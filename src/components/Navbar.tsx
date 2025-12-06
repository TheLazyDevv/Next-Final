"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Clock, X, Loader2 } from "lucide-react"; 
import { useRouter, usePathname } from "next/navigation"; 
import { useTokens } from "@/utils/store";
import api from "@/utils/axios"; 
import ProductCard from "@/components/ProductCard"; 

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken } = useTokens(); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(""); 
  

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    setIsHistoryOpen(false);
    setIsResultsModalOpen(false);
    setSearchTerm("");
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const findArrayInResponse = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    
    if (data.history && Array.isArray(data.history)) return data.history;
    if (data.content && Array.isArray(data.content)) return data.content;
    if (data.items && Array.isArray(data.items)) return data.items;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.products && Array.isArray(data.products)) return data.products;

    const keys = Object.keys(data);
    for (const key of keys) {
        if (Array.isArray(data[key])) return data[key];
    }
    return [];
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (accessToken) {
        try {
          const res = await api.get("/search/history");
          console.log("History Response:", res.data);
          
          const items = findArrayInResponse(res.data);
          setHistory(items);
        } catch (error) {
          console.error("History fetch error:", error);
        }
      }
    };
    fetchHistory();
  }, [accessToken]);

  const filteredHistory = history.filter((item: any) => {
    const text = typeof item === 'string' 
        ? item 
        : (item.term || item.query || item.search || item.title || "");
    
    return text && text.toLowerCase().includes(searchTerm.toLowerCase());
  });


  const performSearch = async (term: string) => {
    if (!term.trim()) return;
    
   
    setSubmittedSearchTerm(term);
    

    setSearchTerm("");
    
    setIsHistoryOpen(false);
    setIsResultsModalOpen(true);
    setLoading(true);

    try {
      const res = await api.get(`/search?searchterm=${encodeURIComponent(term)}`);
      const items = findArrayInResponse(res.data);
      setSearchResults(items);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleInputFocus = () => {
    setIsHistoryOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        performSearch(searchTerm);
    }
  };

  const handleHistoryItemClick = (item: any) => {
    const text = typeof item === 'string' 
        ? item 
        : (item.term || item.query || item.search || item.title || "");
    
    setSearchTerm(text);
    performSearch(text);
  };

  const handleProfileClick = () => router.push(accessToken ? "/account" : "/login");
  const handleCartClick = () => router.push(accessToken ? "/cart" : "/login");

  return (
    <>
      {isResultsModalOpen && (
        <>
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-all duration-300" 
                onClick={() => setIsResultsModalOpen(false)}
            />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1000px] max-h-[80vh] bg-white rounded-lg shadow-2xl z-[60] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-black">
                        Results for "{submittedSearchTerm}"
                    </h3>
                    <button onClick={() => setIsResultsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-[#DB4444] animate-spin mb-4" />
                            <p className="text-gray-500">Searching...</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults.map((product, index) => (
                                <div key={index} className="transform hover:scale-[1.02] transition-transform duration-200">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Search size={48} className="text-gray-300 mb-4" />
                            <p className="text-lg text-gray-500">No products found for "{submittedSearchTerm}".</p> {/* DƏYİŞDİ: searchTerm -> submittedSearchTerm */}
                        </div>
                    )}
                </div>
            </div>
        </>
      )}

      <header className="w-full flex justify-center border-b border-gray-200 bg-white pt-[40px] pb-[16px] relative z-40">
        <div className="w-[1170px] h-[38px] flex items-center justify-between px-4 xl:px-0">
          
          <Link href="/" className="w-[118px] h-[24px]">
            <h1 className="font-bold text-2xl leading-[24px] tracking-[0.03em] text-black">
              Exclusive
            </h1>
          </Link>

          <div className="flex items-center gap-[24px]">
            
            <div ref={searchContainerRef} className="relative">
                
                <div className="flex items-center bg-[#F5F5F5] rounded-[4px] py-[7px] pr-[12px] pl-[20px] gap-[10px] w-[243px] h-[38px]">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={handleInputFocus}
                        onKeyDown={handleKeyDown}
                        placeholder="What are you looking for?"
                        className="bg-transparent outline-none border-none text-[12px] leading-[18px] text-black placeholder:text-black placeholder:opacity-50 w-[153px]"
                    />
                    <button onClick={() => performSearch(searchTerm)} className="w-[24px] h-[24px] flex items-center justify-center">
                        <Search className="w-[16px] h-[16px] text-black" strokeWidth={1.5} />
                    </button>
                </div>

                {isHistoryOpen && filteredHistory.length > 0 && (
                    <div className="absolute top-[42px] left-0 w-[243px] bg-white rounded-[4px] shadow-lg border border-gray-100 overflow-hidden flex flex-col z-50">
                        {filteredHistory.slice(0, 6).map((item: any, index: number) => {
                            const text = typeof item === 'string' 
                                ? item 
                                : (item.term || item.query || item.search || item.title || "");
                            
                            return (
                                <div 
                                    key={index}
                                    onClick={() => handleHistoryItemClick(item)}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <Clock size={12} className="text-gray-400" />
                                    <span className="text-xs text-gray-700 truncate">{text}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-[16px]">
              <button onClick={handleCartClick} className="group relative">
                 <ShoppingCart className="w-[24px] h-[24px] text-black hover:text-[#DB4444] transition-colors" strokeWidth={1.5} />
              </button>

              <button 
                onClick={handleProfileClick}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-[#DB4444] hover:text-white transition-colors group"
              >
                <User className="w-[24px] h-[24px] text-black group-hover:text-white" strokeWidth={1.5} />
              </button>
            </div>
          </div>

        </div>
      </header>
    </>
  );
}