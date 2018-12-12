import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body } from 'routing-controllers'
import User from '../users/entity'
import Event from './entity'


@JsonController()
export default class EventsController {

  @Get('/events')
  async allEvents() {
    const events = await Event.find()
    return { events }
  }
  
  @Get('/events/:id')
  async getEvent(
    @Param('id') id: number
  ) {
    const event = await Event.findOne(id)
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

    if ( user!.account.includes('admin') ){
      
      const entity = await Event.create({
        name,
        location,
        games: null,
        teams: null
      }).save()

      return {entity}
    }
  }
}  


