import { ArchiveBlock } from "@/blocks/ArchiveBlock/Component";
import { CallToActionBlock } from "@/blocks/CallToAction/Component";
import { ContentBlock } from "@/blocks/Content/Component";
import { FormBlock } from "@/blocks/Form/Component";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { VisualEditingWrapper } from "@/components/VisualEditingWrapper";

import { HotspotBlock } from "./(ecommerce)/Hotspot/Component";
import { AccordionBlock } from "./Accordion/Component";
import { CarouselBlock } from "./Carousel/Component";

import type { Page } from "@/types/cms";
import { default as LayoutBlockRenderer } from "./Container/component";
import { AboutPageRenderer } from "./About/component";

// Import section components
// Equal Columns
import {
  TwoEqualColumnsComponent,
  ThreeEqualColumnsComponent,
  FourEqualColumnsComponent,
  FiveEqualColumnsComponent,
  SixEqualColumnsComponent
} from "@/section/components/EqualColumns";
// Offset Columns
import {
  TwoThirdsOneThirdComponent,
  OneThirdTwoThirdsComponent,
  OneQuarterThreeQuartersComponent,
  ThreeQuartersOneQuarterComponent
} from "@/section/components/OffsetColumns";
// Multi-Column Layouts
import {
  SidebarMainLayoutComponent,
  MainSidebarLayoutComponent,
  HeaderTwoColumnsLayoutComponent,
  HeaderThreeColumnsLayoutComponent,
  MasonryLayoutComponent
} from "@/section/components/MultiColumnLayouts";
// Multi-Row Columns
import {
  TwoRowsTwoColumnsComponent,
  TwoRowsThreeColumnsComponent,
  ThreeRowsTwoColumnsComponent,
  ThreeRowsThreeColumnsComponent
} from "@/section/components/MultiRowColumns";
import { BlurbBlock } from "@/blocks/contentBlock/Blurb/Component";
import { TextBlock } from "@/blocks/contentBlock/Text/Component";
import { ToggleBlock } from "./contentBlock/Toggle/Component";
import { DividerBlock } from "./contentBlock/Divider/Component";

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  carousel: CarouselBlock,
  mediaBlock: MediaBlock,
  accordion: AccordionBlock,
  hotspotZone: HotspotBlock,
  layoutBlock: LayoutBlockRenderer,
  aboutPage: AboutPageRenderer,
  // Equal Columns Section components
  twoEqualColumns: TwoEqualColumnsComponent,
  threeEqualColumns: ThreeEqualColumnsComponent,
  fourEqualColumns: FourEqualColumnsComponent,
  fiveEqualColumns: FiveEqualColumnsComponent,
  sixEqualColumns: SixEqualColumnsComponent,
  // Offset Columns components
  twoThirdsOneThird: TwoThirdsOneThirdComponent,
  oneThirdTwoThirds: OneThirdTwoThirdsComponent,
  oneQuarterThreeQuarters: OneQuarterThreeQuartersComponent,
  threeQuartersOneQuarter: ThreeQuartersOneQuarterComponent,
  // Multi-Column Layout components
  sidebarMainLayout: SidebarMainLayoutComponent,
  mainSidebarLayout: MainSidebarLayoutComponent,
  headerTwoColumnsLayout: HeaderTwoColumnsLayoutComponent,
  headerThreeColumnsLayout: HeaderThreeColumnsLayoutComponent,
  masonryLayout: MasonryLayoutComponent,
  // Multi-Row Columns components
  twoRowsTwoColumns: TwoRowsTwoColumnsComponent,
  twoRowsThreeColumns: TwoRowsThreeColumnsComponent,
  threeRowsTwoColumns: ThreeRowsTwoColumnsComponent,
  threeRowsThreeColumns: ThreeRowsThreeColumnsComponent,
  // Block Type
  blurb: BlurbBlock,
  text: TextBlock,
  toggle: ToggleBlock,
  divider: DividerBlock
};

export const RenderBlocks = ({
  blocks,
  pageId
}: {
  blocks: NonNullable<
    NonNullable<Page["sections"]>[number]["rows"]
  >[number]["Columns"];
  pageId?: string;
}) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <>
        {blocks.map((block, index) => {
          const { blockType } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              // Check if it's a section component
              const isSectionComponent = [
                "twoEqualColumns",
                "threeEqualColumns",
                "fourEqualColumns",
                "fiveEqualColumns",
                "sixEqualColumns",
                "twoThirdsOneThird",
                "oneThirdTwoThirds",
                "oneQuarterThreeQuarters",
                "threeQuartersOneQuarter",
                "sidebarMainLayout",
                "mainSidebarLayout",
                "headerTwoColumnsLayout",
                "headerThreeColumnsLayout",
                "masonryLayout",
                "twoRowsTwoColumns",
                "twoRowsThreeColumns",
                "threeRowsTwoColumns",
                "threeRowsThreeColumns",
              ].includes(blockType as string);

              if (isSectionComponent) {
                // For section components, pass the whole block
                return <Block key={`section-${index}`} {...(block as any)} />;
              } else {
                // For regular blocks
                return (
                  <VisualEditingWrapper
                    key={`block-${index}`}
                    blockType={blockType}
                  >
                    <Block id={pageId} {...(block as any)} />
                  </VisualEditingWrapper>
                );
              }
            }
          }
          return null;
        })}
      </>
    );
  }

  return null;
};


