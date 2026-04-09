import type { RichTextState } from "@/types/richtext";

export type CMSIdentifier = string;
export type CMSCurrency = "USD" | "EUR" | "GBP" | "PLN" | string;

export type RichTextContent = RichTextState | null;

export type CMSLinkReference =
  | {
      relationTo?: string | null;
      value?: string | number | any | null;
    }
  | null;

export type Field = {
  name?: string;
  type: string;
  localized?: boolean;
  defaultValue?: any;
  relationTo?: string;
  tabs?: any[];
  fields?: any[];
  blocks?: any[];
  [key: string]: any;
};

export type Block = {
  slug: string;
  fields: Field[];
  labels?: {
    singular?: string | Record<string, string>;
    plural?: string | Record<string, string>;
  };
  [key: string]: any;
};

export type CollectionConfig = {
  slug: string;
  fields: Field[];
  labels?: {
    singular?: string | Record<string, string>;
    plural?: string | Record<string, string>;
  };
  [key: string]: any;
};

export type CMSLinkData = {
  appearance?: string | null;
  label?: string;
  newTab?: boolean | null;
  reference?: CMSLinkReference;
  type?: "reference" | "custom" | string | null;
  url?: string | null;
  [key: string]: any;
};

export interface Media {
  id: CMSIdentifier;
  alt?: string | null;
  caption?: RichTextContent;
  createdAt?: string | null;
  filename?: string | null;
  filesize?: number | null;
  focalX?: number | null;
  focalY?: number | null;
  height?: number | null;
  mimeType?: string | null;
  sizes?: Record<string, { height?: number | null; mimeType?: string | null; url?: string | null; width?: number | null } | null>;
  thumbnailURL?: string | null;
  updatedAt?: string | null;
  url?: string | null;
  width?: number | null;
  [key: string]: any;
}

export interface Meta {
  description?: string | null;
  image?: Media | string | null;
  title?: string | null;
  [key: string]: any;
}

export interface Category {
  id: CMSIdentifier;
  createdAt?: string | null;
  slug?: string | null;
  title: string;
  updatedAt?: string | null;
  [key: string]: any;
}

export interface PopulatedAuthor {
  id?: string | null;
  name?: string | null;
  [key: string]: any;
}

export interface Post {
  id: CMSIdentifier;
  authors?: (Administrator | string)[] | null;
  categories?: (Category | string)[] | null;
  content?: RichTextContent;
  createdAt?: string | null;
  heroImage?: Media | string | null;
  meta?: Meta;
  populatedAuthors?: PopulatedAuthor[] | null;
  publishedAt?: string | null;
  relatedPosts?: (Post | string)[] | null;
  slug?: string | null;
  title: string;
  updatedAt?: string | null;
  _status?: "draft" | "published" | string | null;
  [key: string]: any;
}

export interface Page {
  id: CMSIdentifier;
  Code?: string;
  createdAt?: string | null;
  hero?: any | null;
  layout?: unknown[] | null;
  meta?: Meta;
  section?: unknown[] | null;
  slug?: string | string[] | null;
  title: string;
  updatedAt?: string | null;
  [key: string]: any;
}

export interface Header {
  id: CMSIdentifier;
  background?: string | null;
  hideOnScroll?: boolean | null;
  logo?: Media | string | null;
  navItems?: { id?: string | null; link?: CMSLinkData }[] | null;
  type?: "default" | "floating" | string | null;
  [key: string]: any;
}

export interface Footer {
  id: CMSIdentifier;
  [key: string]: any;
}

export interface EmailMessage {
  id: CMSIdentifier;
  messages?: {
    additionalText?: string | null;
    logo?: Media | string | null;
    template?: "default" | "template 1" | null;
    [key: string]: any;
  };
  smtp?: SMTPSettings | null;
  [key: string]: any;
}

export interface SMTPSettings {
  fromEmail: string;
  host: string;
  password: string;
  port: number;
  secure: boolean;
  user: string;
  [key: string]: any;
}

export interface CourierPricing {
  currency: CMSCurrency;
  id?: string | null;
  value: number;
  [key: string]: any;
}

export interface CourierDeliveryRange {
  height?: number | null;
  id?: string | null;
  length?: number | null;
  pricing: CourierPricing[];
  weightFrom: number;
  weightTo: number;
  width?: number | null;
  [key: string]: any;
}

export interface CourierFreeShipping {
  currency: CMSCurrency;
  id?: string | null;
  value: number;
  [key: string]: any;
}

export interface CourierDeliveryZone {
  countries: string[];
  freeShipping?: CourierFreeShipping[] | null;
  id?: string | null;
  range?: CourierDeliveryRange[] | null;
  [key: string]: any;
}

