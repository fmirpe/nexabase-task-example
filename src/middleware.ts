import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("nexabase_token");
  const { pathname } = request.nextUrl;

  console.log("🛡️ MIDDLEWARE:", pathname, "Token:", !!token);

  // Rutas públicas que no requieren autenticación
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    // Si ya tiene token y está en login, redirigir a dashboard
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Rutas protegidas - requieren token
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
