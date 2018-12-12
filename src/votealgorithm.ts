// Voting power calculator
export const calculateVotingPower = (owner, team) => {
  const percentage = (owner.shares / team.totalShares) * 100
  if (percentage >= 40) {
    return 0.4 * owner.shares
  }
  return owner.shares
}

// Voting for a coach
export async function voteCoach(owner, coach) {
  if (!owner.votedCoach) {
    owner.votedCoach = coach
    coach.votes += owner.votingPower
    await owner.save()
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


export const updateVotingPower = (team) => {
  team.owners.map(owner => owner.votingPower = calculateVotingPower(owner, team).save()) 
}

export const calculateVotes = async (nominee) => {

  const arrPower = await nominee.owners.map(owner => owner.votingPower)
  nominee.votes = await arrPower.reduce((acc, cur) => acc + cur)

}