export interface CourierGlobal {
  APIUrl?: string | null;
  createdAt?: string | null;
  deliveryZones?: CourierDeliveryZone[] | null;
  enabled?: boolean | null;
  icon?: Media | string | null;
  id: CMSIdentifier;
  settings: {
    description?: string | null;
    label: string;
    [key: string]: any;
  };
  updatedAt?: string | null;
  [key: string]: any;
}

export interface InpostCourier extends CourierGlobal {}

export interface InpostCourierCod extends CourierGlobal {}

export interface FulfilmentAddress {
  address: string;
  city: string;
  country: string;
  email: string;
  name: string;
  phone: string;
  postalCode: string;
  region: string;
  [key: string]: any;
}

export interface Fulfilment {
  id: CMSIdentifier;
  shopAddress?: FulfilmentAddress | null;
  [key: string]: any;
}

export interface CurrencyValue {
  currency: CMSCurrency;
  id?: string | null;
  value: number;
}

export interface ShopSetting {
  id: CMSIdentifier;
  availableCurrencies: CMSCurrency[];
  currencyValues?: CurrencyValue[] | null;
  enableOAuth: boolean;
  [key: string]: any;
}

export interface ShopLayout {
  id: CMSIdentifier;
  productDetails: {
    reviewsEnabled: boolean;
    type: "WithImageGalleryExpandableDetails" | string;
  };
  productList?: {
    filters?: "none" | "withSidebar" | "sortOnly" | string | null;
  };
  cartAndWishlist: {
    type: "slideOver" | string;
  };
  checkout: {
    type: "OneStepWithSummary" | string;
  };
  clientPanel: {
    help?: {
      content?: RichTextContent;
      title?: string | null;
      [key: string]: any;
    };
    type: "withSidebar" | string;
  };
  [key: string]: any;
}

export interface Sitesetting {
  id: CMSIdentifier;
  backgroundColor?: string;
  backgroundSecondary?: string;
  backgroundTertiary?: string;
  borderColor?: string;
  errorColor?: string;
  favicon?: Media | string | null;
  fontMonospace?: string;
  fontPrimary?: string;
  fontSecondary?: string;
  fontSizeBase?: number;
  fontSizeH1?: number;
  fontSizeH2?: number;
  fontSizeH3?: number;
  fontSizeH4?: number;
  fontSizeH5?: number;
  fontSizeH6?: number;
  fontSizeLarge?: number;
  fontSizeSmall?: number;
  fontWeightBold?: number;
  fontWeightLight?: number;
  fontWeightMedium?: number;
  fontWeightNormal?: number;
  fontWeightSemibold?: number;
  infoColor?: string;
  letterSpacingNormal?: string;
  letterSpacingWide?: string;
  lineHeightBase?: number | string;
  lineHeightHeading?: number | string;
  logo?: Media | string | null;
  logoDark?: Media | string | null;
  logoLight?: Media | string | null;
  primaryColor?: string;
  primaryHover?: string;
  primaryLight?: string;
  secondaryColor?: string;
  secondaryHover?: string;
  secondaryLight?: string;
  shadowColor?: string;
  siteicon?: Media | string | null;
  sitetitle?: string | null;
  successColor?: string;
  tagline?: string | null;
  tertiaryColor?: string;
  tertiaryHover?: string;
  tertiaryLight?: string;
  textLink?: string;
  textLinkHover?: string;
  textMuted?: string;
  textPrimary?: string;
  textSecondary?: string;
  warningColor?: string;
  [key: string]: any;
}

export interface PaymentStripeSettings {
  public?: string;
  secret?: string;
  webhookSecret?: string;
  [key: string]: any;
}

export interface PaymentAutopaySettings {
  endpoint: string;
  hashKey: string;
  serviceID: string;
  [key: string]: any;
}

export interface PaymentP24Settings {
  crc: string;
  endpoint: string;
  posId: string;
  secretId: string;
  [key: string]: any;
}

export interface Payment {
  id: CMSIdentifier;
  autopay?: PaymentAutopaySettings | null;
  paywall?: "stripe" | "autopay" | "p24" | string | null;
  p24?: PaymentP24Settings | null;
  stripe?: PaymentStripeSettings | null;
  [key: string]: any;
}

export interface ProductOption {
  id?: string | null;
  label: string;
  slug: string;
  colorValue?: string | null;
  [key: string]: any;
}

export interface PricingEntry {
  currency: CMSCurrency;
  id?: string | null;
  value: number;
  [key: string]: any;
}

