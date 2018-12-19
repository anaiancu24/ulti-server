import { JsonController, Get, Param, Authorized, Body, Patch, ForbiddenError, NotFoundError, Post, HttpCode, CurrentUser, BadRequestError } from 'routing-controllers'
import { In } from 'typeorm'
import Player from './entity'
import User from '../users/entity'
import Team from '../team/entity'


@JsonController()
export default class PLayerController {

  @Get('/players')
  async allPlayers() {
    const players = await Player.find()
    return { players }
  }

  @Authorized()
  @Get('/player')
  async getPlayer(
    @CurrentUser() currentUser: User
  ) {
    const player = await Player.findOne({where: {user: currentUser}})
    if (!player) throw new NotFoundError('Cannot find player')

    return { player }
  }


  // Create a new Player
  @Authorized()
  @Post('/players')
  @HttpCode(201)
  async createPlayer(
    @CurrentUser() currentUser: User,
    @Body() data: Partial<Player>
  ) {
    const user = await User.findOne(currentUser.id)
    if (!user) throw new NotFoundError(`User not found`)

    if (!user.account.includes('player')) {
      user.account.push('player')
      await user.save()
    } else {
      throw new BadRequestError(`You are already a player`)
    }

    const { description, location, gender, pictureURL, socialMedia, outOfArea } = data

    const entity = await Player.create({
      user,
      description,
      location,
      outOfArea,
      gender,
      socialMedia,
      pictureURL,
      nominatedTeams: [],
      hasPaid: false,
    }).save()

    return { entity }
  }


  @Authorized()
  @Patch('/players/:id([0-9]+)')
  async updatePlayer(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
    @Body() update: Partial<Player>
  ) {
    const player = await Player.findOne(id)
    if (!player) throw new NotFoundError('Cannot find Player')

    if (player.user.id !== currentUser.id) {
      throw new BadRequestError(`You are not allowed to alter other players, but yourself only`)
    }

    if (update.hasPaid === false && player.hasPaid === true) {
      throw new ForbiddenError(`You can't cancel the payment of a player`)
    }

    if (update.nominatedTeams && update.nominatedTeams!.length > 0) {
      if (!player.hasPaid) {
        throw new BadRequestError(`Player needs to pay in order to be nominated`)
      } else {
        const teamsIds = update.nominatedTeams!.map(team => team.id)
        const teams = await Team.find({where: {id: In(teamsIds)}})

        if (teams.length !== update.nominatedTeams!.length) {
          throw new BadRequestError(`You provided a team that doesn't exist`)
        }

        update.nominatedTeams = teams
      }
    }

    const updatedPlayer = await Player.merge(player, update)
    await updatedPlayer.save()

    return { updatedPlayer }
  }


  @Authorized()
  @Patch('/players/:id([0-9]+)/pay')
  async payforPlayer(
    @Param('id') id: number,
  ) {
    const player = await Player.findOne(id)
    if (!player) throw new NotFoundError('Cannot find player')

    if (player.hasPaid) {
      throw new BadRequestError(`Player ${player.id} has already paid`)
    } else {
      player.hasPaid = await true
      await player.save()
    }

    return { player }
  }
}


