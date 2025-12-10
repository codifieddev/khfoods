# Dynamic URLs with Multi-Language Support

## Overview

When implementing multi-language support, URLs automatically adapt to the current locale. Here's how to handle dynamic URLs properly in your application.

## URL Structure

Your app automatically handles locale prefixes:

```
English (default):  /about              or  /en/about
Chinese:           /zh/about
Croatian:          /hr/about
Polish:            /pl/about

With dynamic params:
English:           /product/123         or  /en/product/123
Chinese:           /zh/product/123
Croatian:          /hr/product/123
```

## Key Principle: Always Use `Link` from `@/i18n/routing`

❌ **NEVER use:**
```tsx
import Link from "next/link";  // This won't handle locales!

<Link href="/products">Products</Link>
// URL: /products (no locale prefix)
```

✅ **ALWAYS use:**
```tsx
import { Link } from "@/i18n/routing";  // Locale-aware routing

<Link href="/products">Products</Link>
// English: /products or /en/products
// Chinese: /zh/products
```

## Methods for Handling Dynamic URLs

### Method 1: Template Literals in href (Recommended)

```tsx
import { Link } from "@/i18n/routing";

export function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      {product.name}
    </Link>
  );
}

// Current locale: en → /product/123
// Current locale: zh → /zh/product/123
```

### Method 2: Object Syntax with pathname and params

```tsx
import { Link } from "@/i18n/routing";

export function CategoryLink({ category }) {
  return (
    <Link 
      href={{
        pathname: '/category/[slug]',
        params: { slug: category.slug }
      }}
    >
      {category.name}
    </Link>
  );
}
```

### Method 3: Programmatic Navigation with useRouter

```tsx
"use client"
import { useRouter } from "@/i18n/routing";

export function ProductButton({ productId }) {
  const router = useRouter();
  
  const handleClick = () => {
    // Automatically includes current locale
    router.push(`/product/${productId}`);
  };
  
  return <button onClick={handleClick}>View Product</button>;
}

// Current locale: en → navigates to /product/123
// Current locale: zh → navigates to /zh/product/123
```

### Method 4: Navigation with Query Parameters

```tsx
import { Link } from "@/i18n/routing";

export function FilterLink({ category, color }) {
  return (
    <Link 
      href={{
        pathname: '/products',
        query: { category, color }
      }}
    >
      Filter Products
    </Link>
  );
}

// English: /products?category=shoes&color=red
// Chinese: /zh/products?category=shoes&color=red
```

## Real-World Examples

### Example 1: Product Listing with Categories

```tsx
"use client"
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function ProductList({ products, category }) {
  const t = useTranslations("Products");
  
  return (
    <div>
      <h1>{t("category")}: {category.name}</h1>
      
      {products.map((product) => (
        <Link 
          key={product.id}
          href={`/category/${category.slug}/product/${product.slug}`}
          className="product-card"
        >
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.price}</p>
        </Link>
      ))}
    </div>
  );
}

// English:  /category/electronics/product/laptop
// Chinese:  /zh/category/electronics/product/laptop
```

### Example 2: Breadcrumbs with Dynamic URLs

```tsx
import { Link } from "@/i18n/routing";

export function Breadcrumbs({ category, subcategory, product }) {
  return (
    <nav>
      <Link href="/">Home</Link>
      {' > '}
      <Link href={`/category/${category.slug}`}>
        {category.name}
      </Link>
      
      {subcategory && (
        <>
          {' > '}
          <Link href={`/category/${category.slug}/${subcategory.slug}`}>
            {subcategory.name}
          </Link>
        </>
      )}
      
      {product && (
        <>
          {' > '}
          <span>{product.name}</span>
        </>
      )}
    </nav>
  );
}

// English:  Home > Electronics > Laptops > MacBook Pro
// Chinese:  /zh 首頁 > /zh/category/electronics 電子產品 > ...
```

### Example 3: Search with Dynamic Filters

```tsx
"use client"
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    
    // Automatically maintains current locale
    router.push(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div>
      <select onChange={(e) => updateFilter('category', e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
      </select>
      
      <select onChange={(e) => updateFilter('sort', e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
      </select>
    </div>
  );
}

// English:  /search?category=electronics&sort=price-low
// Chinese:  /zh/search?category=electronics&sort=price-low
```

### Example 4: User Profile with Dynamic Username

```tsx
import { Link } from "@/i18n/routing";

export function UserCard({ user }) {
  return (
    <div>
      <Link href={`/user/${user.username}`}>
        <img src={user.avatar} alt={user.name} />
        <h3>{user.name}</h3>
      </Link>
      
      <Link href={`/user/${user.username}/posts`}>
        View Posts
      </Link>
    </div>
  );
}

// English:  /user/john-doe
// Chinese:  /zh/user/john-doe
```

### Example 5: Blog Post with Date-based URLs

