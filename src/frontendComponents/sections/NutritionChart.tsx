"use client";

import React, { useEffect, useMemo, useRef } from "react";

type NFVars = {
  calories: number;
  serving: string;
  servings: number;

  fatG: number;
  carbG: number;
  proteinG: number;

  fatKcal: number;
  carbKcal: number;
  proteinKcal: number;

  pFat: number;
  pCarb: number;
  pProtein: number;

  dvFat: number;
  dvSatFat: number;
  dvSodium: number;
  dvCarb: number;
  dvFiber: number;
};

const css = `
.nfchart{
  /* LIGHT THEME */
  --bg:#ffffff;
  --card:#ffffff;
  --card2:#fafafa;
  --stroke:rgba(15,23,42,.12);
  --text:rgba(15,23,42,.92);
  --muted:rgba(15,23,42,.62);

  /* chart colors */
  --fat:#f59e0b;      /* amber */
  --carb:#3b82f6;     /* blue */
  --protein:#22c55e;  /* green */

  max-width:1100px;
  margin:0;
  padding:22px;
  border-radius:18px;
  background:#eaba88;
  color:var(--text);
  font-family:"Montserrat", sans-serif;
  border:1px solid var(--stroke);
  box-shadow: 0 18px 60px rgba(2,6,23,.08);
}

.nfchart__top{
  display:flex;
  justify-content:space-between;
  align-items:end;
  gap:16px;
  padding-bottom:18px;
  border-bottom:1px solid var(--stroke);
  margin-bottom:18px;
}

.nfchart__kicker{
  font-size:12px;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--muted);
}

.nfchart__h{
  margin:4px 0 6px;
  font-size:28px;
  line-height:1.1;
}

.nfchart__meta{ color:var(--muted); font-size:14px; }
.nfchart__meta strong{ color:var(--text); font-weight:800; }

.nfchart__cal{
  min-width:180px;
  text-align:right;
  padding:12px 14px;
  border-radius:14px;
  background:linear-gradient(180deg, rgba(255,255,255,.95), rgba(250,250,250,.95));
  border:1px solid var(--stroke);
  box-shadow: 0 10px 25px rgba(2,6,23,.06);
}

.nfchart__calLabel{
  font-size:12px;
  color:var(--muted);
  text-transform:uppercase;
  letter-spacing:.12em;
}
.nfchart__calValue{ font-size:40px; font-weight:900; margin-top:2px; color:rgba(15,23,42,.95); }
.nfchart__calSub{ font-size:12px; color:var(--muted); }

.nfchart__grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}

.nfchart__card{
  border-radius:18px;
  background:linear-gradient(180deg, rgba(255,255,255,.95), rgba(250,250,250,.95));
  border:1px solid var(--stroke);
  padding:16px;
  box-shadow: 0 10px 25px rgba(2,6,23,.05);
}

.nfchart__cardHead{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-bottom:14px;
}

.nfchart__cardTitle{ margin:0; font-size:16px; font-weight:850; color:rgba(15,23,42,.92); }
.nfchart__pill{
  font-size:12px;
  color:var(--muted);
  padding:6px 10px;
  border-radius:999px;
  border:1px solid var(--stroke);
  background:rgba(255,255,255,.75);
}

.nfchart__macro{
  display:grid;
  grid-template-columns:190px 1fr;
  gap:14px;
  align-items:center;
}

/* Ring */
.nfchart__ring{
  width:180px;
  height:180px;
  border-radius:999px;
  background:
    conic-gradient(
      var(--fat) 0 calc(var(--p-fat) * 1%),
      var(--carb) 0 calc((var(--p-fat) + var(--p-carb)) * 1%),
      var(--protein) 0 100%
    );
  position:relative;
  box-shadow: 0 0 0 1px var(--stroke) inset, 0 10px 25px rgba(2,6,23,.10);
}

.nfchart__ring::after{
  content:"";
  position:absolute;
  inset:22px;
  border-radius:999px;
  background:rgba(255,255,255,.92);
  box-shadow:0 0 0 1px var(--stroke) inset;
}

.nfchart__ringCenter{
  position:absolute;
  inset:0;
  display:grid;
  place-items:center;
  z-index:1;
  text-align:center;
}
.nfchart__ringNum{ font-size:26px; font-weight:950; color:rgba(15,23,42,.95); }
.nfchart__ringTxt{
  font-size:12px;
  color:var(--muted);
  letter-spacing:.12em;
  text-transform:uppercase;
}

.nfchart__legend{ display:grid; gap:10px; }
.nfchart__legRow{
  display:grid;
  grid-template-columns:12px 70px 1fr;
  gap:10px;
  align-items:center;
}

.nfchart__swatch{ width:12px; height:12px; border-radius:4px; }
.nfchart__swatch--fat{ background:var(--fat); }
.nfchart__swatch--carb{ background:var(--carb); }
.nfchart__swatch--protein{ background:var(--protein); }

.nfchart__legName{ color:rgba(15,23,42,.92); font-weight:850; }
.nfchart__legVal{ color:var(--muted); font-size:13px; }
.nfchart__legVal strong{ color:rgba(15,23,42,.92); font-weight:900; }

.nfchart__note{ margin-top:12px; color:var(--muted); font-size:12px; }

/* DV Bars */
.nfchart__dv{ display:grid; gap:10px; }

.nfchart__dvRow{
  display:grid;
  grid-template-columns:1fr 190px 46px;
  gap:10px;
  align-items:center;
}

.nfchart__dvLabel{ font-weight:800; color:rgba(15,23,42,.90); }
.nfchart__muted{ color:var(--muted); font-weight:600; }

.nfchart__bar{
  height:10px;
  border-radius:999px;
  background:rgba(15,23,42,.06);
  border:1px solid rgba(15,23,42,.08);
  overflow:hidden;
  position:relative;
}

.nfchart__fill{
  display:block;
  height:100%;
  width: calc(min(var(--w), 100) * 1%);
  background: linear-gradient(90deg, rgba(15,23,42,.60), rgba(15,23,42,.18));
}

.nfchart__dvPct{ text-align:right; color:var(--muted); }
.nfchart__dvPct strong{ color:rgba(15,23,42,.92); font-weight:900; }

.nfchart__dvRow--nodv .nfchart__dvLabel{ color:rgba(15,23,42,.78); }
.nfchart__dvRow--nodv .nfchart__fill{ width:0; opacity:.3; }

/* Micros */
.nfchart__micros{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:14px;
}

.nfchart__chip{
  font-size:12px;
  color:rgba(15,23,42,.78);
  padding:6px 10px;
  border-radius:999px;
  border:1px solid var(--stroke);
  background:rgba(255,255,255,.75);
}

.nfchart__foot{
  margin:12px 0 0;
  color:var(--muted);
  font-size:12px;
  line-height:1.4;
}

@media (max-width: 880px){
  .nfchart__grid{ grid-template-columns:1fr; }
  .nfchart__macro{ grid-template-columns:1fr; }
  .nfchart__ring{ margin:0 auto; }
  .nfchart__dvRow{ grid-template-columns:1fr; }
  .nfchart__dvPct{ text-align:left; }
  .nfchart__cal{ text-align:left; width:100%; }
  .nfchart__top{ align-items:start; flex-direction:column; }
}
`;

