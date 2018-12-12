// The owner that tries to vote for a coach
const currentOwner = await Owner.findOne(currentUser.id)

// The team we are about to check if the owner can vote for
const team = await Team.findOne(teamId)

const currentCoach = await.findOne(coachId)

if (team) {

  // Also need to check for the 40% rule
  // Also check if you can vote multiple times at once
  currentOwner.availableVotes -= 1
  currentCoach.votes +=1

}