"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react"; 
import api from "@/utils/axios";
import { useTokens } from "@/utils/store";
import { pickImageUrl } from "@/utils/format";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BasketPage() {
  const { accessToken } = useTokens();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState<string | number>(0);

  const fetchBasket = async () => {
    try {
      setLoading(true);
      const res = await api.get("/basket/products"); 
      
      console.log("Basket API Response:", res.data); 

      const data = res.data;
      
      let items: any[] = [];
      
      if (data.content && Array.isArray(data.content)) {
        items = data.content;
      } else if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.products)) {
        items = data.products;
      }

      setCartItems(items);

      if (data.basketTotal) {
        setTotalPrice(data.basketTotal);
      } else {
        const total = items.reduce((acc: number, item: any) => {
          const price = parseFloat(item.pricePerItem || item.price || 0);
          const qty = item.count || item.quantity || 1; 
          return acc + (price * qty);
        }, 0);
        setTotalPrice(total.toFixed(2));
      }

    } catch (error) {
      console.error("Error fetching basket:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchBasket();
    } else {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [accessToken]);


  const handleRemoveItem = async (idToDelete: string) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    try {

      await api.delete(`/basket/delete/${idToDelete}`);
      fetchBasket(); 
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error removing item");
    }
  };


  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear the basket?")) return;
    try {
        setCartItems([]);
        setTotalPrice(0);

        const deletePromises = cartItems.map(item => {
            const id = item.id || item._id || item.productId;
            return api.delete(`/basket/delete/${id}`);
        });
        await Promise.all(deletePromises);
        
        fetchBasket();
    } catch (e) {
        console.error("Clear all error:", e);
        fetchBasket();
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center">
      <Navbar />

      <div className="w-full max-w-[1170px] px-4 py-10 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">Basket</span>
      </div>

      <div className="w-full max-w-[1170px] px-4 mb-20">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h1 className="text-xl font-medium text-black">
                Basket ({cartItems.length})
            </h1>
            
            {cartItems.length > 0 && (
                <button 
                    onClick={handleClearAll}
                    className="px-10 py-3 border border-gray-400 rounded-[4px] text-black font-medium hover:bg-black hover:text-white transition-all bg-white"
                >
                    Clear all
                </button>
            )}
        </div>


        {cartItems.length > 0 ? (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-10">
                    {cartItems.map((item: any, index: number) => {

                        const title = item.title || "Product Name";
                        const price = item.pricePerItem || 0;
                        const count = item.count || 1;
                        
                        const deleteId = item.id || item._id; 

                        const imgUrl = pickImageUrl(item) || pickImageUrl(item.product);

                        return (
                            <div key={index} className="flex flex-col group w-full">

                                <div className="relative w-full aspect-square bg-[#F5F5F5] rounded-[4px] flex items-center justify-center mb-4 overflow-hidden">
                                    
                                    <button 
                                        onClick={() => handleRemoveItem(deleteId)}
                                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full text-black hover:bg-[#DB4444] hover:text-white transition-colors shadow-sm z-10"
                                    >
                                        <Trash2 size={16} />
                                    </button>


                                    {imgUrl ? (
                                        <img 
                                            src={imgUrl} 
                                            alt={title} 
                                            className="w-[70%] h-[70%] object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300" 
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-base font-medium text-black truncate pr-2" title={title}>
                                        {title} {count > 1 && <span className="text-gray-500 text-sm">({count})</span>}
                                    </h3>
                                    <span className="text-[#DB4444] font-medium text-base">
                                        ${price}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end items-center mt-10">
                    <div className="flex items-center gap-2 text-xl">
                        <span className="font-medium text-black">Total Price:</span>
                        <span className="font-medium text-[#DB4444]">${totalPrice}</span>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-gray-500 mb-6">Your basket is empty.</p>
                <Link href="/" className="px-12 py-4 bg-[#DB4444] text-white rounded-[4px] font-medium hover:bg-opacity-90 transition">
                    Return to Shop
                </Link>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}