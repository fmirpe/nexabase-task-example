export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin" | "developer";
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
}

// ✅ ACTUALIZADO para que coincida con tu schema boolean
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: boolean; // ✅ CAMBIAR: boolean en lugar de string
  priority: "low" | "medium" | "high";
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// ✅ ACTUALIZADO para que coincida con tu schema boolean
export interface CreateTaskData {
  title: string;
  description?: string;
  status: boolean; // ✅ CAMBIAR: boolean en lugar de string
  priority: "low" | "medium" | "high";
  due_date?: string;
}

// ✅ ACTUALIZADO para que coincida con tu schema boolean
export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed_at?: string;
}

// ✅ ACTUALIZADO para que coincida con tu backend que usa 'pages'
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number; // ✅ Tu backend usa 'pages' no 'totalPages'
  };
}

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode?: number;
}

// Backwards compatibility
export type { CreateTaskData as CreateTaskRequest };
export type { UpdateTaskData as UpdateTaskRequest };
