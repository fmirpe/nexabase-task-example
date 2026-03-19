# NexaBase Task Example - Reference

Technical reference documentation.

---

## Components

### TaskList

**File:** `src/components/TaskList.tsx`

Displays list of tasks with filtering.

```tsx
<TaskList 
  tasks={tasks} 
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

---

### TaskForm

**File:** `src/components/TaskForm.tsx`

Create/edit task form.

```tsx
<TaskForm 
  task={selectedTask}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

---

### TaskItem

**File:** `src/components/TaskItem.tsx`

Single task display.

```tsx
<TaskItem 
  task={task}
  onEdit={onEdit}
  onDelete={onDelete}
/>
```

---

## Hooks

### useTasks

**File:** `src/hooks/useTasks.ts`

Task management hook.

```typescript
const { 
  tasks, 
  loading, 
  createTask, 
  updateTask, 
  deleteTask 
} = useTasks();
```

---

### useAuth

**File:** `src/hooks/useAuth.ts`

Authentication hook.

```typescript
const { 
  user, 
  login, 
  logout, 
  isLoading 
} = useAuth();
```

---

## Types

### Task

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
}
```

---

## API Integration

### NexaBase Client

**File:** `src/lib/nexabase.ts`

```typescript
import { createNexaBaseClient } from "@nexabase/sdk";

export const nexabase = createNexaBaseClient({
  baseURL: process.env.NEXT_PUBLIC_NEXABASE_URL!,
  apiKey: process.env.NEXT_PUBLIC_NEXABASE_API_KEY!,
});
```

---

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_NEXABASE_URL` | Backend URL |
| `NEXT_PUBLIC_NEXABASE_API_KEY` | API Key |

---

**For guides:** [How-to](./how-to/README.md) | [Tutorials](./tutorials/README.md)
