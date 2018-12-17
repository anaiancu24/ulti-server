import { JsonController, Get, Param, Post, HttpCode, Authorized, BadRequestError, CurrentUser, Body, Patch, NotFoundError } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity' 
import { CoachVote, PlayerVote } from '../votes/entity'
import { reCalculateVotingPower } from '../votealgorithm'
import { In } from 'typeorm'


@JsonController()
export default class OwnerController {

  @Get('/owners')
  async allOwners() {
    const owners = await Owner.find()
    return { owners }
  }

  @Authorized()
  @Get('/owner')
  async getOwner(
    @CurrentUser() currentUser: User
  ) {
    const owner = await Owner.findOne({where: {user: currentUser}})
    if (!owner) throw new NotFoundError('Cannot find owner')

    return { owner }
  }


  // Create a new Owner when buying shares for a team
  @Authorized()
  @Post('/owners')
  @HttpCode(201)
  async createOwner(
    @CurrentUser() currentUser: User,
    @Body() data
  ) {
    const { shares, teamId } = data

    const user = await User.findOne(currentUser.id)
    const team = await Team.findOne(teamId)

    if (user) {
      await user.account.push('owner')
    }

    await user!.save()

    const entity = await Owner.create({
      user,
      shares,
      team,
    }).save()

    team!.totalShares = await (Number(team!.totalShares) + Number(shares))
    await team!.save()

    entity.votingPower = await Math.min(Number(entity.shares), 0.4 * Number(team!.totalShares))
    await entity.save()

    // Re-calculate the voting power and new votes of all the owners that have shares in the team
    reCalculateVotingPower(team)

    return { entity }
  }

  
  // When buying shares
  @Authorized()
  @Patch('/owners/:id([0-9]+)')
  async updateOwner(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
    @Body() update
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    if (owner.user.id !== currentUser.id) {
      throw new BadRequestError(`You are not allowed to buy shares for a different owner, but only for yourself`)
    }

    if (!owner.team) {
      const team = await Team.findOne(update.teamId)
      if (!team) throw new NotFoundError('Cannot find team')
      owner.team = await team
      await owner.save()
    }

    owner.team.totalShares += await Number(update.shares)
    await owner.team.save()

    owner.shares += await Number(update.shares)
    await owner.save()

    owner.votingPower = await Math.round(Math.min(Number(owner.shares), 0.4 * Number(owner.team!.totalShares)))
    await owner.save()

    // Re-calculate the voting power and new votes of all the owners that have shares in the team
    reCalculateVotingPower(owner.team)
    await owner.save()

    return { owner }
  }


  // When voting for a Coach
  @Authorized() 
  @Patch('/owners/:id([0-9]+)/votecoach')
  async ownervoteCoach(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() update: Partial<Coach>
  ) {

    if (!currentUser.account.includes('owner')) {
      throw new NotFoundError('You are not an owner')
    }

    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    if (owner.user.id !== currentUser.id) throw new BadRequestError(`You can't vote on behalf of another owner`)

    if (owner.coach) throw new BadRequestError(`You have already voted for a coach`)

    const coach = await Coach.findOne(update.id)
    if (!coach) throw new NotFoundError('Cannot find coach')

    if (!coach.hasPaid) throw new BadRequestError(`Coach ${coach.user.lastName} needs to pay to be nominated`)

    if (!coach.nominatedTeam) {
      throw new BadRequestError(`Coach ${coach.user.lastName} is not nominated for any team`)
    } 
    
    if (coach.nominatedTeam.id !== owner.team.id) {
      throw new BadRequestError(`Coach ${coach.user.lastName} is not nominated for ${owner.team.name}, which is your team`)
    }


    const vote = await CoachVote.create({
      coachId: coach.id,
      ownerId: id,
      teamId: owner.team.id,
      votes: owner.votingPower
    }).save()

    owner.coach = await coach
    await owner.save()
    
    return { vote }
  }


  // When unvoting for a Coach
  @Authorized() 
  @Patch('/owners/:id([0-9]+)/unvotecoach')
  async ownerUnvoteCoach(
    @CurrentUser() currentUser: User,
    @Param('id') id: number
  ) {

    if (!currentUser.account.includes('owner')) {
      throw new NotFoundError('You are not an owner')
    }

    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    if (owner.user.id !== currentUser.id) throw new BadRequestError(`You can't unvote on behalf of another owner`)

    if (!owner.coach) throw new BadRequestError('You have not voted for a coach yet')

    const entity = await CoachVote.find({where:{coachId: owner.coach.id, ownerId: owner.id}})
    await entity[0].remove()
    owner.coach = await null
    await owner.save()

    return { owner }
  }


