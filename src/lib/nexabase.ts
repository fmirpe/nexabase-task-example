// ✅ lib/nexabase.ts - COMPLETO actualizado para tu backend
import axios, { AxiosInstance, AxiosError } from "axios";
import {
  AuthResponse,
  User,
  PaginatedResponse,
  ApiError,
  CreateTaskData,
  UpdateTaskData,
} from "@/types";

// Utility functions para cookies
const setCookie = (name: string, value: string, days: number = 1) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof window !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
};

class NexaBaseClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string, apiKey?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { "X-API-Key": apiKey }),
      },
    });

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          this.token = null;
          deleteCookie("nexabase_token");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(
    email: string,
    password: string
  ): Promise<{ auth: AuthResponse; user: User }> {
    console.log("🔥 A. NexaBase.login called");

    try {
      const response = await this.client.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      console.log("🔥 D. Login response received:", response.data);

      this.token = response.data.access_token;

      // ✅ GUARDAR en cookies (expires en 15 minutos)
      setCookie("nexabase_token", this.token, 1 / 96); // 15 minutos
      console.log("🔥 F. Token saved to cookies");

      const userProfile = await this.getUserProfile();

      return {
        auth: response.data,
        user: userProfile,
      };
    } catch (error) {
      console.error("🔥 ERROR in nexabase.login:", error);
      throw error;
    }
  }

  async getUserProfile(): Promise<User> {
    try {
      interface BackendUser {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        role: string;
        created_at?: string;
        updated_at?: string;
      }

      const response = await this.client.get<BackendUser>("/auth/me");

      const fullName =
        response.data.first_name && response.data.last_name
          ? `${response.data.first_name} ${response.data.last_name}`
          : response.data.first_name || response.data.email;

      const user: User = {
        id: response.data.id,
        email: response.data.email,
        full_name: fullName,
        role: response.data.role as "user" | "admin" | "developer",
        created_at: response.data.created_at || new Date().toISOString(),
        updated_at: response.data.updated_at || new Date().toISOString(),
        first_name: response.data.first_name,
        last_name: response.data.last_name,
      };

      return user;
    } catch (error) {
      console.error("👤 ERROR in getUserProfile:", error);
      throw error;
    }
  }

  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<User> {
    const response = await this.client.post<{ user: User }>("/auth/register", {
      email,
      password,
      full_name: fullName,
    });
    return response.data.user;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/auth/logout");
    } catch (error) {
      console.warn("Logout request failed:", error);
    }

    this.token = null;
    deleteCookie("nexabase_token");
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = getCookie("nexabase_token");
    }
    return this.token;
  }

  // ✅ ACTUALIZADO para tu backend que devuelve { data: [...], meta: {...} }
  async getRecords<T = Record<string, unknown>>(
    collection: string,
    params?: Record<string, unknown>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.client.get(`/api/collections/${collection}`, {
      params,
    });

    // ✅ Tu backend devuelve { data: [...], meta: {...} }
    return {
      data: response.data.data || [], // ✅ Acceder a response.data.data
      meta: response.data.meta || {
        // ✅ Usar el meta que devuelve tu backend
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
      },
    };
  }

  // ✅ ACTUALIZADO - tu backend devuelve el objeto creado directamente
  async createRecord<T = Record<string, unknown>>(
    collection: string,
    data: Record<string, unknown> | CreateTaskData | UpdateTaskData
  ): Promise<T> {
    console.log("📦 CREATING RECORD:");
    console.log("📦 Collection:", collection);
    console.log("📦 Data being sent:", JSON.stringify(data, null, 2));

    try {
      const response = await this.client.post<T>(
        `/api/collections/${collection}`,
        data
      );
      console.log("✅ CREATE SUCCESS:", response.data);
      return response.data; // ✅ Tu backend devuelve el objeto directamente
    } catch (error) {
      console.error("❌ CREATE ERROR:", error);
      if (axios.isAxiosError(error)) {
        console.error("❌ Response data:", error.response?.data);
        console.error("❌ Response status:", error.response?.status);
      }
      throw error;
    }
  }

  // ✅ ACTUALIZADO - tu backend devuelve el objeto actualizado directamente
  async updateRecord<T = Record<string, unknown>>(
    collection: string,
    id: string,
    data: Record<string, unknown> | CreateTaskData | UpdateTaskData
  ): Promise<T> {
    const response = await this.client.put<T>(
      `/api/collections/${collection}/${id}`,
      data
    );
    return response.data; // ✅ Tu backend devuelve el objeto directamente
  }

  // ✅ ACTUALIZADO - tu backend devuelve { message: string, id: string, collection: string }
  async deleteRecord(
    collection: string,
    id: string
  ): Promise<{ message: string }> {
    const response = await this.client.delete<{
      message: string;
      id: string;
      collection: string;
    }>(`/api/collections/${collection}/${id}`);
    return { message: response.data.message }; // ✅ Mantener compatibilidad
  }

  // ✅ ACTUALIZADO - tu backend devuelve el objeto directamente
  async getRecord<T = Record<string, unknown>>(
    collection: string,
    id: string
  ): Promise<T> {
    const response = await this.client.get<T>(
      `/api/collections/${collection}/${id}`
    );
    return response.data; // ✅ Tu backend devuelve el objeto directamente
  }
}

const nexabase = new NexaBaseClient(
  process.env.NEXT_PUBLIC_NEXABASE_URL!,
  process.env.NEXT_PUBLIC_NEXABASE_API_KEY
);

export default nexabase;
