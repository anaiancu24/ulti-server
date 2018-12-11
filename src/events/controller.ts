import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body } from 'routing-controllers'
import User from '../users/entity'

import Event from './entity'


@JsonController()
export default class EventsController {

  @Get('/events')
  allEvents() {
      const events = Event.find()
    return { events }

  }
  
  @Get('/events/:id')
  getEvent(
    @Param('id') id: number
  ) {
      const event = Event.findOne(id)
    return { event }
  }



  @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createEvent(
    @CurrentUser() currentUser: User,
    @Body() data: Event
  ) {
    const user = await User.findOne(currentUser.id)
    const {location, name} = data
    console.log(user)
    if ( user!.account.includes('admin') ){
      
    const entity = Event.create({
        name,
        location,
        games: null,
        teams: null
      }).save()

      return entity

    }



  }
}  


