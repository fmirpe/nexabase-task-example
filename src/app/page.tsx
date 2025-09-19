'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Task Manager</h1>
        <p className="text-gray-600 mb-8">Powered by NexaBase</p>
        
        {user ? (
          <div>
            <p className="mb-4 text-gray-700">
              Bienvenido, <span className="font-semibold">{user.full_name}</span>
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Dashboard
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
}