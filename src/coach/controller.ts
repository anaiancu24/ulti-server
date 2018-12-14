import { JsonController, Get, Post, Param, HttpCode, Authorized, CurrentUser, Body, Patch, NotFoundError } from 'routing-controllers'
import Coach from './entity'
import User from '../users/entity'


@JsonController()
export default class CoachController {

  @Get('/coaches')
  async allCoaches() {
    const coaches = await Coach.find()
    return { coaches }
  }

  @Get('/coaches/:id')
  async getCoach(
    @Param('id') id: number
  ) {
    const coach = await Coach.findOne(id)
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

    if (user) {
      user.account.push('coach')
    }

    await user!.save()

    const { description } = data

    const entity = await Coach.create({
      user,
      description,
      nominatedTeams: [],
      hasPaid: false,
      socialMedia: null,
    }).save()

    return { entity }
  }

  @Authorized()
  @Patch('/coaches/:id([0-9]+)')
  async updateCoach(
    @Param('id') id: number,
    @Body() update: Partial<Coach>
  ) {
    const coach = await Coach.findOne(id)
    if (!coach) throw new NotFoundError('Cannot find coach')

    const updatedCoach = await Coach.merge(coach, update)

    await updatedCoach.save()

    return { updatedCoach }
  }


}