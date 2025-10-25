import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas
  const publicPaths = ["/", "/login", "/register"];
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Para rutas protegidas, el AuthProvider manejará la protección
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
};
