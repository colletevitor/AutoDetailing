import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/login";
  const auth = request.cookies.get("admin_auth")?.value;

  if (!auth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (auth && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/login|api/logout|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
