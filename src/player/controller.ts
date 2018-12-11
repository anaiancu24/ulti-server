import { JsonController, Get, Param, Post, HttpCode} from 'routing-controllers'
import Player from './entity'
import User from '../users/entity';
//import {io} from '../index'

@JsonController()
export default class PLayerController {

  @Get('/players')
  allEvents() {
    return Player.find()
   
  }
  
  @Get('/players/:id')
  getEvent(
    @Param('id') id: number
  ) {
    return Player.findOne(id)
  }

 

  // @Authorized()
  @Post('/users/:id')
  @HttpCode(201)
  async createPlayer(
    @Param('id') id: number
  ) {
    const user = await User.findOne(id)


    user!.account = 'player'

    user!.save()

    const entity = Player.create({
      rank: 100,
      user,
    }).save()

    return entity





    //const entity = await data.save()
    //const player = await Player.findOne(entity.id)

    // io.emit('action', {
    //   type: 'ADD_EVENT',
    //   payload: event
    // })

    // return player
  }


}