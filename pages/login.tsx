import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "../templates/LandingPage/components/LoadingSpinner";

const Index: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login berhasil
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
        console.log("Login successful");

        // Redirect ke halaman dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500); // Delay
      } else {
        // Login gagal
        setMessage("Invalid email or password.");
        setMessageType("error");
        console.error("Login failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      setMessageType("error");
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
        <meta name="login" content="Login users" />
      </Head>

      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          <h2
            className="text-4xl font-bold text-gray-900 mb-4 text-center"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            Sign in
          </h2>

          <div className="flex items-center justify-center flex-wrap mb-8">
            <p className=" text-gray-900">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-sm font-bold text-gray-700 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Pesan berhasil/gagal */}
          {message && (
            <div
              className={`mt-4 mb-4 p-3 rounded ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <form className="flex flex-col" onSubmit={handleSubmit}>
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

            <button
              type="submit"
              disabled={isLoading}
              className={`bg-gradient-to-r from-indigo-950 to-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4 mb-4 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
              }`}
              style={{ fontFamily: '"Quicksand", serif' }}
            >
              {isLoading ? "Logging in..." : "Sign in"}{" "}
              {isLoading && <LoadingSpinner />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Index;
