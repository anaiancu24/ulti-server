import { JsonController, Get, Param} from 'routing-controllers'
import Game from './entity'
// import Event from '../events/entity'


@JsonController()
export default class GameController {

  @Get('/games')
  async allGames() {
    const games = await Game.find()
    return { games }
  }

  @Get('/games/:id')
  async getGame(
    @Param('id') id: number
  ) {
    const game = await Game.findOne(id)
    return { game }
  }


  // @Authorized()
  // @Post('/games')
  // @HttpCode(201)
  // async createGame(
  //   // @CurrentUser() currentUser: User,
  //   @Body() {teams, homeScore, awayScore, date, id}:Game
  // ) {

  //   const event = await Event.findOne(id)


  //   const entity = await Game.create({
  //     homeScore,
  //     awayScore,
  //     event,
  //     teams,
  //     date
  //   }).save()


  //   return { entity }
  //   }
}


