import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body, Patch, NotFoundError } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity' 
import { CoachVote, PlayerVote } from '../votes/entity'
import { reCalculateVotingPower } from '../votealgorithm'



@JsonController()
export default class OwnerController {

  @Get('/owners')
  async allOwners() {
    const owners = await Owner.find()
    return { owners }
  }

  @Get('/owners/:id')
  async getOwner(
    @Param('id') id: number
  ) {
    const owner = await Owner.findOne(id)
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
    @Body() update
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    if (!owner.team) {
      const team = await Team.findOne(update.teamId)
      owner!.team = team!
      owner.save()
    }

    owner.team!.totalShares += await Number(update.shares!)
    await owner.team!.save()

    owner.shares += await Number(update.shares!)
    await owner.save()

    owner.votingPower = await Math.round(Math.min(Number(owner.shares), 0.4 * Number(owner.team!.totalShares)))
    await owner.save()

    // Re-calculate the voting power and new votes of all the owners that have shares in the team
    reCalculateVotingPower(owner.team!)
    await owner.save()

    return {owner}
  }


  // When voting for a Coach
  @Authorized() 
  @Patch('/owners/:id([0-9]+)/votecoach')
  async ownerPlayerCoach(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() update: Partial<Player>
  ) {
    const owner = await Owner.findOne(id)
    if (!currentUser.account.includes('owner')) {
      throw new NotFoundError('You are not an owner')
    }

    if (!owner) throw new NotFoundError('Cannot find owner')

    const coach = await Coach.findOne(update.id)
    if (!coach) throw new NotFoundError('Cannot find coach')


    const vote = await CoachVote.create({
      coachId: coach!.id,
      ownerId: id,
      teamId: owner.team.id,
      votes: owner.votingPower
    }).save()

    owner.coach = coach
    owner.save()
    
    if (!coach.nominatedTeams!.includes(owner.team)) {
      coach.nominatedTeams!.push(owner.team)
      coach.save()
    }
    
    return {vote}
  }


    // When voting for a Player
  @Authorized() 
  @Patch('/owners/:id([0-9]+)/voteplayer')
  async ownerVotePlayer(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() update: Partial<Player>
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')
    if (!currentUser.account.includes('owner')) {
      throw new NotFoundError('You are not an owner')
    }

    const player = await Player.findOne(update.id)
    if (!player) throw new NotFoundError('Cannot find player')

    const vote = await PlayerVote.create({
      playerId: player!.id,
      ownerId: id,
      teamId: owner.team.id,
      votes: owner.votingPower
    }).save()

    owner.players.push(player)
    owner.save()
    
    if (!player.nominatedTeams!.includes(owner.team)) {
      player.nominatedTeams!.push(owner.team)
      player.save()
    }
    
    return {vote}
  }
}