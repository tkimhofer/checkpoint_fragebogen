import React, { useEffect, /* useMemo, */ useState } from "react"; // useMemo unused
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { writeTextFile, exists } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";


const CURR_VERSION = "v0.3";
// ---- submission config ----
const API_HOST = "192.168.10.108";
const API_PORT = 8000;
const API_PATH = "/api/questionnaire";
const ENDPOINT = `http://${API_HOST}:${API_PORT}${API_PATH}`;
const SCHEMA_VERSION = 1;                   // bump if your question set changes
const SUBMIT_LABELS = false;                // true -> submit localized labels instead of codes



type Lang = "de" | "en" | "tr" | "uk";
// const LANGS: Lang[] = ["de","en","tr","uk"]; // unused
// const FLAG: Record<Lang, string> = { de: "🇩🇪", en: "🇬🇧", tr: "🇹🇷", uk: "🇺🇦" }; // unused
// const LABEL: Record<Lang, string> = { de: "Deutsch", en: "English", tr: "Türkçe", uk: "Українська" }; // unused

// type Opt = { code: string; labels: Record<Lang, string> };
type Opt = { 
  code: string; 
  labels: Record<Lang, string>; 
  group?: string; // new → group name
};

const ANSWER_INDENT = "pl-6 md:pl-8";

// const OPTION_STACK  = "space-y-1";
// const ANSWER_INDENT = "pl-3 border-l border-muted/30"; // alternate style

const SKIP_LABEL: Record<Lang, string> = {
  de: "Möchte ich nicht sagen",
  en: "Prefer not to say",
  tr: "Söylemek istemiyorum",
  uk: "Волію не відповідати",
};

const ANSWER_LABEL: Record<Lang, string> = {
  de: "Möchte beantworten",
  en: "Answer this question",
  tr: "Bu soruyu yanıtlamak istiyorum",
  uk: "Хочу відповісти",
};


const QTITLE: Record<string, Record<Lang, string>> = {
  // age: { de: "Wie alt bis Du?", en: "How old are you?", tr: "Kaç yaşındasın?", uk: "Скільки тобі років?" },
  // sex_birth: { de: "Welches Geschlecht wurde Dir bei der Geburt eingetragen?", en: "What sex were you assigned at birth?", tr: "Doğumda sana hangi cinsiyet atandı?", uk: "Яку стать тобі було визначено при народженні?" },
  gender: { de: "Z1. Wie beschreibst Du deine derzeitige Geschlechtsidentität?", en: "How do you describe your current gender identity?", tr: "Şu anki cinsiyet kimliğini nasıl tanımlarsın?", uk: "Як ти описуєш свою поточну гендерну ідентичність?" },
  orientation: { de: "1. Wie beschreibst Du deine sexuelle Orientierung?", en: "How do you describe your sexual orientation?", tr: "Cinsel yönelimini nasıl tanımlarsın?", uk: "Як ти описуєш свою сексуальну орієнтацію?" },
  birthCountry: { de: "2. Wo bist Du geboren?", en: "Where were you born?", tr: "Nerede doğdun?", uk: "Де ти народився/народилася?" },
  insurance: { de: "3. Bist Du krankenversichert?", en: "Do you have health insurance?", tr: "Sağlık sigortan var mı?", uk: "Чи маєш медичне страхування?" },
  doctor: { de: "4. Hast Du einen Arzt/Ärztin?", en: "Do you have a doctor?", tr: "Bir doktorun var mı?", uk: "Чи маєш лікаря?" },
  hiv_test: { de: "5.1 Möchtest Du heute einen HIV Test machen?", en: "Would you like to take an HIV test today?", tr: "Bugün HIV testi yaptırmak ister misin?", uk: "Хочеш сьогодні здати тест на ВІЛ?" },
  riskType: { de: "5.2 Aus welchem Grund möchtest Du dich auf HIV testen lassen?", en: "For what reason would you like to be tested for HIV?", tr: "HIV testi yaptırmak istemenin nedeni nedir?", uk: "З якої причини ти хочеш пройти тест на ВІЛ?" },
  hiv_risk_selfest: { de: "6. Wie hoch schätzt Du das Risiko einer möglichen Ansteckung mit HIV ein?", en: "How do you rate the risk of a possible HIV infection?", tr: "Olası HIV bulaşma riskini nasıl değerlendiriyorsun?", uk: "Як ти оцінюєш ризик можливого зараження ВІЛ?" },
  sexualRiskTime: { de: "7. Wie lange liegt die letzte Risikosituation zurück?", en: "How long ago was the last risk situation?", tr: "Son riskli durum ne kadar zaman önceydi?", uk: "Скільки часу минуло від твоєї останньої ризикової ситуації?" },
  riskCountry: { de: "8. In welchem Land hattest Du die Risikosituation?", en: "In which country did the risk situation occur?", tr: "Riskli durum hangi ülkede gerçekleşti?", uk: "У якій країні сталася ризикова ситуація?" },
  risk_situation: { de: "9. Wobei oder mit wem hattest Du die Risikosituation?", en: "In what context or with whom did the risk situation occur?", tr: "Riskli durum hangi bağlamda veya kiminle gerçekleşti?", uk: "У якому контексті або з ким сталася ризикова ситуація?" },
  risk_situation_d1_1: { de: "10.1 Ungeschützter GV (anal/vaginal)?", en: "Unprotected anal/vaginal sex?", tr: "Korunmasız anal/vajinal ilişki?", uk: "Незахищений анальний/вагінальний секс?" },
  risk_situation_d1_2: { de: "10.2 Kondom abgerutscht/gerissen?", en: "Condom slipped/torn?", tr: "Prezervatif kaydı/yırtıldı?", uk: "Презерватив зісковзнув/порвався?" },
  risk_situation_d1_3: { de: "10.3 Oralverkehr?", en: "Oral sex?", tr: "Oral seks?", uk: "Оральний секс?" },
  risk_situation_d2_1: { de: "11. Gründe ohne Kondom", en: "Reasons for no condom", tr: "Kondomsuz nedenler", uk: "Причини без презерватива" },
  risk_situation_d1_4: { de: "10.4 Drogenkonsum?", en: "Drug use?", tr: "Uyuşturucu kullanımı?", uk: "Вживання наркотиків?" },
  hiv_test_prev: { de: "12. Schon früher auf HIV getestet?", en: "Tested for HIV before?", tr: "Daha önce HIV testi?", uk: "Раніше тест на ВІЛ?" },
  sti_history_yesno: { de: "13.1 Wurde je eine STI festgestellt?", en: "Ever diagnosed with an STI?", tr: "Hiç CYBH tanısı?", uk: "Колись діагностували ІПСШ?" },
  sti_history_which: { de: "13.2 Welche STI?", en: "Which STI?", tr: "Hangi CYBH?", uk: "Яку саме ІПСШ?" },
  sti_history_treat: { de: "13.3 Wurde die STI behandelt?", en: "Was the STI treated?", tr: "Tedavi edildi mi?", uk: "Було лікування?" },
  sti_history_treat_country: { de: "13.4 In welchem Land behandelt?", en: "Treated in which country?", tr: "Hangi ülkede tedavi?", uk: "В якій країні лікували?" },
  hepA: { de: "16. Hepatitis A geimpft?", en: "Vaccinated against Hep A?", tr: "Hep A aşılı mı?", uk: "Щеплення від гепатиту A?" },
  hepB: { de: "17. Hepatitis B geimpft?", en: "Vaccinated against Hep B?", tr: "Hep B aşılı mı?", uk: "Щеплення від гепатиту B?" },
  hepABVac: { de: "18. Serologie Hep A/B bei unklarem Status?", en: "Serology Hep A/B if unclear?", tr: "Belirsizse A/B seroloji?", uk: "Серологія A/B при невизначеному статусі?" },
  hepC: { de: "19.1 Je Hepatitis C diagnostiziert?", en: "Ever Hep C diagnosis?", tr: "Hep C tanısı oldu mu?", uk: "Колись діагностували гепатит C?" },
  hepC_tm: { de: "19.2 Medikamentös behandelt?", en: "Treated with medication?", tr: "İlaçla tedavi?", uk: "Медикаментозне лікування?" },
  beraterkennung: {de: "Beraterkennung", en: "Beraterkennung", tr: "Beraterkennung", uk: "Beraterkennung"},
  beraterkommentar: {de: "Kommentar", en: "Kommentar", tr: "Kommentar", uk: "Kommentar"},
  besucherkennung: {de: "Besucher-ID", en: "Besucher-ID", tr: "Besucher-ID", uk: "Besucher-ID"},
  testanforderungen: {de: "Testanforderungen", en: "Testanforderungen", tr: "Testanforderungen", uk: "Testanforderungen"},
};
const titleFor = (qid: string, lang: Lang) => QTITLE[qid]?.[lang] ?? qid;

