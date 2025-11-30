import { SETTINGS } from "@/lib/settings";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { cookies } from "next/headers";

export const getProvider = async () => {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get(SETTINGS.ai.provider.apiKey)?.value;
  if (!apiKey) {
    return null;
  }
  const provider = createGoogleGenerativeAI({
    apiKey: apiKey,
  });
  return provider;
};
