import { notFound } from "next/navigation";
import React from "react";

import { CollectionArchive } from "@/components/CollectionArchive";
import { PageRange } from "@/components/PageRange";
import { Pagination } from "@/components/Pagination";
import { getPostCount, getPostsPage, POSTS_PAGE_SIZE } from "@/data/storefront/posts";
import { type Locale } from "@/i18n/config";

import PageClient from "./page.client";

import type { Metadata } from "next/types";

export const revalidate = 600;

type Args = {
  params: Promise<{
    pageNumber: string;
    locale: Locale;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber, locale } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber)) notFound();

  const posts = await getPostsPage({
    locale,
    page: sanitizedPageNumber,
    limit: POSTS_PAGE_SIZE,
  });

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={POSTS_PAGE_SIZE}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise;
  return {
    title: `Payload Ecommerce Template Posts Page ${pageNumber || ""}`
  };
}

export async function generateStaticParams() {
  const totalDocs = await getPostCount();
  const totalPages = Math.ceil(totalDocs / POSTS_PAGE_SIZE);

  const pages: { pageNumber: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}
