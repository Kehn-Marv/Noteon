# Quick Start Guide

Get up and running with Noteon in 5 minutes.

## Installation

### Option 1: Local Development

```bash
# Clone the repository
git clone https://github.com/Kehn-Marv/Noteon.git
cd Noteon

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Docker

```bash
# Build the image
docker build -t noteon .

# Run the container
docker run -p 3000:3000 noteon
```

## First Steps

### 1. Create Your First Note

1. Click on **Journal** in the sidebar
2. Click the **+** button to create a new note
3. Start writing in markdown format
4. Your note is automatically saved

### 2. Try the AI Chat

1. Click on **Chat** in the sidebar
2. Type a question like "What should I write about?"
3. Get AI-powered responses
4. Ask questions about your notes

### 3. Organize with Knowledge Base

1. Click on **Knowledge** in the sidebar
2. Create reference notes for long-term storage
3. Use markdown for formatting
4. Search across all your knowledge

## Basic Markdown

```markdown
# Heading 1
## Heading 2

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

[Link text](https://example.com)

`inline code`

\`\`\`javascript
// Code block
console.log('Hello');
\`\`\`
```

## AI Features Setup (Optional)

To use AI features:

1. Get a Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create a `.env.local` file:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

3. Restart the development server

## Keyboard Shortcuts

- `Ctrl/Cmd + N` - New note
- `Ctrl/Cmd + S` - Save note
- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + B` - Bold text
- `Ctrl/Cmd + I` - Italic text

## Tips

1. **Use Markdown**: Format your notes with markdown for better organization
2. **Chat with Notes**: Ask the AI questions about your notes
3. **Search Often**: Use search to find information quickly
4. **Dark Mode**: Toggle theme in settings for comfortable writing
5. **Local Storage**: All data stays on your device

## Common Tasks

### Export a Note
1. Open the note
2. Copy the content
3. Paste into your preferred format

### Delete a Note
1. Open the note
2. Click the delete button
3. Confirm deletion

### Change Theme
1. Go to Settings
2. Select Light or Dark mode
3. Or choose System to match your OS

### Clear All Data
1. Go to Settings
2. Click "Clear All Data"
3. Confirm (this cannot be undone)

## Troubleshooting

### Notes Not Saving
- Check browser console for errors
- Ensure you have storage space
- Try refreshing the page

### AI Not Working
- Verify API key in `.env.local`
- Check internet connection
- Restart development server

### Styles Not Loading
- Clear browser cache
- Delete `.next` folder
- Run `npm run dev` again

## Next Steps

- Read the [Features Documentation](FEATURES.md)
- Check out [Development Guide](DEVELOPMENT.md)
- Explore [API Documentation](API.md)
- Learn about [Architecture](ARCHITECTURE.md)

## Getting Help

- Check [existing issues](https://github.com/Kehn-Marv/Noteon/issues)
- Read the [documentation](../README.md)
- Contact [@KehnMarv](https://x.com/KehnMarv)

---

Happy note-taking!
