import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body, Patch, NotFoundError } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'
import Team from '../team/entity';
import {calculateVotingPower} from '../votealgorithm'


@JsonController()
export default class OwnerController {

  @Get('/owners')
  async allOwners() {
    const owners = await Owner.find()
    return {owners}
  }
  
  @Get('/owners/:id')
  async getOwner(
    @Param('id') id: number
  ) {
    const owner = await Owner.findOne(id)
    return {owner}
  }



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

    if (user){
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

    return {entity}
  }

  @Authorized()
  @Patch('/owners/:id([0-9]+)')
  async updateOwner(
    @Param('id') id: number,
    @Body() update: Partial<Owner>
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    const updatedOwner = await Owner.merge(owner, update)

    await updatedOwner.save()

    return {updatedOwner}
  }
}