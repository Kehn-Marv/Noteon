# Features Documentation

## Core Features

### 1. Note Taking

#### Journal Notes
Personal, chronological notes for daily journaling and thought capture.

**Features:**
- Markdown formatting support
- Auto-save functionality
- Date-based organization
- Quick note creation
- Full-text search

**Use Cases:**
- Daily journaling
- Meeting notes
- Quick thoughts and ideas
- Personal reflections

#### Knowledge Base
Organized, reference-style notes for long-term knowledge management.

**Features:**
- Hierarchical organization
- Tag support
- Cross-referencing
- Rich markdown editing
- Persistent storage

**Use Cases:**
- Technical documentation
- Research notes
- Learning materials
- Reference guides

### 2. Markdown Editor

Full-featured markdown editor powered by MDXEditor.

**Supported Syntax:**
- Headers (H1-H6)
- Bold, italic, strikethrough
- Lists (ordered, unordered, tasks)
- Code blocks with syntax highlighting
- Tables
- Links and images
- Blockquotes
- Horizontal rules

**Editor Features:**
- Live preview
- Toolbar shortcuts
- Keyboard shortcuts
- Drag and drop
- Copy/paste support

### 3. AI-Powered Chat

Conversational interface to interact with your notes.

**Capabilities:**
- Ask questions about your notes
- Get summaries of topics
- Find related information
- Generate insights
- Context-aware responses

**How It Works:**
1. Your notes are indexed locally
2. When you ask a question, relevant notes are retrieved
3. AI uses the context to provide accurate answers
4. All processing happens securely

**Example Queries:**
- "What did I write about project X?"
- "Summarize my notes from last week"
- "Find all notes mentioning AI"
- "What are my main goals?"

### 4. Smart Search

AI-powered search that understands context and meaning.

**Search Types:**

**Text Search:**
- Exact phrase matching
- Partial word matching
- Case-insensitive

**Semantic Search:**
- Meaning-based search
- Related concept finding
- Context understanding

**Filters:**
- By date range
- By note type (journal/knowledge)
- By tags

### 5. Local-First Storage

All data stored locally on your device using IndexedDB.

**Benefits:**
- Complete privacy
- Works offline
- Fast access
- No server required
- Your data stays yours

**Data Stored:**
- Notes and content
- Chat history
- User preferences
- Search indexes

**Storage Limits:**
- Browser-dependent (typically 50MB+)
- Automatic cleanup of old data
- Manual export options

### 6. Theme Support

Built-in dark and light mode support.

**Themes:**
- Light mode (default)
- Dark mode
- System preference sync

**Customization:**
- Automatic theme switching
- Persistent preference
- Smooth transitions

### 7. Privacy & Security

**Privacy Features:**
- No data collection
- No tracking
- No analytics (optional Vercel Analytics)
- Local-only storage

**Security:**
- No server-side storage
- API keys stored in environment
- HTTPS recommended for deployment
- No third-party data sharing

## AI Features

### AI Commands

Execute AI-powered operations on your notes.

**Available Commands:**

**Summarize:**
- Condense long notes
- Extract key points
- Generate TL;DR

**Expand:**
- Add more detail
- Elaborate on ideas
- Generate examples

**Rewrite:**
- Improve clarity
- Change tone
- Restructure content

**Fix Grammar:**
- Correct spelling
- Fix punctuation
- Improve sentence structure

**Translate:**
- Multiple languages
- Preserve formatting
- Context-aware

**Custom Prompts:**
- Write your own commands
- Combine operations
- Save favorites

### Context-Aware AI

AI features understand your note context.

**Context Sources:**
- Current note content
- Related notes
- Previous conversations
- User preferences

**Context Usage:**
- More accurate responses
- Relevant suggestions
- Personalized results

## User Interface

### Sidebar Navigation

**Sections:**
- Journal: Daily notes
- Knowledge: Reference notes
- Chat: AI conversations
- Settings: App configuration

**Features:**
- Collapsible sections
- Recent chats list
- Quick navigation
- Keyboard shortcuts

### Note Editor

**Toolbar:**
- Formatting options
- Insert elements
- AI commands
- Save/export

**Editor Area:**
- Full-screen mode
- Split view (future)
- Distraction-free writing

### Chat Interface

**Features:**
- Message history
- Streaming responses
- Code highlighting
- Copy responses
- Delete conversations

## Keyboard Shortcuts

### Global
- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: New note
- `Ctrl/Cmd + S`: Save note
- `Ctrl/Cmd + /`: Toggle sidebar

### Editor
- `Ctrl/Cmd + B`: Bold
- `Ctrl/Cmd + I`: Italic
- `Ctrl/Cmd + K`: Insert link
- `Ctrl/Cmd + Shift + C`: Code block

### Navigation
- `Ctrl/Cmd + 1`: Journal
- `Ctrl/Cmd + 2`: Knowledge
- `Ctrl/Cmd + 3`: Chat
- `Ctrl/Cmd + ,`: Settings

## Export & Import

### Export Options

**Formats:**
- Markdown (.md)
- Plain text (.txt)
- JSON (with metadata)

**Export Scope:**
- Single note
- Multiple notes
- All notes
- Chat history

### Import Options

**Supported Formats:**
- Markdown files
- Plain text
- JSON backup

**Import Features:**
- Preserve metadata
- Merge or replace
- Conflict resolution

## Upcoming Features

### Planned for Next Release

1. **Tags System**
   - Add tags to notes
   - Filter by tags
   - Tag suggestions

2. **Note Templates**
   - Pre-defined structures
   - Custom templates
   - Quick start guides

3. **Advanced Search**
   - Boolean operators
   - Regex support
   - Saved searches

4. **Export Enhancements**
   - PDF export
   - HTML export
   - Batch operations

### Future Roadmap

1. **Cloud Sync** (Optional)
   - Multi-device sync
   - Encrypted storage
   - Conflict resolution

2. **Collaboration**
   - Share notes
   - Real-time editing
   - Comments

3. **Mobile App**
   - iOS app
   - Android app
   - PWA support

4. **Plugins**
   - Extension system
   - Community plugins
   - Custom integrations

5. **Advanced AI**
   - Custom AI models
   - Local AI option
   - More AI providers

## Configuration

### Settings

**General:**
- Theme preference
- Default note type
- Auto-save interval

**AI:**
- AI provider selection
- Model configuration
- API key management

**Editor:**
- Font size
- Line height
- Spell check

**Privacy:**
- Analytics opt-in/out
- Data export
- Clear all data

## Performance

### Optimization Features

1. **Lazy Loading**
   - Load notes on demand
   - Infinite scroll
   - Virtual scrolling

2. **Caching**
   - In-memory cache
   - IndexedDB cache
   - Smart invalidation

3. **Debouncing**
   - Search input
   - Auto-save
   - AI requests

### Performance Tips

- Keep notes under 10,000 words for best performance
- Regularly archive old notes
- Use search instead of scrolling
- Clear cache periodically

## Accessibility

### Keyboard Navigation
- Full keyboard support
- Focus indicators
- Skip links

### Screen Readers
- ARIA labels
- Semantic HTML
- Alt text for images

### Visual
- High contrast mode
- Adjustable font sizes
- Color blind friendly

## Browser Support

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- IndexedDB
- ES2020
- CSS Grid
- Fetch API

## Limitations

**Current Limitations:**
- Single user only
- No real-time collaboration
- No mobile app (yet)
- Limited export formats
- Browser storage limits

**AI Limitations:**
- Requires internet for AI features
- API rate limits apply
- Context window limits
- Language model constraints