// const PNR: Opt = { code: "pnr", labels: { de: "Möchte ich nicht sagen", en: "I'd rather not say", tr: "Söylemek istemiyorum", uk: "Волію не відповідати" } };

const YES_NO: Opt[] = [
  { code: "yes", labels: { de: "Ja", en: "Yes", tr: "Evet", uk: "Так" } },
  { code: "no",  labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
];

const YES_NO_UNKNOWN: Opt[] = [
  ...YES_NO,
  { code: "unknown", labels: { de: "Weiß nicht", en: "Don't know", tr: "Bilmiyorum", uk: "Не знаю" } },
];

const ORIENTATION: Opt[] = [
  { code: "heterosexual", labels: { de: "Heterosexuell", en: "Heterosexual", tr: "Heteroseksüel", uk: "Гетеросексуальний" } },
  { code: "gay_lesbian", labels: { de: "Schwul/Lesbisch", en: "Gay/Lesbian", tr: "Gey/Lezbiyen", uk: "Гей/Лесбійка" } },
  { code: "bisexual", labels: { de: "Bisexuell", en: "Bisexual", tr: "Biseksüel", uk: "Бісексуальний" } },
  { code: "other", labels: { de: "Anderes", en: "Other", tr: "Diğer", uk: "Інше" } },
];

// const SEX_BIRTH: Opt[] = [
//   { code: "male", labels: { de: "Männlich", en: "Male", tr: "Erkek", uk: "Чоловіча" } },
//   { code: "female", labels: { de: "Weiblich", en: "Female", tr: "Kadın", uk: "Жіноча" } },
// ];

const GENDER: Opt[] = [
  { code: "male", labels: { de: "Männlich", en: "Male", tr: "Erkek", uk: "Чоловіча" } },
  { code: "female", labels: { de: "Weiblich", en: "Female", tr: "Kadın", uk: "Жіноча" } },
  { code: "diverse", labels: { de: "Divers", en: "Diverse", tr: "Diğer", uk: "Інша" } },
];

const BIRTH_COUNTRY: Opt[] = [
  { code: "de", labels: { de: "Deutschland", en: "Germany", tr: "Almanya", uk: "Німеччина" } },
  { code: "eu", labels: { de: "EU (nicht DE)", en: "EU (non-DE)", tr: "AB (DE değil)", uk: "ЄС (крім Німеччини)" } },
  { code: "non_eu", labels: { de: "Nicht-EU", en: "Non-EU", tr: "AB dışı", uk: "Поза ЄС" } },
];

const HIV_RISK: Opt[] = [
  { code: "risk_myself", labels: { de: "Ich hatte eine/mehrere Risikosituationen", en: "I had one or more risk situations", tr: "Bir veya birden fazla riskli durum yaşadım", uk: "Я мав/мала одну або кілька ризикових ситуацій" } },
  { code: "risk_partner", labels: { de: "Mein Partner/meine Partnerin hatte eine/mehrere Risikosituationen", en: "My partner had one or more risk situations", tr: "Partnerim bir veya birden fazla riskli durum yaşadı", uk: "Мій партнер/моя партнерка мав/мала одну або кілька ризикових ситуацій" } },
  { code: "routine", labels: { de: "Ich lasse meinen HIV-Status regelmäßig kontrollieren (Routine)", en: "I have my HIV status checked regularly (routine)", tr: "HIV durumumu düzenli olarak kontrol ettiriyorum (rutin)", uk: "Я регулярно перевіряю свій ВІЛ-статус (рутинно)" } },
  { code: "new_relationship", labels: { de: "Ich bin in einer neuen Beziehung", en: "I am in a new relationship", tr: "Yeni bir ilişkim var", uk: "Я у нових стосунках" } },
  { code: "partner_hivPositive", labels: { de: "Mein Partner/meine Partnerin ist HIV positive", en: "My partner is HIV positive", tr: "Partnerim HIV pozitif", uk: "Мій партнер/моя партнерка ВІЛ-позитивний/позитивна" } },
  { code: "other", labels: { de: "Andere", en: "Other", tr: "Diğer", uk: "Інше" } },
];

const PERCEIVED_RISK: Opt[] = [
  { code: "none", labels: { de: "Kein Risiko", en: "No risk", tr: "Risk yok", uk: "Немає ризику" } },
  { code: "low", labels: { de: "Gering", en: "Low", tr: "Düşük", uk: "Низький" } },
  { code: "medium", labels: { de: "Mittel", en: "Medium", tr: "Orta", uk: "Середній" } },
  { code: "high", labels: { de: "Hoch", en: "High", tr: "Yüksek", uk: "Високий" } },
];

const LAST_RISK_TIME: Opt[] = [
  { code: "lt3d", labels: { de: "0 - 3 Tage", en: "0 - 3 days", tr: "0 - 3 gün", uk: "0 - 3 дні" } },
  { code: "4t9d", labels: { de: "4 - 9 Tage", en: "4 - 9 days", tr: "4 - 9 gün", uk: "4 - 9 днів" } },
  { code: "10t14d", labels: { de: "10 - 14 Tage", en: "10 - 14 days", tr: "10 - 14 gün", uk: "10 - 14 днів" } },
  { code: "15dt6w", labels: { de: "15 Tage - 6 Wochen", en: "15 days - 6 weeks", tr: "15 gün - 6 hafta", uk: "15 днів - 6 тижнів" } },
  { code: "6wt3m", labels: { de: "6 Wochen - 3 Monate", en: "6 weeks - 3 months", tr: "6 hafta - 3 ay", uk: "6 тижнів - 3 місяці" } },
  { code: "gt3m", labels: { de: "mehr als 3 Monate", en: "more than 3 months", tr: "3 aydan fazla", uk: "більше ніж 3 місяці" } },
];

const RISK_COUNTRY: Opt[] = [
  { code: "de", labels: { de: "Deutschland", en: "Germany", tr: "Almanya", uk: "Німеччина" } },
  { code: "eu", labels: { de: "EU (nicht DE)", en: "EU (non-DE)", tr: "AB (DE değil)", uk: "ЄС (крім Німеччини)" } },
  { code: "non_eu", labels: { de: "Nicht-EU", en: "Non-EU", tr: "AB dışı", uk: "Поза ЄС" } },
  { code: "multiple", labels: { de: "Mehrere Länder", en: "Multiple countries", tr: "Birden fazla ülke", uk: "Кілька країн" } },
];

const RISK_SITUATION: Opt[] = [
  { code: "partner", labels: { de: "mit festem Partner / fester Partnerin", en: "with steady partner", tr: "düzenli partner ile", uk: "з постійним партнером" } },
  { code: "acquaintance", labels: { de: "mit jemandem den/die ich schon länger kenne", en: "with someone I have known for a long time", tr: "uzun süredir tanıdığım biriyle", uk: "з кимось, кого давно знаю" } },
  { code: "unknown_person", labels: { de: "mit einer mir unbekannten Person", en: "with an unknown person", tr: "tanımadığım biriyle", uk: "з незнайомою людиною" } },
  { code: "sexworker", labels: { de: "Sexarbeiter/-in oder Escort(s)", en: "sex worker or escort(s)", tr: "seks işçisi veya eskort", uk: "секс-працівник/-ця або ескорт" } },
  { code: "professional_risk", labels: { de: "berufliches Risiko (z.B. Nadelstich i. Arztpraxis)", en: "occupational risk (e.g., needle stick in medical practice)", tr: "mesleki risk (ör. tıbbi uygulamada iğne batması)", uk: "професійний ризик (напр., укол голкою в медичній практиці)" } },
  { code: "other", labels: { de: "Andere Risikosituation (z.B. Tatoo)", en: "other risk situation (e.g., tattoo)", tr: "diğer riskli durum (ör. dövme)", uk: "інша ризикова ситуація (напр., тату)" } },
  { code: "unkwn", labels: { de: "Infektionsrisiko nicht zu ermitteln", en: "infection risk cannot be determined", tr: "bulaşma riski belirlenemiyor", uk: "ризик зараження неможливо визначити" } },
];

const CONDOM_REASON: Opt[] = [
  { code: "partner_refused", labels: { de: "Mein(e) Sexpartner/Sexpartnerin wollte ohne Kondom", en: "My sexual partner wanted to have sex without a condom", tr: "Cinsel partnerim prezervatifsiz ilişki istedi", uk: "Мій сексуальний партнер хотів зайнятися сексом без презерватива" } },
  { code: "myself_refused", labels: { de: "Ich wollte ohne Kondom", en: "I wanted to have sex without a condom", tr: "Prezervatifsiz ilişki istedim", uk: "Я хотів/хотіла зайнятися сексом без презерватива" } },
  { code: "partner_said_neg", labels: { de: "Mein(e) Partner/Partnerin hat mir gesagt, dass er/sie HIV negative ist", en: "My partner told me they are HIV negative", tr: "Partnerim HIV negatif olduğunu söyledi", uk: "Мій партнер сказав мені, що він/вона ВІЛ-негативний/на" } },
  { code: "partner_in_tm", labels: { de: "… wird behandelt und ist nicht mehr ansteckend", en: "… is treated and no longer infectious", tr: "… tedavi görüyor ve artık bulaştırıcı değil", uk: "… лікується і вже не заразний/на" } },
  { code: "trusted_partner", labels: { de: "Ich nahm an, Partner*in ist HIV-negativ", en: "I assumed partner is HIV negative", tr: "Partnerimin HIV negatif olduğunu varsaydım", uk: "Припустив/ла, що партнер ВІЛ-негативний" } },
  { code: "no_hardon", labels: { de: "Mit Kondom schwer Erektion", en: "Difficult erection with condoms", tr: "Prezervatif ile ereksiyon zor", uk: "Важко досягти ерекції з презервативом" } },
  { code: "no_condom", labels: { de: "Kein Kondom dabei", en: "No condom with me", tr: "Yanımda prezervatif yoktu", uk: "Не було презерватива" } },
  { code: "noidea", labels: { de: "Weiß nicht", en: "I don't know", tr: "Bilmiyorum", uk: "Не знаю" } },
  { code: "other", labels: { de: "Andere", en: "Other", tr: "Diğer", uk: "Інше" } },
];

const STI_HISTORY: Opt[] = [
  { code: "chlamydia", labels: { de: "Chlamydien", en: "Chlamydia", tr: "Klamidya", uk: "Хламідіоз" } },
  { code: "gonorrhea", labels: { de: "Gonorrhö", en: "Gonorrhea", tr: "Bel soğukluğu", uk: "Гонорея" } },
  { code: "syphilis", labels: { de: "Syphilis", en: "Syphilis", tr: "Frengi", uk: "Сифіліс" } },
  { code: "hpv", labels: { de: "HPV", en: "HPV", tr: "HPV", uk: "HPV" } },
  { code: "herpes", labels: { de: "Herpes", en: "Herpes", tr: "Uçuk (Herpes)", uk: "Герпес" } },
  { code: "hepb", labels: { de: "Hepatitis B", en: "Hepatitis B", tr: "Hepatit B", uk: "Гепатит B" } },
  { code: "hepc", labels: { de: "Hepatitis C", en: "Hepatitis C", tr: "Hepatit C", uk: "Гепатит C" } },
  { code: "other", labels: { de: "Andere", en: "Other", tr: "Diğer", uk: "Інше" } },
];

const DRUG_USE: Opt[] = [
  { code: "none", labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
  { code: "smoked_snorted", labels: { de: "Ja, Geraucht/geschnupft", en: "Yes, smoked/snorted", tr: "Evet, içilmiş/çekilmiş", uk: "Так, курив/нюхав" } },
  { code: "injected", labels: { de: "Ja, Gespritzt", en: "Yes, injected", tr: "Evet, enjekte", uk: "Так, ін'єкційно" } },
];

const GONO_CHLAM_MAP: Record<string, string> = {
  go_throat: "chlam_throat",
  go_urine: "chlam_urine",
  go_anal: "chlam_anal",
};



// ---- Registry ----
type QType = "radio" | "checkbox" | "text" | "textarea";
type QDef = { type: QType; section: "general"|"hiv"|"sexpractices"|"other"|"summary"|"berater"; options?: Opt[]; placeholder?: Record<Lang,string> };

const Q: Record<string, QDef> = {

  gender: { type: "radio", options: GENDER, section: "general" },
  orientation: { type: "radio", options: ORIENTATION, section: "general" },
  birthCountry: { type: "radio", options: BIRTH_COUNTRY, section: "general" },
  // sex_birth: { type: "radio", options: SEX_BIRTH, section: "general" },
  // age: { ... },

  insurance: { type: "radio", options: YES_NO_UNKNOWN, section: "general" },
  doctor: { type: "radio", options: YES_NO, section: "general" },
  hiv_test: { type: "radio", options: YES_NO, section: "general" },

  riskType: { type: "checkbox", options: HIV_RISK, section: "hiv" },
  hiv_risk_selfest: { type: "radio", options: PERCEIVED_RISK, section: "hiv" },
  hiv_test_prev: { type: "radio", options: YES_NO, section: "hiv" },
  sexualRiskTime: { type: "radio", options: LAST_RISK_TIME, section: "hiv" },
  riskCountry: { type: "radio", options: RISK_COUNTRY, section: "hiv" },
  risk_situation: { type: "checkbox", options: RISK_SITUATION, section: "hiv" },

  risk_situation_d1_1: { type: "radio", options: [
    { code: "no", labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
    { code: "yes_both", labels: { de: "Ja, aktiv & passiv", en: "Yes, insertive and receptive", tr: "Evet, aktif ve pasif", uk: "Так, інсертивно і рецептивно" } },
    { code: "yes_insertive", labels: { de: "Ja, aktiv (insertiv)", en: "Yes, insertive", tr: "Evet, aktif", uk: "Так, інсертивно" } },
    { code: "yes_receptive", labels: { de: "Ja, passiv (rezeptiv)", en: "Yes, receptive", tr: "Evet, pasif", uk: "Так, рецептивно" } },
  ], section: "sexpractices" },
  risk_situation_d1_2: { type: "radio", options: [
    { code: "no", labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
    { code: "yes_both", labels: { de: "Ja, aktiv & passiv", en: "Yes, insertive and receptive", tr: "Evet, aktif ve pasif", uk: "Так, інсертивно і рецептивно" } },
    { code: "yes_insertive", labels: { de: "Ja, aktiv (insertiv)", en: "Yes, insertive", tr: "Evet, aktif", uk: "Так, інсертивно" } },
    { code: "yes_receptive", labels: { de: "Ja, passiv (rezeptiv)", en: "Yes, receptive", tr: "Evet, pasif", uk: "Так, рецептивно" } },
  ], section: "sexpractices" },
  risk_situation_d1_3: { type: "radio", options: YES_NO, section: "sexpractices" },
  risk_situation_d2_1: { type: "checkbox", options: CONDOM_REASON, section: "sexpractices" },
  risk_situation_d1_4: { type: "radio", options: DRUG_USE, section: "sexpractices" },

  sti_history_yesno: { type: "radio", options: YES_NO, section: "other" },
  sti_history_which: { type: "checkbox", options: STI_HISTORY, section: "other" },
  // was checkbox → should be exclusive: radio
  sti_history_treat:  { type: "radio", options: YES_NO, section: "other" },
  // consider whether multi-country makes sense:
  sti_history_treat_country: { type: "checkbox", options: RISK_COUNTRY, section: "other" },

  hepA: { type: "radio", options: YES_NO_UNKNOWN, section: "other" },
  hepB: { type: "radio", options: YES_NO_UNKNOWN, section: "other" },
  hepABVac: { type: "radio", options: YES_NO_UNKNOWN, section: "other" },
  hepC: { type: "radio", options: YES_NO_UNKNOWN, section: "other" },
  // hepC_diag: { type: "radio", options: HCV_THERAPY, section: "other" },
  hepC_tm: { type: "checkbox", options: YES_NO_UNKNOWN, section: "other" },

  // berater
  besucherkennung: { type: "text", section: "berater" },

  testanforderungen: { 
    type: "checkbox", 
    section: "berater",
    options: [
      // Beratung
      { code: "counsel", labels: { de: "Nur Beratung", en: "Counsel only", tr: "Nur Beratung", uk: "Лише консультація" }, group: "Beratung" },

      // HIV
      { code: "hiv_poc", labels: { de: "HIV Schnelltest", en: "HIV rapid test", tr: "HIV Schnelltest", uk: "Швидкий тест на ВІЛ" }, group: "HIV" },
      { code: "hiv_lab", labels: { de: "HIV Labor", en: "HIV lab test", tr: "HIV Labor", uk: "Лабораторний тест на ВІЛ" }, group: "HIV" },

      // Syphilis
      { code: "tp", labels: { de: "Syphilis (Labor)", en: "Syphilis (lab)", tr: "Sifiliz (Labor)", uk: "Сифіліс (лаб.)" }, group: "Syphilis" },

      // Gonorrhoe/Chlam
      { code: "go_ct_throat", labels: { de: "Rachen", en: "Rachen", tr: "Rachen", uk: "Rachen" }, group: "Gonorrhoe/Chlamydien" },
      { code: "go_ct_urine", labels: { de: "Urin", en: "Urin", tr: "Urin", uk: "Urin" }, group: "Gonorrhoe/Chlamydien" },
      { code: "go_ct_anal", labels: { de: "Rektal", en: "Rektal", tr: "Rektal", uk: "Rektal" }, group: "Gonorrhoe/Chlamydien" },

      // // Chlamydien
      // { code: "chlam_throat", labels: { de: "Rachen-CHL", en: "Rachen-CHL", tr: "Rachen-CHL", uk: "Rachen-CHL" }, group: "Chlamydien" },
      // { code: "chlam_urine", labels: { de: "Urin-CHL", en: "Urin-CHL", tr: "Urin-CHL", uk: "Urin-CHL" }, group: "Chlamydien" },
      // { code: "chlam_anal", labels: { de: "Rektal-CHL", en: "Rektal-CHL", tr: "Rektal-CHL", uk: "Rektal-CHL" }, group: "Chlamydien" },

      // HAV
      { code: "hav", labels: { de: "HAV", en: "HAV", tr: "HAV", uk: "HAV" }, group: "Hepatitiden" },
      { code: "anti-hbc", labels: { de: "Anti-HBC", en: "Anti-HBC", tr: "Anti-HBC", uk: "Anti-HBC" }, group: "Hepatitiden" },
      { code: "hcv", labels: { de: "HCV", en: "HCV", tr: "HCV", uk: "HCV" }, group: "Hepatitiden" }

    ]
  },

  beraterkennung: { type: "text", section: "berater" },
  beraterkommentar: { type: "textarea", section: "berater" },
};

// map code → localized label; safe when no options (text)
const labelFor = (qid: string, code: string, lang: Lang) => {
  const opt = Q[qid]?.options?.find(o => o.code === code);
  return opt?.labels?.[lang] ?? code;
};

// // Inject PNR only for radio/checkbox
// for (const key of Object.keys(Q)) {
//   const def = Q[key];
//   if (
//     key !== "testanforderungen" &&
//     (def.type === "radio" || def.type === "checkbox") && def.options) {
//     const o = def.options;
//     if (!o.some(x => x.code === "pnr")) o.push(PNR);
//   }
// }

function optionsFor(opts: Opt[], lang: Lang) {
  return opts.filter(o => o.code !== "pnr").map(o => ({ value: o.code, label: o.labels[lang] ?? o.code }));
}

export default function EQuestionnaireWired() {
  const [lang, setLang] = useState<Lang>("de");
  const [responses, setResponses] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem("responses_draft");
    return saved ? JSON.parse(saved) : {};
  });
  const [backup, setBackup] = useState<Record<string, any>>({});
  // const sections = ["general","hiv","sexpractices","other","summary","berater"] as const; // unused

  useEffect(() => {
    localStorage.setItem("responses_draft", JSON.stringify(responses));
  }, [responses]);

  function isSkipped(qid: string): boolean {
    const v = responses[qid];
    return v === "pnr" || (Array.isArray(v) && v.length === 1 && v[0] === "pnr");
  }
  function skipQuestion(qid: string) {
    const def = Q[qid];
    setBackup(prev => ({ ...prev, [qid]: responses[qid] }));
    setResponses(prev => ({ ...prev, [qid]: def.type === "radio" ? "pnr" : ["pnr"] }));
  }
  function unskipQuestion(qid: string) {
    setResponses(prev => {
      const next = { ...prev };
      if (Object.prototype.hasOwnProperty.call(backup, qid)) next[qid] = backup[qid];
      else delete next[qid];
      return next;
    });
    setBackup(prev => {
      const { [qid]: _, ...rest } = prev;
      return rest;
    });
  }

  function handleTestanforderungChange(
  code: string,
  checked: boolean,
  qid: string
  ) {
    setResponses((prev) => {
      let arr = new Set<string>(prev[qid] || []);

      if (checked) {
        arr.add(code);

        // Nur Beratung clears all others
        if (code === "counsel") {
          return { ...prev, [qid]: ["counsel"] };
        }

        // Any other clears "counsel"
        arr.delete("counsel");

        // Gonorrhoe auto-selects Chlamydien
        if (GONO_CHLAM_MAP[code]) {
          const chl = GONO_CHLAM_MAP[code];
          const chlamArr = new Set<string>(prev[qid] || []);
          chlamArr.add(chl);
          arr.add(chl); // ensure in same set
        }
      } else {
        arr.delete(code);

        // Gonorrhoe auto-deselects Chlamydien
        if (GONO_CHLAM_MAP[code]) {
          const chl = GONO_CHLAM_MAP[code];
          arr.delete(chl);
        }
      }

      return { ...prev, [qid]: Array.from(arr) };
    });
  }

  const renderQuestion = (qid: string) => {
    const def = Q[qid];
    const title = titleFor(qid, lang);

    if (isSkipped(qid)) {
      return (
        <div key={qid} className="mb-6 border rounded-md p-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            <Button variant="ghost" size="sm" onClick={() => unskipQuestion(qid)}>
              {ANSWER_LABEL[lang]}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{SKIP_LABEL[lang]}</p>
        </div>
      );
    }

    if (def.type === "radio") {
      const o = optionsFor(def.options!, lang);
      return (
        <div key={qid} className="mb-6">
          <h3 className="mb-2 text-lg font-medium">{title}</h3>
          <RadioGroup
            className={ANSWER_INDENT}
            value={responses[qid] || ""}
            onValueChange={(val) => setResponses(prev => ({ ...prev, [qid]: val }))}
          >
            {o.map((item, i) => (
              <div className="flex items-center space-x-2" key={`${qid}-${item.value}`}>
                <RadioGroupItem value={item.value} id={`${qid}-${i}`} />
                <Label htmlFor={`${qid}-${i}`}>{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {qid !== "testanforderungen" && (
            <div className="mt-2">
              <Button variant="link" size="sm" onClick={() => skipQuestion(qid)}>
                {SKIP_LABEL[lang]}
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (def.type === "text" || def.type === "textarea") {
      const value = responses[qid] ?? "";
      const ph = def.placeholder?.[lang] ?? "";
      return (
        <div key={qid} className="mb-6">
          <h3 className="mb-1 text-lg font-medium">{title}</h3>
          {def.type === "text" ? (
            <Input value={value} placeholder={ph} onChange={(e) => setResponses(p => ({ ...p, [qid]: e.target.value }))} />
          ) : (
            <Textarea value={value} placeholder={ph} rows={4} onChange={(e) => setResponses(p => ({ ...p, [qid]: e.target.value }))} />
          )}
        </div>
      );
    }

    if (def.type === "checkbox" && def.options) {
  const selected: string[] = responses[qid] || [];
  const groups = def.options.reduce((acc, opt) => {
    const g = opt.group ?? "";
    if (!acc[g]) acc[g] = [];
    acc[g].push(opt);
    return acc;
  }, {} as Record<string, Opt[]>);

  return (
    <div key={qid} className="mb-6">
      <h3 className="mb-2 text-lg font-medium">{titleFor(qid, lang)}</h3>
      <div className={`${ANSWER_INDENT} `}>
  {Object.entries(groups).map(([group, opts]) => (
    <div key={group} className="mb-6">
      {group && (
        <p className="font-semibold text-sm text-blue-600 mb-1">{group}</p>
      )}

      <div
        className={
          qid === "testanforderungen"
            ? "flex flex-wrap gap-x-4 gap-y-2"   // horizontal for testanforderungen
            : "flex flex-col space-y-2"          // vertical for others
        }
      >
        {opts.map((item) => {
          const checked = selected.includes(item.code);
          return (
            <label
              key={`${qid}-${item.code}`}
              htmlFor={`${qid}-${item.code}`}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`${qid}-${item.code}`}
                checked={checked}
                disabled={
                  responses[qid]?.includes("counsel") && item.code !== "counsel"
                }
                onCheckedChange={(c) =>
                  handleTestanforderungChange(item.code, c === true, qid)
                }
              />
              <span>{item.labels[lang]}</span>
            </label>
          );
        })}
      </div>


    </div>
  ))}
  {qid !== "testanforderungen" && (
    <div className="mt-2">
      <Button variant="link" size="sm" onClick={() => skipQuestion(qid)}>
        {SKIP_LABEL[lang]}
      </Button>
    </div>
   )} 
</div>
    </div>
  );
}

  };

  const [activeTab, setActiveTab] = useState<"general"|"hiv"|"sexpractices"|"other"|"summary"|"berater">("general");
  const hivDisabled = responses["hiv_test"] === "no";

  const QUESTION_ORDER = Object.keys(Q);

  const unansweredDE = QUESTION_ORDER
  .filter(qid => responses[qid] === undefined || responses[qid] === "" || (Array.isArray(responses[qid]) && responses[qid].length === 0))
  .map(qid => titleFor(qid, "de"));


  const pretty = Object.fromEntries(
    QUESTION_ORDER
    .filter(qid => responses[qid] !== undefined && responses[qid] !== "")
    .map(qid => {
      const val = responses[qid];
      const def = Q[qid];
      const title = titleFor(qid, "de");
      if (def?.options) {
        return [
          title,
          Array.isArray(val)
            ? val.map(c => labelFor(qid, c, "de"))
            : labelFor(qid, val, "de"),
        ];
      }
      return [title, val];
    })
    // Object.entries(responses).map(([qid, val]) => {
    //   const def = Q[qid];
    //   const title = titleFor(qid, "de");
    //   if (def?.options) {
    //     return [title, Array.isArray(val) ? val.map(c => labelFor(qid, c, "de")) : labelFor(qid, val, "de")];
    //   }
    //   return [title, val];
    // })
  );

  const [submitState, setSubmitState] = useState<
  { status: "idle" | "submitting" | "success" | "error"; message?: string }
>({ status: "idle" });

function buildPayload() {
  // by default submit raw codes; optionally include a label view for humans
  const labeled = Object.fromEntries(
    Object.entries(responses).map(([qid, val]) => {
      const def = Q[qid];
      const title = titleFor(qid, lang);
      if (!def?.options) return [title, val]; // text/textarea
      const toLabel = (code: string) => {
        const opt = def.options!.find(o => o.code === code);
        return opt?.labels?.[lang] ?? code;
      };
      return [title, Array.isArray(val) ? val.map(toLabel) : toLabel(val)];
    })
  );

  return {
    meta: {
      schemaVersion: SCHEMA_VERSION,
      lang,
      timestamp: new Date().toISOString(),
      // optionally include app/session identifiers:
      visitorId: responses["besucherkennung"] ?? null,
    },
    data: SUBMIT_LABELS ? labeled : responses,
  };
}

// async function submit(payload: any) {
//   const isTauri = typeof (window as any).__TAURI__ !== "undefined";

//   try {
//     if (isTauri) {
//       const { fetch } = await import("@tauri-apps/plugin-http");
//       await fetch(ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     } else {
//       await window.fetch(ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     }
//     alert("Gesendet!");
//   } catch (err) {
//     console.error("submit failed", err);
//     // local outbox fallback (Tauri only)
//     if (isTauri) {
//       const { writeTextFile, createDir, BaseDirectory } = await import("@tauri-apps/plugin-fs");
//       await createDir("questionnaire/outbox", { baseDir: BaseDirectory.Document, recursive: true });
//       const fname = `outbox_${Date.now()}.json`;
//       await writeTextFile(`questionnaire/outbox/${fname}`, JSON.stringify(payload, null, 2), {
//         baseDir: BaseDirectory.Document,
//       });
//       alert("Kein Server erreicht – lokal gespeichert (Dokumente/questionnaire/outbox).");
//     }
//   }
// }

// define the order of all questions in CSV
const QUESTION_ORDER_OUT = [
  "besucherkennung",
  "gender",
  "beraterkennung",
  "beraterkommentar",
  "testanforderungen",  
  "orientation",
  "birthCountry",
  "insurance",
  "doctor",
  "hiv_test",
  "riskType",
  "hiv_risk_selfest",
  "sexualRiskTime",
  "riskCountry",
  "risk_situation",
  "risk_situation_d1_1",
  "risk_situation_d1_2",
  "risk_situation_d1_3",
  "risk_situation_d1_4",
  "sti_history_yesno",
  "sti_history_which",
  "sti_history_treat",
  "sti_history_treat_country",
  "hepA",
  "hepB",
  "hepABVac",
  "hepC",
  "hepC_tm",
];


async function submitResponses() {

  // validation: Besucher-ID and Beraterkennung required
  if (!responses["besucherkennung"] || !responses["beraterkennung"]) {
    alert("Bitte Besucher-ID und Beraterkennung eingeben, bevor Sie absenden.");
    return;
  }

  setSubmitState({ status: "submitting" });
  const payload = buildPayload();

  try {
    const filePath = "Z:\\Project(e), Arbeitsbereich(e)\\Check-up Duisburg Kreis Wesel\\fuertorben";
    // must exist: /Users/tk/js/antworten.csv

    // Flatten the questionnaire into a row-oriented record
    const flat: Record<string, string | boolean> = {
      timestamp: payload.meta.timestamp,
      // visitorId: payload.meta.visitorId ?? "",
    };

    for (const [qid, val] of Object.entries(payload.data)) {
      // if (qid === "visitorId" || qid === "timestamp") continue; // ✅ skip
      const def = Q[qid];
      if (def?.type === "checkbox" && def.options) {
        for (const opt of def.options) {
          flat[`${qid}_${opt.code}`] = Array.isArray(val) && val.includes(opt.code);
        }
      } else {
        flat[qid] = Array.isArray(val) ? val.join(";") : String(val ?? "");
      }
    }

    // Build header and row
    // const header = Object.keys(flat).join(",");
    const header = [
        "timestamp", 
        "visitorId",
        ...QUESTION_ORDER_OUT.flatMap(qid => {
          const def = Q[qid];
          if (def?.type === "checkbox" && def.options) {
            return def.options.map(opt => `${qid}_${opt.code}`);
          }
          return [qid];
        })
      ].join(",");


    // const row = Object.keys(flat)
    //   .map(k => {
    //     const val = flat[k];
    //     return typeof val === "boolean"
    //       ? (val ? "true" : "false")
    //       : `"${String(val ?? "").replace(/"/g, '""')}"`;
    //   })
    //   .join(",");
    const flatRow: string[] = [];
    flatRow.push(payload.meta.timestamp);
    flatRow.push(payload.meta.visitorId ?? "");

    for (const qid of QUESTION_ORDER_OUT) {
      const def = Q[qid];
      const val = responses[qid];

      if (def?.type === "checkbox" && def.options) {
        for (const opt of def.options) {
          flatRow.push(Array.isArray(val) && val.includes(opt.code) ? "true" : "false");
        }
      } else {
        flatRow.push(val ? `"${String(val).replace(/"/g, '""')}"` : "");
      }
    }

    const row = flatRow.join(",");

    // One single call to Rust
    await invoke("append_csv", {
      path: filePath,
      row,
      header, // plain string
    });

    // setSubmitState({ status: "success" });
    setSubmitState({
      status: "success",
      message: `Besucher-ID: ${responses["besucherkennung"] || "-"}, Berater-ID: ${responses["beraterkennung"] || "-"}`
    });
    alert(
      `Antwort gespeichert in CSV:\n${filePath}\n\nBesucher-ID: ${responses["besucherkennung"] || "-"}\nBerater-ID: ${responses["beraterkennung"] || "-"}`
    );
        

    // 🔄 Reset everything for next participant
    setResponses(prev => ({ 
      beraterkennung: prev.beraterkennung ?? "" 
    }));
    setBackup({});
    localStorage.removeItem("responses_draft");
    // setActiveTab("general");   // go back to first tab
        
  } catch (err: any) {
          console.error("CSV append failed", err);
          setSubmitState({
            status: "error",
            message: err?.message ?? JSON.stringify(err),
          });
    }
  }


  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold uppercase text-white 
  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
  px-3 py-1 rounded-full shadow-md">
            DEVEL {CURR_VERSION}
          </span>
          <h1 className="text-2xl font-semibold">Checkpoint Fragebogen</h1>
        </div>
        <div className="flex items-center space-x-2">
          {(["de","en","tr","uk"] as Lang[]).map(l => (
            <Button key={l} variant={l === lang ? "default" : "outline"} onClick={() => setLang(l)} aria-pressed={l === lang}>
              {l.toUpperCase()}
            </Button>
          ))}
        </div>
      </header>



      <Tabs value={activeTab} onValueChange={(v:any)=>setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="hiv" disabled={hivDisabled} className={clsx(hivDisabled && "opacity-50")}>
            HIV Risiko
          </TabsTrigger>
          <TabsTrigger value="sexpractices">Sexualverhalten</TabsTrigger>
          <TabsTrigger value="other">Impfungen & Infektionen</TabsTrigger>
          <TabsTrigger value="berater">Beratereingaben</TabsTrigger>
          <TabsTrigger value="summary">Prüfen & Senden</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          {Object.entries(Q).filter(([_,v])=>v.section==="general").map(([qid]) => renderQuestion(qid))}
          <div className="flex justify-end">
            <Button onClick={()=>setActiveTab("hiv")}>Next: HIV</Button>
          </div>
        </TabsContent>

        <TabsContent value="hiv">
          {Object.entries(Q).filter(([_,v])=>v.section==="hiv").map(([qid]) => renderQuestion(qid))}
          <div className="flex justify-end">
            <Button onClick={()=>setActiveTab("sexpractices")}>Next: Sexpraktiken</Button>
          </div>
        </TabsContent>

        <TabsContent value="sexpractices">
          {Object.entries(Q).filter(([_,v])=>v.section==="sexpractices").map(([qid]) => renderQuestion(qid))}
          <div className="flex justify-end">
            <Button onClick={()=>setActiveTab("other")}>Next: Vorgeschichte</Button>
          </div>
        </TabsContent>

        <TabsContent value="other">
          {Object.entries(Q).filter(([_,v])=>v.section==="other").map(([qid]) => renderQuestion(qid))}
          <div className="flex justify-end">
            <Button onClick={()=>setActiveTab("summary")}>Next: Summary</Button>
          </div>
        </TabsContent>

       

        <TabsContent value="berater">
          {Object.entries(Q)
            .filter(([_, v]) => v.section === "berater")
            .map(([qid]) => renderQuestion(qid))}

          <div className="mt-4 flex items-center justify-end">
            <Button variant="outline" onClick={() => setActiveTab("summary")}>
              Weiter zum Absenden
            </Button>
{/* 
            <Button onClick={submitResponses} 
              disabled={
                submitState.status === "submitting" ||
                !responses["besucherkennung"] ||
                !responses["beraterkennung"]
              }
            >
              {submitState.status === "submitting" ? "Absenden…" : "Absenden"}
            </Button> */}

          </div>

          {/* {submitState.status === "success" && (
            <p className="mt-2 text-sm text-green-700">Submitted ✓</p>
          )}
          {submitState.status === "error" && (
            <p className="mt-2 text-sm text-red-700">Submission failed: {submitState.message}</p>
          )} */}
        </TabsContent>

        <TabsContent value="summary">
          <h3 className="font-semibold mb-2">Beantwortet:</h3>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
            {JSON.stringify(pretty, null, 2)}
          </pre>

          <h3 className="font-semibold mt-4 mb-2">Noch offen:</h3>
          <ul className="list-disc pl-5 text-sm">
            {unansweredDE.map(q => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col items-end space-y-2">
          <Button
            onClick={submitResponses}
            disabled={
              submitState.status === "submitting" ||
              !responses["besucherkennung"] ||
              !responses["beraterkennung"]
            }
          >
            {submitState.status === "submitting" ? "Absenden…" : "Absenden"}
          </Button>


          {!responses["besucherkennung"] && (
            <p className="text-sm text-red-600 text-right">
              Absenden ist nur möglich, wenn eine <strong>Besucher-ID</strong> eingetragen ist.
            </p>
          )}

          {!responses["beraterkennung"] && (
            <p className="text-sm text-red-600 text-right">
              Absenden ist nur möglich, wenn eine <strong>Beraterkennung</strong> eingetragen ist.
          </p>
          )}
        </div>

        {submitState.status === "success" && (
          <p className="mt-2 text-sm text-green-700 text-right">
            {submitState.message} ✓ 
          </p>
        )}

        {submitState.status === "error" && (
          <p className="mt-2 text-sm text-red-700 text-right">
            Submission failed: {submitState.message}
          </p>
        )}
        </TabsContent>

         {/* <TabsContent value="summary">
          <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(pretty, null, 2)}</pre>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