export interface ProductCategory {
  id: CMSIdentifier;
  createdAt?: string | null;
  image?: Media | string | null;
  slug?: string | null;
  subcategories?:
    | {
        docs?: (ProductSubCategory | string)[];
        hasNextPage?: boolean;
        totalDocs?: number;
        [key: string]: any;
      }
    | null;
  title: string;
  updatedAt?: string | null;
  [key: string]: any;
}

export interface ProductSubCategory {
  id: CMSIdentifier;
  category?: ProductCategory | string | null;
  createdAt?: string | null;
  slug?: string | null;
  title: string;
  updatedAt?: string | null;
  [key: string]: any;
}

export interface ProductVariant {
  color?: string | null;
  id?: string | null;
  image?: Media | string | null;
  pricing?: PricingEntry[] | null;
  size?: string | null;
  stock: number;
  variantSlug?: string | null;
  weight?: number | null;
  [key: string]: any;
}

export interface ProductCategoryRelation {
  category: ProductCategory | string;
  id?: string | null;
  subcategories?: (ProductSubCategory | string)[] | null;
  [key: string]: any;
}

export interface ProductDetailItem {
  content: RichTextContent;
  id?: string | null;
  title: string;
  [key: string]: any;
}

export interface Product {
  id: CMSIdentifier;
  Highlight?: string | null;
  bought?: number | null;
  categoriesArr?: ProductCategoryRelation[] | null;
  colors?: ProductOption[] | null;
  createdAt?: string | null;
  description?: RichTextContent;
  details?: ProductDetailItem[] | null;
  enableVariantPrices?: boolean | null;
  enableVariantWeights?: boolean | null;
  enableVariants?: boolean | null;
  images: (Media | string)[];
  meta?: Meta;
  pricing?: PricingEntry[] | null;
  sizes?: ProductOption[] | null;
  slug?: string | null;
  stock?: number | null;
  title: string;
  updatedAt?: string | null;
  variants?: ProductVariant[] | null;
  variantsType?: "sizes" | "colors" | "colorsAndSizes" | string | null;
  weight?: number | null;
  _status?: "draft" | "published" | string | null;
  [key: string]: any;
}

export interface Address {
  address: string;
  city: string;
  country: string;
  email: string;
  name: string;
  phone: string;
  postalCode: string;
  region: string;
  [key: string]: any;
}

export interface CustomerShipping extends Address {
  default?: boolean | null;
  id?: string | null;
}

export interface CustomerSession {
  createdAt?: string | null;
  expiresAt: string;
  id: string;
  [key: string]: any;
}

export interface Customer {
  id: CMSIdentifier;
  _sid?: string;
  _strategy?: "local-jwt";
  _verificationToken?: string | null;
  _verified?: boolean | null;
  birthDate?: string | null;
  cart?: string | null;
  collection?: "customers";
  createdAt?: string | null;
  email: string;
  firstName?: string | null;
  fullName?: string | null;
  hash?: string | null;
  lastBuyerType?: string | null;
  lastName?: string | null;
  lockUntil?: string | null;
  loginAttempts?: number | null;
  name?: string | null;
  resetPasswordExpiration?: string | null;
  resetPasswordToken?: string | null;
  salt?: string | null;
  sessions?: CustomerSession[] | null;
  shippings?: CustomerShipping[] | null;
  updatedAt?: string | null;
  wishlist?: string | null;
  [key: string]: any;
}

export interface AdministratorSession {
  createdAt?: string | null;
  expiresAt: string;
  id: string;
  [key: string]: any;
}

export interface Administrator {
  id: CMSIdentifier;
  _sid?: string;
  _strategy?: "local-jwt";
  collection?: "administrators";
  createdAt?: string | null;
  email: string;
  firstName?: string | null;
  fullName?: string | null;
  hash?: string | null;
  lastName?: string | null;
  lockUntil?: string | null;
  loginAttempts?: number | null;
  name?: string | null;
  resetPasswordExpiration?: string | null;
  resetPasswordToken?: string | null;
  salt?: string | null;
  sessions?: AdministratorSession[] | null;
  updatedAt?: string | null;
  [key: string]: any;
}

export interface InvoiceAddress extends Address {
  isCompany?: boolean | null;
  tin?: string | null;
}

export interface OrderProduct {
  color?: string | null;
  hasVariant?: boolean | null;
  id?: string | null;
  isFromAPI: boolean;
  price?: number | null;
  priceTotal?: number | null;
  product?: Product | string | null;
  productName?: string | null;
  quantity?: number | null;
  size?: string | null;
  variantSlug?: string | null;
  [key: string]: any;
}

