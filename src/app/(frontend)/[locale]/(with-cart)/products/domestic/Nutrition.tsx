"use client";

import React, { useEffect } from "react";
import "./nutrition.css";

const Nutrition = () => {
  useEffect(() => {
    const root = document.querySelector(".nfchart") as HTMLElement;
    if (!root) return;

    const css = getComputedStyle(root);

    const getNum = (v: string) =>
      Number(css.getPropertyValue(v).trim().replace(/['"]/g, "")) || 0;

    const getStr = (v: string) =>
      css.getPropertyValue(v).trim().replace(/['"]/g, "");

    const setAll = (sel: string, val: string | number) => {
      root.querySelectorAll(sel).forEach((el) => {
        el.textContent = String(val);
      });
    };

    setAll("[data-calories]", getNum("--calories"));
    setAll("[data-serving]", getStr("--serving"));
    setAll("[data-servings]", getNum("--servings"));

    setAll("[data-fatg]", getNum("--fat-g"));
    setAll("[data-carbg]", getNum("--carb-g"));
    setAll("[data-proteing]", getNum("--protein-g"));

    setAll("[data-fatkcal]", getNum("--fat-kcal"));
    setAll("[data-carbkcal]", getNum("--carb-kcal"));
    setAll("[data-proteinkcal]", getNum("--protein-kcal"));

    setAll("[data-pfat]", getNum("--p-fat"));
    setAll("[data-pcarb]", getNum("--p-carb"));
    setAll("[data-pprotein]", getNum("--p-protein"));

    setAll("[data-dvfat]", getNum("--dv-fat"));
    setAll("[data-dvsatfat]", getNum("--dv-satfat"));
    setAll("[data-dvsodium]", getNum("--dv-sodium"));
    setAll("[data-dvcarb]", getNum("--dv-carb"));
    setAll("[data-dvfiber]", getNum("--dv-fiber"));
  }, []);

  return (
    <section
      className="nfchart"
      aria-label="Nutrition summary"
      style={
        {
          "--calories": 170,
          "--serving": "'1 oz (28g)'",
          "--servings": 6,

          "--fat-g": 13,
          "--carb-g": 6,
          "--protein-g": 7,

          "--fat-kcal": 110,
          "--carb-kcal": 24,
          "--protein-kcal": 28,

          "--p-fat": 65,
          "--p-carb": 14,
          "--p-protein": 21,

          "--dv-fat": 21,
          "--dv-satfat": 9,
          "--dv-sodium": 5,
          "--dv-carb": 2,
          "--dv-fiber": 11,
        } as React.CSSProperties
      }
    >
      {/* 👇 Boss ka HTML yahin rahega (class → className) */}
    </section>
  );
};

export default Nutrition;
