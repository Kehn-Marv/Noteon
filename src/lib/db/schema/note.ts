export enum NoteType {
  Journal = "journal",
  Notes = "notes",
}

export type Note = {
  id: number;
  title: string;
  type: NoteType;
  content: string;
  subject?: string; // e.g., "Math", "History", "Biology"
  createdAt: Date;
  updatedAt: Date | null;
  embeddingUpdatedAt: Date | null;
};
