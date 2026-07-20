export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*", "/account/:path*", "/profile/:path*"],
};
