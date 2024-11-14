import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

const protectedRoutes = ["/showcases", "/galleries/:path*"];
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
//   if (protectedRoutes.includes(pathname)) {
    const hasSessionToken = request.cookies.get("sessionToken");
    const hasNextAuthToken = request.cookies.get("next-auth.session-token");

    if (!hasSessionToken && !hasNextAuthToken) {
      const authRequiredUrl = new URL("/auth-require", request.url);
      return NextResponse.redirect(authRequiredUrl);
    }
    return NextResponse.next();
//   }
}

export const config = {
  matcher: ["/showcases", "/galleries/:path*"],
};
