"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Truck, RotateCcw } from "lucide-react"; 
import api from "@/utils/axios";
import { useTokens } from "@/utils/store";
import { pickImageUrl } from "@/utils/format"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard"; 

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { accessToken } = useTokens();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        let productData = null;
        try {
            const res = await api.get(`/products/${id}/details`);
            productData = res.data.product || res.data;
        } catch (err) {
            const fallbackRes = await api.get(`/products/${id}`);
            productData = fallbackRes.data.product || fallbackRes.data;
        }
        setProduct(productData);
        setMainImage(pickImageUrl(productData));

        try {
            const similarRes = await api.get(`/products/${id}/similar`);
            const similarData = Array.isArray(similarRes.data) ? similarRes.data : (similarRes.data.products || []);
            setRelatedProducts(similarData);
        } catch (simError) {
            console.error(simError);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
    if (type === "inc") setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    setAddingToCart(true);
    try {
        await api.post("/basket/add", {
            productId: String(product._id || product.id),
            count: Number(quantity)
        });
        alert("Məhsul səbətə əlavə edildi!");
    } catch (error: any) {
        alert(error.response?.data?.message || "Xəta baş verdi");
    } finally {
        setAddingToCart(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-xl">Yüklənir...</div>;

  if (!product) return <div className="text-center py-20">Məhsul tapılmadı.</div>;

  const stockCount = product.stock ?? product.quantity ?? 0;
  const isInStock = stockCount > 0;
  const images = product.images && Array.isArray(product.images) ? product.images : [product.image];

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center">
      <Navbar />


      <div className="w-full max-w-[1170px] px-4 py-10 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-black font-medium">{product.title}</span>
      </div>

      <div className="w-full max-w-[1170px] px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20 items-start">
        
        <div className="flex flex-col-reverse md:flex-row gap-4 h-auto md:h-[500px]">
            <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar">
                {images.slice(0, 4).map((img: any, index: number) => {
                    const url = pickImageUrl({ image: img });
                    return (
                        <div 
                            key={index} 
                            className={`w-[100px] h-[100px] md:w-[130px] md:h-[110px] bg-[#F5F5F5] rounded-[4px] flex items-center justify-center cursor-pointer border transition-all flex-shrink-0 ${mainImage === url ? 'border-black' : 'border-transparent hover:border-gray-400'}`}
                            onClick={() => setMainImage(url)}
                        >
                            {url && <img src={url} alt="thumbnail" className="w-[80%] h-[80%] object-contain mix-blend-multiply" />}
                        </div>
                    )
                })}
            </div>
            <div className="flex-1 bg-[#F5F5F5] rounded-[4px] flex items-center justify-center relative h-[400px] md:h-full">
                 {mainImage && (
                    <img 
                        src={mainImage} 
                        alt="Main Product" 
                        className="w-[90%] h-[90%] object-contain mix-blend-multiply" 
                    />
                 )}
            </div>
        </div>


        <div className="flex flex-col h-full pt-2">
            

            <h1 className="text-3xl font-semibold text-black mb-4 leading-tight tracking-wide">
                {product.title}
            </h1>


            <div className="flex items-center gap-3 mb-4">
                 <div className="w-[1px] h-[20px] bg-black opacity-50"></div>
                 
                 <span className={`text-sm font-medium ${isInStock ? "text-[#00FF66]" : "text-[#DB4444]"}`}>
                    {isInStock ? "In Stock" : "Out of Stock"}
                </span>
            </div>
            
            <div className="mb-6">
                <span className="text-2xl font-medium text-black tracking-wide">${product.price}</span>
            </div>

            <p className="text-sm text-black mb-8 border-b border-gray-400 pb-8 leading-6">
                {product.description || "No description available for this product."}
            </p>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-400 rounded-[4px] w-[160px] h-[44px]">
                    <button onClick={() => handleQuantity("dec")} className="w-1/3 h-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors border-r border-gray-400">
                        <Minus size={16} />
                    </button>
                    <div className="w-1/3 h-full flex items-center justify-center font-medium text-xl border-r border-gray-400">
                        {quantity}
                    </div>
                    <button onClick={() => handleQuantity("inc")} className="w-1/3 h-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white transition-colors">
                        <Plus size={16} />
                    </button>
                </div>

                <button 
                    onClick={handleAddToCart}
                    disabled={!isInStock || addingToCart}
                    className="h-[44px] px-10 bg-[#DB4444] text-white font-medium rounded-[4px] hover:bg-opacity-90 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {addingToCart ? "Adding..." : "Add To Basket"}
                </button>

            </div>

            <div className="w-full border border-gray-400 rounded-[4px] divide-y divide-gray-400 mt-auto">
                <div className="flex items-center gap-4 p-5">
                    <Truck size={40} className="text-black" strokeWidth={1} />
                    <div className="flex flex-col gap-1">
                        <span className="text-base font-medium text-black">Free Delivery</span>
                        <a href="#" className="text-xs text-black font-medium underline">Enter your postal code for Delivery Availability</a>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-5">
                    <RotateCcw size={40} className="text-black" strokeWidth={1} />
                    <div className="flex flex-col gap-1">
                        <span className="text-base font-medium text-black">Return Delivery</span>
                        <span className="text-xs text-black font-medium">Free 30 Days Delivery Returns. <a href="#" className="underline">Details</a></span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="w-full max-w-[1170px] px-4 mb-20">
         <div className="flex items-center gap-4 mb-10">
            <div className="w-[20px] h-[40px] bg-[#DB4444] rounded-[4px]"></div>
            <span className="text-[#DB4444] font-semibold text-base">Related Item</span>
        </div>
        {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
                {relatedProducts.slice(0, 4).map((p, i) => (
                    <ProductCard key={i} product={p} />
                ))}
            </div>
        ) : (
            <div className="text-gray-500">Oxşar məhsul tapılmadı.</div>
        )}
      </div>

      <Footer />
    </main>
  );
}