"use client";

import VendorCard from "@/componants/vendor/vendor_card";
import { useEffect, useState } from "react";

type vendor = {
  id: string;
  email: string;
  vendor_status: "PENDING" | "ACTIVE" | "REJECTED";

  vendor_profiles: {
    company_name: string;
    category: string;
    other_category: string;
    service_area: string;
    capacity_min: number;
    capacity_max: number;
    pricing_max: number;
    pricing_min: number;
    description: string;
    portfolio_urls: string[];
  };

  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

export default function admin() {
  const [vendors, setVendors] = useState<vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch("/api/vendor/details");
      const data = await res.json();

      setVendors(data.vendor);
    };

    fetchVendors();
  }, []);

  const handleApprove =async (id:string) => {

    setVendors((prev) => prev.filter((v) => v.id !== id));

    await fetch('/api/vendor/approve',
        {
            method: "POST",
            headers:{
                "Content-type" : "application/json"
            },
            body : JSON.stringify({id : id})
        }
    )
  }

  const handleReject = async (id : string, reason : string) => {

    setVendors((prev) => prev.filter((v) => v.id !== id));

    await fetch('api/vendor/reject',{
        method: "POST",
        headers:{
            "Content-type" : "application/json"
        },
        body: JSON.stringify({id: id, reason : reason})
    })
  }

  return (
    <div>
      <h1>Welcome Admin</h1>
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            {...vendor}
            venodr_profiles={vendor.vendor_profiles}
            showActions={true}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
    </div>
  );
}
