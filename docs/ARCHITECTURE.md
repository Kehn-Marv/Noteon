# Architecture Documentation

## Overview

Noteon is built as a modern web application using Next.js 15 with the App Router. The architecture follows a client-first approach with local data storage and optional AI integration.

## Core Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│           Next.js App Router            │
├─────────────────────────────────────────┤
│  Pages (Journal, Knowledge, Chat)       │
├─────────────────────────────────────────┤
│  React Components (UI Layer)            │
├─────────────────────────────────────────┤
│  Context Providers (State Management)   │
├─────────────────────────────────────────┤
│  Dexie (IndexedDB Wrapper)              │
└─────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → React Components
2. **State Management** → Context API
3. **Data Persistence** → Dexie → IndexedDB
4. **AI Features** → API Routes → Vercel AI SDK → Google AI

## Database Schema

### Notes Table
```typescript
{
  id: number (auto-increment)
  title: string
  content: string
  type: 'journal' | 'knowledge'
  createdAt: Date
  updatedAt: Date
  embeddingUpdatedAt: Date | null
}
```

### Embeddings Table
```typescript
{
  id: number (auto-increment)
  noteId: number (foreign key)
  content: string
  embedding: number[] (vector)
}
```

### Chats Table
```typescript
{
  id: string (UUID)
  title: string
  createdAt: Date
  updatedAt: Date
}
```

### ChatMessages Table
```typescript
{
  id: string (UUID)
  chatId: string (foreign key)
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}
```

## Key Components

### Database Layer (`src/lib/db/`)

The database layer uses Dexie.js as a wrapper around IndexedDB:

```typescript
class NoteonDB extends Dexie {
  notes!: EntityTable<Note, "id">;
  embeddings!: EntityTable<Embedding, "id">;
  chats!: EntityTable<Chat, "id">;
  chatMessages!: EntityTable<ChatMessage, "id">;
}
```

### AI Integration (`src/lib/ai/`)

AI features are powered by the Vercel AI SDK with Google's Generative AI:

- **Chat**: Conversational interface with context from notes
- **Search**: Semantic search using embeddings
- **Commands**: AI-powered note operations

### UI Components (`src/components/`)

Built with Radix UI primitives and styled with Tailwind CSS:

- **AppSidebar**: Navigation and app structure
- **Logo**: Dynamic branding component
- **MDXEditor**: Markdown editing interface
- **UI Components**: Reusable design system components

## API Routes

### `/api/chat` (POST)
Handles chat interactions with AI, including context from notes.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

**Response:** Streaming AI response

### `/api/ai-command` (POST)
Executes AI commands on notes.

**Request:**
```json
{
  "prompt": "command text"
}
```

**Response:** Command execution result

## State Management

### Chat Store (`src/contexts/chat-store.tsx`)

Manages chat state using React Context:

```typescript
interface ChatStore {
  chats: Chat[]
  isLoading: boolean
  deleteChat: (id: string) => Promise<void>
  // ... other methods
}
```

## Styling System

### Tailwind Configuration

Custom design tokens defined in `tailwind.config.ts`:

- Color palette with CSS variables
- Typography scale
- Spacing system
- Animation utilities

### Theme Support

Dark/light mode support via `next-themes`:

```typescript
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

## Performance Optimizations

1. **Turbopack**: Fast development builds
2. **React 19**: Concurrent rendering features
3. **IndexedDB**: Fast local data access
4. **Code Splitting**: Automatic route-based splitting
5. **Image Optimization**: Next.js image component

## Security Considerations

1. **Local-First**: Data stays on device by default
2. **API Key Management**: Environment variables for sensitive data
3. **CORS**: Configured for API routes
4. **Input Validation**: Zod schemas for data validation

## Deployment

### Production Build

```bash
npm run build
```

Creates an optimized production build with:
- Minified JavaScript
- Optimized images
- Static page generation where possible

### Docker Deployment

Multi-stage Docker build for minimal image size:

1. **deps**: Install dependencies
2. **builder**: Build application
3. **runner**: Production runtime

### Environment Variables

Required for AI features:
- `GOOGLE_GENERATIVE_AI_API_KEY`: Google AI API key

## Future Considerations

1. **Sync**: Optional cloud sync for multi-device support
2. **Plugins**: Extensible plugin system
3. **Export**: Multiple export formats (PDF, HTML, etc.)
4. **Collaboration**: Real-time collaborative editing
5. **Mobile**: Progressive Web App (PWA) support
