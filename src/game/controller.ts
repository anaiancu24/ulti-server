import { JsonController, Get, Param, Post, HttpCode, Body } from 'routing-controllers'
import Game from './entity'
import Event from '../events/entity'


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


  //@@Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    //@CurrentUser() currentUser: User,
    @Body() data
  ) {
    //const user = await User.findOne(currentUser.id)
    const {homeTeam, awayTeam, homeScore, awayScore, id} = data
    const event = await Event.findOne(id)
    //if ( user!.account.includes('admin') ){
      
    const entity = await Game.create({
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      event
    }).save()

      return { entity }
    }
  }
// }  


