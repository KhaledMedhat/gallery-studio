import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

const protectedRoutes = ["/sign-up?ctxVerificationCode=true"];
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isFromSubmitButton = request.headers.get("referer") === "/sign-up?ctxVerificationCode=true"; // Replace with the actual URL
  console.log('ana', isFromSubmitButton)

  const hasSessionToken = request.cookies.get("sessionToken");
  const hasNextAuthToken = request.cookies.get("next-auth.session-token");
  const hasProdNextAuthToken = request.cookies.get("_Secure-next-auth.session-token");


  if (!hasSessionToken && !hasNextAuthToken && !hasProdNextAuthToken) {
    const authRequiredUrl = new URL("/auth-require", request.url);
    return NextResponse.redirect(authRequiredUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/showcases", "/galleries/:path*"],
};
