"use client";

import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Customer } from "@/types/cms";

const buyerTypes: Array<NonNullable<Customer["lastBuyerType"]>> = ["individual", "company"];

export const AdminCustomerForm = ({
  id,
  initialBirthDate,
  initialEmail,
  initialFirstName,
  initialIsLocked,
  initialIsVerified,
  initialLastBuyerType,
  initialLastName,
}: {
  id: string;
  initialBirthDate?: string | null;
  initialEmail: string;
  initialFirstName?: string | null;
  initialIsLocked: boolean;
  initialIsVerified: boolean;
  initialLastBuyerType?: Customer["lastBuyerType"];
  initialLastName?: string | null;
}) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");
  const [email, setEmail] = useState(initialEmail);
  const [birthDate, setBirthDate] = useState(initialBirthDate ? initialBirthDate.slice(0, 10) : "");
  const [lastBuyerType, setLastBuyerType] = useState<Customer["lastBuyerType"]>(initialLastBuyerType ?? null);
  const [isVerified, setIsVerified] = useState(initialIsVerified);
  const [unlockAccount, setUnlockAccount] = useState(initialIsLocked);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveChanges = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      await axios.patch(
        `/api/admin/customers/${id}`,
        {
          birthDate: birthDate || null,
          email,
          firstName,
          isVerified,
          lastBuyerType,
          lastName,
          unlockAccount,
        },
        {
          withCredentials: true,
        },
      );

      setMessage("Customer updated.");
      setUnlockAccount(false);
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        setMessage((error.response?.data as { message?: string } | undefined)?.message ?? "Failed to update customer.");
      } else {
        setMessage("Failed to update customer.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerFirstName">First Name</Label>
          <Input id="customerFirstName" onChange={(event) => setFirstName(event.target.value)} value={firstName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerLastName">Last Name</Label>
          <Input id="customerLastName" onChange={(event) => setLastName(event.target.value)} value={lastName} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerEmail">Email</Label>
        <Input id="customerEmail" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerBirthDate">Birth Date</Label>
          <Input
            id="customerBirthDate"
            onChange={(event) => setBirthDate(event.target.value)}
            type="date"
            value={birthDate}
          />
        </div>
        <div className="space-y-2">
          <Label>Last Buyer Type</Label>
          <Select
            onValueChange={(value) => setLastBuyerType(value === "none" ? null : (value as Customer["lastBuyerType"]))}
            value={lastBuyerType ?? "none"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select buyer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {buyerTypes.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <Checkbox checked={isVerified} onCheckedChange={(checked) => setIsVerified(Boolean(checked))} />
          <span>Customer is verified</span>
        </label>

        {initialIsLocked ? (
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <Checkbox checked={unlockAccount} onCheckedChange={(checked) => setUnlockAccount(Boolean(checked))} />
            <span>Unlock account on save</span>
          </label>
        ) : null}
      </div>

      <Button disabled={isSaving} onClick={saveChanges}>
        {isSaving ? "Saving..." : "Save changes"}
      </Button>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
};
