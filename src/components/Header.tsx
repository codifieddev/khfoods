
"use client";
import React, { useState, useTransition } from "react";
import { FaPhone, FaEnvelope, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { IoLanguageSharp } from "react-icons/io5";
import { MdAccountCircle, MdOutlineShoppingBag } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/routing";


const HeaderMinor = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
 
  const dropdownMenu = {
    [t("about")]: [
      { name: t("history"), link: "/about/history" },
      { name: t("nutrition"), link: "/about/nutrition" },
      { name: t("process"), link: "/about/process" },
    ],
    [t("products")]: [
      { name: t("domestic"), link: "/our-products/domestic" },
      { name: t("international"), link: "/our-products/international" },
    ],
  };

  const mainMenu = [
    { name: t("home"), link: "/", active: true },
    { name: t("about"), link: "/about", dropdown: true },
    { name: t("products"), link: "/our-products", dropdown: true },
    { name: t("contact"), link: "/contact" },
    { name: t("store-locator"), link: "/store-locator" },
    { name: t("wholesale"), link: "/wholesale" },
    {
      name: "",
      icon: <MdOutlineShoppingBag size={15}/>,
      link: "/cart",
    },
  ];

  return (
    <header className="w-full sticky top-0 z-50">

      {/* TOP BAR */}
      <div className="bg-primary text-white text-[14px] py-2 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <FaPhone /> {t("phone")}
            </span>

            <span className="flex items-center gap-2">
              <FaEnvelope /> {t("email")}
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <span>{t("free-shipping")}</span>
           
           <div className="relative">
              {/* Trigger */}
              <span
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
              >
                <IoLanguageSharp size={16} />
                {t("languages")}
                <RiArrowDropDownLine className="w-8 h-8 -ms-3"/>

              </span>

              {/* Dropdown */}
              {open && (
                <div className="absolute left-0 mt-2 w-32 bg-white text-black rounded shadow-lg py-2 z-50">
                  <div 
                    className={`px-4 py-2 hover:bg-[#7c1502] hover:text-white cursor-pointer transition ${
                      locale === "en" ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => {
                      startTransition(() => {
                        router.replace(pathname, { locale: "en" });
                        setOpen(false);
                      });
                    }}
                  >
                    English
                  </div>
                  <div 
                    className={`px-4 py-2 hover:bg-[#7c1502] hover:text-white cursor-pointer transition ${
                      locale === "zh" ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => {
                      startTransition(() => {
                        router.replace(pathname, { locale: "zh" });
                        setOpen(false);
                      });
                    }}
                  >
                    繁體中文
                  </div>
                </div>
              )}
            </div>

         
            <span className="flex items-center gap-1 cursor-pointer">
              <MdAccountCircle size={18} /> {t("my-account")}
            </span>
          </div>
        </div>
      </div>

      {/* MENU BAR */}
      <div className="bg-[rgba(0,0,0,0.75)] border-b border-[#d4a762]/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* LOGO */}
          <Link href="/">
            <img
              src="/assets/Image/khfoodImage/khfood_logo.png"
              className="w-32 h-auto"
              alt="KH Food Logo"
            />
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-8 uppercase tracking-wide relative">
            {mainMenu.map((item) => (
              <div key={item.name} className="group relative flex items-center">

                <Link
                  href={item.link}
                  className={`text-[15px] flex items-center gap-1 transition ${
                    item.active ? "text-[#d4a762]" : "text-white group-hover:text-[#d4a762]"
                  }`}
                >
                  {/* ICON + NAME */}
                  {item.icon ? (
                    <span className="flex items-center gap-1">
                      {item.icon} {item.name}
                    </span>
                  ) : (
                    item.name
                  )}

                  {/* DROP ARROW */}
                  {item.dropdown && (
                    <FaChevronDown
                      size={12}
                      className="transition-transform duration-300 group-hover:rotate-180 text-[#d4a762]"
                    />
                  )}
                </Link>

                {/* DROPDOWN MENU */}
                {item.dropdown && (
                  <div className="absolute left-0 top-8 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-48 bg-[#423f3a]/90 backdrop-blur-md text-white shadow-xl p-4 space-y-3 rounded">
                      {dropdownMenu[item.name].map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.link}
                          className="block text-[14px] hover:text-[#d4a762] transition"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 text-white"
          >
            <HiMenu size={28} />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#1b1a17] text-white z-50 p-6 shadow-lg transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2"
        >
          <HiX size={26} className="text-white" />
        </button>

        {/* MOBILE MENU */}
        <div className="mt-12 space-y-5 text-[16px] font-medium uppercase">

          {mainMenu.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between">

                {/* ICON + NAME */}
                <Link
                  href={item.link}
                  onClick={() => setMobileOpen(false)}
                  className={`block flex items-center gap-2 transition ${
                    item.active ? "text-[#d4a762]" : "text-white hover:text-[#d4a762]"
                  }`}
                >
                  {item.icon && item.icon} {item.name}
                </Link>

                {/* DROPDOWN ARROW */}
                {item.dropdown && (
                  <FaChevronDown size={12} className="text-[#d4a762]" />
                )}
              </div>

              {/* MOBILE DROPDOWN */}
              {item.dropdown && (
                <div className="ml-3 mt-2 space-y-2">
                  {dropdownMenu[item.name].map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.link}
                      onClick={() => setMobileOpen(false)}
                      className="block text-[14px] text-gray-300 hover:text-[#d4a762]"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

    </header>
  );
};

export default HeaderMinor;

