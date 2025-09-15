"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { scanReceipt } from "@/actions/scanReceipt";

export function ReceiptScanner({
  onScanComplete,
}: {
  onScanComplete: (data: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReceiptScan = async (formData: FormData) => {
    const file = formData.get("file") as File | null;
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    setLoading(true);

    const res = await scanReceipt(formData);
    setLoading(false);
    if (res.success) {
      toast.success("Receipt scanned successfully", {
        position: "top-right",
      });
      onScanComplete(res.data);
    } else {
      toast.error(res.message || "Failed to scan receipt");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            handleReceiptScan(formData);
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="animate-gradient h-10 w-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 text-white transition-opacity hover:text-white hover:opacity-90"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Camera className="mr-2 h-4 w-4" />
        )}
        Scan Receipt
      </Button>
    </div>
  );
}
