import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside

const protectedRoutes = ["/sign-up?ctxVerificationCode=true"];
export function middleware(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const isFromSubmitButton =
    request.headers.get("referer") === "/sign-up?ctxVerificationCode=true"; // Replace with the actual URL
  console.log("ana", isFromSubmitButton);

  const hasSessionToken = request.cookies.get("sessionToken");
  const hasNextAuthToken = request.cookies.get("next-auth.session-token"); // development
  const hasProdNextAuthToken = request.cookies.get(
    "__Secure-next-auth.session-token",
  ); // production

  if (!hasSessionToken && !hasNextAuthToken && !hasProdNextAuthToken) {
    const authRequiredUrl = new URL("/auth-require", request.url);
    return NextResponse.redirect(authRequiredUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/showcases", "/galleries/:path*"],
};