export interface PrintLabel {
  labelurl?: string | null;
  packageNumber?: string | null;
  weight?: number | null;
  [key: string]: any;
}

export interface OrderDetails {
  amountPaid?: number | null;
  currency: CMSCurrency;
  orderNote?: string | null;
  shipping?: string | null;
  shippingCost?: number | null;
  shippingDate?: string | null;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled" | string;
  total: number;
  totalWithShipping: number;
  trackingNumber?: string | null;
  transactionID?: string | null;
  [key: string]: any;
}

export interface Order extends Record<string, unknown> {
  createdAt?: string | null;
  customer?: Customer | string | null;
  date?: string;
  extractedFromStock?: boolean;
  id: CMSIdentifier;
  invoice?: InvoiceAddress | null;
  orderDetails: OrderDetails;
  printLabel?: PrintLabel | null;
  products?: OrderProduct[] | null;
  shippingAddress: Address & {
    pickupPointAddress?: string | null;
    pickupPointID?: string | null;
  };
  updatedAt?: string | null;
}

export interface Redirect {
  id: CMSIdentifier;
  from?: string | null;
  to?: {
    reference?: {
      relationTo?: "pages" | "posts" | string | null;
      value?: Page | Post | string | null;
    } | null;
    url?: string | null;
    [key: string]: any;
  } | null;
  [key: string]: any;
}

export interface Website {
  id: CMSIdentifier;
  domains?: { domain?: string | null; [key: string]: any }[] | null;
  [key: string]: any;
}

export interface AccordionBlock {
  items?:
    | {
        content?: RichTextContent;
        id?: string | null;
        title?: string | null;
      }[]
    | null;
  [key: string]: any;
}

export interface BannerBlock {
  content?: RichTextContent;
  style?: "info" | "warning" | "error" | "success" | string | null;
  [key: string]: any;
}

export interface CallToActionBlock {
  links?:
    | {
        id?: string | null;
        link?: any;
      }[]
    | null;
  paddingBottom?: string | null;
  paddingTop?: string | null;
  richText?: RichTextContent;
  spacingBottom?: string | null;
  spacingTop?: string | null;
  [key: string]: any;
}

export interface CarouselBlock {
  blockName?: string | null;
  items?: any[] | null;
  [key: string]: any;
}

export interface ContentBlock {
  alignment?: "left" | "center" | "right" | "full" | string | null;
  background?: string | null;
  blockName?: string | null;
  columns?:
    | {
        background?: string | null;
        enableLink?: boolean | null;
        enableProse?: boolean | null;
        id?: string | null;
        link?: any;
        paddingBottom?: string | null;
        paddingTop?: string | null;
        richText?: RichTextContent;
        size?: "oneSixth" | "oneThird" | "half" | "twoThirds" | "fiveSixth" | "full" | string | null;
      }[]
    | null;
  paddingBottom?: string | null;
  paddingTop?: string | null;
  radius?: boolean | null;
  radiusAll?: string | null;
  radiusBottomLeft?: string | null;
  radiusBottomRight?: string | null;
  radiusTopLeft?: string | null;
  radiusTopRight?: string | null;
  spacingBottom?: string | null;
  spacingTop?: string | null;
  specifiedRadius?: boolean | null;
  [key: string]: any;
}

export interface MediaBlock {
  media?: Media | string | null;
  paddingBottom?: string | null;
  paddingTop?: string | null;
  spacingBottom?: string | null;
  spacingTop?: string | null;
  [key: string]: any;
}

export interface ArchiveBlock {
  blockName?: string | null;
  categories?: (Category | string)[] | null;
  introContent?: RichTextContent;
  limit?: number | null;
  populateBy?: "collection" | "selection" | string | null;
  relationTo?: "posts" | string | null;
  selectedDocs?:
    | {
        value?: Post | string | null;
        id?: string | null;
      }[]
    | null;
  [key: string]: any;
}

export interface AppCollectionsMap {
  administrators: Administrator;
  categories: Category;
  customers: Customer;
  media: Media;
  orders: Order;
  pages: Page;
  posts: Post;
  productCategories: ProductCategory;
  productSubCategories: ProductSubCategory;
  products: Product;
  redirects: Redirect;
  websites: Website;
}

export interface AppGlobalsMap {
  emailMessages: EmailMessage;
  footer: Footer;
  fulfilment: Fulfilment;
  header: Header;
  "inpost-courier": InpostCourier;
  "inpost-courier-cod": InpostCourierCod;
  shopLayout: ShopLayout;
  shopSettings: ShopSetting;
  sitesetting: Sitesetting;
}
