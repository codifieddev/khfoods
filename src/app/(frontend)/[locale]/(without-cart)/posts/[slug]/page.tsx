import { draftMode } from "next/headers";
import React, { cache } from "react";

import { RelatedPosts } from "@/blocks/RelatedPosts/Component";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import RichText from "@/components/RichText";
import { PostHero } from "@/components/heros/PostHero";
import { getPostBySlug, getPublishedPostSlugs } from "@/data/storefront/posts";
import { type Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { generateMeta } from "@/utilities/generateMeta";

import PageClient from "./page.client";

import type { Post } from "@/types/cms";
import type { Metadata } from "next";

// Force dynamic rendering due to draftMode() usage
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const postSlugs = await getPublishedPostSlugs();

    if (!postSlugs.length) {
      console.error("No published post slugs returned in generateStaticParams");
      return [];
    }

    const params = routing.locales.flatMap((locale) => {
      return postSlugs.map((slug) => {
        return { locale, slug };
      });
    });
    return params;
  } catch (error) {
    console.error("Error in generateStaticParams for posts/[slug]", error);
    return [];
  }
}

type Args = {
  params: Promise<{
    slug?: string;
    locale: Locale;
  }>;
};

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "", locale } = await paramsPromise;
  const url = "/posts/" + slug;
  const post = await queryPostBySlug({ slug, locale });

  if (!post) return <PayloadRedirects locale={locale} url={url} />;

  return (
    <article className="pb-16 pt-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects locale={locale} disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="mx-auto max-w-3xl" data={post.content ?? null} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="col-span-3 col-start-1 mt-12 max-w-208 grid-rows-[2fr] lg:grid lg:grid-cols-subgrid"
              docs={post.relatedPosts.filter((post) => typeof post === "object")}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = "", locale } = await paramsPromise;
  const post = await queryPostBySlug({ slug, locale });
  return generateMeta({ doc: post || {} });
}

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  try {
    const { isEnabled: draft } = await draftMode();
    const post = await getPostBySlug({
      slug,
      locale,
      draft,
    });

    if (!post) {
      console.error(`No post returned for slug="${slug}" locale="${locale}" in queryPostBySlug`);
      return null;
    }

    return post;
  } catch (error) {
    console.error(`Error in queryPostBySlug for slug="${slug}" locale="${locale}":`, error);
    return null;
  }
});

