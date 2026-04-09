import { Button, type ButtonProps } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { Page, Post } from "@/types/cms";
import { cn } from "src/utilities/cn";

type CMSLinkType = {
  appearance?: "inline" | ButtonProps["variant"] | string | null;
  children?: React.ReactNode;
  className?: string;
  label?: string | null;
  newTab?: boolean | null;
  reference?: {
    relationTo?: "pages" | "posts" | null;
    value?: Page | Post | string | number | null;
  } | null;
  size?: ButtonProps["size"] | null;
  type?: "custom" | "reference" | string | null;
  url?: string | null;
};

export const CMSLink = (props: CMSLinkType) => {
  const {
    type,
    appearance = "inline",
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url
  } = props;
  const href =
    type === "reference" &&
    reference?.value &&
    typeof reference.value === "object" &&
    reference.value.slug
      ? `${reference?.relationTo !== "pages" ? `/${reference?.relationTo}` : ""}/${reference.value.slug}`
      : url;

  if (!href) return null;

  const size = appearance === "link" ? "clear" : sizeFromProps;
  const newTabProps = newTab ? { rel: "noopener noreferrer", target: "_blank" } : {};

  /* Ensure we don't break any styles set by richText */
  if (appearance === "inline") {
    return (
      <Link className={cn(className)} href={(href || url) ?? ""} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    );
  }

  return (
    <Button asChild className={className} size={size} variant={appearance as ButtonProps["variant"]}>
      <Link className={cn(className)} href={(href || url) ?? ""} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  );
};
