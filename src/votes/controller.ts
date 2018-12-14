import { JsonController, Get, Param } from 'routing-controllers'
import { CoachVote, PlayerVote } from './entity'


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


  @Get('/coachvotesbyteam/:id')
  async getCoachVoteByTeam(
    @Param('id') id: number
  ) {
    const coachVoteByTeam = await CoachVote.find({where: {teamId: id}})
    return { coachVoteByTeam }
  }
  

}

@JsonController()
export class PlayerVoteController {

  @Get('/playervotes')
  async allPlayerVotes() {
    const playerVotes = await PlayerVote.find()
    return { playerVotes }
  }

  @Get('/coachvotes/:id')
  async getPlayerVote(
    @Param('id') id: number
  ) {
    const playerVote = await PlayerVote.find({where: {playerId: id}})
    return { playerVote }
  }


  @Get('/playervotesbyteam/:id')
  async getPlayerVoteByTeam(
    @Param('id') id: number
  ) {
    const playerVoteByTeam = await PlayerVote.find({where: {teamId: id}})
    return { playerVoteByTeam }
  }
  

}