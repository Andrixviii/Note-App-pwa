import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

const SignUp: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending request to /api/signup"); // Debug log
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json(); // Parse pesan error dari server
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      console.log("Response from server:", data); // Debug log

      setSuccess("User created successfully!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error:", err.message); // Debug log
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign up users" />
      </Head>

      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2
            className="text-4xl font-bold text-gray-900 mb-6 text-center"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Sign up
          </h2>
          {error && (
            <p className="text-sm text-red-600 mb-4 border border-red-300 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 mb-4 border border-green-300 bg-green-100 p-2 rounded">
              {success}
            </p>
          )}
          <form className="flex flex-col" onSubmit={handleSignUp}>
            <input
              type="email"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-black">
                Have an account?{" "}
                <Link href="/login">
                  <span className="text-sm text-gray-700 font-bold hover:underline">
                    Sign in
                  </span>
                </Link>
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-gradient-to-r from-indigo-950 to-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
              }`}
              style={{ fontFamily: '"Quicksand", serif' }}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