  // When voting for a Player
  @Authorized() 
  @Patch('/owners/:id([0-9]+)/voteplayer')
  async ownerVotePlayer(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() update: Partial<Player>
  ) {

    if (!currentUser.account.includes('owner')) {
      throw new NotFoundError('You are not an owner')
    }

    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    if (owner.user.id !== currentUser.id) throw new BadRequestError(`You can't vote on behalf of another owner`)

    const player = await Player.findOne(update.id)
    if (!player) throw new NotFoundError('Cannot find player')

    if (!player.hasPaid) throw new BadRequestError(`Player ${player.user.lastName} needs to pay to be nominated`)

    if (player.nominatedTeams!.length === 0) {
      throw new BadRequestError(`Player ${player.user.lastName} is not nominated for any team`)
    } 
    
    const teamsIds = player.nominatedTeams!.map(team => team.id)
    if (!teamsIds.includes(owner.team.id)) {
      throw new BadRequestError(`Player ${player.user.lastName} is not nominated for ${owner.team.name}, which is your team`)
    }

    const playersIds = owner.players.map(player => player.id)
    if (playersIds.includes(player.id)) {
      throw new BadRequestError(`You have already voted for player ${player.user.lastName}`)
    }

    // Check how many male, female and outOfArea players an owner has already voted for
    if (owner.players.length === 14) {
      throw new BadRequestError(`You can't vote for another player`)
    }

    if (player.outOfArea) {
      const outOfAreaPlayers = await owner.players.filter(player => player.outOfArea)
      if (outOfAreaPlayers.length === 2) {
        throw new BadRequestError(`You can't vote for more than 2 out of the area players`)
      }
      const maleOutOfAreaPlayers = await outOfAreaPlayers.filter(_ => _.gender === "male")
      const femaleOutOfAreaPlayers = await outOfAreaPlayers.filter(_ => _.gender === "female")


      if (player.gender === "male" && maleOutOfAreaPlayers.length === 1) {
        throw new BadRequestError(`You have already voted for an out of area male player`)
      }
      if (player.gender === "female" && femaleOutOfAreaPlayers.length === 1) {
        throw new BadRequestError(`You have already voted for an out of area female player`)
      }
    } else {
      const playersGender = await owner.players.map(_ => _.gender)
      const malePlayers = await playersGender.filter(gender => gender === "male")
      const femalePlayers = await playersGender.filter(gender => gender === "female")
  
      if (player.gender === 'male' && malePlayers.length === 7) {
        throw new BadRequestError(`You have already voted for 7 male players`)
      }
      if (player.gender === 'female' && femalePlayers.length === 7) {
        throw new BadRequestError(`You have already voted for 7 female players`)
      }
    }

    const vote = await PlayerVote.create({
      playerId: player.id,
      ownerId: id,
      teamId: owner.team.id,
      votes: owner.votingPower
    }).save()

    owner.players.push(player)
    owner.save()
    
    return { vote }
  }

  // When unvoting for a Player
  @Authorized() 
  @Patch('/owners/:id([0-9]+)/unvoteplayer')
  async ownerUnvotePlayer(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() data
  ) {

    if (!currentUser.account.includes('owner')) {
      throw new NotFoundError('You are not an owner')
    }

    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    if (owner.user.id !== currentUser.id) throw new BadRequestError(`You can't unvote on behalf of another owner`)

    const { pId } = data

    const player = await Player.findOne(pId)
    if (!player) throw new NotFoundError('Cannot find player')

    const playersIds = await owner.players.map(_ => _.id)
    if (!playersIds.includes(pId)) {
      throw new BadRequestError(`You haven't voted for this player`)
    }

    const voteEntity = await PlayerVote.find({where:{playerId: pId, ownerId: id}})
    await voteEntity[0].remove()  

    playersIds.splice(playersIds.indexOf(pId), 1)
    const players = await Player.find({where:{id: In(playersIds)}})

    owner.players = await players
    await owner.save()

    return { owner }
  }

  // Clear the whole selection of the owner
  @Authorized() 
  @Patch('/owners/:id([0-9]+)/clearselection')
  async clearSelection(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
  ) {

    if (!currentUser.account.includes('owner')) {
      throw new NotFoundError('You are not an owner')
    }

    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    if (owner.user.id !== currentUser.id) throw new BadRequestError(`You can't clear the selection of another owner`)

    const voteEntity = await PlayerVote.find({where:{ownerId: id}})
    await voteEntity.map(async _ => await _.remove())

    owner.players = []
    await owner.save()

    return { owner }
  }

}
