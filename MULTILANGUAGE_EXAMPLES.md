# Multi-Language Implementation Examples

## Quick Start Guide

### Example 1: Simple Component with Translations

```tsx
"use client"
import { useTranslations } from "next-intl";

export function WelcomeSection() {
  const t = useTranslations("HomePage");
  
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("about")}</p>
    </div>
  );
}
```

### Example 2: Server Component with Translations

```tsx
import { getTranslations } from "next-intl/server";

export default async function ProductPage() {
  const t = await getTranslations("ProductDetails");
  
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <button>{t("add-to-cart")}</button>
    </div>
  );
}
```

### Example 3: Navigation with Locale-aware Links

```tsx
import { Link } from "@/i18n/routing";

export function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/products">Products</Link>
    </nav>
  );
}
```

### Example 4: Getting Current Locale

```tsx
"use client"
import { useLocale } from "next-intl";

export function LocaleDisplay() {
  const locale = useLocale();
  
  return <p>Current language: {locale}</p>;
}
```

### Example 5: Language Switcher

```tsx
import { LocaleSwitch } from "@/components/LocaleSwitch/LocaleSwitch";

export function Header() {
  return (
    <header>
      <nav>{/* Navigation items */}</nav>
      <LocaleSwitch />
    </header>
  );
}
```

### Example 6: Dynamic Translation Values

**In translations/en.json:**
```json
{
  "Cart": {
    "items-count": "You have {count} items in your cart",
    "total": "Total: ${amount}"
  }
}
```

**In component:**
```tsx
"use client"
import { useTranslations } from "next-intl";

export function CartSummary({ itemCount, total }) {
  const t = useTranslations("Cart");
  
  return (
    <div>
      <p>{t("items-count", { count: itemCount })}</p>
      <p>{t("total", { amount: total })}</p>
    </div>
  );
}
```

### Example 7: Conditional Translations

```tsx
"use client"
import { useTranslations } from "next-intl";

export function ProductStatus({ inStock }) {
  const t = useTranslations("ProductDetails");
  
  return (
    <div>
      {inStock ? (
        <button>{t("add-to-cart")}</button>
      ) : (
        <p>{t("product-unavailable")}</p>
      )}
    </div>
  );
}
```

## How to Update Your Existing Header

### Step 1: Replace the old Header import

**Before:**
```tsx
import Header from "@/components/Header";
```

**After:**
```tsx
import HeaderWithI18n from "@/components/HeaderWithI18n";
```

### Step 2: Use it in your layout

```tsx
export default function Layout({ children }) {
  return (
    <>
      <HeaderWithI18n />
      {children}
    </>
  );
}
```

## Testing Multi-Language

### Test URLs:
- English (default): `http://localhost:3000/`
- Chinese: `http://localhost:3000/zh`
- Croatian: `http://localhost:3000/hr`
- Polish: `http://localhost:3000/pl`

### Test Language Switching:
1. Start on English homepage
2. Click language dropdown in header
3. Select "繁體中文" (Chinese)
4. Page should reload with Chinese translations
5. URL should change to `/zh`

## Common Patterns

### Pattern 1: Form with Translations

```tsx
"use client"
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  
  return (
    <form>
      <label>{t("name")}</label>
      <input type="text" placeholder={t("name-placeholder")} />
      
      <label>{t("email")}</label>
      <input type="email" placeholder={t("email-placeholder")} />
      
      <label>{t("message")}</label>
      <textarea placeholder={t("message-placeholder")} />
      
      <button type="submit">{t("submit")}</button>
    </form>
  );
}
```

### Pattern 2: Error Messages

```tsx
"use client"
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("LoginForm");
  const [error, setError] = useState(null);
  
  return (
    <form>
      {error && <p className="error">{t(`errors.${error}`)}</p>}
      <input type="email" placeholder={t("email")} />
      <input type="password" placeholder={t("password")} />
      <button>{t("submit")}</button>
    </form>
  );
}
```

### Pattern 3: SEO with Translations

```tsx
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const t = await getTranslations("Metadata");
  
  return {
    title: t("title"),
    description: t("description"),
  };
}
```

## Adding New Translation Keys

### Step 1: Add to English file
```json
// translations/en.json
{
  "NewSection": {
    "title": "Welcome",
    "subtitle": "This is a new section"
  }
}
```

### Step 2: Add to all other language files
```json
// translations/zh.json
{
  "NewSection": {
    "title": "歡迎",
    "subtitle": "這是一個新區塊"
  }
}
```

### Step 3: Use in component
```tsx
const t = useTranslations("NewSection");
<h1>{t("title")}</h1>
```

## Best Practices Checklist

- ✅ Use `useTranslations()` for client components
- ✅ Use `getTranslations()` for server components
- ✅ Use `Link` from `@/i18n/routing` instead of `next/link`
- ✅ Group related translations under namespaces
- ✅ Always add translations for all supported languages
- ✅ Use lowercase-with-hyphens for translation keys
- ✅ Test language switching between all locales
- ✅ Use `LocaleSwitch` component for language selection
- ✅ Keep translation files organized and consistent