export default function NutritionChart() {
  const rootRef = useRef<HTMLElement | null>(null);

  const vars: NFVars = useMemo(
    () => ({
      calories: 170,
      serving: "1 oz (28g)",
      servings: 6,

      fatG: 13,
      carbG: 6,
      proteinG: 7,

      fatKcal: 110,
      carbKcal: 24,
      proteinKcal: 28,

      pFat: 65,
      pCarb: 14,
      pProtein: 21,

      dvFat: 21,
      dvSatFat: 9,
      dvSodium: 5,
      dvCarb: 2,
      dvFiber: 11,
    }),
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const setAll = (selector: string, value: string | number) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.textContent = String(value);
      });
    };

    setAll("[data-calories]", vars.calories);
    setAll("[data-serving]", vars.serving);
    setAll("[data-servings]", vars.servings);

    setAll("[data-fatg]", vars.fatG);
    setAll("[data-carbg]", vars.carbG);
    setAll("[data-proteing]", vars.proteinG);

    setAll("[data-fatkcal]", vars.fatKcal);
    setAll("[data-carbkcal]", vars.carbKcal);
    setAll("[data-proteinkcal]", vars.proteinKcal);

    setAll("[data-pfat]", vars.pFat);
    setAll("[data-pcarb]", vars.pCarb);
    setAll("[data-pprotein]", vars.pProtein);

    setAll("[data-dvfat]", vars.dvFat);
    setAll("[data-dvsatfat]", vars.dvSatFat);
    setAll("[data-dvsodium]", vars.dvSodium);
    setAll("[data-dvcarb]", vars.dvCarb);
    setAll("[data-dvfiber]", vars.dvFiber);
  }, [vars]);

  const sectionStyle = {
    ["--calories" as any]: vars.calories,
    ["--serving" as any]: `'${vars.serving}'`,
    ["--servings" as any]: vars.servings,

    ["--fat-g" as any]: vars.fatG,
    ["--carb-g" as any]: vars.carbG,
    ["--protein-g" as any]: vars.proteinG,

    ["--fat-kcal" as any]: vars.fatKcal,
    ["--carb-kcal" as any]: vars.carbKcal,
    ["--protein-kcal" as any]: vars.proteinKcal,

    ["--p-fat" as any]: vars.pFat,
    ["--p-carb" as any]: vars.pCarb,
    ["--p-protein" as any]: vars.pProtein,

    ["--dv-fat" as any]: vars.dvFat,
    ["--dv-satfat" as any]: vars.dvSatFat,
    ["--dv-sodium" as any]: vars.dvSodium,
    ["--dv-carb" as any]: vars.dvCarb,
    ["--dv-fiber" as any]: vars.dvFiber,
  } as React.CSSProperties;

  return (
    <>
      <section
        ref={(el) => {
          rootRef.current = el;
        }}
        className="nfchart"
        aria-label="Nutrition summary"
        style={sectionStyle}
      >
        <header className="nfchart__top">
          <div className="nfchart__title">
            <div className="nfchart__kicker">Nutrition</div>
            <h2 className="nfchart__h">Facts (visual)</h2>
            <div className="nfchart__meta">
              Serving size <strong data-serving /> · Servings{" "}
              <strong data-servings />
            </div>
          </div>

          <div className="nfchart__cal">
            <div className="nfchart__calLabel">Calories</div>
            <div className="nfchart__calValue" data-calories />
            <div className="nfchart__calSub">Per serving</div>
          </div>
        </header>

        <div className="nfchart__grid">
          {/* Macro ring + breakdown */}
          <div className="nfchart__card">
            <div className="nfchart__cardHead">
              <h3 className="nfchart__cardTitle">Calories by macro</h3>
              <span className="nfchart__pill">Ring chart</span>
            </div>

            <div className="nfchart__macro">
              <div
                className="nfchart__ring"
                role="img"
                aria-label="Macro distribution ring chart"
              >
                <div className="nfchart__ringCenter">
                  <div className="nfchart__ringNum" data-calories />
                  <div className="nfchart__ringTxt">kcal</div>
                </div>
              </div>

              <div className="nfchart__legend" aria-label="Macro legend">
                <div className="nfchart__legRow">
                  <span className="nfchart__swatch nfchart__swatch--fat" aria-hidden="true" />
                  <div className="nfchart__legName">Fat</div>
                  <div className="nfchart__legVal">
                    <strong data-fatg />g · <span data-fatkcal /> kcal · <span data-pfat />%
                  </div>
                </div>

                <div className="nfchart__legRow">
                  <span className="nfchart__swatch nfchart__swatch--carb" aria-hidden="true" />
                  <div className="nfchart__legName">Carbs</div>
                  <div className="nfchart__legVal">
                    <strong data-carbg />g · <span data-carbkcal /> kcal · <span data-pcarb />%
                  </div>
                </div>

                <div className="nfchart__legRow">
                  <span className="nfchart__swatch nfchart__swatch--protein" aria-hidden="true" />
                  <div className="nfchart__legName">Protein</div>
                  <div className="nfchart__legVal">
                    <strong data-proteing />g · <span data-proteinkcal /> kcal ·{" "}
                    <span data-pprotein />%
                  </div>
                </div>
              </div>
            </div>

            <div className="nfchart__note">
              *Macro kcal are optional; you can show only grams and percentages if preferred.
            </div>
          </div>

          {/* DV bar chart */}
          <div className="nfchart__card">
            <div className="nfchart__cardHead">
              <h3 className="nfchart__cardTitle">% Daily Value</h3>
              <span className="nfchart__pill">Bar chart</span>
            </div>

            <div className="nfchart__dv" role="list" aria-label="Daily value bars">
              <div className="nfchart__dvRow" role="listitem">
                <div className="nfchart__dvLabel">
                  Total Fat <span className="nfchart__muted">(13g)</span>
                </div>
                <div className="nfchart__bar" aria-hidden="true">
                  <span className="nfchart__fill" style={{ ["--w" as any]: vars.dvFat }} />
                </div>
                <div className="nfchart__dvPct">
                  <strong data-dvfat />%
                </div>
              </div>

              <div className="nfchart__dvRow" role="listitem">
                <div className="nfchart__dvLabel">
                  Saturated Fat <span className="nfchart__muted">(2g)</span>
                </div>
                <div className="nfchart__bar" aria-hidden="true">
                  <span className="nfchart__fill" style={{ ["--w" as any]: vars.dvSatFat }} />
                </div>
                <div className="nfchart__dvPct">
                  <strong data-dvsatfat />%
                </div>
              </div>

              <div className="nfchart__dvRow" role="listitem">
                <div className="nfchart__dvLabel">
                  Sodium <span className="nfchart__muted">(120mg)</span>
                </div>
                <div className="nfchart__bar" aria-hidden="true">
                  <span className="nfchart__fill" style={{ ["--w" as any]: vars.dvSodium }} />
                </div>
                <div className="nfchart__dvPct">
                  <strong data-dvsodium />%
                </div>
              </div>

              <div className="nfchart__dvRow" role="listitem">
                <div className="nfchart__dvLabel">
                  Total Carbs <span className="nfchart__muted">(6g)</span>
                </div>
                <div className="nfchart__bar" aria-hidden="true">
                  <span className="nfchart__fill" style={{ ["--w" as any]: vars.dvCarb }} />
                </div>
                <div className="nfchart__dvPct">
                  <strong data-dvcarb />%
                </div>
              </div>

              <div className="nfchart__dvRow" role="listitem">
                <div className="nfchart__dvLabel">
                  Fiber <span className="nfchart__muted">(3g)</span>
                </div>
                <div className="nfchart__bar" aria-hidden="true">
                  <span className="nfchart__fill" style={{ ["--w" as any]: vars.dvFiber }} />
                </div>
                <div className="nfchart__dvPct">
                  <strong data-dvfiber />%
                </div>
              </div>

              <div className="nfchart__dvRow nfchart__dvRow--nodv" role="listitem">
                <div className="nfchart__dvLabel">
                  Sugars <span className="nfchart__muted">(1g)</span>
                </div>
                <div className="nfchart__bar" aria-hidden="true">
                  <span className="nfchart__fill" style={{ ["--w" as any]: 0 }} />
                </div>
                <div className="nfchart__dvPct">—</div>
              </div>

              <div className="nfchart__dvRow nfchart__dvRow--nodv" role="listitem">
                <div className="nfchart__dvLabel">
                  Protein <span className="nfchart__muted">(7g)</span>
                </div>
                <div className="nfchart__bar" aria-hidden="true">
                  <span className="nfchart__fill" style={{ ["--w" as any]: 0 }} />
                </div>
                <div className="nfchart__dvPct">—</div>
              </div>
            </div>

            <div className="nfchart__micros" aria-label="Vitamins and minerals">
              <span className="nfchart__chip">Vitamin A 4%</span>
              <span className="nfchart__chip">Vitamin C 0%</span>
              <span className="nfchart__chip">Calcium 0%</span>
              <span className="nfchart__chip">Iron 0%</span>
            </div>

            <p className="nfchart__foot">
              *% Daily Value (DV) are based on a 2,000 calorie diet.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{css}</style>
    </>
  );
}
