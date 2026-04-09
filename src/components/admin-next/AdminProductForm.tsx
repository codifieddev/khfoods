"use client";

import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types/cms";

const productStatuses: NonNullable<Product["_status"]>[] = ["draft", "published"];

export const AdminProductForm = ({
  canEditStock,
  canEditWeight,
  id,
  initialHighlight,
  initialSlug,
  initialStatus,
  initialStock,
  initialTitle,
  initialWeight,
}: {
  canEditStock: boolean;
  canEditWeight: boolean;
  id: string;
  initialHighlight?: string | null;
  initialSlug?: string | null;
  initialStatus?: Product["_status"];
  initialStock?: number | null;
  initialTitle: string;
  initialWeight?: number | null;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [status, setStatus] = useState<NonNullable<Product["_status"]>>(initialStatus ?? "draft");
  const [highlight, setHighlight] = useState(initialHighlight ?? "");
  const [stock, setStock] = useState(initialStock ?? 0);
  const [weight, setWeight] = useState(initialWeight ?? 0);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveChanges = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      await axios.patch(
        `/api/admin/products/${id}`,
        {
          highlight,
          slug,
          status,
          stock: canEditStock ? stock : undefined,
          title,
          weight: canEditWeight ? weight : undefined,
        },
        {
          withCredentials: true,
        },
      );

      setMessage("Product updated.");
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        setMessage((error.response?.data as { message?: string } | undefined)?.message ?? "Failed to update product.");
      } else {
        setMessage("Failed to update product.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="productTitle">Title (English)</Label>
        <Input id="productTitle" onChange={(event) => setTitle(event.target.value)} value={title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productSlug">Slug</Label>
        <Input id="productSlug" onChange={(event) => setSlug(event.target.value)} value={slug} />
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select onValueChange={(value) => setStatus(value as NonNullable<Product["_status"]>)} value={status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {productStatuses.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productHighlight">Highlight</Label>
        <Textarea
          id="productHighlight"
          onChange={(event) => setHighlight(event.target.value)}
          placeholder="Short highlight shown on the product page"
          rows={4}
          value={highlight}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="productStock">Stock</Label>
          <Input
            disabled={!canEditStock}
            id="productStock"
            onChange={(event) => setStock(Number(event.target.value))}
            type="number"
            value={stock}
          />
          {!canEditStock ? <p className="text-xs text-slate-500">Managed through variants in the legacy editor.</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productWeight">Weight (g)</Label>
          <Input
            disabled={!canEditWeight}
            id="productWeight"
            onChange={(event) => setWeight(Number(event.target.value))}
            type="number"
            value={weight}
          />
          {!canEditWeight ? <p className="text-xs text-slate-500">Managed through variant weights in the legacy editor.</p> : null}
        </div>
      </div>

      <Button disabled={isSaving} onClick={saveChanges}>
        {isSaving ? "Saving..." : "Save changes"}
      </Button>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
};
