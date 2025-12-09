
"use client";
import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { IoLanguageSharp } from "react-icons/io5";
import { MdAccountCircle, MdOutlineShoppingBag } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";


const HeaderMinor = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
const [open, setOpen] =useState(false);
  const dropdownMenu = {
    "ABOUT US": [
      { name: "HISTORY", link: "/about/history" },
      { name: "NUTRITION", link: "/about/nutrition" },
      { name: "PROCESS", link: "/about/process" },
    ],

    PRODUCTS: [
      { name: "DOMESTIC", link: "/our-products/domestic" },
      { name: "INTERNATIONAL", link: "/our-products/international" },
    ],
  };

  const mainMenu = [
    { name: "HOME", link: "/", active: true },
    { name: "ABOUT US", link: "/about", dropdown: true },
    { name: "PRODUCTS", link: "/our-products", dropdown: true },
    { name: "CONTACT US", link: "/contact" },
    { name: "STORE LOCATOR", link: "/store-locator" },
    { name: "WHOLESALE", link: "/wholesale" },
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
              <FaPhone /> (714)639-1201
            </span>

            <span className="flex items-center gap-2">
              <FaEnvelope /> contact@khfood.com 
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <span>FREE SHIPPING WITHIN US</span>
           
           <div className="relative">
              {/* Trigger */}
              <span
                className="flex items-center gap-1 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
              >
                <IoLanguageSharp size={16} />
                Languages 
                <RiArrowDropDownLine className="w-8 h-8 -ms-3"/>

              </span>

              {/* Dropdown */}
              {open && (
                <div className="absolute left-0 mt-2 w-32 bg-white text-black rounded shadow-lg py-2 z-50">
                  <div className="px-4 py-2 hover:bg-[#7c1502] cursor-pointer">
                    English
                  </div>
                  <div className="px-4 py-2 hover:bg-[#7c1502] cursor-pointer">
                    繁體中文
                  </div>
                </div>
              )}
            </div>

         
            <span className="flex items-center gap-1 cursor-pointer">
              <MdAccountCircle size={18} /> My Account
            </span>
          </div>
        </div>
      </div>

      {/* MENU BAR */}
      <div className="bg-[rgba(0,0,0,0.75)] border-b border-[#d4a762]/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* LOGO */}
          <a href="/">
            <img
              src="/assets/Image/khfoodImage/khfood_logo.png"
              className="w-32 h-auto"
            />
          </a>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-8 uppercase tracking-wide relative">
            {mainMenu.map((item) => (
              <div key={item.name} className="group relative flex items-center">

                <a
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
                </a>

                {/* DROPDOWN MENU */}
                {item.dropdown && (
                  <div className="absolute left-0 top-8 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="w-48 bg-[#423f3a]/90 backdrop-blur-md text-white shadow-xl p-4 space-y-3 rounded">
                      {dropdownMenu[item.name].map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.link}
                          className="block text-[14px] hover:text-[#d4a762] transition"
                        >
                          {sub.name}
                        </a>
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
                <a
                  href={item.link}
                  onClick={() => setMobileOpen(false)}
                  className={`block flex items-center gap-2 transition ${
                    item.active ? "text-[#d4a762]" : "text-white hover:text-[#d4a762]"
                  }`}
                >
                  {item.icon && item.icon} {item.name}
                </a>

                {/* DROPDOWN ARROW */}
                {item.dropdown && (
                  <FaChevronDown size={12} className="text-[#d4a762]" />
                )}
              </div>

              {/* MOBILE DROPDOWN */}
              {item.dropdown && (
                <div className="ml-3 mt-2 space-y-2">
                  {dropdownMenu[item.name].map((sub) => (
                    <a
                      key={sub.name}
                      href={sub.link}
                      className="block text-[14px] text-gray-300 hover:text-[#d4a762]"
                    >
                      {sub.name}
                    </a>
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

