import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceSection from "@/components/ServiceSection";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-white">
      
      <Navbar />
      

      <CategorySection />
      
      <ProductSection />

      <ServiceSection />
      
      <Footer />
    </main>
  );
}