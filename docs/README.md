# NexaBase Task Example - Documentation

**Version 0.1.0** - Next.js Task Management Example

Example application demonstrating NexaBase SDK integration with Next.js.

---

## Documentation Structure

### 📚 [Tutorials](./tutorials/README.md)
- Getting Started
- Building the Task App
- Deploying to Production

### 🔧 [How-to Guides](./how-to/README.md)
- Connect to NexaBase
- Create Task Collection
- Implement CRUD Operations
- Add Authentication

### 📖 [Reference](./reference/README.md)
- Component Reference
- API Integration
- Configuration

### 🎓 [Explanation](./explanation/README.md)
- Architecture Overview
- Next.js + NexaBase Pattern
- Best Practices

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:4000
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework |
| **React 19** | UI library |
| **NexaBase SDK** | Backend integration |
| **Tailwind CSS** | Styling |
| **TypeScript** | Type safety |

---

## Features

- ✅ Task CRUD operations
- ✅ User authentication
- ✅ Real-time updates
- ✅ Responsive design
- ✅ TypeScript support

---

## Project Structure

```
nexabase-task-example/
├── src/
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json         # Dependencies
```

---

## Key Files

### NexaBase Client

**File:** `src/lib/nexabase.ts`

```typescript
import { createNexaBaseClient } from "@nexabase/sdk";

export const nexabase = createNexaBaseClient({
  baseURL: process.env.NEXT_PUBLIC_NEXABASE_URL!,
  apiKey: process.env.NEXT_PUBLIC_NEXABASE_API_KEY!,
});
```

### Task Hook

**File:** `src/hooks/useTasks.ts`

```typescript
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    const { data } = await nexabase.listDocuments("tasks");
    setTasks(data);
  };
  
  const createTask = async (task: Partial<Task>) => {
    return await nexabase.createDocument("tasks", task);
  };
  
  return { tasks, createTask };
}
```

---

## Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_NEXABASE_URL=http://localhost:3000
NEXT_PUBLIC_NEXABASE_API_KEY=your-api-key
```

### Next.js Configuration

**File:** `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

---

## Deployment

### Vercel

```bash
vercel deploy
```

### Docker

```bash
docker build -t nexabase-task-example .
docker run -p 4000:4000 nexabase-task-example
```

### Node Server

```bash
npm run build
npm run start
```

---

## Learning Resources

- [NexaBase SDK Docs](../../nexabase-sdk/javascript/docs/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

---

**For detailed guides:** Browse documentation sections above.
