import Owner from './owner/entity'

// Re-calculate the voting powers and votes for all players and coaches of the team-owner
export const reCalculateVotingSystem = async (team) => {
  const owners = await Owner.find({where:{team: team.Id}})
  owners.map(async owner => {owner.votingPower = await Math.min(owner.shares, 0.4 * team!.totalShares)
                              owner.save()
                            owner.players.map(player => {calculateVotes(player)
                                                        player.save()})
                            calculateVotes(owner.coach)
                            owner.coach.save()})
}


// Voting for a coach
export async function voteCoach(owner, coach) {
  if (!owner.coach) {
    owner.coach = coach

    // const vote = coach.votes.filter(vote => vote.teamName === team.name)[0]

    console.log(owner.coach.votes)
    // if (vote) {
    //   vote.numberOfVotes += owner.votingPower
    //   await coach.save()
    // } else {
    //   const addedVote = await {
    //     teamName: team.name,
    //     numberOfVotes: owner.votingPower
    //   }
    //   await coach.votes.push(addedVote)
    //   await coach.save()
    // }
  } else {
    console.log(`You have already voted for a coach dude!`)
  }
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