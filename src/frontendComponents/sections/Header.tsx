"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Facebook, Globe, Instagram, Linkedin, ShoppingCart, Twitter } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCartCount } from "@/lib/store/cart/cartSlice";

type HeaderProps = {
  className?: string;
};

const socialLinks = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Globe, label: "Globe" },
];

const aboutLinks = [
  { label: "History", href: "/about/history", title: "Our History" },
  { label: "Nutrition", href: "/about/nutrition", title: "Nutrition" },
  { label: "Process", href: "/about/process", title: "Our Process" },
];

const productLinks = [
  { label: "Domestic (US)", href: "/products/domestic", title: "Domestic Products" },
  { label: "International (Taiwan)", href: "/products/international", title: "International Products" },
];

export default function Header({ className }: HeaderProps) {
  const headerRef = React.useRef<HTMLElement | null>(null);
  const [openMenu, setOpenMenu] = React.useState<"about" | "products" | null>(null);
  const [langOpen, setLangOpen] = React.useState(false);
  const [locale, setLocale] = React.useState("EN");
  const cartCount = useSelector(selectCartCount);

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setLangOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setLocale(window.location.pathname.startsWith("/zh") ? "ZH" : "EN");
  }, []);

  function handleLanguageChange(nextLocale: "en" | "zh") {
    setLangOpen(false);
    if (typeof window === "undefined") return;

    const { pathname, search, hash } = window.location;
    const normalized = pathname.replace(/^\/(en|zh)(?=\/|$)/, "") || "/";
    const nextPath = nextLocale === "en" ? normalized : `/${nextLocale}${normalized}`;
    window.location.assign(`${nextPath}${search}${hash}`);
  }

  return (
    <header ref={headerRef} className={className}>
      <div className="fixed inset-x-0 top-0 z-50 w-full">
        <div className="h-10 w-full bg-[#D6A574]">
          <div className="mx-auto flex h-full max-w-[1300px] items-center justify-between px-5 text-[14px] text-black">
            <span className="leading-none">Welcome to Khfoods!</span>

            <div className="flex items-center gap-5 leading-none">
              <a href="#" className="hover:opacity-90">
                Store locator
              </a>
              <a href="#" className="hover:opacity-90">
                Wholesale
              </a>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangOpen((current) => !current)}
                  className="inline-flex items-center gap-1 hover:opacity-90"
                  aria-haspopup="menu"
                  aria-expanded={langOpen}
                >
                  <span className="uppercase">{locale}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>

                {langOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-[124px] rounded-md bg-white py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("en")}
                      className={`block w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-black/5 ${locale === "en" ? "font-semibold text-[#f0b400]" : "text-black"}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("zh")}
                      className={`block w-full px-4 py-2 text-left text-[14px] transition-colors hover:bg-black/5 ${locale === "zh" ? "font-semibold text-[#f0b400]" : "text-black"}`}
                    >
                      繁體中文
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                {socialLinks.map(({ Icon, label }) => (
                  <a key={label} href="#" aria-label={label} className="inline-flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[74px] w-full bg-black/80 backdrop-blur-sm">
          <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8">
            <div className="flex w-[200px] items-center">
              <Link href="/" aria-label="Home" className="inline-flex items-center">
                <img src="/assets/khfood_logo.png" alt="KHFOOD" className="h-10 md:h-12 w-auto object-contain" />
              </Link>
            </div>

            <nav className="flex flex-1 items-center justify-center gap-12 text-[14px] font-semibold tracking-[0.04em] text-white">
              <Link href="/" className="transition-colors hover:text-[#facc15]">
                HOME
              </Link>

              <button
                type="button"
                onClick={() => setOpenMenu((current) => (current === "about" ? null : "about"))}
                onMouseEnter={() => setOpenMenu("about")}
                className={`inline-flex items-center gap-1.5 transition-colors hover:text-[#facc15] ${
                  openMenu === "about" ? "text-[#facc15]" : "text-white"
                }`}
              >
                ABOUT US
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </button>

              <button
                type="button"
                onClick={() => setOpenMenu((current) => (current === "products" ? null : "products"))}
                onMouseEnter={() => setOpenMenu("products")}
                className={`inline-flex items-center gap-1.5 transition-colors hover:text-[#facc15] ${
                  openMenu === "products" ? "text-[#facc15]" : "text-white"
                }`}
              >
                PRODUCTS
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </button>

              <Link href="/contact" className="transition-colors hover:text-[#facc15]">
                CONTACT US
              </Link>
            </nav>

            <div className="flex w-[200px] items-center justify-end gap-5 text-[14px] font-semibold tracking-[0.04em] text-white">
              <Link href="/shop" className="transition-colors hover:text-[#facc15]">
                SHOP
              </Link>

              <Link href="/cart" aria-label="Cart" className="relative inline-flex items-center justify-center">
                <ShoppingCart className="h-7 w-7 text-white" />
                <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#facc15] px-1 text-[11px] font-bold leading-none text-black">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>

          {openMenu === "about" ? (
            <div className="absolute left-0 top-full z-50 w-full border-t border-[#e5e7eb] bg-white">
              <div className="mx-auto flex max-w-[1300px] gap-20 px-10 py-14">
                <div className="w-[280px] pt-2">
                  <h2 className="text-[36px] font-semibold tracking-[0.02em] text-[#202020]">ABOUT US</h2>
                </div>

                <div className="flex flex-1 justify-between">
                  {aboutLinks.map((item) => (
                    <div key={item.label} className="min-w-[180px] border-r border-[#e5e7eb] pr-10 last:border-r-0">
                      <p className="text-[16px] font-bold uppercase tracking-[0.02em] text-black">{item.label.toUpperCase()}</p>
                      <Link href={item.href} className="mt-3 block text-[18px] text-[#202020] transition-colors hover:text-black">
                        {item.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {openMenu === "products" ? (
            <div className="absolute left-0 top-full z-50 w-full border-t border-[#e5e7eb] bg-white">
              <div className="mx-auto flex max-w-[1300px] gap-20 px-10 py-14">
                <div className="w-[280px] pt-2">
                  <h2 className="text-[36px] font-semibold tracking-[0.02em] text-[#202020]">PRODUCTS</h2>
                </div>

                <div className="flex flex-1 justify-between">
                  {productLinks.map((item) => (
                    <div key={item.label} className="min-w-[240px] border-r border-[#e5e7eb] pr-10 last:border-r-0">
                      <p className="text-[16px] font-bold uppercase tracking-[0.02em] text-black">{item.label}</p>
                      <Link href={item.href} className="mt-3 block text-[18px] text-[#202020] transition-colors hover:text-black">
                        {item.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
