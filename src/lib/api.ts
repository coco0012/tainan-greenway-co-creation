import { mockResponses, mockReactions } from '@/data/mockResponses';

export interface AIResponses {
  [roleId: string]: string;
}

/**
 * Simulates fetching AI stakeholder comments BEFORE a decision is made.
 */
export async function fetchAIResponses(
  roundId: number,
  playerRoleId: string
): Promise<AIResponses> {
  // Simulate network latency (e.g., 800ms)
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return the initial mock concerns for the given round
  return mockResponses[roundId] || {};
}

/**
 * Simulates fetching AI stakeholder reactions AFTER a decision is made.
 */
export async function fetchAIReactions(
  roundId: number,
  choiceId: string
): Promise<AIResponses> {
  // Simulate network latency for AI deliberation (e.g., 1000ms)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return the mock reactions for the given choice
  return mockReactions[choiceId] || {};
}
