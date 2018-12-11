import { JsonController, Get, Param, Post, HttpCode, Body} from 'routing-controllers'
import Team from './entity'
//import {io} from '../index'

@JsonController()
export default class TeamController {

  @Get('/teams')
  allEvents() {
    return Team.find()

  }
  
  @Get('/teams/:id')
  getEvent(
    @Param('id') id: number
  ) {
    return Team.findOne(id)
  }



//   @Authorized()
  @Post('/teams')
  @HttpCode(201)
  async createTeam(
    @Body() { name }
  ) {

    const entity = await Team.create({
      name
    }).save()

    // io.emit('action', {
    //   type: 'ADD_EVENT',
    //   payload: event
    // })

    return entity
  
  }


}