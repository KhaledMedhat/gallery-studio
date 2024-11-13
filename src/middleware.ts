import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log("request", request.cookies.has("sessionToken"));
  if (
    !request.cookies.has("sessionToken") ||
    !request.cookies.has("next-auth.session-token")
  ) {
    return NextResponse.redirect(new URL("/auth-require", request.url));
  }
}

export const config = {
  matcher: "/showcases",
};
