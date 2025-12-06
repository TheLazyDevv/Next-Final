"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-[1170px] px-4 py-10 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">404 Error</span>
      </div>

      <div className="w-full max-w-[1170px] px-4 py-20 flex flex-col items-center justify-center text-center gap-10 mb-20">
        
        <h1 className="text-[80px] sm:text-[110px] font-medium leading-none tracking-[0.03em] text-black">
          404 Not Found
        </h1>
        
        <p className="text-base text-black">
          Your visited page not found. You may go home page.
        </p>

        <Link 
            href="/" 
            className="px-12 py-4 bg-[#DB4444] text-white rounded-[4px] font-medium hover:bg-opacity-90 transition-opacity"
        >
            Back to home page
        </Link>

      </div>

      <Footer />
    </main>
  );
}