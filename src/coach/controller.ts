import { JsonController, Get, Post, Param, HttpCode, Authorized, ForbiddenError, BadRequestError, CurrentUser, Body, Patch, NotFoundError } from 'routing-controllers'
import Coach from './entity'
import User from '../users/entity'
import Team from '../team/entity';


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
    if (!user) throw new NotFoundError(`User not found`)

    if (!user.account.includes('coach')) {
      user.account.push('coach')
      await user.save()
    } else {
      throw new BadRequestError(`You are already a coach`)
    }

    const { description, socialMedia, pictureURL } = data

    const entity = await Coach.create({
      user,
      description,
      nominatedTeam: null,
      hasPaid: false,
      socialMedia,
      pictureURL
    }).save()

    return { entity }
  }

  @Authorized()
  @Patch('/coaches/:id([0-9]+)')
  async updateCoach(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
    @Body() update: Partial<Coach>
  ) {
    const coach = await Coach.findOne(id)
    if (!coach) throw new NotFoundError('Cannot find coach')

    if (coach.user.id !== currentUser.id) {
      throw new BadRequestError(`You are not allowed to alter other coaches, but yourself only`)
    }

    if (update.nominatedTeam) {
      if (coach.nominatedTeam) throw new BadRequestError(`Coach has already been nominated for a team`)

      if (!coach.hasPaid) throw new BadRequestError(`Coach needs to pay to be nominated`)
      const team = await Team.findOne(update.nominatedTeam.id)
      if (!team) throw new NotFoundError('Cannot find team')
    }

    if (update.hasPaid === false && coach.hasPaid === true) {
      throw new ForbiddenError(`You can't cancel the payment of a coach`)
    }

    const updatedCoach = await Coach.merge(coach, update)

    await updatedCoach.save()

    return { updatedCoach }
  }


  @Authorized()
  @Patch('/coaches/:id([0-9]+)/pay')
  async payforCoach(
    @Param('id') id: number,
  ) {
    const coach = await Coach.findOne(id)
    if (!coach) throw new NotFoundError('Cannot find coach')

    if (coach.hasPaid) {
      throw new BadRequestError(`Coach ${coach.id} has already paid`)
    } else {
      coach.hasPaid = await true
      await coach.save()
    }

    return { coach }
  }

}