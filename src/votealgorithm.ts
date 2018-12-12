// Voting power calculator
export const calculateVotingPower = (owner, team) => {
  const percentage = (owner.shares / team.totalShares) * 100
  if (percentage >= 40) {
    return 0.4 * owner.shares
  }
  return owner.shares
}

// Voting for a coach
export const voteCoach = (owner, coach) => {
  if (!owner.votedCoach) {
    owner.voteCoach = coach
    coach.votes += owner.votingPower
  } else {
    console.log(`You have already voted for a coach dude!`)
  }
}

export const votePlayer = (owner, player) => {
  if (player.gender === "male" && owner.players.malePlayers.length < 7){
    owner.players.malePlayers.push(player)
  } else if (owner.players.femalePlayers.length < 7) {
    owner.players.femalePlayers.push(player)
  }

}