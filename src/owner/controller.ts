import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body, Patch, NotFoundError } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity'
import { reCalculateVotingSystem, voteCoach, votePlayer, calculateVotes} from '../votealgorithm'



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

    team!.totalShares = await team!.totalShares + shares
    await team!.save()

    entity.votingPower = await Math.min(entity.shares, 0.4 * team!.totalShares)
    await entity.save()

    // Re-calculate the voting power of all the owners that have shares in the team
    reCalculateVotingSystem(team)

    return { entity }
  }

  
  @Authorized()
  @Patch('/owners/:id([0-9]+)')
  async updateOwner(
    @Param('id') id: number,
    @Body() update: Partial<Owner>
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    // Check for new shares and calculate the new total shares of the team
    if (update.shares !== owner.shares) {
      owner.team!.totalShares += await (update.shares! - owner.shares!)
      owner.team!.save()
    }

    const updatedOwner = await Owner.merge(owner, update).save()

    updatedOwner.votingPower = await Math.min(updatedOwner.shares, 0.4 * updatedOwner.team!.totalShares)

    // Re-calculate the voting power of all the owners that have shares in the team
    reCalculateVotingSystem(updatedOwner.team)

    return {updatedOwner}
  }


  @Authorized()
  @Patch('/owners/:id([0-9]+)/votecoach')
  async ownerVoteCoach(
    @Param('id') id: number,
    @Body() update: Coach
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    const coach = await Coach.findOne(update.id)

    voteCoach(owner, coach)

    calculateVotes(coach)

    return {coach}
  }


  @Authorized()
  @Patch('/owners/:id([0-9]+)/voteplayer')
  async ownerVotePlayer(
    @Param('id') id: number,
    @Body() update: Player
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    const player = await Player.findOne(update.id)

    votePlayer(owner, player)

    calculateVotes(player)

    return {player}
  }

}