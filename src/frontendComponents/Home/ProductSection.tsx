"use client";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { Product, ProductCategory } from "@/payload-types";
import { Media } from "@/components/Media";
import { Link } from "@/i18n/routing";

const products = [
  {
    id: 1,
    title: "morning recovery",
    flavor: "Lemon",
    price: "36.60",
    rating: 5,
    reviews: 780,
    description: "Engineered to prevent rough mornings",
    pack: "6 Pack",
    bestSeller: true,
  },
  {
    id: 2,
    title: "morning recovery",
    flavor: "Lemon",
    price: "36.60",
    rating: 5,
    reviews: 780,
    description: "Engineered to prevent rough mornings",
    pack: "6 Pack",
    bestSeller: true,
  },
  {
    id: 3,
    title: "morning recovery",
    flavor: "Lemon",
    price: "36.60",
    rating: 5,
    reviews: 780,
    description: "Engineered to prevent rough mornings",
    pack: "6 Pack",
    bestSeller: true,
  },
  {
    id: 4,
    title: "morning recovery",
    flavor: "Lemon",
    price: "36.60",
    rating: 5,
    reviews: 780,
    description: "Engineered to prevent rough mornings",
    pack: "6 Pack",
    bestSeller: true,
  },
  //   {
  //   id: 5,
  //   title: "morning recovery",
  //   flavor: "Lemon",
  //   price: "36.60",
  //   rating: 5,
  //   reviews: 780,
  //   description: "Engineered to prevent rough mornings",
  //   pack: "6 Pack",
  //   bestSeller: true,
  // },
];

export default function ProductSection() {
  return (
    <div className="w-full bg-gray-50 py-8">
      <ProductListing type="left" catType="domestic" />
      <ProductListing type="right" catType="international" />
    </div>
  );
}

function ProductListing({ type, catType }: { type: string; catType: string }) {
  const [allproduct, setAllProduct] = useState<Product[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [prdtCategory, setPrdtCategory] = useState<ProductCategory[]>([]);

  // getproduct
  useEffect(() => {
    if (catType) {
      void getAllProduct(catType);
    }
  }, [catType]);

  const getAllProduct = async (catType: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/products");
      const prd: Product[] = response.data?.docs;

      const filterPrd: Product[] = prd.filter((item) => {
        if (item.categoriesArr && item.categoriesArr.length > 0) {
          const data = item.categoriesArr[0].category;
          if (typeof data === "object" && data !== null && "slug" in data) {
            const slug = data.slug;
            return slug === catType;
          }
        }
        return false;
      });
      //console.log("filterPrd", filterPrd);
      setAllProduct(filterPrd);
    } catch (err) {
      alert("Failed to load products. Please try again later.");
      //console.log("error loading products", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full px-4 py-6 ${type === "left" ? "bg-white" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col ${type === "left" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-6 items-stretch`}
        >
          {/* Product Marking Card */}
          <div className="w-full lg:w-64 flex-shrink-0">
            {type == "left" ? (
              <ProductMarking />
            ) : (
              <ProductInernationalMarking />
            )}
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 overflow-x-auto p-1">
            <div className="flex gap-4 justify-between pb-4 lg:pb-0">
              {isLoading ? (
                // Loading skeleton
                [...Array(4)].map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-64 lg:w-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col animate-pulse">
                      <div className="relative bg-gray-200 p-6 flex items-center justify-center h-64">
                        <div className="w-24 h-24 bg-gray-300 rounded"></div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="flex items-center justify-between mt-auto pt-4">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : allproduct && allproduct.length > 0 ? (
                allproduct.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-64 lg:w-auto"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12">
                  <p className="text-gray-500">No products available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  // Get the first image from the product
  const productImage = product.images?.[0] || null;
   
  console.log("product")
  return (
    <Link href={`/product/${product.slug}`} prefetch={true} className="block h-full">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex items-center justify-center h-64 overflow-hidden">
          {productImage ? (
            <div className="w-40 h-40 relative">
              <Media
                resource={productImage}
                imgClassName="w-full h-full object-contain"
                priority={false}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}

        {/* {product?.bestSeller && (
          <div className="absolute top-4 right-4 bg-blue-300 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full">
            best seller
          </div>
        )} */}

        {product.Highlight && (
          <div className="absolute top-4 left-4 bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
            {product.Highlight}
          </div>
        )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {/* {[...Array(product.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-blue-900 text-blue-900" />
          ))} */}
          {/* <span className="text-xs text-gray-600 ml-1">
            {product.reviews} reviews
          </span> */}
        </div>
        {/* <p className="text-sm text-gray-500 mb-2">{product.flavor}</p> */}

        {/* Rating */}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500">Price</span>
          <span className="text-xl font-bold text-gray-900">
            ${product?.pricing?.[0]?.value || '0.00'}
          </span>
        </div>
        </div>
      </div>
    </Link>
  );
}

function ProductMarking() {
  return (
    <div className="h-full bg-orange-200 rounded-xl p-6 flex flex-col justify-between shadow-lg min-h-[300px]">
      <div>
        <h2 className="font-extrabold text-xl text-gray-900 leading-tight mb-4">
          FREE SHIPPING within US
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          We ship orders to all states including AK, HI, and PR at no cost.
        </p>
      </div>
      <button className="mt-6 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 w-full sm:w-auto">
        View All
      </button>
    </div>
  );
}
function ProductInernationalMarking() {
  return (
    <div className="h-full bg-orange-200 rounded-xl p-6 flex flex-col justify-between shadow-lg min-h-[300px]">
      <div>
        <h2 className="font-extrabold text-xl text-gray-900 leading-tight mb-4">
          Product Ship International
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          Currently, we offer direct shipping to Taiwan only. If you are
          interested to ship to other countries, please visit Contact Us page to
          submit your inquiry.
        </p>
      </div>
      <button className="mt-6 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 w-full sm:w-auto">
        View All
      </button>
    </div>
  );
}
