import { getLocale } from "next-intl/server";
import React from "react";

import { CollectionArchive } from "@/components/CollectionArchive";
import { PageRange } from "@/components/PageRange";
import { Pagination } from "@/components/Pagination";
import { getPostsPage, POSTS_PAGE_SIZE } from "@/data/storefront/posts";
import { type Locale } from "@/i18n/config";

import PageClient from "./page.client";

import type { Metadata } from "next/types";

export const dynamic = "force-static";
export const revalidate = 600;

export default async function Page() {
  const locale = (await getLocale()) as Locale;
  const posts = await getPostsPage({ locale, limit: POSTS_PAGE_SIZE });

  return (
    <div className="pb-24 pt-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none dark:prose-invert">
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
        {posts.totalPages > 1 && posts.page && <Pagination page={posts.page} totalPages={posts.totalPages} />}
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `KarloBan`
  };
}
