"use client";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type Country } from "@/globals/(ecommerce)/Couriers/utils/countryList";
import { type Customer } from "@/types/cms";
import { cn } from "@/utilities/cn";

import { AddNewAddressDialog } from "../../Checkout/variants/OneStepWithSummary/components/AddNewAddressDialog";
import { EditAddressDialog } from "../../Checkout/variants/OneStepWithSummary/components/EditAddressDialog";

export const OrdersData = ({
  user,
  updateCustomerData
}: {
  user: Customer;
  updateCustomerData: () => Promise<void>;
}) => {
  const [selectedShipping, setSelectedShipping] = useState(
    user?.shippings?.find((shipping) => shipping.default) ??
      user?.shippings?.[0]
  );
  const [shippings, setShippings] = useState(user.shippings ?? []);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const t = useTranslations("Account.orders-data");

  const setDefaultAddress = async () => {
    await updateCustomerData();
    // console.log(user.shippings);
    if (!selectedShipping || !user.shippings?.length) return;

    // console.log(user.shippings);

    const updatedShippings = shippings.map((shipping) => ({
      ...shipping,
      default: shipping.id === selectedShipping.id
    }));

    try {
      const { data } = await axios.patch<{ doc: Customer }>(
        "/api/customers/me",
        {
          shippings: updatedShippings
        }
      );

      if (data?.doc.shippings) {
        setShippings(data.doc.shippings);
        const defaultShipping = data.doc.shippings.find((s) => s.default) ?? data.doc.shippings[0];
        setSelectedShipping({
          ...defaultShipping,
          email: defaultShipping.email ?? ''
        });
      }
    } catch (error) {
      console.error("Failed to update default address:", error);
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!confirm(t("confirm-delete"))) return;

    try {
      const updatedShippings = shippings.filter((shipping) => shipping.id !== addressId);
      
      const { data } = await axios.patch<{ doc: Customer }>(
        "/api/customers/me",
        {
          shippings: updatedShippings
        }
      );

      if (data?.doc.shippings) {
        setShippings(data.doc.shippings);
        if (selectedShipping?.id === addressId) {
          const newDefault = data.doc.shippings.find((s) => s.default) ?? data.doc.shippings[0];
          setSelectedShipping(newDefault ? {
            ...newDefault,
            email: newDefault.email ?? ''
          } : undefined);
        }
      }
      await updateCustomerData();
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleEditAddress = (shipping: any) => {
    setEditingAddress(shipping);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    setShippings(user.shippings ?? []);
    setSelectedShipping(
      user.shippings?.find((shipping) => shipping.default) ??
        user.shippings?.[0]
    );
  }, [user.shippings]);

  return (
    <section className="no-prose">
      <AddNewAddressDialog
        open={addressDialogOpen}
        setOpen={setAddressDialogOpen}
        user={user}
        setShipping={async (shipping) => {
          setShippings((prevState) => [
            ...prevState,
            {
              ...shipping,
              country: shipping.country as Country
            },
          ]);
          await updateCustomerData();
        }}
      />
      {editingAddress && (
        <EditAddressDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          user={user}
          address={editingAddress}
          onUpdate={updateCustomerData}
        />
      )}
      <h2 className="mb-8 text-xl font-bold">{t("title")}</h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {shippings
          .sort((a, b) => {
            if (a.default === b.default) return 0;
            return a.default ? -1 : 1;
          })
          .map((shipping) => (
            <div
              key={shipping.id}
              className={cn(
                "group relative flex cursor-pointer rounded-lg border border-gray-300 border-transparent bg-white p-4 shadow-xs ring-2 ring-gray-200 focus:outline-hidden",
                shipping.id === selectedShipping?.id && "ring-main-500"
              )}
            >
              <span 
                className="flex flex-1"
                onClick={() => {
                  setSelectedShipping({
                    ...shipping,
                    id: shipping.id ?? undefined
                  });
                }}
              >
                <span className="flex w-full flex-col">
                  <span className="block text-left text-sm font-medium text-gray-900">
                    {shipping.name}
                  </span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">
                    {shipping.address}
                  </span>
                  <span className="mt-1 text-left text-sm font-medium text-gray-500">
                    {shipping.postalCode}, {shipping.city}, {shipping.country}
                  </span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">
                    {shipping.phone}
                  </span>
                  <span className="mt-1 flex items-center text-sm text-gray-500">
                    {shipping.email}
                  </span>
                </span>
              </span>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(shipping);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  title={t("edit")}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void deleteAddress(shipping.id ?? '');
                  }}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  title={t("delete")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <Button
          variant="tailwindOutline"
          onClick={() => setAddressDialogOpen(true)}
        >
          {t("add-new")}
        </Button>
        <Button variant="tailwind" onClick={setDefaultAddress}>
          {t("set-as-default")}
        </Button>
      </div>
    </section>
  );
};


