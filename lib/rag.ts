import { qaData, QAItem } from "@/data/qa-data";

/**
 * Simple keyword-based search for relevant QAs
 * TODO: Upgrade to vector similarity search using embeddings
 */
export function searchRelevantQAs(query: string, topK: number = 5): QAItem[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower
    .split(/\s+/)
    .filter((word) => word.length > 2); // Filter out short words

  // Score each QA based on keyword matches
  const scoredQAs = qaData.map((qa) => {
    let score = 0;

    const questionLower = qa.question.toLowerCase();
    const answerLower = qa.answer.toLowerCase();
    const keywordsLower = (qa.keywords || []).map((k) => k.toLowerCase());

    queryWords.forEach((word) => {
      // Question match - highest weight
      if (questionLower.includes(word)) {
        score += 3;
      }
      // Keyword match - medium weight
      if (keywordsLower.some((k) => k.includes(word))) {
        score += 2;
      }
      // Answer match - lower weight
      if (answerLower.includes(word)) {
        score += 1;
      }
    });

    return { qa, score };
  });

  // Filter and sort by score
  const relevantQAs = scoredQAs
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.qa);

  return relevantQAs;
}

/**
 * TODO: Implement vector-based semantic search
 * 
 * This would involve:
 * 1. Generate embeddings for all QAs using Gemini or other embedding APIs
 * 2. Store embeddings in Supabase with pgvector
 * 3. Generate embedding for user query
 * 4. Find most similar QAs using cosine similarity
 * 
 * Example implementation:
 * 
 * import { createClient } from '@supabase/supabase-js';
 * 
 * export async function vectorSearchQAs(query: string, topK: number = 5) {
 *   const supabase = createClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 *   );
 *   
 *   // Generate embedding for query
 *   const queryEmbedding = await generateEmbedding(query);
 *   
 *   // Search in Supabase
 *   const { data, error } = await supabase.rpc('match_qas', {
 *     query_embedding: queryEmbedding,
 *     match_count: topK
 *   });
 *   
 *   return data;
 * }
 */
