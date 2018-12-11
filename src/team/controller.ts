import { JsonController, Get, Param, Post, HttpCode, Body} from 'routing-controllers'
import Team from './entity'


@JsonController()
export default class TeamController {

  @Get('/teams')
  allTeams() {
    const teams = Team.find()
    return {teams}
  }
  
  @Get('/teams/:id')
  getTeam(
    @Param('id') id: number
  ) {
    const team = Team.findOne(id)
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

    return {entity}
  }
}