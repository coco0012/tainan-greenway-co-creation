import { mockResponses } from '@/data/mockResponses';

export interface AIResponses {
  [roleId: string]: string;
}

/**
 * Simulates fetching AI stakeholder responses asynchronously.
 * 
 * Future implementation:
 * Replace this mock fetching with a real Server API fetch:
 * 
 *   const response = await fetch('/api/negotiate', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ roundId, playerRoleId, choiceId })
 *   });
 *   return await response.json();
 */
export async function fetchAIResponses(
  roundId: number,
  playerRoleId: string,
  choiceId?: string
): Promise<AIResponses> {
  // Simulate network latency (e.g., 900ms) to mock server processing
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Return the mock responses for the given round
  return mockResponses[roundId] || {};
}
