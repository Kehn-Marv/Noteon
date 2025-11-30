# Changelog

All notable changes to Noteon will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Tag system for notes
- Note templates
- Advanced search with filters
- PDF export functionality
- Cloud sync (optional)

## [0.1.0] - 2024-12-01

### Added
- Initial release of Noteon
- Journal note-taking with markdown support
- Knowledge base for organized notes
- AI-powered chat interface
- Smart search functionality
- Local-first storage using IndexedDB
- Dark and light theme support
- Markdown editor with live preview
- AI commands (summarize, expand, rewrite, etc.)
- Context-aware AI responses
- Responsive design for all screen sizes
- Docker deployment support
- Comprehensive documentation

### Features
- **Note Management**
  - Create, edit, and delete notes
  - Markdown formatting support
  - Auto-save functionality
  - Full-text search

- **AI Integration**
  - Chat with your notes
  - AI-powered commands
  - Semantic search
  - Context-aware responses

- **User Interface**
  - Clean, modern design
  - Sidebar navigation
  - Theme switching
  - Responsive layout

- **Privacy & Security**
  - Local-only data storage
  - No tracking or analytics
  - Open source codebase
  - AGPL-3.0 license

### Technical
- Built with Next.js 15.1
- React 19 with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Dexie.js for database
- Vercel AI SDK integration
- Radix UI components

---

## Version History

### [0.1.0] - Initial Release
First public release of Noteon with core features for note-taking and AI assistance.

---

## Upgrade Guide

### From Pre-release to 0.1.0

If you were using a pre-release version:

1. **Backup your data:**
   ```javascript
   // In browser console
   const notes = await db.notes.toArray();
   console.log(JSON.stringify(notes));
   ```

2. **Clear old data:**
   - Open DevTools → Application → Storage
   - Clear IndexedDB data

3. **Update the app:**
   ```bash
   git pull origin main
   npm install
   npm run build
   ```

4. **Restore data if needed:**
   - Import notes through the UI (when feature is available)
   - Or manually add to IndexedDB

---

## Breaking Changes

### 0.1.0
- Initial release, no breaking changes

---

## Migration Notes

### Database Schema
Current version: 1

No migrations required for initial release.

---

## Known Issues

### 0.1.0
- Large notes (>10,000 words) may experience performance issues
- Export functionality limited to markdown format
- No mobile app available yet
- Browser storage limits apply (typically 50MB+)

---

## Deprecations

None in current version.

---

## Security Updates

### 0.1.0
- Initial security implementation
- Local-only data storage
- Environment variable protection for API keys
- No known vulnerabilities

---

## Contributors

Thank you to all contributors who helped make Noteon possible!

- Kehn Marv ([@KehnMarv](https://x.com/KehnMarv)) - Creator and maintainer

---

## Links

- [GitHub Repository](https://github.com/Kehn-Marv/Noteon)
- [Documentation](docs/)
- [Issue Tracker](https://github.com/Kehn-Marv/Noteon/issues)
- [Discussions](https://github.com/Kehn-Marv/Noteon/discussions)
