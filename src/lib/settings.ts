export const SETTINGS = {
  ai: {
    provider: {
      apiKey: "settings.ai.provider.apiKey",
      baseUrl: "settings.ai.provider.baseUrl",
    },
    embeddings: {
      autoUpdate: "settings.ai.embeddings.autoUpdate",
    },
    chat: {
      accessJournal: "settings.ai.chat.accessJournal",
      accessNotes: "settings.ai.chat.accessNotes",
    },
  },
} as const;

// Type helper for getting nested values
type SettingsValue<T> =
  T extends Record<string, unknown>
    ? { [K in keyof T]: SettingsValue<T[K]> }
    : string;

// Inferred settings type
export type Settings = SettingsValue<typeof SETTINGS>;
