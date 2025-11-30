# Contributing to Noteon

Thank you for considering contributing to Noteon! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and considerate in all interactions. We're building a welcoming community for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:
- Check existing issues to avoid duplicates
- Collect relevant information (browser, OS, steps to reproduce)

**Bug Report Template:**
```
**Description:**
A clear description of the bug.

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen.

**Actual Behavior:**
What actually happens.

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Version: [e.g., 0.1.0]

**Screenshots:**
If applicable, add screenshots.
```

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been suggested
- Explain the use case and benefits
- Consider implementation complexity

**Feature Request Template:**
```
**Feature Description:**
Clear description of the feature.

**Use Case:**
Why is this feature needed?

**Proposed Solution:**
How should it work?

**Alternatives:**
Other ways to achieve the same goal.
```

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Follow the code style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes:**
   ```bash
   git commit -m "feat: add your feature"
   ```
   Use conventional commits (see below)

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request:**
   - Describe your changes
   - Reference related issues
   - Add screenshots for UI changes

## Development Setup

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed setup instructions.

Quick start:
```bash
git clone https://github.com/Kehn-Marv/Noteon.git
cd Noteon
npm install
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

**Example:**
```typescript
interface NoteProps {
  title: string;
  content: string;
  createdAt: Date;
}

function Note({ title, content, createdAt }: NoteProps) {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Add JSDoc comments for complex components

**Example:**
```typescript
/**
 * Displays a note card with title and preview
 */
export function NoteCard({ note }: { note: Note }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
    </div>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Use CSS variables for colors
- Keep styles consistent

**Example:**
```typescript
<div className="flex items-center gap-2 p-4 rounded-lg bg-background">
  Content
</div>
```

### File Organization

- One component per file
- Group related files in folders
- Use index files for exports
- Keep file names lowercase with hyphens

**Structure:**
```
src/
├── components/
│   ├── note-card/
│   │   ├── note-card.tsx
│   │   ├── note-card.test.tsx
│   │   └── index.ts
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples:**
```
feat(editor): add markdown table support
fix(chat): resolve streaming response issue
docs(readme): update installation instructions
style(sidebar): improve spacing consistency
refactor(db): optimize query performance
```

## Testing

### Manual Testing

Before submitting a PR:
- [ ] Test in multiple browsers
- [ ] Test dark and light modes
- [ ] Test responsive layouts
- [ ] Verify no console errors
- [ ] Check accessibility

### Code Quality

Run these commands before committing:
```bash
npm run lint        # Check for linting errors
npm run build       # Verify build succeeds
```

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying configuration
- Updating dependencies

Documentation files:
- `README.md`: Overview and quick start
- `docs/API.md`: API documentation
- `docs/ARCHITECTURE.md`: Architecture details
- `docs/DEVELOPMENT.md`: Development guide
- `docs/FEATURES.md`: Feature documentation

## Pull Request Process

1. **Update Documentation:**
   - Update README if needed
   - Add/update API docs
   - Update changelog

2. **Code Review:**
   - Address review comments
   - Keep discussions focused
   - Be open to feedback

3. **Merge Requirements:**
   - All checks must pass
   - At least one approval
   - No merge conflicts
   - Documentation updated

## Project Priorities

Current focus areas:
1. Core stability and bug fixes
2. Performance improvements
3. User experience enhancements
4. Documentation improvements

## Getting Help

- Read the [documentation](docs/)
- Check existing issues and discussions
- Ask questions in issue comments
- Contact: [@KehnMarv](https://x.com/KehnMarv)

## Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Credited in commit history

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.

---

Thank you for contributing to Noteon!
