import { NextResponse } from "next/server";

export function proxy(request) {
  const requestHeaders = new Headers(request.headers);
  const locale = request.nextUrl.pathname.startsWith("/es")
    ? "es"
    : request.nextUrl.pathname.startsWith("/fr") ? "fr" : "en";
  requestHeaders.set("x-folde-locale", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
