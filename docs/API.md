# API Documentation

## Overview

Noteon provides a minimal API surface for AI-powered features. All APIs are internal and designed to work with the frontend application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required as all data is local. API keys for AI providers are configured via environment variables.

## Endpoints

### Chat API

#### POST `/api/chat`

Stream chat responses with context from your notes.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What did I write about project planning?"
    }
  ]
}
```

**Response:**
- Streaming response using Server-Sent Events (SSE)
- Content-Type: `text/event-stream`

**Example:**
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
});

const reader = response.body.getReader();
// Handle streaming response
```

**Status Codes:**
- `200`: Success
- `400`: Bad request (invalid message format)
- `500`: Server error

---

### AI Command API

#### POST `/api/ai-command`

Execute AI-powered commands on note content.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Summarize this note: [note content]"
}
```

**Response:**
```json
{
  "result": "Summary of the note content..."
}
```

**Supported Commands:**
- Summarize
- Expand
- Rewrite
- Fix grammar
- Translate
- Custom prompts

**Example:**
```typescript
const response = await fetch('/api/ai-command', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'Fix grammar: ' + noteContent 
  })
});

const data = await response.json();
console.log(data.result);
```

**Status Codes:**
- `200`: Success
- `400`: Bad request (missing prompt)
- `500`: Server error

---

## Rate Limiting

Currently, no rate limiting is implemented. For production deployments, consider:

1. Implementing rate limiting middleware
2. Using API keys for external access
3. Setting up request quotas

## Error Handling

All API endpoints return errors in the following format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `INVALID_REQUEST`: Malformed request body
- `AI_PROVIDER_ERROR`: Error from AI provider
- `INTERNAL_ERROR`: Server-side error

## Configuration

### Environment Variables

```env
# Required for AI features
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# Optional: Configure AI model
AI_MODEL=gemini-pro
```

### Timeouts

- Maximum duration: 30 seconds (configured in route handlers)
- Streaming timeout: 60 seconds

## Usage Examples

### React Hook for Chat

```typescript
import { useChat } from '@ai-sdk/react';

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleInputChange} />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Direct API Call

```typescript
async function executeCommand(prompt: string) {
  try {
    const response = await fetch('/api/ai-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Command execution failed:', error);
    throw error;
  }
}
```

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Loading States**: Show loading indicators during streaming
3. **Retry Logic**: Implement exponential backoff for failed requests
4. **Caching**: Cache responses when appropriate
5. **Abort Controllers**: Use AbortController for cancellable requests

## Limitations

- Maximum request size: 10MB
- Maximum response time: 30 seconds
- Streaming responses only for chat endpoint
- No batch operations currently supported

## Future API Additions

Planned endpoints for future releases:

- `/api/export` - Export notes in various formats
- `/api/import` - Import notes from other apps
- `/api/sync` - Cloud sync functionality
- `/api/share` - Share notes with others
