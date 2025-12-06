"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import api from "@/utils/axios";
import { useTokens } from "@/utils/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AccountPage() {
  const router = useRouter();
  const { accessToken } = useTokens();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/me");
        setUser(res.data.user || res.data);
      } catch (error) {
        console.error("User fetch error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUser();
    } else {
      router.push("/login");
    }
  }, [accessToken, router]);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;
    try {
      await api.post("/auth/logout");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-[1170px] px-4 py-10 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">My Account</span>
      </div>

      <div className="flex-1 w-full max-w-[1170px] px-4 mb-20 flex justify-center items-start">
        

        <div className="w-full max-w-md bg-white shadow-[0_1px_13px_0_rgba(0,0,0,0.05)] border border-gray-100 rounded-[4px] p-8 flex flex-col items-center gap-6">
            

            <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center text-[#DB4444]">
                <User size={40} />
            </div>


            <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-2xl font-medium text-black">My Profile</h2>
                <p className="text-gray-500 text-sm">Manage your account</p>
            </div>
            
            <div className="w-full flex flex-col gap-2">
                <label className="text-sm text-black font-medium">Email Address</label>
                <div className="w-full h-[50px] bg-[#F5F5F5] rounded-[4px] flex items-center px-4 text-black border border-transparent font-medium">
                    {user?.email || "email@example.com"}
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="w-full h-[50px] mt-4 flex items-center justify-center gap-2 bg-[#DB4444] text-white rounded-[4px] font-medium hover:bg-opacity-90 transition-all shadow-sm"
            >
                <LogOut size={20} />
                <span>Sign Out</span>
            </button>

        </div>

      </div>

      <Footer />
    </main>
  );
}