import bcrypt from "npm:bcryptjs@2.4.3";
import * as jose from "npm:jose@5.9.6";

// In-memory user store for demo purposes
const users = new Map();

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "fallback-secret";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

async function signToken(payload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET_KEY);
}

async function verifyToken(token) {
  const { payload } = await jose.jwtVerify(token, SECRET_KEY);
  return payload;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, email, password, token } = body;

    // REGISTER
    if (action === "register") {
      if (!email || !password) {
        return Response.json({ error: "Email and password required" }, { status: 400, headers: corsHeaders });
      }
      if (users.has(email)) {
        return Response.json({ error: "User already exists" }, { status: 409, headers: corsHeaders });
      }

      const hashed = await hashPassword(password);
      users.set(email, { email, password: hashed });

      const jwtToken = await signToken({ email, sub: email });

      return Response.json({
        success: true,
        message: "User registered successfully",
        demo: {
          plain_password: password,
          bcrypt_hash: hashed,
          jwt_token: jwtToken,
        }
      }, { headers: corsHeaders });
    }

    // LOGIN
    if (action === "login") {
      if (!email || !password) {
        return Response.json({ error: "Email and password required" }, { status: 400, headers: corsHeaders });
      }

      const user = users.get(email);
      if (!user) {
        return Response.json({ error: "User not found — register first" }, { status: 404, headers: corsHeaders });
      }

      const valid = await comparePassword(password, user.password);
      if (!valid) {
        return Response.json({ error: "Invalid password" }, { status: 401, headers: corsHeaders });
      }

      const jwtToken = await signToken({ email, sub: email });

      return Response.json({
        success: true,
        message: "Login successful",
        demo: {
          bcrypt_verified: true,
          jwt_token: jwtToken,
        }
      }, { headers: corsHeaders });
    }

    // VERIFY TOKEN
    if (action === "verify") {
      if (!token) {
        return Response.json({ error: "Token required" }, { status: 400, headers: corsHeaders });
      }

      const payload = await verifyToken(token);
      return Response.json({
        success: true,
        message: "Token is valid",
        payload,
      }, { headers: corsHeaders });
    }

    return Response.json({ error: "Unknown action. Use: register, login, verify" }, { status: 400, headers: corsHeaders });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
});