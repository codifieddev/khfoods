"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { type ReactNode, useEffect, useState } from "react";

import { Media } from "@/components/Media";
import { type Product } from "@/types/cms";

import { type FilledVariant } from "../../../types";

export const ProductGallery = ({
  product,
  tabs,
  selectedVariant,
  minQuantity,
  maxQuantity,
  children
}: {
  product: Product;
  selectedVariant?: FilledVariant;
  tabs: ReactNode;
  minQuantity: number;
  maxQuantity: number;
  children: ReactNode;
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    setSelectedTab(0);
  }, [selectedVariant, minQuantity, maxQuantity]);

  // ✅ DYNAMIC PRODUCT IMAGES (ADMIN PANEL SE)
    const images =
      product?.images
        ?.map((item) =>
          item && typeof item === "object" && "image" in item && typeof (item as any).image === "object"
            ? (item as any).image
            : null
        )
        .filter(Boolean) || [];

  return (
    <TabGroup
      defaultIndex={0}
      selectedIndex={selectedTab}
      onChange={(index) => {
        setSelectedTab(index);
      }}
      className="flex flex-col-reverse"
    >
      {/* IMAGE SELECTOR (THUMBNAILS) */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <TabList className="grid grid-cols-4 gap-6">
          {/* Variant image (as it was) */}
          {product.enableVariants && selectedVariant?.image && (
            <Tab className="focus:ring-3 focus:outline-hidden focus:ring-main-500/50 group relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:ring-offset-4">
              <span className="sr-only">{selectedVariant.image.alt}</span>
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <Media
                  resource={selectedVariant.image}
                  className="size-full object-cover"
                />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-main-500"
              />
            </Tab>
          )}

          {/* ✅ DYNAMIC PRODUCT IMAGES */}
          {images.map((image, index) => (
            <Tab
              key={index}
              className="focus:ring-3 focus:outline-hidden focus:ring-main-500/50 group relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:ring-offset-4"
            >
              <span className="sr-only">{image.alt || "Product image"}</span>
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <Media
                  resource={image}
                  className="size-full object-cover"
                />
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-main-500"
              />
            </Tab>
          ))}

          {/* as it was */}
          {children}
        </TabList>
      </div>

      {/* MAIN IMAGE */}
      <TabPanels>
        {/* Variant image panel (as it was) */}
        {product.enableVariants && selectedVariant?.image && (
          <TabPanel>
            <Media
              resource={selectedVariant.image}
              placeholder="empty"
              className="aspect-square w-full object-cover sm:rounded-lg"
            />
          </TabPanel>
        )}

        {/* ✅ DYNAMIC PRODUCT IMAGE PANELS */}
        {images.map((image, index) => (
          <TabPanel key={index}>
            <Media
              resource={image}
              placeholder="empty"
              className="aspect-square w-full object-cover sm:rounded-lg"
            />
          </TabPanel>
        ))}

        {tabs}
      </TabPanels>
    </TabGroup>
  );
};


