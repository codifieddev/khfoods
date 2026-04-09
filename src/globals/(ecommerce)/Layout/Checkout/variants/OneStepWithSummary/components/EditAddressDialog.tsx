"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

import { ShippingAddressForm } from "@/components/(ecommerce)/ShippingAddressForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { type Customer } from "@/types/cms";
import { type CheckoutFormData, useCheckoutFormSchema } from "@/schemas/checkoutForm.schema";

export const EditAddressDialog = ({
  open,
  setOpen,
  user,
  address,
  onUpdate
}: {
  open: boolean;
  user: Customer;
  setOpen: Dispatch<SetStateAction<boolean>>;
  address: CheckoutFormData["shipping"] & { id?: string };
  onUpdate: () => Promise<void>;
}) => {
  const { ShippingFormSchemaResolver } = useCheckoutFormSchema();
  const form = useForm<{ shipping: CheckoutFormData["shipping"] }>({
    resolver: zodResolver(ShippingFormSchemaResolver),
    defaultValues: {
      shipping: {
        name: address.name || "",
        address: address.address || "",
        city: address.city || "",
        country: address.country || "pl",
        region: address.region || "",
        postalCode: address.postalCode || "",
        phone: address.phone || "",
        email: address.email || ""
      }
    }
  });

  const t = useTranslations("CheckoutForm.edit-address-dialog");

  // Update form values when address changes
  useEffect(() => {
    form.reset({
      shipping: {
        name: address.name || "",
        address: address.address || "",
        city: address.city || "",
        country: address.country || "pl",
        region: address.region || "",
        postalCode: address.postalCode || "",
        phone: address.phone || "",
        email: address.email || ""
      }
    });
  }, [address, form]);

  const onSubmit = async (values: { shipping: CheckoutFormData["shipping"] }) => {
    try {
      const updatedShippings = (user.shippings ?? []).map((shipping) =>
        shipping.id === address.id
          ? { ...shipping, ...values.shipping }
          : shipping
      );

      const { data } = await axios.patch<{
        doc: Customer;
      }>(
        "/api/customers/me",
        {
          shippings: updatedShippings
        },
        {
          withCredentials: true
        },
      );

      if (data.doc.shippings) {
        await onUpdate();
        setOpen(false);
      }
    } catch {
      form.setError("root", {
        message: "Internal server error"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="max-w-(--breakpoint-sm)">
        <DialogHeader>
          <DialogTitle className="mb-4">{t("edit-address")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <ShippingAddressForm />
            <Button variant="tailwind" type="submit" className="col-span-2 mt-4">
              {form.formState.isSubmitting ? t("saving") : t("save")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};


