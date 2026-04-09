import { getCachedGlobal } from "./getGlobals";

export const defaultSiteSettings = {
  primaryColor: "#0070f3",
  primaryHover: "#0051cc",
  primaryLight: "#e6f2ff",
  secondaryColor: "#6c757d",
  secondaryHover: "#545b62",
  secondaryLight: "#f8f9fa",
  tertiaryColor: "#17a2b8",
  tertiaryHover: "#117a8b",
  tertiaryLight: "#d1ecf1",
  backgroundColor: "#ffffff",
  backgroundSecondary: "#f8f9fa",
  backgroundTertiary: "#e9ecef",
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  textMuted: "#adb5bd",
  textLink: "#0070f3",
  textLinkHover: "#0051cc",
  successColor: "#28a745",
  warningColor: "#ffc107",
  errorColor: "#dc3545",
  infoColor: "#17a2b8",
  borderColor: "#dee2e6",
  shadowColor: "rgba(0, 0, 0, 0.1)",
  fontPrimary: "Inter, sans-serif",
  fontSecondary: "Georgia, serif",
  fontMonospace: "Monaco, monospace",
  fontSizeBase: 16,
  fontSizeH1: 48,
  fontSizeH2: 40,
  fontSizeH3: 32,
  fontSizeH4: 24,
  fontSizeH5: 20,
  fontSizeH6: 18,
  fontSizeSmall: 14,
  fontSizeLarge: 20,
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  lineHeightBase: 1.5,
  lineHeightHeading: 1.2,
  letterSpacingNormal: "0",
  letterSpacingWide: "0.05em",
};

export const getSiteSettings = async (sitesetting, locale, depth) => {
  let d = defaultSiteSettings;

  try {
    const data = await getCachedGlobal(sitesetting, locale, depth);
    d = await data();
  } catch (error) {
    console.warn(
      `Using fallback site settings because the database could not load global "${sitesetting}".`,
      error
    );
  }

  return `
  :root {
    --db-primary: ${d.primaryColor};
    --db-primary-hover: ${d.primaryHover};
    --db-primary-light: ${d.primaryLight};

    --db-secondary: ${d.secondaryColor};
    --db-secondary-hover: ${d.secondaryHover};
    --db-secondary-light: ${d.secondaryLight};

    --db-tertiary: ${d.tertiaryColor};
    --db-tertiary-hover: ${d.tertiaryHover};
    --db-tertiary-light: ${d.tertiaryLight};

    --db-background: ${d.backgroundColor};
    --db-background-secondary: ${d.backgroundSecondary};
    --db-background-tertiary: ${d.backgroundTertiary};

    --db-text-primary: ${d.textPrimary};
    --db-text-secondary: ${d.textSecondary};
    --db-text-muted: ${d.textMuted};
    --db-text-link: ${d.textLink};
    --db-text-link-hover: ${d.textLinkHover};

    --db-success: ${d.successColor};
    --db-warning: ${d.warningColor};
    --db-error: ${d.errorColor};
    --db-info: ${d.infoColor};

    --db-border-color: ${d.borderColor};
    --db-shadow-color: ${d.shadowColor};

    --db-font-primary: ${d.fontPrimary};
    --db-font-secondary: ${d.fontSecondary};
    --db-font-mono: ${d.fontMonospace};

    --db-fz-base: ${d.fontSizeBase}px;
    --db-fz-h1: ${d.fontSizeH1}px;
    --db-fz-h2: ${d.fontSizeH2}px;
    --db-fz-h3: ${d.fontSizeH3}px;
    --db-fz-h4: ${d.fontSizeH4}px;
    --db-fz-h5: ${d.fontSizeH5}px;
    --db-fz-h6: ${d.fontSizeH6}px;
    --db-fz-small: ${d.fontSizeSmall}px;
    --db-fz-large: ${d.fontSizeLarge}px;

    --db-fw-light: ${d.fontWeightLight};
    --db-fw-normal: ${d.fontWeightNormal};
    --db-fw-medium: ${d.fontWeightMedium};
    --db-fw-semibold: ${d.fontWeightSemibold};
    --db-fw-bold: ${d.fontWeightBold};

    --db-lh-base: ${d.lineHeightBase};
    --db-lh-heading: ${d.lineHeightHeading};

    --db-ls-normal: ${d.letterSpacingNormal};
    --db-ls-wide: ${d.letterSpacingWide};
  }

  /* =======================
     COLORS
  ======================== */

  /* BACKGROUND COLORS */
.db-bg-primary { background-color: var(--db-primary); }
.db-bg-primary-hover:hover { background-color: var(--db-primary-hover); }
.db-bg-primary-light { background-color: var(--db-primary-light); }

.db-bg-secondary { background-color: var(--db-secondary); }
.db-bg-secondary-hover:hover { background-color: var(--db-secondary-hover); }
.db-bg-secondary-light { background-color: var(--db-secondary-light); }

.db-bg-tertiary { background-color: var(--db-tertiary); }
.db-bg-tertiary-hover:hover { background-color: var(--db-tertiary-hover); }
.db-bg-tertiary-light { background-color: var(--db-tertiary-light); }

.db-bg-base { background-color: var(--db-background); }
.db-bg-base-2 { background-color: var(--db-background-secondary); }
.db-bg-base-3 { background-color: var(--db-background-tertiary); }

/* TEXT COLORS */
.db-text-primary { color: var(--db-text-primary); }
.db-text-secondary { color: var(--db-text-secondary); }
.db-text-muted { color: var(--db-text-muted); }
.db-text-link { color: var(--db-text-link); }
.db-text-link-hover:hover { color: var(--db-text-link-hover); }

/* FEEDBACK COLORS */
.db-text-success { color: var(--db-success); }
.db-text-warning { color: var(--db-warning); }
.db-text-error { color: var(--db-error); }
.db-text-info { color: var(--db-info); }

/* BORDERS & SHADOWS */
.db-border-default { border-color: var(--db-border-color); }
.db-shadow-default { box-shadow: 0 4px 10px var(--db-shadow-color); }

/* FONT FAMILIES */
.db-font-primary { font-family: var(--db-font-primary); }
.db-font-secondary { font-family: var(--db-font-secondary); }
.db-font-mono { font-family: var(--db-font-mono); }

/* FONT SIZES */
.db-h1 { font-size: var(--db-fz-h1); line-height: var(--db-lh-heading); }
.db-h2 { font-size: var(--db-fz-h2); line-height: var(--db-lh-heading); }
.db-h3 { font-size: var(--db-fz-h3); line-height: var(--db-lh-heading); }
.db-h4 { font-size: var(--db-fz-h4); line-height: var(--db-lh-heading); }
.db-h5 { font-size: var(--db-fz-h5); line-height: var(--db-lh-heading); }
.db-h6 { font-size: var(--db-fz-h6); line-height: var(--db-lh-heading); }

.db-text-base { font-size: var(--db-fz-base); }
.db-text-small { font-size: var(--db-fz-small); }
.db-text-large { font-size: var(--db-fz-large); }

/* FONT WEIGHTS */
.db-fw-light { font-weight: var(--db-fw-light); }
.db-fw-normal { font-weight: var(--db-fw-normal); }
.db-fw-medium { font-weight: var(--db-fw-medium); }
.db-fw-semibold { font-weight: var(--db-fw-semibold); }
.db-fw-bold { font-weight: var(--db-fw-bold); }

/* LETTER SPACING */
.db-tracking-normal { letter-spacing: var(--db-ls-normal); }
.db-tracking-wide { letter-spacing: var(--db-ls-wide); }
`;
};
