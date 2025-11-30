import { getProvider } from "@/lib/ai/provder";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const provider = await getProvider();
    if (!provider) {
      return new Response(
        JSON.stringify({
          error: "No provider found. Please set API credentials first.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { text } = await generateText({
      model: provider("gemini-2.5-flash"),
      prompt,
      maxTokens: 8000,
    });

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI command error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
