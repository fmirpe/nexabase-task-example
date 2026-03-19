# NexaBase Task Example - Explanation

Conceptual documentation about the example app.

---

## Architecture Overview

The Task Example demonstrates best practices for integrating NexaBase with Next.js.

### Application Structure

```
┌─────────────────────────────────────┐
│          Browser                    │
│  ┌───────────────────────────────┐  │
│  │      Next.js Application      │  │
│  │  ┌─────────┐  ┌────────────┐  │  │
│  │  │  Pages  │  │ Components │  │  │
│  │  └────┬────┘  └─────┬──────┘  │  │
│  │       │             │         │  │
│  │  ┌────┴─────────────┴──────┐  │  │
│  │  │   Custom Hooks          │  │  │
│  │  └─────────────┬───────────┘  │  │
│  └────────────────┼──────────────┘  │
└───────────────────┼──────────────────┘
                   │ API Calls
                   ▼
┌─────────────────────────────────────┐
│       NexaBase Backend API          │
└─────────────────────────────────────┘
```

---

## Next.js + NexaBase Pattern

### Data Flow

1. **Component renders** → Calls custom hook
2. **Hook** → Makes API call via SDK
3. **SDK** → Sends request to NexaBase
4. **Response** → Updates state
5. **Component** → Re-renders with new data

---

### Example Flow

```typescript
// Component
function TaskList() {
  // 1. Use custom hook
  const { tasks, loading } = useTasks();
  
  // 5. Render with data
  return tasks.map(task => <TaskItem key={task.id} task={task} />);
}

// Hook
function useTasks() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    // 2. API call via SDK
    const fetch = async () => {
      const { data } = await nexabase.listDocuments("tasks");
      setTasks(data);
    };
    fetch();
  }, []);
  
  return { tasks };
}

// SDK
// 3. Sends HTTP request to NexaBase
// 4. Returns response
```

---

## Best Practices

### 1. Environment Variables

```typescript
// ✅ Good
const apiKey = process.env.NEXT_PUBLIC_NEXABASE_API_KEY;

// ❌ Bad
const apiKey = "sk_live_abc123";
```

---

### 2. Error Handling

```typescript
// ✅ Good
try {
  await nexabase.createDocument("tasks", task);
} catch (error) {
  if (error.code === "UNAUTHORIZED") {
    // Handle auth error
  } else {
    // Handle other errors
  }
}
```

---

### 3. Loading States

```typescript
// ✅ Good
const { data, isLoading, error } = useTasks();

if (isLoading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <TaskList tasks={data} />;
```

---

### 4. Type Safety

```typescript
// ✅ Good
interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

// ❌ Bad
type Task = any;
```

---

## State Management

### Local State

Use React `useState` for component-specific state.

```typescript
const [selectedTask, setSelectedTask] = useState<Task | null>(null);
```

---

### Global State

Use Context or Zustand for shared state.

```typescript
const AuthContext = createContext<AuthState>({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Performance Optimization

### Techniques Used

1. **React Server Components** - Render on server when possible
2. **Lazy Loading** - Load components on demand
3. **Memoization** - Cache expensive computations
4. **Debouncing** - Limit API calls from user input

---

### Example: Debounced Search

```typescript
function useDebouncedSearch(query: string, delay: number) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data } = await nexabase
        .from("tasks")
        .where("title", "ilike", `%${query}%`)
        .get();
      setResults(data);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [query, delay]);
  
  return results;
}
```

---

## Security Considerations

### Client-Side Security

- ✅ Use environment variables
- ✅ Validate user input
- ✅ Handle errors gracefully
- ✅ Sanitize HTML content

---

### Server-Side Security

- ✅ API key authentication
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Input validation

---

## Testing Strategy

### Unit Tests

```typescript
describe("useTasks", () => {
  it("should fetch tasks on mount", async () => {
    const { result } = renderHook(() => useTasks());
    
    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
    });
  });
});
```

---

### Integration Tests

```typescript
describe("TaskList", () => {
  it("should display tasks", async () => {
    render(<TaskList />);
    
    const taskItems = await screen.findAllByTestId("task-item");
    expect(taskItems).toHaveLength(3);
  });
});
```

---

**Learn more:** [Tutorials](./tutorials/README.md) | [How-to Guides](./how-to/README.md)
