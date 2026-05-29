import { Effect } from '@/data/missionData';

export const calculateStrategy = (scores: Effect): string => {
  const scoreEntries = Object.entries(scores);
  
  // Find highest score
  let maxScore = -Infinity;
  for (const [, score] of scoreEntries) {
    if (score > maxScore) {
      maxScore = score;
    }
  }

  // Find all categories with the highest score
  const topCategories = scoreEntries
    .filter(([, score]) => score === maxScore)
    .map(([category]) => category);

  // If there's a tie of 3 or more, or if maxScore is not particularly high compared to average, 
  // we could consider it 'balanced', but for this prototype, if there are multiple winners, 
  // or all scores are close to starting values, we can return 'balanced'
  
  const scoreValues = Object.values(scores);
  const minScore = Math.min(...scoreValues);
  const spread = maxScore - minScore;

  if (spread <= 15) {
    return 'balanced';
  }

  // If there's a clear winner or tie between two, just pick the first one for simplicity,
  // or return balanced if it's too tied.
  if (topCategories.length > 2) {
    return 'balanced';
  }

  return topCategories[0];
};
