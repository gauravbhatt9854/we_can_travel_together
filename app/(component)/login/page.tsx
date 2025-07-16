'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [number, setNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const validate = (): string | null => {
    const isNumberValid = /^\d{10}$/.test(number);
    const isPasswordValid = /^\d{4}$/.test(password);
    if (!isNumberValid) return "Enter 10-digit mobile number";
    if (!isPasswordValid) return "Enter 4-digit numeric password";
    return null;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setErrorMsg(error);
      return;
    }

    const res = await signIn("credentials", {
      number,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      setErrorMsg("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
              Mobile Number <span className="text-gray-500">( +91 )</span>
            </label>
            <input
              id="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              placeholder="10-digit number"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              4-Digit Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
              maxLength={4}
              placeholder="1234"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
            onClick={()=> router.push("/register")}
          >
            Register
          </button>

          {errorMsg && (
            <p className="text-red-600 text-sm text-center">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;