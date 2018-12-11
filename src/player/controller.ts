import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body } from 'routing-controllers'
import Player from './entity'
import User from '../users/entity';


@JsonController()
export default class PLayerController {

  @Get('/players')
  allPlayers() {
    const players = Player.find()
    return {players}

  }
  
  @Get('/players/:id')
  getPlayer(
    @Param('id') id: number
  ) {
    const player = Player.findOne(id)
    return {player}
  }



  @Authorized()
  @Post('/players')
  @HttpCode(201)
  async createPlayer(
    @CurrentUser() currentUser: User,
    @Body() data: Player
  ) {
    const user = await User.findOne(currentUser.id)

    if (user){
      user.account.push('player')
    }

    user!.save()

    const { location, description } = data

    const entity = Player.create({
      rank: null,
      user,
      location,
      description,
      isNominated: false,
      team: null
    }).save()

    return entity
  }
}  


