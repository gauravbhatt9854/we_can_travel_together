// app/api/register/route.ts
import { registerUser } from "@/app/lib/userStore";

export async function POST(req: Request) {
  const { fullName, number, password } = await req.json();

  console.log(fullName , number , password);
  console.log("i m here to register user");

  if (!/^\+91\d{10}$/.test(number) || !/^\d{4}$/.test(password)) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  const result = await registerUser({fullName, number, password});

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), { status: 409 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}