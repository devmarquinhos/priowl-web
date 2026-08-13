import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "as-needed"
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};