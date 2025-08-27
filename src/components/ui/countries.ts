// Auto-generated countries.ts
// Covers current countries (UN members + Holy See + State of Palestine + Kosovo (XK) for practicality).
// Names are provided dynamically via Intl.DisplayNames at runtime for de/en/tr/uk with English fallbacks.

export type Country = {
  code: string;
  labels: {
    de: string;
    en: string;
    tr: string;
    uk: string;
  };
};

// Prefer runtime localization to avoid shipping a giant static translation table.
// Fallback to English if a locale is unavailable in the runtime.
function nameFor(code: string, locale: string): string {
  try {
    // Some environments may not support all locales; catch and fallback.
    const dn = new (Intl as any).DisplayNames([locale], { type: "region" });
    const n = dn.of(code);
    if (typeof n === "string") return n;
  } catch {}
  // Fallback: use English
  try {
    const dn = new (Intl as any).DisplayNames(["en"], { type: "region" });
    const n = dn.of(code);
    if (typeof n === "string") return n;
  } catch {}
  return code; // ultimate fallback
}

// Build labels object for all supported languages
export function makeCountryLabels(code: string) {
  return {
    de: nameFor(code, "de"),
    en: nameFor(code, "en"),
    tr: nameFor(code, "tr"),
    uk: nameFor(code, "uk"),
  };
}

export const COUNTRY_CODES: string[] = ["AL", "AD", "AM", "AT", "AZ", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "GE", "DE", "GR", "HU", "IS", "IE", "IT", "KZ", "XK", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL", "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "TR", "UA", "GB", "VA", "AF", "BH", "BD", "BT", "BN", "KH", "CN", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "LK", "SY", "TJ", "TH", "TL", "TM", "AE", "UZ", "VN", "YE", "KP", "KR", "DZ", "AO", "BJ", "BW", "BF", "BI", "CV", "CM", "CF", "TD", "KM", "CG", "CD", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW", "AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS", "SB", "TO", "TV", "VU", "AG", "AR", "BS", "BB", "BZ", "BO", "BR", "CA", "CL", "CO", "CR", "CU", "DM", "DO", "EC", "SV", "GD", "GT", "GY", "HT", "HN", "JM", "MX", "NI", "PA", "PY", "PE", "KN", "LC", "VC", "SR", "TT", "US", "UY", "VE"];

export const COUNTRIES: Country[] = COUNTRY_CODES.map((code) => ({
  code,
  labels: makeCountryLabels(code),
}));
