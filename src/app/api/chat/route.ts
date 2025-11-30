import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getProvider } from "@/lib/ai/provder";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const provider = await getProvider();
  
  if (!provider) {
    return new Response("No provider found. Please set API credentials first.", {
      status: 400,
    });
  }
  
  const messagesWithSystem = [
    { 
      role: "user" as const, 
      content: CHAT_SYSTEM_PROMPT 
    },
    { 
      role: "assistant" as const, 
      content: "Understood. I'm ready to help you with your notes and journals." 
    },
    ...messages,
  ];
  
  const result = streamText({
    model: provider("gemini-2.5-flash"),
    messages: messagesWithSystem,
  });

  return result.toDataStreamResponse();
}
