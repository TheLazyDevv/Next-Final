"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/utils/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default function CategoryPage() {
  const params = useParams();
  const categoryRaw = params?.category ? String(params.category) : "";
  const category = decodeURIComponent(categoryRaw);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const findArrayInResponse = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    
    if (data.content && Array.isArray(data.content)) return data.content;
    if (data.products && Array.isArray(data.products)) return data.products;
    if (data.items && Array.isArray(data.items)) return data.items;
    if (data.data && Array.isArray(data.data)) return data.data;

    const keys = Object.keys(data);
    for (const key of keys) {
        if (Array.isArray(data[key])) {
            return data[key];
        }
    }
    return [];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        let foundProducts: any[] = [];

        try {
            console.log(`Trying Plan A: /products/category/${category}`);
            const res = await api.get(`/products/category/${category}`);
            foundProducts = findArrayInResponse(res.data);
        } catch (e) {
            console.warn("Plan A failed (Category Endpoint), switching to Plan B...", e);
        }

        if (foundProducts.length === 0) {
             console.log("Plan B: Fetching ALL products to filter client-side...");
             try {
                const resAll = await api.get(`/products`); 
                const allProducts = findArrayInResponse(resAll.data);
                

                foundProducts = allProducts.filter((p: any) => {

                    const pCat = p.category?.name || p.category || ""; 
                    return String(pCat).toLowerCase() === category.toLowerCase();
                });
             } catch (errAll) {
                 console.error("Plan B also failed:", errAll);
             }
        }

        setProducts(foundProducts);

      } catch (error) {
        console.error("Error in main fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-[1170px] px-4 py-10 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-500">Category</span>
        <span>/</span>
        <span className="text-black font-medium capitalize">{category}</span>
      </div>

      <div className="w-full max-w-[1170px] px-4 mb-20">
        
        <div className="flex flex-col gap-2 mb-10">
             <div className="flex items-center gap-3">
                <div className="w-[16px] h-[32px] bg-[#DB4444] rounded-[4px]"></div>
                <span className="text-[#DB4444] font-semibold text-sm capitalize">{category}</span>
            </div>
            <h1 className="text-3xl font-semibold text-black capitalize">
                {category} Products
            </h1>
        </div>

        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-gray-500 mb-6">No products found for "{category}".</p>
                <Link href="/" className="px-10 py-3 bg-[#DB4444] text-white rounded-[4px] font-medium hover:bg-opacity-90 transition">
                    Back to Home
                </Link>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}