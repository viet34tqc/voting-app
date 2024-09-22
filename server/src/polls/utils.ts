import { customAlphabet, nanoid } from 'nanoid';
import { NominationId, Nominations, Votes } from 'voting-app-shared';

export const createPollId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
);

export const createUserId = () => nanoid();
export const createNominationId = () => nanoid(8);

export const getResults = (
  votes: Votes,
  nominations: Nominations,
  votesPerVoter: number,
) => {
  // Normally, the result is the nomination with the highest number of vote
  // However,there would be a tie if two nominations have the same number of votes
  // So, I will also apply weighted votes method.
  // It's based on the position of nomination in each user votes
  // For example, if a nomination was a first choice more often than another, it could be given more weight (more score).

  const scores: Record<NominationId, number> = {};

  Object.values(votes).forEach((userVotes) => {
    userVotes.forEach((nominationId, index) => {
      const nominationWeight = votesPerVoter - index; // The higher the index, the less weight it gets. That means the nomination is voted later than the others
      scores[nominationId] = (scores[nominationId] || 0) + nominationWeight;
    });
  });

  const results = Object.entries(scores).map(([nominationId, score]) => ({
    nominationId,
    nominationText: nominations[nominationId].text,
    score,
  }));

  // Sort results by score from highest to lowest
  results.sort((result1, result2) => result2.score - result1.score);
  return results;
};
