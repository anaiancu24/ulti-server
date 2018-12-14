import Owner from './owner/entity'
import { CoachVote, PlayerVote } from './votes/entity'

// Re-calculate the voting powers and votes for all players and coaches of the team-owner
export const reCalculateVotingPower = async (team) => {
  const owners = await Owner.find({where:{team: team.id}})
  owners.map(async owner => {{owner.votingPower = await Math.round(Math.min(owner.shares, 0.4 * team!.totalShares))
                              reCalculateCoachVotes(owner)
                              reCalculatePlayerVotes(owner)
                            }
                            await owner.save()})
}

export const reCalculateCoachVotes = async (owner) => {
  const coachVoteArr = await CoachVote.find({where:{ownerId: owner.id}})
  coachVoteArr.map(async coachVote => {{coachVote.votes = owner.votingPower
                                }
                                await coachVote.save()})
}

export const reCalculatePlayerVotes = async (owner) => {
  const playerVoteArr = await PlayerVote.find({where:{ownerId: owner.id}})
  playerVoteArr.map(async playerVote => {{playerVote.votes = owner.votingPower
                                }
                                await playerVote.save()})
}




export const votePlayer = (owner, player) => {
  if (player.location === player.team.location) {
    if (player.gender === "male" && owner.votedPlayers.malePlayers.length < 7){
      owner.votedPlayers.malePlayers.push(player)
    } else if (player.gender === "female" && owner.votedPlayers.femalePlayers.length < 7) {
      owner.votedPlayers.femalePlayers.push(player)
    }  
  } else {
    if (player.gender === "male" && owner.votedPlayers.outMale.length < 1){
      owner.votedPlayers.outMale.push(player)
    } else if (player.gender === "female" && owner.votedPlayers.outFemale.length < 1) {
      owner.votedPlayers.outFemale.push(player)
    }  
  }
}


export const calculateVotes = async (nominee) => {

  const arrPower = await nominee.owners.map(owner => owner.votingPower)
  nominee.votes = await arrPower.reduce((acc, cur) => acc + cur)

}

export const totalVotesOfCoach = async (coach, team) => {

  const votes = await CoachVote.find({where: {
    teamId: team.id,
    coachId: coach.id
  }})

  const arrVotes = await votes.map(vote => vote.votes)
  const totalVotes = await arrVotes.reduce((acc, cur) => acc + cur)
  
  return totalVotes
}