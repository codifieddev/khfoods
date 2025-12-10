# Database Content Localization Guide

## Overview

For dynamic content from your database (like category names, product descriptions, etc.), you need to store translations **in the database** itself, not in translation JSON files.

## How It Works

### 1. Field Configuration with `localized: true`

In your Payload collection config:

```typescript
// src/collections/Categories.ts
export const Categories: CollectionConfig = {
  slug: "categories",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,  // ✅ This enables multi-language for this field
    },
  ],
};
```

### 2. Database Storage Structure

When `localized: true` is set, Payload stores the field like this:

```json
{
  "id": "123",
  "title": {
    "en": "Electronics",
    "zh": "電子產品",
    "hr": "Elektronika",
    "pl": "Elektronika"
  },
  "slug": "electronics"
}
```

### 3. Automatic Resolution in Components

When you query data with the correct locale, Payload automatically returns the right translation:

```typescript
// Server Component
import { getLocale } from "next-intl/server";

const locale = await getLocale(); // "en" or "zh"

// When you fetch category with locale context
const category = await payload.find({
  collection: "categories",
  locale: locale, // Pass current locale
});

// category.title will be "Electronics" for en or "電子產品" for zh
```

## Pattern 1: Server Component with Database Content

```tsx
import { getLocale, getTranslations } from "next-intl/server";

export async function CategoryPage({ params }) {
  const locale = await getLocale();
  const t = await getTranslations("Category");
  
  // Fetch with locale
  const category = await payload.findByID({
    collection: "categories",
    id: params.id,
    locale: locale,
  });
  
  return (
    <div>
      <h1>{category.title}</h1> {/* Auto-translated based on locale */}
      <p>{t("description")}</p> {/* From JSON translation files */}
    </div>
  );
}
```

## Pattern 2: Ensuring Data is Fetched with Locale

Make sure your data fetching functions accept and use locale:

```typescript
// utilities/getCategory.ts
export async function getCategory(slug: string, locale: string) {
  const category = await payload.find({
    collection: "categories",
    where: {
      slug: { equals: slug }
    },
    locale: locale, // ✅ Pass locale here
  });
  
  return category.docs[0];
}

// In your page
const locale = await getLocale();
const category = await getCategory("electronics", locale);
```

## Pattern 3: Mixed Static and Dynamic Content

```tsx
import { getTranslations } from "next-intl/server";

export async function ProductCard({ product }) {
  const t = await getTranslations("Products");
  
  return (
    <div>
      {/* Dynamic from database (auto-translated) */}
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      
      {/* Static from translation files */}
      <button>{t("add-to-cart")}</button>
      <span>{t("price")}: ${product.price}</span>
    </div>
  );
}
```

## When to Use Each Approach

### Use JSON Translation Files (`translations/en.json`):
✅ Static UI text (buttons, labels, menus)
✅ Error messages
✅ Form placeholders
✅ Navigation items
✅ Common phrases

**Example:**
```json
{
  "Header": {
    "home": "HOME",
    "about": "ABOUT US"
  }
}
```

### Use Database with `localized: true`:
✅ Product names
✅ Product descriptions
✅ Category titles
✅ Blog post content
✅ Page content (CMS)
✅ User-generated content

**Example:**
```typescript
{
  name: "title",
  type: "text",
  localized: true, // Stores: { en: "...", zh: "...", hr: "..." }
}
```

## Adding Localization to Existing Collections

### Step 1: Update Collection Config

```typescript
// src/collections/Products.ts
export const Products: CollectionConfig = {
  slug: "products",
  fields: [
    {
      name: "name",
      type: "text",
      localized: true, // ✅ Add this
    },
    {
      name: "description",
      type: "textarea",
      localized: true, // ✅ Add this
    },
    {
      name: "price",
      type: "number",
      // ❌ Don't localize numbers/prices
    },
    {
      name: "sku",
      type: "text",
      // ❌ Don't localize SKUs
    },
  ],
};
```

### Step 2: Update Existing Data

After adding `localized: true`, you need to update existing data:

**Option A: Manual via Admin Panel**
1. Go to each record
2. Add translations for each language
3. Save

**Option B: Migration Script**
```typescript
// scripts/migrateToLocalized.ts
import payload from "payload";

async function migrate() {
  const products = await payload.find({
    collection: "products",
    limit: 1000,
  });
  
  for (const product of products.docs) {
    await payload.update({
      collection: "products",
      id: product.id,
      data: {
        name: {
          en: product.name, // Existing value becomes English
          zh: product.name, // Set same for now, update later
        },
      },
    });
  }
}
```

### Step 3: Update Type Definitions

Regenerate Payload types:
```bash
pnpm payload generate:types
```

## Common Patterns

### Pattern 1: Fallback to English

If a translation is missing, show English:

```tsx
export function CategoryName({ category }) {
  const locale = await getLocale();
  
  // If title is object (localized), get specific language
  const title = typeof category.title === 'object' 
    ? (category.title[locale] || category.title.en)
    : category.title;
  
  return <h1>{title}</h1>;
}
```

### Pattern 2: Rich Text Content

For rich text editors:

```typescript
{
  name: "content",
  type: "richText",
  localized: true, // ✅ Entire rich text content per language
}
```

### Pattern 3: Conditional Fields Based on Locale

```typescript
{
  name: "promotionBanner",
  type: "text",
  localized: true,
  admin: {
    condition: (data, siblingData, { locale }) => {
      // Only show for Chinese locale
      return locale === 'zh';
    },
  },
}
```

## Client Components with Database Content

If you need database content in a client component, pass it as props:

```tsx
// Server Component (page.tsx)
export default async function Page() {
  const locale = await getLocale();
  const category = await getCategory("electronics", locale);
  
  return <CategoryDisplay category={category} />;
}

// Client Component
"use client"
export function CategoryDisplay({ category }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <h1>{category.title}</h1> {/* Already translated */}
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
    </div>
  );
}
```

## Querying with Locale in API Routes

```typescript
// app/api/categories/route.ts
import { getLocale } from "next-intl/server";

export async function GET(request: Request) {
  const locale = await getLocale();
  
  const categories = await payload.find({
    collection: "categories",
    locale: locale, // ✅ Important!
  });
  
  return Response.json(categories);
}
```

## Testing Localized Content

### Test 1: Check Database Structure
```javascript
// In Payload admin
console.log(category.title);
// Should see: { en: "Electronics", zh: "電子產品" }
```

### Test 2: Verify Locale Context
```tsx
const locale = await getLocale();
console.log(locale); // Should match URL locale
```

### Test 3: Test Each Language
1. Visit `/en/category/electronics` → Should show "Electronics"
2. Visit `/zh/category/electronics` → Should show "電子產品"

## Summary

**For Static UI Text:**
- Use `translations/en.json`, `translations/zh.json`
- Use `useTranslations()` (client) or `getTranslations()` (server)

**For Dynamic Database Content:**
- Add `localized: true` to field config
- Always pass `locale` when querying
- Content auto-resolves to correct language

**Your breadcrumb example:**
```tsx
// "Products" → from translations/en.json (static UI)
{t("products")} 

// "Electronics" → from database (dynamic content)
{category.title}
```

Both work together seamlessly! 🌍
