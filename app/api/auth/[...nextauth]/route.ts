// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser, getUserByNumber } from "@/app/lib/userStore";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        number: { label: "Mobile Number", type: "text" },
        password: { label: "Password (4-digit)", type: "password" },
      },
      async authorize(credentials) {
        const formattedNumber = `+91${credentials?.number}`;
        const user = await verifyUser({
          number: formattedNumber,
          password: credentials?.password || "",
        });

        if (user) {
          return {
            id: user.number,
            number: user.number,
            fullName: user.fullName,
            location: user.location,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.number = user.number;
        token.fullName = user.fullName;
        token.location = user.location;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.number) {
        const redisUser = await getUserByNumber(token.number as string);

        if (redisUser) {
          session.user = {
            number: redisUser.number,
            fullName: redisUser.fullName,
            location: redisUser.location,
          };
        } else {
          session.user = {
            number: token.number as string,
            fullName: token.fullName as string,
            location: token.location,
          };
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };