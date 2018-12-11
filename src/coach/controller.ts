import { JsonController, Get, Param, Post, HttpCode } from 'routing-controllers'
import Coach from './entity'
import User from '../users/entity'
//import {io} from '../index'

@JsonController()
export default class CoachController {

  @Get('/coaches')
  allCoaches() {
    return Coach.find()

  }
  
  @Get('/coaches/:id')
  getCoach(
    @Param('id') id: number
  ) {
    return Coach.findOne(id)
  }



//   @Authorized()
@Post('/coaches/:id')
@HttpCode(201)
async createCoach(
  @Param('id') id: number
) {
  const user = await User.findOne(id)

  
  user!.account = 'coach'

  user!.save()

  const entity = Coach.create({
    user,
  }).save()

  return entity
  
  }


}