"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
// FIXED: Use navigation from your i18n configuration for language switching
import { useRouter, usePathname, Link } from "@/i18n/routing"; 
import Image from "next/image";
import { useLocale } from "next-intl"; // Import locale hook
import {
  ChevronDownIcon,
  ShoppingBagIcon,
  XMarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { IoMdClose } from "react-icons/io";
import { IoLanguageSharp } from "react-icons/io5"; // Added Language Icon
import { property } from "zod";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type MegaCategory = "HOME" | "ABOUT US" | "PRODUCTS" | "CONTACT US" | "STORE LOCATOR" | "WHOLESALE" | null;

type Section = {
  title: string;
  links: { label: string; href: string }[];
};

type MegaConfig = {
  title: string;
  href: string;
  columns: {
    heading: string;
    sections: Section[];
  }[];
  resources: Section;
};


/* -------------------------------------------------------------------------- */
/* LOGO VARIANTS                                                              */
/* -------------------------------------------------------------------------- */
const LOGO_COLOURED = "/assets/Image/khfood_logo.png";
const LOGO_BLACK = "/assets/Image/khfood_logo.png";

/* -------------------------------------------------------------------------- */
/* CONFIG PER CATEGORY                                                        */
/* -------------------------------------------------------------------------- */

const megaConfigs: Record<Exclude<MegaCategory, null>, MegaConfig> = {
  HOME: {
    title: "HOME",
    href: "/",
    columns: [],
    resources: {
      title: "",
      links: [],
    },
  },

  "ABOUT US": {
    title: "ABOUT US",
    href: "/about-us",
    columns: [
      {
        heading: "ABOUT",
        sections: [
          {
            title: "HISTORY",
            links: [{ label: "Our History", href: "/about/history" }],
          },
          {
            title: "NUTRITION",
            links: [{ label: "Nutrition", href: "/about/nutrition" }],
          },
          {
            title: "PROCESS",
            links: [{ label: "Our Process", href: "/about/process" }],
          },
        ],
      },
    ],
    resources: {
      title: "Resources",
      links: [],
    },
  },

  PRODUCTS: {
    title: "PRODUCTS",
    href: "/products",
    columns: [
      {
        heading: "PRODUCT CATEGORIES",
        sections: [
          {
            title: "DOMESTIC",
            links: [{ label: "Domestic Products", href: "/products/domestic" }],
          },
          {
            title: "INTERNATIONAL",
            links: [{ label: "International Products", href: "/products/international" }],
          },
        ],
      },
    ],
    resources: {
      title: "More",
      links: [],
    },
  },

  "CONTACT US": {
    title: "CONTACT US",
    href: "/contact-us",
    columns: [],
    resources: {
      title: "",
      links: [],
    },
  },

  "STORE LOCATOR": {
    title: "STORE LOCATOR",
    href: "/store-locator",
    columns: [],
    resources: {
      title: "",
      links: [],
    },
  },

  WHOLESALE: {
    title: "WHOLESALE",
    href: "/wholesale",
    columns: [],
    resources: {
      title: "",
      links: [],
    },
  },
};


  
/* -------------------------------------------------------------------------- */
/* HEADER                                                                     */
/* -------------------------------------------------------------------------- */

export default function Header() {
  const [openMega, setOpenMega] = useState<MegaCategory>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // --- LANGUAGE STATE ---
  const [langOpen, setLangOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Added 'SHOP' to the main menu items for mobile/desktop visibility
  const menuItems: (MegaCategory | "Home")[] = ["HOME","ABOUT US","PRODUCTS","CONTACT US","STORE LOCATOR","WHOLESALE"];
  const isMegaOpen = !!openMega;

  const activeConfig = useMemo(
    () => (openMega ? megaConfigs[openMega] : null),
    [openMega]
  );

  // scroll -> header style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ESC close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMega(null);
        setMobileOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // prevent body scroll when mobile open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else if (!openMega) document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, openMega]);

  const headerClass = isMegaOpen
    ? "bg-white text-black shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
    : isScrolled
    ? "bg-black/80 text-white shadow-lg backdrop-blur"
    : "bg-black/50 text-white";

  const handleDesktopClick = (item: MegaCategory | "Home") => {
    setLangOpen(false); // Close lang menu if nav clicked
    if (item === "Home") {
      setOpenMega(null);
      return;
    }
    setOpenMega((prev) => (prev === item ? null : item));
  };

  // --- LANGUAGE SWITCH HANDLER ---
  const handleLanguageChange = (nextLocale: string) => {
    startTransition(() => {
      // Replace current path with new locale using next-intl router
      router.replace(pathname, { locale: nextLocale });
      setLangOpen(false);
      setMobileOpen(false);
    });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${headerClass}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpenMega(null)}>
            <Image
              src={isMegaOpen ? LOGO_BLACK : LOGO_COLOURED}
              alt="KH FOOD"
              // UPDATED: Reduced width and height here
              width={150} 
              height={36}
              priority
              sizes="(min-width: 1024px) 150px, 120px"
              // UPDATED: Changed w-[150px] to w-[120px] and lg:w-[190px] to lg:w-[150px]
              className="h-auto w-[120px] lg:w-[150px] object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-10 font-semibold text-sm ${isMegaOpen ? "text-black" : "text-white"}`}>
            {menuItems.map((item) => {
              const isHome = item === "Home";
              const isOpen = item === openMega;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleDesktopClick(item)}
                  className="flex items-center gap-1 transition-colors"
                >
                  <span
                    className={
                      isHome
                        ? isMegaOpen
                          ? "text-black font-semibold hover:text-[#FFD100]"
                          : "text-[#FFD100] font-semibold"
                        : isOpen
                        ? "text-[#FFD100]"
                        : isMegaOpen
                        ? "text-black/70 hover:text-black"
                        : "hover:text-[#FFD100]"
                    }
                  >
                    {item}
                  </span>

                  {!isHome && (
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isMegaOpen ? "text-black/60" : "text-white/70"
                      } ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* --- DESKTOP LANGUAGE SWITCHER --- */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1 text-sm font-semibold tracking-wide transition-colors ${
                    isMegaOpen ? "text-black hover:text-black/70" : "text-white hover:text-[#FFD100]"
                }`}
              >
                <IoLanguageSharp size={20} />
                <span className="uppercase">{locale}</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-3 w-32 bg-white text-black rounded shadow-xl py-2 z-50 border border-gray-100">
                  <button
                    disabled={isPending}
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${locale === 'en' ? 'font-bold text-[#FFD100]' : ''}`}
                  >
                    English
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => handleLanguageChange('zh')}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${locale === 'zh' ? 'font-bold text-[#FFD100]' : ''}`}
                  >
                    繁體中文
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/shop"
              onClick={() => setOpenMega(null)}
              className={`hidden lg:inline-flex text-sm font-semibold tracking-wide ${
                isMegaOpen ? "text-black hover:text-black/70" : "text-white hover:text-[#FFD100]"
              }`}
            >
              SHOP
            </Link>

            <button
              type="button"
              className={`relative w-11 h-11 rounded-full flex items-center justify-center ${
                isMegaOpen ? "bg-[#111] text-white" : "bg-black text-white"
              }`}
              aria-label="Cart"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </button>

            {/* Mobile menu button (Hamburger/Close) */}
            <button
              type="button"
              className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center ${
                isMegaOpen ? "text-black" : "text-white"
              }`}
              onClick={() => {
                setMobileOpen((s) => !s);
                setOpenMega(null);
                setLangOpen(false);
              }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className="text-3xl leading-none">
                {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : "☰"}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu + overlay (smooth) */}
        <div
          className={`relative overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            activeConfig ? "max-h-[620px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {activeConfig && (
            <>
              <div
                className="fixed inset-0 top-20 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setOpenMega(null)}
              />
              <div className="relative z-10 bg-white">
                <MegaMenu config={activeConfig} onClose={() => setOpenMega(null)} />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-full w-[90%] max-w-[450px] bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Pass language props to MobileMenu */}
          <MobileMenu
            onClose={() => setMobileOpen(false)}
            configs={megaConfigs}
            locale={locale}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* DESKTOP MEGA                                                               */
/* -------------------------------------------------------------------------- */

function MegaMenu({ config, onClose }: { config: MegaConfig; onClose: () => void }) {
  return (
    <div className="w-full text-[#222]">
      <div className="max-w-6xl mx-auto px-6 lg:px-0 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[0.8fr_1.2fr_1.2fr_1.2fr_1.3fr] lg:gap-x-10">
          {/* LEFT title clickable */}
          <div className="flex items-start lg:items-center">
            <Link
              href={config.href}
              onClick={onClose}
              className="text-3xl md:text-[36px] font-semibold uppercase tracking-wide hover:underline underline-offset-4"
            >
              {config.title}
            </Link>
          </div>

          {/* columns */}
          {config.columns.map((col, idx) => (
            <div key={idx} className="space-y-6 text-md">
              {col.sections.map((section, si) => (
                <div key={si}>
                  <h3 className="mb-3 text-[14px] font-bold uppercase text-black tracking-wide">
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.links.map((l) => (
                      <MenuLink key={l.label} label={l.label} href={l.href} onClose={onClose} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {/* resources */}
          <div className="pt-6 lg:pt-0 lg:pl-10 lg:border-l lg:border-neutral-200 text-sm">
            <h3 className="mb-3 text-[14px] font-bold uppercase text-black tracking-wide">
              {config.resources.title}
            </h3>
            <ul className="space-y-2.5">
              {config.resources.links.map((l) => (
                <MenuLink key={l.label} label={l.label} href={l.href} onClose={onClose} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* close button */}
      <div className="pb-10 flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white hover:border-black hover:text-black text-neutral-500 shadow-sm"
          aria-label="Close menu"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function MenuLink({ label, href, onClose }: { label: string; href: string; onClose: () => void }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className="inline-flex items-center text-[40px] text-neutral-700 hover:text-black transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* MOBILE DRAWER                                                              */
/* -------------------------------------------------------------------------- */

function MobileMenu({
  onClose,
  configs,
  locale,
  onLanguageChange,
}: {
  onClose: () => void;
  configs: Record<Exclude<MegaCategory, null>, MegaConfig>;
  locale: string;
  onLanguageChange: (lang: string) => void;
}) {
  const [open, setOpen] = useState<Exclude<MegaCategory, null> | null>(null);

  // Desktop same items on Mobile (include URBAN too)
  const cats: Exclude<MegaCategory, null>[] = ["HOME","ABOUT US","PRODUCTS","CONTACT US","STORE LOCATOR","WHOLESALE"];

  const toggleCategory = (category: Exclude<MegaCategory, null>) => {
    setOpen((prev) => (prev === category ? null : category));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-200/80">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-black hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <span className="text-2xl leading-none">
            <IoMdClose />
          </span>
        </button>

        <div className="flex items-center justify-center">
          <Image
            src={LOGO_BLACK}
            alt="Goodyear Bicycle Tires"
            // UPDATED: Reduced Mobile Menu logo size
            width={140}
            height={36}
            priority
            // UPDATED: Changed w-[160px] to w-[130px]
            className="h-auto w-[130px] object-contain"
          />
        </div>

        {/* Placeholder to balance the header (width of close button) */}
        <div className="w-10 h-10" />
      </div>

      {/* --- MOBILE LANGUAGE SWITCHER --- */}
      <div className="px-5 py-3 border-b border-neutral-200/80 bg-gray-50 flex gap-2">
          <button 
            onClick={() => onLanguageChange('en')}
            className={`flex-1 py-1.5 text-sm rounded border ${locale === 'en' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            English
          </button>
          <button 
            onClick={() => onLanguageChange('zh')}
            className={`flex-1 py-1.5 text-sm rounded border ${locale === 'zh' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            繁體中文
          </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-10">
        {cats.map((c) => {
          const cfg = configs[c];
          const expanded = open === c;

          return (
            <div key={c} className="border-b border-neutral-200/80 py-6">
              <button
                type="button"
                onClick={() => toggleCategory(c)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-[22px] font-semibold tracking-wide text-neutral-800">
                  {cfg.title}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-200 text-neutral-500 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded && (
                <div className="mt-5 space-y-8 transition-all duration-300">
                  
                  {/* Products (Flatten all links) */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-[15px] text-black">Products</h5>

                    {cfg.columns
                      .flatMap((col) => col.sections)
                      .flatMap((sec) => sec.links)
                      .map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={onClose}
                          className="block text-[15px] text-neutral-700 hover:text-black transition-colors ml-2"
                        >
                          {l.label}
                        </Link>
                      ))}
                  </div>

                  {/* Resources */}
                  <div>
                    <h5 className="font-semibold text-[15px] text-black">{cfg.resources.title}</h5>
                    <div className="mt-3 space-y-3">
                      {cfg.resources.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={onClose}
                          className="block text-[15px] text-neutral-700 hover:text-black transition-colors ml-2"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={cfg.href}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-[15px] font-semibold text-black hover:text-[#FFD100] transition-colors"
                  >
                    View All {cfg.title} <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SHOP button at bottom */}
      <div className="px-6 py-4 border-t border-neutral-200/80">
        <Link
          href="/shop"
          onClick={onClose}
          className="block py-3 text-center text-[18px] font-bold tracking-wide bg-[#FFD100] text-black rounded-lg hover:bg-yellow-500 transition-colors"
        >
          SHOP
        </Link>
      </div>
    </div>
  );
}