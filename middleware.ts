import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  // Function to verify token using jose (Edge compatible)
  const verifyToken = async (token: string) => {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return true;
    } catch (err) {
      return false;
    }
  };

  // 🔐 Protect /admin routes
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const isValid = await verifyToken(token);

    if (!isValid) {
      console.log("Invalid token detected on admin route. Redirecting to login and clearing cookie.");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }

    return NextResponse.next();
  }

  // 🔁 Redirect logged-in users away from login page
  if (isLoginPage) {
    if (!token) {
      return NextResponse.next();
    }

    const isValid = await verifyToken(token);

    if (isValid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      // Cleanup invalid token if the user is on the login page
      const response = NextResponse.next();
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};