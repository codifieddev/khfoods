import { NextResponse } from "next/server";
import { z } from "zod";
import { 
  findAdministratorByEmail, 
  isAdministratorPasswordValid, 
  buildAdministratorSession, 
  signAdministratorSessionToken, 
  setAdministratorAuthCookie,
  adminPayloadTokenCookieName
} from "@/data/storefront/adminAccounts";
import { getMongoDb } from "@/data/mongo/client";

// Zod schema for login validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate Input with Zod
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        message: validation.error.issues[0].message 
      }, { status: 400 });
    }

    const { email, password } = validation.data;

    // 2. Find Administrator in MongoDB
    const administrator = await findAdministratorByEmail(email);
    if (!administrator) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid credentials" 
      }, { status: 401 });
    }

    // 3. Verify Password (using PBKDF2 native matching)
    const isValid = isAdministratorPasswordValid({
      hash: administrator.hash as string,
      salt: administrator.salt as string,
      password
    });

    if (!isValid) {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid credentials" 
      }, { status: 401 });
    }

    // 4. Create and store Session
    const session = buildAdministratorSession();
    const db = await getMongoDb();
    
    await db.collection("administrators").updateOne(
      { _id: administrator._id },
      { 
        $push: { sessions: session as any },
        $set: { 
            loginAttempts: 0, 
            lockUntil: null, 
            lastLogin: new Date().toISOString() 
        } 
      }
    );

    // 5. Sign JWT Token
    const token = signAdministratorSessionToken({
      email: administrator.email as string,
      id: administrator._id.toString(),
      sid: session.id
    });

    // 6. Set Secure HTTP-only Cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
          email: administrator.email,
          name: administrator.name || administrator.email,
          roles: administrator.roles || ['admin']
      }
    }, { status: 200 });

    setAdministratorAuthCookie(response, token);

    return response;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown server error";
    console.error("Secure Login API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: `Login System Error: ${errorMsg}` 
    }, { status: 500 });
  }
}
