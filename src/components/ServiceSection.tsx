import { Truck, Headphones, ShieldCheck } from "lucide-react";

export default function ServiceSection() {
  return (
    <div className="w-full flex justify-center py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-20 text-center">
        
        <div className="flex flex-col items-center">
          <div className="bg-gray-300 rounded-full p-2 mb-6">
            <div className="bg-black text-white p-4 rounded-full">
              <Truck size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="font-bold text-xl uppercase mb-2 text-black">FREE AND FAST DELIVERY</h3>
          <p className="text-sm text-black">Free delivery for all orders over $140</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-gray-300 rounded-full p-2 mb-6">
            <div className="bg-black text-white p-4 rounded-full">
              <Headphones size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="font-bold text-xl uppercase mb-2 text-black">24/7 CUSTOMER SERVICE</h3>
          <p className="text-sm text-black">Friendly 24/7 customer support</p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-gray-300 rounded-full p-2 mb-6">
             <div className="bg-black text-white p-4 rounded-full">
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="font-bold text-xl uppercase mb-2 text-black">MONEY BACK GUARANTEE</h3>
          <p className="text-sm text-black">We return money within 30 days</p>
        </div>

      </div>
    </div>
  );
}