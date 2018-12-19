import { JsonController, Get, Post, Param, Body, HttpCode, Authorized, NotFoundError, CurrentUser, UnauthorizedError, BadRequestError } from 'routing-controllers'
import Game from './entity'
import Event from '../events/entity'
import Team from '../team/entity'
import User from '../users/entity'

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


  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() currentUser: User,
    @Body() { livestream, date, hour, eventId, homeTeamId, awayTeamId }
  ) {

    const user = await User.findOne(currentUser.id)
    if (!user) throw new NotFoundError(`Cannot find user`)

    if (!user.isAdmin) throw new UnauthorizedError(`You have to be an administrator to create a new game`)

    const event = await Event.findOne(eventId)
    if (!event) throw new NotFoundError(`Cannot find event`)

    if (homeTeamId !== 0 && homeTeamId === awayTeamId) {
      throw new BadRequestError(`You cannot have the same team playing against itself`)
    }

    const homeTeam = await Team.findOne(Number(homeTeamId))
    if (!homeTeam) throw new NotFoundError(`Cannot find home team`)

    const awayTeam = await Team.findOne(Number(awayTeamId))
    if (!awayTeam) throw new NotFoundError(`Cannot find away team`)  


    const entity = await Game.create({
      livestream,
      date,
      hour,
      event,
      homeTeam,
      awayTeam
    }).save()

    return { entity }
    }


  @Authorized()
  @Post('/games/:id')
  async updateGame(
    @CurrentUser() currentUser: User,
    @Param('id') id: number,
    @Body() update: Partial<Game>
  ) {

    const user = await User.findOne(currentUser.id)
    if (!user) throw new NotFoundError(`Cannot find user`)

    if (!user.isAdmin) throw new UnauthorizedError(`You have to be an administrator to create a new game`)

    const game = await Game.findOne(id)
    if (!game) throw new BadRequestError(`Cannot find game`)

    const updatedGame = await Game.merge(game, update)
    await updatedGame.save()

    return { updatedGame}
    }
}