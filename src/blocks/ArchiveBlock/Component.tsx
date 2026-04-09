import { getLocale } from "next-intl/server";

import { CollectionArchive } from "@/components/CollectionArchive";
import { getArchiveBlockPosts } from "@/data/storefront/posts";
import { type Locale } from "@/i18n/config";
import RichText from "@/components/RichText";

import type { Post, ArchiveBlock as ArchiveBlockProps } from "@/types/cms";

export const ArchiveBlock = async (
  props: ArchiveBlockProps & {
    id?: string;
  },
) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props;
  const locale = (await getLocale()) as Locale;

  const limit = limitFromProps ?? 3;

  let posts: Post[] = [];

  if (populateBy === "collection") {
    const flattenedCategories = categories?.map((category) => {
      if (typeof category === "object") return category.id;
      else return category;
    });
    posts = await getArchiveBlockPosts({
      categoryIds: flattenedCategories,
      limit,
      locale,
    });
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (post?.value && typeof post.value === "object") return post.value;
        return null;
      }) as Post[];

      posts = filteredSelectedPosts.filter(Boolean);
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-3xl" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  );
};


