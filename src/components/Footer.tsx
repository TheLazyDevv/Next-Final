import { Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-20 pb-6 mt-auto">
      <div className="w-full max-w-[1170px] mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Exclusive</h2>
            <h3 className="text-xl font-medium">Subscribe</h3>
            <p className="text-base">Get 10% off your first order</p>
            <div className="relative w-full max-w-[217px] border border-white rounded-[4px] p-3 flex items-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-none outline-none text-white placeholder:text-gray-500 w-full text-sm"
              />
              <Send size={20} className="text-white absolute right-3 cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium">Support</h3>
            <p className="text-base leading-6">
              111 Bijoy sarani, Dhaka, <br /> DH 1515, Bangladesh.
            </p>
            <p className="text-base">exclusive@gmail.com</p>
            <p className="text-base">+88015-88888-9999</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium">Account</h3>
            <Link href="/account" className="text-base hover:text-gray-300">My Account</Link>
            <Link href="/login" className="text-base hover:text-gray-300">Login / Register</Link>
            <Link href="/cart" className="text-base hover:text-gray-300">Cart</Link>
            <Link href="/wishlist" className="text-base hover:text-gray-300">Wishlist</Link>
            <Link href="/shop" className="text-base hover:text-gray-300">Shop</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium">Quick Link</h3>
            <Link href="/privacy" className="text-base hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="text-base hover:text-gray-300">Terms Of Use</Link>
            <Link href="/faq" className="text-base hover:text-gray-300">FAQ</Link>
            <Link href="/contact" className="text-base hover:text-gray-300">Contact</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium">Download App</h3>
            <p className="text-xs text-gray-400">Save $3 with App New User Only</p>
            <div className="flex gap-2">
              <div className="w-[80px] h-[80px] bg-white text-black flex items-center justify-center text-xs">
                QR Code
              </div>
              <div className="flex flex-col gap-2">
                 <div className="w-[110px] h-[35px] bg-white text-black flex items-center justify-center text-xs border border-white cursor-pointer">
                    Google Play
                 </div>
                 <div className="w-[110px] h-[35px] bg-white text-black flex items-center justify-center text-xs border border-white cursor-pointer">
                    App Store
                 </div>
              </div>
            </div>
            <div className="flex gap-6 mt-2">
              <Facebook size={24} className="cursor-pointer hover:text-gray-300" />
              <Twitter size={24} className="cursor-pointer hover:text-gray-300" />
              <Instagram size={24} className="cursor-pointer hover:text-gray-300" />
              <Linkedin size={24} className="cursor-pointer hover:text-gray-300" />
            </div>
          </div>

        </div>
        <div className="border-t border-gray-800 pt-4 text-center text-gray-500 text-sm">
           © Copyright Rimel 2022. All right reserved
        </div>
      </div>
    </footer>
  );
}