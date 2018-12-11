import { JsonController, Get, Param, Post, HttpCode, Body } from 'routing-controllers'
// import User from '../users/entity'
import Game from './entity'
import Event from '../events/entity'


@JsonController()
export default class GameController {

  @Get('/games')
  allGames() {
    const games = Game.find()
    return { games }

  }
  
  @Get('/games/:id')
  getGame(
    @Param('id') id: number
  ) {
    const game = Game.findOne(id)
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
      
    const entity = Game.create({
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


