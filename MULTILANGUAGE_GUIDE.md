# Multi-Language Content Conversion Guide

This guide explains how to handle multi-language content conversion in your KH Foods website.

## Architecture Overview

Your project uses **next-intl** for internationalization with the following setup:

### Supported Languages
- `en` - English (default)
- `zh` - Chinese (繁體中文)
- `hr` - Croatian (Hrvatski)
- `pl` - Polish (Polski)

### File Structure
```
├── src/
│   ├── i18n/
│   │   ├── config.ts          # Locale configuration
│   │   ├── routing.ts         # Route definitions
│   │   └── request.ts         # Request config
│   └── app/
│       └── (frontend)/
│           └── [locale]/      # Dynamic locale routes
└── translations/
    ├── en.json                # English translations
    ├── zh.json                # Chinese translations
    ├── hr.json                # Croatian translations
    └── pl.json                # Polish translations
```

## How It Works

### 1. URL-Based Locale Routing

Your app automatically handles language URLs:
- `/` or `/en` → English (default)
- `/zh` → Chinese
- `/hr` → Croatian
- `/pl` → Polish

All pages are nested under `[locale]` dynamic segment.

### 2. Translation Files

Each language has a JSON file with nested keys:

**Example: `/translations/en.json`**
```json
{
  "Header": {
    "home": "HOME",
    "about": "ABOUT US",
    "products": "PRODUCTS",
    "contact": "CONTACT US",
    "cart": "Cart"
  },
  "ProductDetails": {
    "add-to-cart": "Add to cart",
    "price": "Price",
    "description": "Description"
  }
}
```

**Example: `/translations/zh.json`**
```json
{
  "Header": {
    "home": "首頁",
    "about": "關於我們",
    "products": "產品",
    "contact": "聯繫我們",
    "cart": "購物車"
  },
  "ProductDetails": {
    "add-to-cart": "加入購物車",
    "price": "價格",
    "description": "描述"
  }
}
```

### 3. Using Translations in Components

#### Client Components
```tsx
"use client"
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("Header");
  
  return (
    <nav>
      <a href="/">{t("home")}</a>
      <a href="/about">{t("about")}</a>
      <a href="/products">{t("products")}</a>
    </nav>
  );
}
```

#### Server Components
```tsx
import { getTranslations } from "next-intl/server";

async function MyServerComponent() {
  const t = await getTranslations("ProductDetails");
  
  return (
    <div>
      <h1>{t("title")}</h1>
      <button>{t("add-to-cart")}</button>
    </div>
  );
}
```

#### Getting Current Locale
```tsx
// Client Component
import { useLocale } from "next-intl";

function MyComponent() {
  const locale = useLocale(); // "en", "zh", etc.
}

// Server Component
import { getLocale } from "next-intl/server";

async function MyComponent() {
  const locale = await getLocale();
}
```

### 4. Language Switcher Component

You already have a `LocaleSwitch` component at `/src/components/LocaleSwitch/LocaleSwitch.tsx`:

```tsx
import { LocaleSwitch } from "@/components/LocaleSwitch/LocaleSwitch";

function Header() {
  return (
    <header>
      {/* Other header content */}
      <LocaleSwitch />
    </header>
  );
}
```

This component:
- Displays current language
- Shows dropdown with all available languages
- Automatically updates URL and reloads content
- Preserves current page path

### 5. Navigation with Locale

Use the special Link component from `@/i18n/routing`:

```tsx
import { Link } from "@/i18n/routing";

function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/products">Products</Link>
    </nav>
  );
}
```

This Link component automatically prefixes URLs with the current locale.

## Implementation Steps

### Step 1: Add Translation Keys

1. Open `/translations/en.json`
2. Add your content keys:
```json
{
  "Header": {
    "home": "HOME",
    "about": "ABOUT US",
    "products": "PRODUCTS",
    "contact": "CONTACT US",
    "store-locator": "STORE LOCATOR",
    "wholesale": "WHOLESALE",
    "free-shipping": "FREE SHIPPING WITHIN US",
    "my-account": "My Account",
    "languages": "Languages"
  }
}
```

3. Add corresponding translations in other language files

### Step 2: Update Your Components

Replace hardcoded strings with translation functions:

**Before:**
```tsx
<span>FREE SHIPPING WITHIN US</span>
```

**After:**
```tsx
const t = useTranslations("Header");
<span>{t("free-shipping")}</span>
```

### Step 3: Add Language Switcher

Replace your current language dropdown with the `LocaleSwitch` component.

### Step 4: Update Links

Replace `<a>` tags with `<Link>` from `@/i18n/routing`:

**Before:**
```tsx
<a href="/about">About</a>
```

**After:**
```tsx
import { Link } from "@/i18n/routing";
<Link href="/about">About</Link>
```

## Advanced Features

### Dynamic Values in Translations

```json
{
  "Cart": {
    "items-count": "You have {count} items"
  }
}
```

```tsx
const t = useTranslations("Cart");
<p>{t("items-count", { count: 5 })}</p>
// Output: "You have 5 items"
```

### Pluralization

```json
{
  "Cart": {
    "items": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
  }
}
```

### Rich Text

```tsx
const t = useTranslations("Header");
<p>{t.rich("welcome", {
  strong: (chunks) => <strong>{chunks}</strong>
})}</p>
```

## Best Practices

1. **Organize Keys**: Group related translations under namespaces
2. **Consistent Naming**: Use lowercase with hyphens (e.g., `add-to-cart`)
3. **Default Values**: Always provide English translations first
4. **Testing**: Test all languages before deployment
5. **Dynamic Content**: For CMS content, store translations in database
6. **SEO**: Use `lang` attribute in HTML (already configured)

## Current Status in Your Project

✅ **Already Configured:**
- next-intl setup
- Route structure with `[locale]`
- LocaleSwitch component
- Translation files for en, zh, hr, pl

❌ **Need to Update:**
- Header component (using hardcoded text)
- Other components with static text
- Menu items and navigation
- Add more translation keys

## Testing

1. Start dev server: `pnpm dev`
2. Navigate to different locales:
   - `http://localhost:3000/` (English - default)
   - `http://localhost:3000/zh` (Chinese)
   - `http://localhost:3000/hr` (Croatian)
3. Use language switcher to change languages
4. Verify translations appear correctly

## Troubleshooting

**Issue**: Translations not showing
- Check translation key exists in JSON file
- Verify namespace matches (e.g., "Header", "ProductDetails")
- Check console for errors

**Issue**: Language switcher not working
- Verify routing.ts configuration
- Check locale files exist in translations folder
- Ensure middleware.ts is configured

**Issue**: Wrong locale displayed
- Check URL has correct locale prefix
- Clear browser cache
- Verify locale detection in config
