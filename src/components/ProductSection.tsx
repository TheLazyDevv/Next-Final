"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "@/utils/axios";

export default function ProductSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(10); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data.products && Array.isArray(res.data.products)) {
          data = res.data.products;
        }
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="w-full flex justify-center py-14 mb-10 border-b border-gray-200">
      <div className="w-full max-w-[1170px] px-4 flex flex-col gap-[40px]">
        
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <div className="w-[16px] h-[32px] bg-[#DB4444] rounded-[4px]"></div>
                <span className="text-[#DB4444] font-semibold text-sm">Our Products</span>
            </div>
            <h2 className="text-3xl font-semibold text-black tracking-[0.04em]">
                Explore Our Products
            </h2>
        </div>

        {loading ? (
            <div className="text-center py-10 text-gray-500">Məhsullar yüklənir...</div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[20px]">
                {products.length > 0 ? (
                    products.slice(0, visibleCount).map((product: any, index: number) => (
                        <ProductCard 
                          key={product._id || product.id || index} 
                          product={product} 
                        />
                    ))
                ) : (
                    <div className="col-span-5 text-center text-gray-500 py-10">
                      Hal-hazırda məhsul tapılmadı.
                    </div>
                )}
            </div>
        )}

        {products.length > visibleCount && (
            <div className="flex justify-center mt-6">
                <button 
                  onClick={handleViewMore}
                  className="bg-[#DB4444] text-white py-3 px-10 rounded-[4px] text-sm font-medium hover:bg-opacity-90 transition-opacity"
                >
                    View More Products
                </button>
            </div>
        )}

      </div>
    </div>
  );
}