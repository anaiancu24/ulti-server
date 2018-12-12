import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'
import Team from '../team/entity';
import Coach from '../coach/entity';


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
    const { shares, teamId, coachId } = data

    const user = await User.findOne(currentUser.id)
    const team = await Team.findOne(teamId)
    const coach = await Coach.findOne(coachId)

    // const manPlayers = await manPlayerIds.filter(id => )
    // const femalePlayers = await Player.find({where: {}})

    if (user){
      user.account.push('owner')
    }

    await user!.save()

    const entity = Owner.create({
      user,
      shares,
      team,
      coach,
      // femalePlayers,
      // malePlayers

    }).save()

    return {entity}
  }

//   @Authorized()
//   @Patch('/players/:id([0-9]+)')
//   async updatePlayer(
//     @Param('id') id: number,
//     @Body() update: Partial<Player>
//   ) {
//     const player = await Player.findOne(id)
//     if (!player) throw new NotFoundError('Cannot find ticket')

//     const updatedPlayer = await Player.merge(player, update)


//     await updatedPlayer.save()

//     return {updatedPlayer}
}



