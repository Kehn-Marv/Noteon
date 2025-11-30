"use client";

import { Messages } from "@/components/chat/messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatWithMessages, useChatStore } from "@/contexts/chat-store";
import { generateChatTitle } from "@/lib/chat";
import { NoteType } from "@/lib/db";
import { SETTINGS } from "@/lib/settings";
import { searchUserContent } from "@/lib/search";
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";
import { useCookies } from "next-client-cookies";
import { useState } from "react";

interface ChatContainerProps {
  className?: string;
  containerClassName?: string;
  chat: ChatWithMessages;
}

export function ChatContainer({
  className,
  containerClassName,
  chat,
}: ChatContainerProps) {
  const cookies = useCookies();
  const { updateChat, insertChatMessage } = useChatStore();
  const [isSearching, setIsSearching] = useState(false);
  
  const accessJournal = cookies.get(SETTINGS.ai.chat.accessJournal) !== "false";
  const accessNotes = cookies.get(SETTINGS.ai.chat.accessNotes) !== "false";
  
  const allowedTypes: string[] = [];
  if (accessJournal) allowedTypes.push(NoteType.Journal);
  if (accessNotes) allowedTypes.push(NoteType.Notes);
  
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    setMessages,
    append,
    stop,
    error,
    reload,
    isLoading,
  } = useChat({
    api: "/api/chat",
    initialMessages: chat.messages,
    id: chat.id,
    onFinish: async (message) => {
      if (message.role === "assistant" && message.content) {
        await insertChatMessage({
          content: message.content,
          createdAt: new Date(),
          role: message.role as "assistant",
          chatId: chat.id,
        });
      }
    },
  });

  const handleSaveMessage = async (content: string) => {
    await insertChatMessage({
      content,
      createdAt: new Date(),
      role: "user",
      chatId: chat.id,
    });

    if (messages.length === 0 && chat.title === "New Chat") {
      try {
        const generatedTitle = generateChatTitle(content);
        await updateChat(chat.id, {
          title: generatedTitle,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error("Failed to generate chat title:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isSearching) return;
    
    const userInput = input.trim();
    
    // Clear input immediately
    setInput("");
    
    // Check if this is a personal query
    const isPersonalQuery = /\b(do i|did i|have i|my|mine|i have|i wrote|i write|writeup|journal|note|recent|what.*i|have.*written|any.*about)\b/i.test(userInput);
    
    if (isPersonalQuery) {
      await handleSaveMessage(userInput);
      
      // Manually add user message to UI (won't trigger AI response)
      setMessages([...messages, {
        id: `user-${Date.now()}`,
        role: "user",
        content: userInput,
        createdAt: new Date(),
      }]);
      
      // Check if user has disabled access to both journals and notes
      if (allowedTypes.length === 0) {
        const contextMessage = `[SEARCH_CONTEXT]
User's question: "${userInput}"

IMPORTANT: The user has disabled AI access to both journals and notes in Settings. 
You cannot search their content. 
Politely let them know they need to enable "Access Journal" or "Access Notes" in Settings → Chat Access to search their content.`;
        
        await append({
          role: "user",
          content: contextMessage,
        });
        return;
      }
      
      setIsSearching(true);
      
      try {
        const results = await searchUserContent(userInput, allowedTypes, 5);
        
        // Send internal context with search results (will be hidden from UI)
        let contextMessage: string;
        
        if (results.length > 0) {
          const searchContext = results
            .map((r, i) => {
              const date = new Date(r.createdAt).toLocaleDateString();
              return `[${i + 1}] From "${r.noteTitle}" (${r.noteType}, ${date}):\n${r.content}`;
            })
            .join("\n\n");
          
          contextMessage = `[SEARCH_CONTEXT]
User's question: "${userInput}"

Found ${results.length} relevant entries:

${searchContext}

Answer based on these entries.`;
        } else {
          const searchedIn = allowedTypes.map(t => t === "journal" ? "journal entries" : "notes").join(" and ");
          contextMessage = `[SEARCH_CONTEXT]
User's question: "${userInput}"

Searched in: ${searchedIn}
No relevant entries found. 

Let them know politely that you couldn't find anything in their ${searchedIn}.
${allowedTypes.length === 1 ? `Note: They have only enabled access to ${searchedIn}. If they want to search ${allowedTypes[0] === "journal" ? "notes" : "journal entries"} too, they can enable it in Settings → Chat Access.` : ''}`;
        }
        
        await append({
          role: "user",
          content: contextMessage,
        });
        
      } catch (error) {
        console.error("Search error:", error);
        await handleSaveMessage(userInput);
        await append({
          role: "user",
          content: userInput,
        });
      } finally {
        setIsSearching(false);
      }
    } else {
      await handleSaveMessage(userInput);
      await append({
        role: "user",
        content: userInput,
      });
    }
  };

  return (
    <div
      className={
        containerClassName ??
        "container flex h-[calc(100vh-64px)] max-w-3xl flex-col gap-4 py-6"
      }
    >
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          <Messages 
            messages={messages.filter(m => 
              !(m.role === "user" && m.content.startsWith("[SEARCH_CONTEXT]"))
            ) as Message[]} 
            isLoading={isLoading || isSearching} 
          />
        </div>
      </div>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">An error occurred.</p>
          <button 
            type="button" 
            onClick={() => reload()}
            className="mt-2 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}
      <div className="sticky bottom-6">
        <ChatInput
          className={className}
          input={input}
          disabled={isSearching}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onStop={isLoading ? stop : undefined}
        />
      </div>
    </div>
  );
}
