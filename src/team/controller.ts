import { JsonController, Get, Param, Post, HttpCode, Body } from 'routing-controllers'
import Team from './entity'


@JsonController()
export default class TeamController {

  @Get('/teams')
  async allTeams() {
    const teams = await Team.find()
    return { teams }
  }

  @Get('/teams/:id')
  async getTeam(
    @Param('id') id: number
  ) {
    const team = await Team.findOne(id)
    return { team }
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

    return { entity }
  }
}