import { Chat } from "@/lib/db/schema/chat";
import { ChatMessage } from "@/lib/db/schema/chat-message";
import { Embedding } from "@/lib/db/schema/embedding";
import { Note } from "@/lib/db/schema/note";
import Dexie, { EntityTable } from "dexie";

class NoteonDB extends Dexie {
  notes!: EntityTable<Note, "id">;
  embeddings!: EntityTable<Embedding, "id">;
  chats!: EntityTable<Chat, "id">;
  chatMessages!: EntityTable<ChatMessage, "id">;

  constructor() {
    super("noteon");
    this.version(1).stores({
      notes: "++id, title, type, createdAt, updatedAt, embeddingUpdatedAt",
      embeddings: "++id, noteId, content, embedding",
      chats: "++id, title, updatedAt, createdAt",
      chatMessages: "++id, chatId",
    });
    // Add subject field to notes (migration)
    this.version(2).stores({
      notes: "++id, title, type, subject, createdAt, updatedAt, embeddingUpdatedAt",
      embeddings: "++id, noteId, content, embedding",
      chats: "++id, title, updatedAt, createdAt",
      chatMessages: "++id, chatId",
    });
    // Migrate "knowledge" type to "notes" type
    this.version(3).stores({
      notes: "++id, title, type, subject, createdAt, updatedAt, embeddingUpdatedAt",
      embeddings: "++id, noteId, content, embedding",
      chats: "++id, title, updatedAt, createdAt",
      chatMessages: "++id, chatId",
    }).upgrade(async (tx) => {
      // Update all notes with type "knowledge" to "notes"
      const notes = await tx.table("notes").toArray();
      for (const note of notes) {
        if (note.type === "knowledge") {
          await tx.table("notes").update(note.id, { type: "notes" });
        }
      }
    });
  }
}

export const db = new NoteonDB();
export * from "@/lib/db/schema/chat";
export * from "@/lib/db/schema/chat-message";
export * from "@/lib/db/schema/embedding";
export * from "@/lib/db/schema/note";
