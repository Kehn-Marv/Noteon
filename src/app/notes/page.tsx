"use client";

import { NotesDialog } from "@/app/notes/notes-dialog";
import { Input } from "@/components/ui/input";
import { db, Note, NoteType } from "@/lib/db";
import { Clock, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const result = await db.notes
        .where("type")
        .equals(NoteType.Notes)
        .reverse()
        .toArray();
      setItems(result);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await db.notes
        .where("type")
        .equals(NoteType.Notes)
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase()),
        )
        .toArray();
      setItems(results);
    } else {
      loadItems();
    }
  };

  const handleCreate = async (
    data: Omit<Note, "id" | "createdAt" | "updatedAt" | "embeddingUpdatedAt" | "content">,
  ): Promise<number> => {
    const now = new Date();
    const noteId = await db.notes.add({
      ...data,
      content: "",
      type: NoteType.Notes,
      createdAt: now,
      updatedAt: null,
      embeddingUpdatedAt: null,
    });
    
    // Navigate to the newly created note
    router.push(`/note/${noteId}`);
    return Number(noteId);
  };

  return (
    <div className="container mx-auto space-y-4 px-3 py-4 sm:px-4 sm:py-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9 border-border/50 focus-visible:ring-primary/20 shadow-sm"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <NotesDialog onSubmit={handleCreate} />
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/note/${item.id}`}
            className="group cursor-pointer rounded-xl border border-border/50 bg-card px-4 py-3 sm:px-5 sm:py-4 shadow-sm transition-all duration-200 hover:border-border hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                {item.subject && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {item.subject}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
