import { JsonController, Get, Param, Post, Authorized, Body, Patch, NotFoundError, BadRequestError } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity'
import {calculateVotingPower, updateVotingPower, voteCoach, votePlayer, calculateVotes} from '../votealgorithm'



@JsonController()
export default class OwnerController {

  @Get('/owners')
  async allOwners() {
    const owners = await Owner.find()
    if(!owners) {BadRequestError}
    return { owners }
  }

  @Get('/owners/:id')
  async getOwner(
    @Param('id') id: number
  ) {
    const owner = await Owner.findOne(id)
    return { owner }
  }



  // @Authorized()
  @Post('/owners')
  // @HttpCode(201)
  async createOwner(
    // @CurrentUser() currentUser: User,
    @Body() data
  ) {
    const { shares, teamId, id } = data

    const user = await User.findOne(id)
    const team = await Team.findOne(teamId)

    if (user) {
      user.account.push('owner')
    }

    await user!.save()

    const entity = await Owner.create({
      user,
      shares,
      team,
    }).save()

    team!.totalShares = team!.totalShares + shares
    await team!.save()

    entity.votingPower = await calculateVotingPower(entity, team)

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

    // Check for new shares
    if (update.shares !== owner.shares) {
      owner.team!.totalShares += await (update.shares! - owner.shares!)
    }

    const updatedOwner = await Owner.merge(owner, update)

    await updatedOwner.save()
    updateVotingPower(owner.team)


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