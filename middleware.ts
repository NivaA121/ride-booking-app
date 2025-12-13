import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // protect all routes except static files
    "/",                     // include root
    "/(api|trpc)(.*)"        // include API routes
  ],
};
