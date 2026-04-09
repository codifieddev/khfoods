import { getLocale } from "next-intl/server";
import React from "react";

import { type CardPostData } from "@/components/Card";
import { CollectionArchive } from "@/components/CollectionArchive";
import { Search } from "@/components/search/Component";
import { getPostsPage, POSTS_PAGE_SIZE } from "@/data/storefront/posts";
import { type Locale } from "@/i18n/config";

import PageClient from "./page.client";

import type { Metadata } from "next/types";

type Args = {
  searchParams: Promise<{
    q: string;
  }>;
};
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise;
  const locale = (await getLocale()) as Locale;
  const posts = await getPostsPage({
    locale,
    limit: POSTS_PAGE_SIZE,
    query,
  });

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="mx-auto max-w-200">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Ecommerce Template Search`
  };
}
