import { JsonController, Get, Param, NotFoundError } from 'routing-controllers'
import { CoachVote, PlayerVote } from './entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity'


@JsonController()
export class CoachVoteController {

  @Get('/coachvotes')
  async allCoachesVotes() {
    const coachesVotes = await CoachVote.find()
    return { coachesVotes }
  }

  @Get('/coachvotes/:id')
  async getCoachVotes(
    @Param('id') id: number
  ) {
    const coach = await Coach.findOne(id)
    if (!coach) throw new NotFoundError(`This coach doesn't exist!`)

    const coachVotes = await CoachVote.find({where: {coachId: id}})
    return { coachVotes }
  }

  @Get('/coachesvotesforteam/:id')
  async getCoachesVotesforTeam(
    @Param('id') id: number
  ) {
    const team = await Team.findOne(id)
    if (!team) throw new NotFoundError(`This team doesn't exist!`)

    const votes = await CoachVote.find({where: {teamId: id}})

    return { votes }
  }
}

@JsonController()
export class PlayerVoteController {

  @Get('/playersvotes')
  async allPlayersVotes() {
    const playersVotes = await PlayerVote.find()
    return { playersVotes }
  }

  @Get('/playersvotes/:id')
  async getPlayerVotes(
    @Param('id') id: number
  ) {
    const player = await Player.findOne(id)
    if (!player) throw new NotFoundError(`This player doesn't exist!`)

    const playerVotes = await PlayerVote.find({where: {playerId: id}})
    return { playerVotes }
  }

  @Get('/playersvotesforteam/:id')
  async getPlayersVotesforTeam(
    @Param('id') id: number
  ) {
    const team = await Team.findOne(id)
    if (!team) throw new NotFoundError(`This team doesn't exist!`)

    const votes = await PlayerVote.find({where: {teamId: id}})

    return { votes }
  }
}
