"use client";

import Link from "next/link"; 
import { 
  Smartphone, Shirt, BookOpen, Armchair, Gamepad2, 
  ShoppingBasket, Sparkles, Dumbbell, Car, MoreHorizontal 
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Smartphone },
  { name: "Clothing", icon: Shirt },
  { name: "Books", icon: BookOpen },
  { name: "Furniture", icon: Armchair },
  { name: "Toys", icon: Gamepad2 },
  { name: "Groceries", icon: ShoppingBasket },
  { name: "Beauty", icon: Sparkles },
  { name: "Sports", icon: Dumbbell },
  { name: "Automotive", icon: Car },
  { name: "Other", icon: MoreHorizontal },
];

export default function CategorySection() {
  return (
    <div className="w-full flex justify-center py-10 border-b border-gray-200">
      <div className="w-full max-w-[1170px] px-4 flex flex-col gap-[40px]">

        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <div className="w-[16px] h-[32px] bg-[#DB4444] rounded-[4px]"></div>
                <span className="text-[#DB4444] font-semibold text-sm">Categories</span>
            </div>
            <h2 className="text-3xl font-semibold text-black tracking-[0.04em]">
                Browse By Category
            </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[20px]">
          {categories.map((cat, index) => (
            <Link 
              href={`/category/${cat.name}`}
              key={index}
              className="group border border-gray-300 rounded-[4px] w-full h-[120px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 hover:bg-[#DB4444] hover:border-[#DB4444]"
            >
              <cat.icon 
                size={40} 
                strokeWidth={1.5} 
                className="text-black group-hover:text-white transition-colors duration-300"
              />
              <span className="text-sm font-medium text-black group-hover:text-white transition-colors duration-300">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}