"use client"
import LocationForm from "./(component)/home/helper/LocationForm";
import Header from "./(component)/header/Header";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <div className="min-h-screen w-full overflow-hidden flex flex-col">
        {/* welcome to dashboard */}
        <Header></Header>
        <LocationForm></LocationForm>

      </div>
    </SessionProvider>

  );
}