```tsx
import { Link } from "@/i18n/routing";

export function BlogPostCard({ post }) {
  const date = new Date(post.publishedAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  return (
    <Link href={`/blog/${year}/${month}/${post.slug}`}>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
    </Link>
  );
}

// English:  /blog/2025/12/my-article
// Chinese:  /zh/blog/2025/12/my-article
```

## Getting Current Locale in Components

### Client Components

```tsx
"use client"
import { useLocale } from "next-intl";

export function LocaleAwareComponent() {
  const locale = useLocale(); // "en", "zh", "hr", or "pl"
  
  return (
    <div>
      <p>Current locale: {locale}</p>
      {locale === "zh" && <p>This is Chinese-specific content</p>}
    </div>
  );
}
```

### Server Components

```tsx
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  
  return <p>Current locale: {locale}</p>;
}
```

## Getting Current Pathname (without locale prefix)

```tsx
"use client"
import { usePathname } from "@/i18n/routing";

export function CurrentPath() {
  const pathname = usePathname();
  
  // Even if URL is /zh/products, pathname returns "/products"
  // Even if URL is /en/about, pathname returns "/about"
  
  return <p>Path: {pathname}</p>;
}
```

## Switching Locale While Preserving Path

```tsx
"use client"
import { useRouter, usePathname } from "@/i18n/routing";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  const switchToZh = () => {
    startTransition(() => {
      // Stays on same page, just changes locale
      router.replace(pathname, { locale: "zh" });
    });
  };
  
  const switchToEn = () => {
    startTransition(() => {
      router.replace(pathname, { locale: "en" });
    });
  };
  
  return (
    <div>
      <button onClick={switchToEn}>English</button>
      <button onClick={switchToZh}>中文</button>
    </div>
  );
}

// User on: /en/products/123
// Clicks Chinese → Goes to: /zh/products/123
// Same page, different language!
```

## Common Patterns

### Pattern 1: Conditional Rendering Based on Locale

```tsx
"use client"
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export function LocalizedPromo({ product }) {
  const locale = useLocale();
  
  return (
    <div>
      <Link href={`/product/${product.id}`}>
        {locale === "zh" ? "立即購買" : "Buy Now"}
      </Link>
      
      {/* Special promo only for Chinese users */}
      {locale === "zh" && (
        <div className="promo">特價優惠！</div>
      )}
    </div>
  );
}
```

### Pattern 2: Language-Specific Slugs

If you have different slugs per language in your database:

```tsx
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function ProductLink({ product }) {
  const locale = useLocale();
  
  // product.slugs = { en: "laptop", zh: "笔记本电脑", hr: "prijenosno-racunalo" }
  const slug = product.slugs[locale] || product.slugs.en;
  
  return (
    <Link href={`/product/${slug}`}>
      {product.name}
    </Link>
  );
}

// English: /product/laptop
// Chinese: /zh/product/笔记本电脑
```

### Pattern 3: Sharing URLs with Locale

```tsx
"use client"
import { useLocale } from "next-intl";

export function ShareButton({ productId }) {
  const locale = useLocale();
  
  const shareUrl = () => {
    const baseUrl = window.location.origin;
    const localePath = locale === "en" ? "" : `/${locale}`;
    const fullUrl = `${baseUrl}${localePath}/product/${productId}`;
    
    navigator.clipboard.writeText(fullUrl);
    alert("URL copied!");
  };
  
  return <button onClick={shareUrl}>Share</button>;
}

// English user shares: https://example.com/product/123
// Chinese user shares: https://example.com/zh/product/123
```

## Migration Checklist

When updating existing components for multi-language support:

- [ ] Replace `import Link from "next/link"` with `import { Link } from "@/i18n/routing"`
- [ ] Replace `import { useRouter } from "next/navigation"` with `import { useRouter } from "@/i18n/routing"`
- [ ] Replace `import { usePathname } from "next/navigation"` with `import { usePathname } from "@/i18n/routing"`
- [ ] Keep `useSearchParams` from `next/navigation` (no change needed)
- [ ] Update all `<a href="">` to `<Link href="">`
- [ ] Test navigation in both English and Chinese
- [ ] Verify dynamic URLs work with locale prefixes

## Testing

Test each dynamic URL pattern:

1. **Navigate to English page**: `/product/123`
2. **Switch to Chinese**: Should go to `/zh/product/123`
3. **Click links**: Should maintain current locale
4. **Direct URL access**: `/zh/category/electronics` should work
5. **Query params**: `/zh/search?q=laptop` should work

## Summary

✅ **Always use** `Link`, `useRouter`, `usePathname` **from** `@/i18n/routing`
✅ **Use template literals** for dynamic URLs: `` href={`/product/${id}`} ``
✅ **Locale prefix is automatic** - you don't need to manually add it
✅ **Pathname returns path without locale** - easier to work with
✅ **Query params work normally** - just append to href

With these patterns, all your dynamic URLs will automatically work with language switching! 🌍
