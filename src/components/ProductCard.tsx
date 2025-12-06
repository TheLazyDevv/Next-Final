"use client";

import { useRouter } from "next/navigation";
import { useTokens } from "@/utils/store";
import { pickImageUrl } from "@/utils/format";
import api from "@/utils/axios"; 
import { useState } from "react";

interface ProductProps {
  _id?: string;
  id?: number | string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  [key: string]: any; 
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const router = useRouter();
  const { accessToken } = useTokens();
  const [loading, setLoading] = useState(false);

  
  const productId = product._id || product.id;

  
  const handleCardClick = () => {
    if (!productId) {
        console.error("Xəta: Product ID yoxdur!", product);
        alert("Xəta: Bu məhsulun ID-si tapılmadı.");
        return;
    }
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (!productId) {
        alert("Məhsul ID-si xətalıdır.");
        return;
    }

    setLoading(true);
    try {
        await api.post("/basket/add", {
            productId: String(productId),
            count: 1
        });

        alert("Məhsul səbətə əlavə olundu! ✅");
        
    } catch (error: any) {
        console.error("Səbət xətası:", error);
        const msg = error.response?.data?.message || "Xəta baş verdi";
        alert(msg);
    } finally {
        setLoading(false);
    }
  };

  const finalImage = pickImageUrl(product);

  return (
    <div 
        onClick={handleCardClick}
        className="flex flex-col gap-3 w-full max-w-[220px] group relative cursor-pointer"
    >
      <div className="w-full h-[170px] bg-[#F5F5F5] rounded-[4px] relative flex items-center justify-center overflow-hidden">
        
        <div className="relative w-[130px] h-[130px] flex items-center justify-center">
             {finalImage ? (
               <img 
                 src={finalImage} 
                 alt={product.name}
                 className="object-contain w-full h-full mix-blend-multiply" 
               />
             ) : (
               <div className="text-gray-400 text-xs">No Image</div>
             )}
        </div>

        <button 
            onClick={handleAddToCart}
            disabled={loading}
            className={`absolute bottom-0 left-0 w-full h-[35px] text-white text-sm font-medium flex items-center justify-center transition-all duration-300 
                ${loading ? "bg-gray-600 translate-y-0" : "bg-black translate-y-full group-hover:translate-y-0"}
            `}
        >
            {loading ? "Adding..." : "Add To Basket"}
        </button>
      </div>


      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-black truncate" title={product.name}>
          {product.name}
        </h3>
        <span className="text-[#DB4444] font-medium text-sm">
          ${product.price}
        </span>
      </div>

    </div>
  );
}