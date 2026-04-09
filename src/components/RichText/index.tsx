import React from "react";

import { AccordionBlock } from "@/blocks/Accordion/Component";
import { BannerBlock } from "@/blocks/Banner/Component";
import { CallToActionBlock } from "@/blocks/CallToAction/Component";
import { CarouselBlock } from "@/blocks/Carousel/Component";
import { CodeBlock } from "@/blocks/Code/Component";
import { FormBlock } from "@/blocks/Form/Component";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { Link } from "@/i18n/routing";
import type { RichTextNode, RichTextState } from "@/types/richtext";
import { cn } from "@/utilities/cn";

const isFormatEnabled = (format: RichTextNode["format"], bit: number, name: string) => {
  if (typeof format === "number") {
    return (format & bit) === bit;
  }

  if (typeof format === "string") {
    return format.split(",").map((entry) => entry.trim()).includes(name);
  }

  return false;
};

const getLinkHref = (node: RichTextNode) => {
  if (typeof node.url === "string" && node.url) {
    return node.url;
  }

  const doc = node.fields?.doc;
  if (doc?.value && typeof doc.value === "object" && doc.value.slug) {
    return `${doc.relationTo === "posts" ? "/posts" : ""}/${doc.value.slug}`;
  }

  return undefined;
};

const renderBlockNode = (node: RichTextNode, key: React.Key) => {
  const fields = node.fields ?? {};
  const blockType = fields.blockType ?? node.blockType ?? fields.slug ?? fields.type;

  switch (blockType) {
    case "banner":
      return <BannerBlock key={key} className="col-start-2 mb-4" {...fields} />;
    case "mediaBlock":
      return (
        <MediaBlock
          key={key}
          className="col-span-3 col-start-1"
          imgClassName="m-0"
          captionClassName="mx-auto max-w-3xl"
          disableInnerContainer={true}
          enableGutter={false}
          {...fields}
        />
      );
    case "accordion":
      return <AccordionBlock key={key} {...fields} />;
    case "formBlock":
      return <FormBlock key={key} {...fields} />;
    case "code":
      return <CodeBlock key={key} className="col-start-2" {...fields} />;
    case "cta":
      return <CallToActionBlock key={key} {...fields} />;
    case "carousel":
      return <CarouselBlock key={key} {...fields} />;
    default:
      return null;
  }
};

const renderChildren = (children?: RichTextNode[]) =>
  children?.map((child, index) => renderNode(child, child.id ?? index)) ?? null;

const renderTextNode = (node: RichTextNode, key: React.Key) => {
  let content: React.ReactNode = node.text ?? "";

  if (isFormatEnabled(node.format, 16, "code")) {
    content = <code>{content}</code>;
  }
  if (isFormatEnabled(node.format, 8, "underline")) {
    content = <u>{content}</u>;
  }
  if (isFormatEnabled(node.format, 4, "strikethrough")) {
    content = <s>{content}</s>;
  }
  if (isFormatEnabled(node.format, 2, "italic")) {
    content = <em>{content}</em>;
  }
  if (isFormatEnabled(node.format, 1, "bold")) {
    content = <strong>{content}</strong>;
  }

  return <React.Fragment key={key}>{content}</React.Fragment>;
};

const renderNode = (node: RichTextNode, key: React.Key): React.ReactNode => {
  switch (node.type) {
    case "root":
      return <React.Fragment key={key}>{renderChildren(node.children)}</React.Fragment>;
    case "paragraph":
      return <p key={key}>{renderChildren(node.children)}</p>;
    case "heading": {
      const Tag = (node.tag || "h2") as keyof JSX.IntrinsicElements;
      return <Tag key={key}>{renderChildren(node.children)}</Tag>;
    }
    case "quote":
      return <blockquote key={key}>{renderChildren(node.children)}</blockquote>;
    case "list": {
      const ListTag = node.listType === "number" ? "ol" : "ul";
      return <ListTag key={key}>{renderChildren(node.children)}</ListTag>;
    }
    case "listitem":
      return <li key={key}>{renderChildren(node.children)}</li>;
    case "linebreak":
      return <br key={key} />;
    case "link": {
      const href = getLinkHref(node);
      if (!href) {
        return <React.Fragment key={key}>{renderChildren(node.children)}</React.Fragment>;
      }

      const isInternal = href.startsWith("/");
      const newTab = Boolean(node.fields?.newTab);

      if (isInternal) {
        return (
          <Link href={href} key={key} target={newTab ? "_blank" : undefined}>
            {renderChildren(node.children)}
          </Link>
        );
      }

      return (
        <a href={href} key={key} rel={newTab ? "noopener noreferrer" : undefined} target={newTab ? "_blank" : undefined}>
          {renderChildren(node.children)}
        </a>
      );
    }
    case "block":
      return renderBlockNode(node, key);
    case "horizontalrule":
      return <hr key={key} />;
    case "upload":
    case "relationship":
      return null;
    case "text":
    default:
      return renderTextNode(node, key);
  }
};

type Props = {
  data: RichTextState | null;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, data, enableProse = true, enableGutter = false, ...rest } = props;

  if (!data?.root) {
    return null;
  }

  return (
    <div
      className="visual-editing-text-wrapper"
      data-visual-editing="true"
      data-block-type="richText"
      data-inline-editable="true"
    >
      <div
        className={cn(
          {
            container: enableGutter,
            "max-w-none": !enableGutter,
            "prose md:prose-md dark:prose-invert mx-auto": enableProse,
          },
          className,
        )}
        {...rest}
      >
        {renderChildren(data.root.children)}
      </div>
    </div>
  );
}

