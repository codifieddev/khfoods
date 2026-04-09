import {
  paddingBottomClasses,
  paddingTopClasses,
  spacingBottomClasses,
  spacingTopClasses
} from "@/blocks/globals";
import { CMSLink } from "@/components/Link";
import RichText from "@/components/RichText";
import { VisualEditingWrapper } from "@/components/VisualEditingWrapper";
import { cn } from "@/utilities/cn";

import type { CallToActionBlock as CTABlockProps } from "@/types/cms";

export const CallToActionBlock = ({
  links,
  richText,
  spacingTop,
  spacingBottom,
  paddingBottom,
  paddingTop
}: CTABlockProps) => {
  return (
    <div
      className={cn(
        "container",
        spacingTopClasses[spacingTop ?? "medium"],
        spacingBottomClasses[spacingBottom ?? "medium"],
        paddingTopClasses[paddingTop ?? "medium"],
        paddingBottomClasses[paddingBottom ?? "medium"],
      )}
    >
      <div className="border-border bg-card flex flex-col gap-8 rounded border p-4 md:flex-row md:items-center md:justify-between">
        <VisualEditingWrapper
          blockType="cta-content"
          field="richText"
          isInlineEditable={true}
          className="flex max-w-3xl items-center"
        >
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </VisualEditingWrapper>
        <VisualEditingWrapper blockType="cta-links" field="links" className="flex flex-col gap-8">
          {(links ?? []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />;
          })}
        </VisualEditingWrapper>
      </div>
    </div>
  );
};


