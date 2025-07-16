'use client';

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validate = (): string | null => {
    if (!/^\d{10}$/.test(number)) return "Enter a 10-digit mobile number";
    if (!/^\d{4}$/.test(password)) return "Enter a 4-digit numeric password";
    // if (!/^\d{4}$/.test(name)) return "Enter a valid name";
    return null;
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const error = validate();
    if (error) {
      setErrorMsg(error);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ number: `+91${number}`, password, fullName: name }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setSuccessMsg("Registered successfully! You can now log in.");
      setNumber("");
      setPassword("");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value.replace(/[^a-zA-Z\s'.-]/g, "")
                )
              }
              maxLength={40}
              placeholder="Enter your full name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500"
            />
            </div>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              Register
            </button>

            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 transition"
              onClick={() => router.push("/login")}
            >
              Login
            </button>

            {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;