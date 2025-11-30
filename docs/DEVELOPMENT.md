# Development Guide

## Getting Started

This guide will help you set up your development environment and understand the development workflow for Noteon.

## Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- Git
- A code editor (VS Code recommended)

## Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Kehn-Marv/Noteon.git
cd Noteon
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

4. **Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
noteon/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (journal)/         # Journal pages
│   │   ├── @modal/            # Parallel routes for modals
│   │   ├── api/               # API routes
│   │   ├── chat/              # Chat pages
│   │   ├── knowledge/         # Knowledge base pages
│   │   ├── notes/             # Note detail pages
│   │   ├── settings/          # Settings pages
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # UI primitives
│   │   ├── app-sidebar.tsx   # Main sidebar
│   │   ├── icons.tsx         # Icon definitions
│   │   └── logo.tsx          # Logo component
│   ├── contexts/             # React contexts
│   │   └── chat-store.tsx    # Chat state management
│   ├── lib/                  # Utilities and libraries
│   │   ├── ai/              # AI integration
│   │   ├── db/              # Database layer
│   │   ├── fonts.ts         # Font configuration
│   │   └── utils.ts         # Utility functions
│   └── config/              # App configuration
│       └── site.ts          # Site metadata
├── public/                   # Static assets
├── docs/                     # Documentation
└── ...config files
```

## Development Workflow

### Creating a New Feature

1. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

3. **Test your changes:**
```bash
npm run lint
npm run build
```

4. **Commit your changes:**
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push and create a PR:**
```bash
git push origin feature/your-feature-name
```

### Commit Message Convention

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## Working with the Database

### Adding a New Table

1. Define the schema in `src/lib/db/schema/`:

```typescript
// src/lib/db/schema/your-table.ts
export interface YourTable {
  id: number;
  name: string;
  createdAt: Date;
}
```

2. Update the database class in `src/lib/db/index.ts`:

```typescript
class NoteonDB extends Dexie {
  // ... existing tables
  yourTable!: EntityTable<YourTable, "id">;

  constructor() {
    super("noteon");
    this.version(2).stores({
      // ... existing stores
      yourTable: "++id, name, createdAt",
    });
  }
}
```

3. Export the schema:

```typescript
export * from "@/lib/db/schema/your-table";
```

### Querying Data

```typescript
import { db } from "@/lib/db";

// Get all records
const records = await db.yourTable.toArray();

// Get by ID
const record = await db.yourTable.get(id);

// Add record
await db.yourTable.add({ name: "test", createdAt: new Date() });

// Update record
await db.yourTable.update(id, { name: "updated" });

// Delete record
await db.yourTable.delete(id);
```

## Working with Components

### Creating a New Component

1. Create the component file:

```typescript
// src/components/your-component.tsx
"use client";

import { cn } from "@/lib/utils";

interface YourComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function YourComponent({ className, children }: YourComponentProps) {
  return (
    <div className={cn("your-classes", className)}>
      {children}
    </div>
  );
}
```

2. Use the component:

```typescript
import { YourComponent } from "@/components/your-component";

<YourComponent>Content</YourComponent>
```

### Using UI Components

UI components are based on Radix UI and located in `src/components/ui/`:

```typescript
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

<Button variant="default" size="lg">
  Click me
</Button>
```

## Working with AI Features

### Adding a New AI Command

1. Define the command in `src/lib/ai/commands.ts`:

```typescript
export const commands = {
  // ... existing commands
  yourCommand: {
    name: "Your Command",
    prompt: (content: string) => `Your prompt: ${content}`,
  },
};
```

2. Use the command:

```typescript
const result = await fetch('/api/ai-command', {
  method: 'POST',
  body: JSON.stringify({
    prompt: commands.yourCommand.prompt(noteContent)
  })
});
```

## Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes:

```typescript
<div className="flex items-center gap-2 p-4 rounded-lg bg-background">
  Content
</div>
```

### Custom Styles

For complex styles, use CSS modules or the `cn()` utility:

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}>
```

### Theme Variables

Use CSS variables for colors:

```css
.element {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

## Testing

### Manual Testing Checklist

- [ ] Test in Chrome, Firefox, and Safari
- [ ] Test dark and light modes
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Test with and without AI features enabled
- [ ] Test data persistence (refresh page)

### Browser DevTools

Use React DevTools and IndexedDB inspector:

1. Open DevTools (F12)
2. Go to Application tab
3. Check IndexedDB → noteon database

## Debugging

### Common Issues

**Issue: Database not updating**
- Check browser console for errors
- Clear IndexedDB: Application → Storage → Clear site data

**Issue: AI features not working**
- Verify API key in `.env.local`
- Check API route logs in terminal
- Verify network requests in DevTools

**Issue: Styles not applying**
- Clear Next.js cache: `rm -rf .next`
- Restart dev server

### Debug Mode

Enable verbose logging:

```typescript
// Add to your component
useEffect(() => {
  console.log('Component state:', state);
}, [state]);
```

## Performance Tips

1. **Use React.memo** for expensive components
2. **Lazy load** heavy components with `dynamic()`
3. **Optimize images** using Next.js Image component
4. **Debounce** search and input handlers
5. **Use IndexedDB indexes** for faster queries

## Building for Production

### Local Production Build

```bash
npm run build
npm run start
```

### Docker Build

```bash
docker build -t noteon .
docker run -p 3000:3000 noteon
```

### Environment Variables

Production environment variables:

```env
NODE_ENV=production
GOOGLE_GENERATIVE_AI_API_KEY=your_production_key
```

## Code Quality

### Linting

```bash
npm run lint
```

Fix auto-fixable issues:

```bash
npm run lint -- --fix
```

### Type Checking

TypeScript will check types during build:

```bash
npm run build
```

### Code Formatting

Format code with Prettier:

```bash
npx prettier --write .
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives)
- [Dexie.js](https://dexie.org)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## Getting Help

- Check existing issues on GitHub
- Read the documentation in `/docs`
- Ask questions in discussions
- Contact: [@KehnMarv](https://x.com/KehnMarv)
