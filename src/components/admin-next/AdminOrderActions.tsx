"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Order } from "@/types/cms";

const statuses: Order["orderDetails"]["status"][] = [
  "pending",
  "paid",
  "unpaid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "returned",
];

export const AdminOrderActions = ({
  id,
  initialNote,
  initialShippingDate,
  initialStatus,
  initialTrackingNumber,
  labelUrl,
}: {
  id: string;
  initialNote?: string | null;
  initialShippingDate?: string | null;
  initialStatus: Order["orderDetails"]["status"];
  initialTrackingNumber?: string | null;
  labelUrl?: string | null;
}) => {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber ?? "");
  const [shippingDate, setShippingDate] = useState(
    initialShippingDate ? initialShippingDate.slice(0, 10) : "",
  );
  const [orderNote, setOrderNote] = useState(initialNote ?? "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveChanges = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      await axios.patch(
        `/api/admin/orders/${id}`,
        {
          orderNote,
          shippingDate: shippingDate ? new Date(shippingDate).toISOString() : null,
          status,
          trackingNumber: trackingNumber || null,
        },
        {
          withCredentials: true,
        },
      );

      setMessage("Order updated.");
      router.refresh();
    } catch (error) {
      console.error("Failed to update order:", error);
      setMessage("Failed to update order.");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadLabel = async () => {
    try {
      const response = await axios.get(`/api/shipping/print-label?orderID=${id}`, {
        responseType: "blob",
        withCredentials: true,
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download label:", error);
      setMessage("Failed to download label.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Status</Label>
        <Select onValueChange={(value) => setStatus(value as Order["orderDetails"]["status"])} value={status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trackingNumber">Tracking Number</Label>
        <input
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          id="trackingNumber"
          onChange={(event) => setTrackingNumber(event.target.value)}
          value={trackingNumber}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shippingDate">Shipping Date</Label>
        <input
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
          id="shippingDate"
          onChange={(event) => setShippingDate(event.target.value)}
          type="date"
          value={shippingDate}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orderNote">Order Note</Label>
        <Textarea
          id="orderNote"
          onChange={(event) => setOrderNote(event.target.value)}
          rows={5}
          value={orderNote}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button disabled={isSaving} onClick={saveChanges}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
        {labelUrl ? (
          <Button onClick={downloadLabel} variant="outline">
            Download Label
          </Button>
        ) : null}
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
};
