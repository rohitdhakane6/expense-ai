import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/transaction(.*)",
]);

// const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, redirectToSignIn } = await auth();

  // ✅ Protect dashboard & transactions
  if (isProtectedRoute(req)) {
    if (!isAuthenticated) return redirectToSignIn();
  }

  // Example: Check onboarding status
  // const hasCompletedOnboarding = sessionClaims?.metadata?.onboardingComplete;

  // ✅ If user is logged in but hasn’t completed onboarding → force redirect
  // if (isAuthenticated && !hasCompletedOnboarding && !isOnboardingRoute(req)) {
  //   return NextResponse.redirect(new URL("/onboarding", req.url));
  // }

  // ✅ Prevent access to onboarding if already completed
  // if (isAuthenticated && hasCompletedOnboarding && isOnboardingRoute(req)) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
