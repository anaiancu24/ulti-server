import { JsonController, Get, Param, Post, HttpCode, Authorized, CurrentUser, Body, Patch, NotFoundError } from 'routing-controllers'
import User from '../users/entity'
import Owner from './entity'
import Team from '../team/entity'
import Coach from '../coach/entity'
import Player from '../player/entity'
import { reCalculateVotingSystem, votePlayer, calculateVotes} from '../votealgorithm'



@JsonController()
export default class OwnerController {

  @Get('/owners')
  async allOwners() {
    const owners = await Owner.find()
    return { owners }
  }

  @Get('/owners/:id')
  async getOwner(
    @Param('id') id: number
  ) {
    const owner = await Owner.findOne(id)
    return { owner }
  }


  // Create a new Owner when buying shares for a team
  @Authorized()
  @Post('/owners')
  @HttpCode(201)
  async createOwner(
    @CurrentUser() currentUser: User,
    @Body() data
  ) {
    const { shares, teamId } = data

    const user = await User.findOne(currentUser.id)
    const team = await Team.findOne(teamId)

    if (user) {
      await user.account.push('owner')
    }

    await user!.save()

    const entity = await Owner.create({
      user,
      shares,
      team,
    }).save()

    team!.totalShares = await (Number(team!.totalShares) + Number(shares))
    await team!.save()

    entity.votingPower = await Math.min(Number(entity.shares), 0.4 * Number(team!.totalShares))
    await entity.save()

    // Re-calculate the voting power of all the owners that have shares in the team
    reCalculateVotingSystem(team)

    return { entity }
  }

  
  // When buying more shares
  @Authorized()
  @Patch('/owners/:id([0-9]+)')
  async updateOwner(
    @Param('id') id: number,
    @Body() update: Partial<Owner>
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    owner.team!.totalShares += await Number(update.shares!)
    await owner.team!.save()

    owner.shares += await Number(update.shares!)
    await owner.save()


    owner.votingPower = await Math.min(Number(owner.shares), 0.4 * Number(owner.team!.totalShares))

    // Re-calculate the voting power of all the owners that have shares in the team
    reCalculateVotingSystem(owner.team)

    return {owner}
  }


  @Authorized()
  @Patch('/owners/:id([0-9]+)/votecoach')
  async ownerVoteCoach(
    @Param('id') id: number,
    @Body() update: Partial<Coach>
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    const coach = await Coach.findOne(update.id)

    owner!.coach = coach!
    owner.save()

    coach!.votes! = {teamName: owner.team,
                    numberOfVotes: owner.votingPower}
    coach!.save()





    // voteCoach(owner, coach)

    // calculateVotes(coach)

    return {owner}
  }


  @Authorized()
  @Patch('/owners/:id([0-9]+)/voteplayer')
  async ownerVotePlayer(
    @Param('id') id: number,
    @Body() update: Player
  ) {
    const owner = await Owner.findOne(id)
    if (!owner) throw new NotFoundError('Cannot find owner')

    const player = await Player.findOne(update.id)

    votePlayer(owner, player)

    calculateVotes(player)

    return {player}
  }

}