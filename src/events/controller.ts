import { JsonController, Get, Param, Post, HttpCode, Body } from 'routing-controllers'
import Event from './entity'


@JsonController()
export default class EventsController {

  @Get('/events')
  async allEvents() {
    const events = await Event.find({relations: ['games']})
    return { events }
  }
  
  @Get('/events/:id')
  async getEvent(
    @Param('id') id: number
  ) {
    const event = await Event.findOne(id)
    return { event }
  }



  // @Authorized()
  @Post('/events')
  @HttpCode(201)
  async createEvent(
    // @CurrentUser() currentUser: User,
    @Body() {location, name, startDate, endDate}:Event
  ) {
      
      const entity = await Event.create({
        name,
        location,
        startDate,
        endDate,
        games: null,
        teams: null
      }).save()

      return {entity}
    }
}  


