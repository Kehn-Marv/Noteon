"use client";

import { EmbeddingsSettings } from "@/components/settings/embeddings-settings";
import { ProviderSettings } from "@/components/settings/provider-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { generateEmbeddings } from "@/lib/ai/embedding";
import { db } from "@/lib/db";
import { SETTINGS } from "@/lib/settings";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SettingsTab = "provider" | "embeddings" | "chat" | "theme";

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const cookies = useCookies();
  const [apiKey, setApiKey] = useState(
    cookies.get(SETTINGS.ai.provider.apiKey) ?? "",
  );
  const [autoUpdateEmbeddings, setAutoUpdateEmbeddings] = useState(
    cookies.get(SETTINGS.ai.embeddings.autoUpdate) !== "false",
  );
  const [chatAccessJournal, setChatAccessJournal] = useState(
    cookies.get(SETTINGS.ai.chat.accessJournal) !== "false",
  );
  const [chatAccessNotes, setChatAccessNotes] = useState(
    cookies.get(SETTINGS.ai.chat.accessNotes) !== "false",
  );

  // Auto-save chat access settings when they change
  const handleChatAccessJournalChange = (value: boolean) => {
    setChatAccessJournal(value);
    cookies.set(SETTINGS.ai.chat.accessJournal, value.toString());
    toast.success("Setting updated", {
      description: `Journal access ${value ? "enabled" : "disabled"}.`,
    });
  };

  const handleChatAccessNotesChange = (value: boolean) => {
    setChatAccessNotes(value);
    cookies.set(SETTINGS.ai.chat.accessNotes, value.toString());
    toast.success("Setting updated", {
      description: `Notes access ${value ? "enabled" : "disabled"}.`,
    });
  };
  const [activeTab, setActiveTab] = useState<SettingsTab>("provider");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSave = () => {
    cookies.set(SETTINGS.ai.provider.apiKey, apiKey);
    cookies.set(
      SETTINGS.ai.embeddings.autoUpdate,
      autoUpdateEmbeddings.toString(),
    );
    cookies.set(
      SETTINGS.ai.chat.accessJournal,
      chatAccessJournal.toString(),
    );
    cookies.set(
      SETTINGS.ai.chat.accessNotes,
      chatAccessNotes.toString(),
    );
    onClose();
    router.refresh();

    // Dispatch custom event to notify that settings have been updated
    window.dispatchEvent(new Event("settings-updated"));

    toast.success("Settings saved.", {
      description: "Your settings have been successfully updated.",
    });
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      console.log("🔄 Starting synchronization...");
      
      // Get ALL notes (both journals and notes)
      const allNotes = await db.notes.toArray();
      console.log(`📝 Found ${allNotes.length} total notes/journals`);
      
      // Filter notes that need updates
      const notesToUpdate = allNotes.filter((note) => {
        if (!note.content || note.content.trim().length === 0) {
          console.log(`⏭️ Skipping note ${note.id} - empty content`);
          return false;
        }
        if (!note.embeddingUpdatedAt) {
          console.log(`✅ Including note ${note.id} "${note.title}" - no embeddings`);
          return true;
        }
        if (note.updatedAt && note.updatedAt > note.embeddingUpdatedAt) {
          console.log(`✅ Including note ${note.id} "${note.title}" - outdated embeddings`);
          return true;
        }
        console.log(`⏭️ Skipping note ${note.id} "${note.title}" - up to date`);
        return false;
      });

      console.log(`🎯 ${notesToUpdate.length} items need embedding updates`);

      if (notesToUpdate.length === 0) {
        toast.info("No updates needed", {
          description: "All notes and journals are already synchronized.",
        });
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Process each note
      for (const note of notesToUpdate) {
        try {
          console.log(`🔄 Processing note ${note.id} "${note.title}" (${note.type})...`);
          
          const embeddings = await generateEmbeddings(note.content, note.title);
          console.log(`✅ Generated ${embeddings.length} embeddings for note ${note.id}`);
          
          await db.transaction("rw", db.notes, db.embeddings, async () => {
            // Delete old embeddings
            await db.embeddings.where("noteId").equals(note.id).delete();
            
            // Add new embeddings
            await db.embeddings.bulkAdd(
              embeddings.map((emb) => ({
                noteId: note.id,
                content: emb.content,
                embedding: emb.embedding,
              })),
            );
            
            // Update the note's embeddingUpdatedAt timestamp
            await db.notes.update(note.id, {
              embeddingUpdatedAt: new Date(),
            });
          });
          
          console.log(`✅ Successfully updated note ${note.id}`);
          successCount++;
        } catch (error) {
          console.error(`❌ Error processing note ${note.id}:`, error);
          errorCount++;
        }
      }

      if (errorCount > 0) {
        toast.warning("Partial sync completed", {
          description: `Updated ${successCount} items, ${errorCount} failed.`,
        });
      } else {
        toast.success("Embeddings synchronized", {
          description: `Successfully updated ${successCount} ${successCount === 1 ? 'item' : 'items'} (notes and journals).`,
        });
      }

      router.refresh();
    } catch (error) {
      console.error("❌ Error syncing embeddings:", error);
      toast.error("Sync failed", {
        description: error instanceof Error ? error.message : "Failed to synchronize embeddings. Please try again.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Settings</DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>AI</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "provider"}
                        onClick={() => setActiveTab("provider")}
                      >
                        <span>Provider</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "embeddings"}
                        onClick={() => setActiveTab("embeddings")}
                      >
                        <span>Embeddings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "chat"}
                        onClick={() => setActiveTab("chat")}
                      >
                        <span>Chat Access</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "theme"}
                        onClick={() => setActiveTab("theme")}
                      >
                        <span>Theme</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <div className="mb-4 flex border-b px-4 pt-4 md:hidden">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "provider"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("provider")}
              >
                Provider
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "embeddings"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("embeddings")}
              >
                Embeddings
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "chat"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("chat")}
              >
                Chat
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "theme"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("theme")}
              >
                Theme
              </button>
            </div>
            <div className="relative flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              {activeTab === "provider" && (
                <ProviderSettings
                  apiKey={apiKey}
                  onApiKeyChange={setApiKey}
                  onSave={handleSave}
                  onCancel={onClose}
                />
              )}
              {activeTab === "embeddings" && (
                <EmbeddingsSettings
                  autoUpdate={autoUpdateEmbeddings}
                  onAutoUpdateChange={setAutoUpdateEmbeddings}
                  onSync={handleSync}
                  isSyncing={isSyncing}
                />
              )}
              {activeTab === "chat" && (
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="text-lg font-medium">Chat Access</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Control which content the AI chat can access and search.
                    </p>
                  </div>

                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="access-journal" className="text-base">
                          Access Journal
                        </Label>
                        <p className="text-[13px] text-muted-foreground">
                          Allow AI to search and retrieve journal entries
                        </p>
                      </div>
                      <Switch
                        id="access-journal"
                        checked={chatAccessJournal}
                        onCheckedChange={handleChatAccessJournalChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="access-notes" className="text-base">
                          Access Notes
                        </Label>
                        <p className="text-[13px] text-muted-foreground">
                          Allow AI to search and retrieve notes
                        </p>
                      </div>
                      <Switch
                        id="access-notes"
                        checked={chatAccessNotes}
                        onCheckedChange={handleChatAccessNotesChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "theme" && <ThemeSettings />}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
