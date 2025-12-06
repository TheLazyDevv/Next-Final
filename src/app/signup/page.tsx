"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: "", 
    lastname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/signup", formData);
      router.push("/login");
      
    } catch (err: any) {
      console.error("Signup xətası:", err);
      const msg = err.response?.data?.message || err.response?.data?.error; 
      setError(msg || "Qeydiyyat zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2 bg-white">
      <div className="relative hidden h-full w-full md:block bg-[#CBE4E8]">
         <Image 
           src="/login.jpg" 
           alt="Signup Image"
           fill
           className="object-cover object-center" 
           priority
         />
      </div>
      <div className="flex h-full w-full items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-[450px]">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-black md:text-4xl lg:text-5xl tracking-wide">
              Create an account
            </h1>
            <p className="mt-4 text-base text-black/70">
              Enter your details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-8">
                <input
                  type="text"
                  name="firstname" 
                  placeholder="First Name"
                  className="border-b-2 border-gray-300 py-2 text-base outline-none transition-colors focus:border-[#DB4444] placeholder:text-gray-500 text-black"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  className="border-b-2 border-gray-300 py-2 text-base outline-none transition-colors focus:border-[#DB4444] placeholder:text-gray-500 text-black"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email or Phone Number"
                  className="border-b-2 border-gray-300 py-2 text-base outline-none transition-colors focus:border-[#DB4444] placeholder:text-gray-500 text-black"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="border-b-2 border-gray-300 py-2 text-base outline-none transition-colors focus:border-[#DB4444] placeholder:text-gray-500 text-black"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-4 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-[#DB4444] py-4 text-base font-medium text-white transition-opacity hover:opacity-90 h-[56px] disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
              
              <div className="flex items-center gap-2 text-base text-black/70">
                <span>Already have account?</span>
                <Link href="/login" className="font-medium text-black transition-opacity hover:opacity-70 border-b border-black ml-1 pb-[1px]">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}