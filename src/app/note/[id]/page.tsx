"use client";

import { AICommandResultDialog } from "@/components/ai-command-result-dialog";
import { AICommandsMenu } from "@/components/ai-commands-menu";
import Editor from "@/components/editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AICommand, executeAICommand } from "@/lib/ai/commands";
import { generateEmbeddings } from "@/lib/ai/embedding";
import { db, Note, NoteType } from "@/lib/db";
import { SETTINGS } from "@/lib/settings";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [isExecutingCommand, setIsExecutingCommand] = useState(false);
  const [commandResult, setCommandResult] = useState<string>("");
  const [currentCommand, setCurrentCommand] = useState<AICommand | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [isSubjectPopoverOpen, setIsSubjectPopoverOpen] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedSubject = useDebounce(subject, 1000);
  const cookies = useCookies();
  const [autoUpdate] = useState(
    cookies.get(SETTINGS.ai.embeddings.autoUpdate) !== "false" &&
      cookies.get(SETTINGS.ai.provider.apiKey) !== undefined,
  );

  const loadNote = useCallback(async () => {
    try {
      const result = await db.notes.get(parseInt(id));
      if (result) {
        setNote(result);
        setContent(result.content);
        setTitle(result.title);
        setSubject(result.subject || "");
      }
    } catch (error) {
      console.error("Failed to load note:", error);
    }
  }, [id]);

  const handleCommandSelect = async (command: AICommand) => {
    setIsExecutingCommand(true);
    setCurrentCommand(command);

    try {
      // Get text selection from window
      const selection = window.getSelection();
      const textToProcess =
        command === "clarify" && selection && selection.toString().trim()
          ? selection.toString()
          : content;

      if (command === "clarify" && selection && selection.toString().trim()) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText("");
      }

      const result = await executeAICommand(command, textToProcess);

      if (result.success && result.result) {
        setCommandResult(result.result);
        setShowResultDialog(true);
      } else {
        toast.error(result.error || "Failed to execute command");
      }
    } catch (error) {
      console.error("Command execution error:", error);
      toast.error("An error occurred while processing your request");
    } finally {
      setIsExecutingCommand(false);
    }
  };

  const handleReplaceText = () => {
    if (selectedText && commandResult) {
      // Use a more robust replacement that handles the first occurrence
      const index = content.indexOf(selectedText);
      if (index !== -1) {
        const newContent = 
          content.substring(0, index) + 
          commandResult + 
          content.substring(index + selectedText.length);
        setContent(newContent);
        // Force editor to re-render with new content
        setEditorKey(prev => prev + 1);
      } else {
        // Fallback: if exact match not found, just replace using string replace
        const newContent = content.replace(selectedText, commandResult);
        setContent(newContent);
        setEditorKey(prev => prev + 1);
      }
      setSelectedText("");
    }
  };

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  useEffect(() => {
    const updateNote = async () => {
      if (!note) return;
      if (
        content === note.content &&
        title === note.title &&
        subject === (note.subject || "")
      )
        return;

      try {
        await db.notes.update(note.id, {
          content,
          title,
          subject: subject || undefined,
          updatedAt: new Date(),
        });
        if (autoUpdate) {
          await db.embeddings.where("noteId").equals(note.id).delete();
          const embedding = await generateEmbeddings(content, title);
          await db.embeddings.bulkAdd(
            embedding.map((embedding) => ({
              noteId: note.id,
              content: embedding.content,
              embedding: embedding.embedding,
            })),
          );
          await db.notes.update(note.id, {
            embeddingUpdatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Failed to update note:", error);
      }
    };

    updateNote();
  }, [
    debouncedContent,
    debouncedTitle,
    debouncedSubject,
    note,
    content,
    title,
    subject,
    autoUpdate,
  ]);

  const handleDelete = async () => {
    if (!note) return;

    try {
      // Delete all embeddings associated with this note
      await db.embeddings.where("noteId").equals(note.id).delete();
      // Then delete the note itself
      await db.notes.delete(note.id);
      toast.success("Note deleted.");
      router.push(note.type === NoteType.Journal ? "/journal" : "/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete the note. Please try again.");
    }
  };

  if (!note) {
    return <div>Loading...</div>;
  }

  const backUrl = note.type === NoteType.Journal ? "/journal" : "/notes";

  return (
    <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
      {/* Header with back link and actions */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-3 sm:pb-4">
        <Link
          href={backUrl}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to {note.type === NoteType.Journal ? "Journal" : "Notes"}</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <AICommandsMenu
            onCommandSelect={handleCommandSelect}
            disabled={isExecutingCommand}
          />
          {note.type === NoteType.Notes && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="rounded-full bg-destructive/10 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20">
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the note and all its content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* AI Processing indicator */}
      {isExecutingCommand && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing with AI...</span>
        </div>
      )}

      {/* Note content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Title and metadata - wrapped in pill */}
        <div className="inline-flex flex-col rounded-2xl bg-muted/50 px-4 py-3 sm:px-6 sm:py-4">
          <div className="mb-2">
            {note.type === NoteType.Notes ? (
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  if (newTitle.length <= 100) {
                    setTitle(newTitle);
                  }
                }}
                placeholder="Untitled"
                maxLength={100}
                size={1}
                className="border-none bg-transparent text-2xl sm:text-3xl font-bold placeholder:text-muted-foreground/40 focus:outline-none min-w-[8ch]"
                style={{ width: `${Math.max(title.length, 8)}ch` }}
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold">{note.title}</h1>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
            {note.type === NoteType.Notes && (
              <Popover open={isSubjectPopoverOpen} onOpenChange={setIsSubjectPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/20">
                    {subject || "Add subject"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] max-w-80" align="start">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Edit Subject</h4>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject..."
                      className="text-sm"
                      maxLength={50}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setIsSubjectPopoverOpen(false);
                        }
                      }}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => setIsSubjectPopoverOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="pt-2">
          <Editor
            key={editorKey}
            markdown={content}
            onValueChange={setContent}
            placeholder="Start writing..."
            contentEditableClassName="min-h-[calc(100vh-350px)] sm:min-h-[calc(100vh-400px)]"
          />
        </div>
      </div>

      <AICommandResultDialog
        open={showResultDialog}
        onOpenChange={setShowResultDialog}
        command={currentCommand}
        result={commandResult}
        onReplace={selectedText ? handleReplaceText : undefined}
        canReplace={!!selectedText}
      />
    </div>
  );
}
