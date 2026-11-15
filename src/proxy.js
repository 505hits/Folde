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
  // Images, videos and other public assets must bypass the proxy. Passing their
  // bytes through a function can consume Fast Origin Transfer on every load.
  matcher: ["/((?!api(?:/|$)|_next/|images/|videos/|fonts/|favicon.ico$|.*\\.[^/]+$).*)"],
};
