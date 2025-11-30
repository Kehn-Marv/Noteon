"use client";

import { db } from "@/lib/db";
import { generateEmbedding } from "@/lib/ai/embedding";

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

export interface SearchResult {
  noteId: number;
  noteTitle: string;
  noteType: string;
  content: string;
  createdAt: Date;
  similarity: number;
}

export async function searchUserContent(
  query: string,
  allowedTypes: string[],
  limit = 5
): Promise<SearchResult[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);
  
  // Get all embeddings
  const allEmbeddings = await db.embeddings.toArray();
  
  if (allEmbeddings.length === 0) {
    return [];
  }
  
  // Get all notes
  const allNotes = await db.notes.toArray();
  const noteMap = new Map(allNotes.map(n => [n.id, n]));
  
  // Calculate similarity and filter
  const results: SearchResult[] = [];
  
  for (const emb of allEmbeddings) {
    const note = noteMap.get(emb.noteId);
    if (!note || !allowedTypes.includes(note.type)) continue;
    
    const similarity = cosineSimilarity(queryEmbedding, emb.embedding);
    
    results.push({
      noteId: note.id,
      noteTitle: note.title,
      noteType: note.type,
      content: emb.content,
      createdAt: note.createdAt,
      similarity,
    });
  }
  
  // Sort by similarity and return top results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
