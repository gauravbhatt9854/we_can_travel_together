// lib/auth.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export function getSession() {
  return getServerSession(authOptions);
}