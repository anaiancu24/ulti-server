import { JsonController, Get, Param, Post, HttpCode, Body } from 'routing-controllers'
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


  // @Authorized()

  @Post('/events')
  @HttpCode(201)
  async createEvent(
    @Body() { location, name, startDate, endDate, teams }: Partial<Event>
  ) {

      const entity = await Event.create({
        name,
        location,
        startDate,
        endDate,
        games: null,
        teams
      }).save()

      return { entity }
    }
}




