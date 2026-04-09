import { getServerSideURL } from "./getURL";

import type { Metadata } from "next";

const defaultOpenGraph: Metadata["openGraph"] = {
  type: "website",
  description: "A high-performance ecommerce platform built with native Next.js and MongoDB.",
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`
    },
  ],
  siteName: "Karloban",
  title: "Karloban"
};

export const mergeOpenGraph = (og?: Metadata["openGraph"]): Metadata["openGraph"] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ?? defaultOpenGraph.images
  };
};
