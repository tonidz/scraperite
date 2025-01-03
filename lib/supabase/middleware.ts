import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Extract the language code from the URL (first segment)
  const langCode = path.split('/')[1];

  // Check if the path requires authentication
  const isAuthPath = path.includes('/resellers/welcome');
  const isPublicPath = 
    path === `/${langCode}` || 
    path === `/${langCode}/login` || 
    path === `/${langCode}/resellers` ||
    path.startsWith(`/${langCode}/products`) ||
    path.startsWith(`/${langCode}/blade-guide`) ||
    path.includes('/auth');

  // If the path requires authentication and there's no user, redirect to login
  if (!user && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${langCode}/login`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
