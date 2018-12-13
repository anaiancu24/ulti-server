import { JsonController, Get, Param, Authorized, Body, Patch, NotFoundError } from 'routing-controllers'
import Player from './entity'
// import User from '../users/entity';


@JsonController()
export default class PLayerController {

  @Get('/players')
  async allPlayers() {
    const players = await Player.find()
    return { players }
  }

  @Get('/players/:id')
  async getPlayer(
    @Param('id') id: number
  ) {
    const player = await Player.findOne(id)
    return { player }
  }

  // @Authorized()
  // @Post('/players')
  // @HttpCode(201)
  // async createPlayer(
  //   @CurrentUser() currentUser: User,
  //   @Body() data: Player
  // ) {
  //   const user = await User.findOne(currentUser.id)

  //   if (user) {
  //     user.account.push('player')
  //   }

  //   await user!.save()

  //   const { location, description, nominatedTeams, gender, socialMedia } = data

  //   const entity = await Player.create({
  //     rank: null,
  //     user,
  //     location,
  //     description,
  //     gender,
  //     isNominated: false,
  //     nominatedTeams,
  //     votes: 0,
  //     socialMedia
  //   }).save()

  //   return { entity }
  // }


  @Authorized()
  @Patch('/players/:id([0-9]+)')
  async updatePlayer(
    @Param('id') id: number,
    @Body() update: Partial<Player>
  ) {
    const player = await Player.findOne(id)
    if (!player) throw new NotFoundError('Cannot find Player')

    const updatedPlayer = await Player.merge(player, update)

    await updatedPlayer.save()

    return { updatedPlayer }
  }
}


