import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body } from 'routing-controllers'
import Coach from './entity'
import User from '../users/entity'


@JsonController()
export default class CoachController {

  @Get('/coaches')
  allCoaches() {
    const coaches = Coach.find()
    return { coaches }

  }
  
  @Get('/coaches/:id')
  getCoach(
    @Param('id') id: number
  ) {
    const coach = Coach.findOne(id)
    return { coach }
  }



  @Authorized()
  @Post('/coaches')
  @HttpCode(201)
  async createCoach(
    @CurrentUser() currentUser: User,
    @Body() data: Coach
  ) {
    const user = await User.findOne(currentUser.id)

    if (user){
      user.account.push('coach')
    }

    user!.save()

    const { description } = data

    const entity = Coach.create({
      user,
      description,
      team: null,
      isNominated: false,
      rank: null
    }).save()

    return {entity}
  }


}