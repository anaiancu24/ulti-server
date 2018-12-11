import { JsonController, Get, Param } from 'routing-controllers'
import Player from './entity'
// import User from '../users/entity';
//import {io} from '../index'

@JsonController()
export default class PLayerController {

  @Get('/players')
  allPlayers() {
    return Player.find()
   
  }
  
  @Get('/players/:id')
  getEvent(
    @Param('id') id: number
  ) {
    return Player.findOne(id)
  }

 

  // @Authorized()
  // @Post('/players')
  // @HttpCode(201)
  // async createPlayer(
  //   @Body() data: User
  // ) {
  //   const user = await User.findOne(id)

  //   user!.save()

  //   const entity = Player.create({
  //     rank: 100,
  //     user,
  //   }).save()

  //   return entity





    //const entity = await data.save()
    //const player = await Player.findOne(entity.id)

    // io.emit('action', {
    //   type: 'ADD_EVENT',
    //   payload: event
    // })

    // return player
  }


