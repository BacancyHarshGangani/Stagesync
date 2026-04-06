"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type VendorCardProps = {
  id: string;
  email: string;
  vendor_status: "PENDING" | "ACTIVE" | "REJECTED";

  venodr_profiles: {
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
  onReject?: (id: string, reason: string) => void;
};

export default function VendorCard({
  id,
  email,
  vendor_status,
  venodr_profiles,
  showActions = false,
  onApprove,
  onReject,
}: VendorCardProps) {
  const [signedUrls, setSignedUrls] = useState<string[]>([]);
  const [isrejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const [showAction, setShowAction] = useState(showActions);

  useEffect(() => {
    const loadImages = async () => {
      if (!venodr_profiles?.portfolio_urls) return;

      const urls = await Promise.all(
        venodr_profiles.portfolio_urls.map(async (key) => {
          const res = await fetch(`/api/get-image?key=${key}`);
          const data = await res.json();
          return data.url;
        }),
      );

      setSignedUrls(urls);
    };

    loadImages();
  }, [venodr_profiles]);

  return (
    <div className="bg-white m-4 border max-w-1/3 rounded-2xl shadow-sm p-5 space-y-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl text-cyan-950 font-semibold ">
            {venodr_profiles?.company_name}
          </h2>
          <p className="text-sm text-gray-500">Provider email : {email}</p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            vendor_status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : vendor_status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {vendor_status}
        </span>
      </div>

      <div className="text-2xl flex  text-gray-700 space-y-1">
        <div>
          <p>
            <span className="font-bold ">
              {venodr_profiles?.category} {venodr_profiles?.other_category}
            </span>
          </p>
          <p>Service area : {venodr_profiles?.service_area}</p>
          <p>
            pricing : {venodr_profiles?.pricing_min} -{" "}
            {venodr_profiles?.pricing_max}
          </p>

          <div className="h-0.5 w-50 bg-black mt-4 "></div>

          <p className=" text-gray-600 line-clamp-2 mt-4">
            Description : {venodr_profiles?.description}
          </p>
        </div>

        <div className="flex ml-auto">
          {signedUrls.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="portfolio"
              className="w-40 h-40 object-fill rounded-lg border"
            />
          ))}
        </div>
      </div>

      {showAction && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onApprove?.(id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition"
          >
            Approve
          </button>

          <button
            onClick={() => {setIsRejecting(true); setShowAction(false)}}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition"
          >
            Reject
          </button>
        </div>
      )}

      {isrejecting && (
        <div>
          <input
            type="text"
            required
            placeholder="Reason for rejection"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
            }}
            className="border text-black rounded-lg px-3 py-2 w-full mt-2"
          />
          <button
            onClick={() => {
              if (!reason || reason.trim().length < 10) {
                toast.error(
                  "Please enter at least 10 characters for rejection reason",
                );
                return;
              }
              onReject?.(id, reason);
              setIsRejecting(false);
              setReason("");
            }}
            className="flex-1 mt-2 bg-red-600 hover:bg-red-700 text-white text-sm p-2 rounded-lg transition"
          >
            Confirm
          </button>

          <button
            onClick={() => {setIsRejecting(false); setShowAction(true)}}
            className="flex-1 bg-gray-600 hover:bg-gray-700 ml-2 text-white text-sm p-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
