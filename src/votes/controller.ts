import { JsonController, Get, Param, NotFoundError } from 'routing-controllers'
import { CoachVote, PlayerVote } from './entity'
import Team from '../team/entity';


@JsonController()
export class CoachVoteController {

  @Get('/coachvotes')
  async allCoachVotes() {
    const coachVotes = await CoachVote.find()
    return { coachVotes }
  }

  @Get('/coachvotes/:id')
  async getCoachVote(
    @Param('id') id: number
  ) {
    const coachVote = await CoachVote.find({where: {coachId: id}})
    return { coachVote }
  }

  @Get('/coachesvotedforteam/:id')
  async getCoachesVotedforTeam(
    @Param('id') id: number
  ) {
    const team = await Team.findOne(id)
    if (!team) throw new NotFoundError(`This team doesn't exist!`)

    const coaches = await team.nominatedCoaches
    return { coaches }
  }
}

@JsonController()
export class PlayerVoteController {

  @Get('/playervotes')
  async allPlayerVotes() {
    const playerVotes = await PlayerVote.find()
    return { playerVotes }
  }

  @Get('/playervotes/:id')
  async getPlayerVote(
    @Param('id') id: number
  ) {
    const playerVote = await PlayerVote.find({where: {playerId: id}})
    return { playerVote }
  }

  @Get('/playersvotedforteam/:id')
  async getPlayersVotedforTeam(
    @Param('id') id: number
  ) {
    const team = await Team.findOne(id)
    if (!team) throw new NotFoundError(`This team doesn't exist!`)

    const players = await team.nominatedPlayers
    return { players }
  }
}
