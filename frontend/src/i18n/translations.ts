/// translations of questions and answering options
/// VERSION 0.7
/// bei version upddate -> copy / paste -> edit und dann neu abspeichern (provenienz)

export type Lang = "de" | "en" | "tr" | "uk";

export type Opt = { 
  code: string; 
  labels: Record<Lang, string>; 
  group?: string; // new → group name
};

export const QTITLE: Record<string, Record<Lang, string>> = {
  // TAB: Allgemein
  
  gender_assigned: {
  de: "Welches Geschlecht wurde Dir bei der Geburt zugewiesen?",
  en: "What sex were you assigned at birth?",
  tr: "Doğumda sana hangi cinsiyet atandı?",
  uk: "Яку стать тобі було призначено при народженні?"
},
gender_identity_alignment: {
  de: "Identifizierst du dich aktuell mit dem Geschlecht, das dir bei der Geburt zugewiesen wurde?",
  en: "Do you currently identify with the sex you were assigned at birth?",
  tr: "Şu anda doğumda sana atanan cinsiyetle özdeşleşiyor musun?",
  uk: "Чи ототожнюєш ти себе зараз із статтю, призначеною тобі при народженні?"
},
  gender:            { de: "Wie beschreibst Du Deine Geschlechtsidentität?", en: "How do you describe your current gender identity?", tr: "Şu anki cinsiyet kimliğini nasıl tanımlarsın?", uk: "Як ти описуєш свою поточну гендерну ідентичність?" },
  gender_other: {
    de: "Andere Geschlechtsidentität – bitte angeben",
    en: "Other gender identity – please specify",
    tr: "Başka bir cinsiyet kimliği – lütfen belirtin",
    uk: "Інша гендерна ідентичність – будь ласка, вкажіть"
  },
  orientation:       { de: "Wie beschreibst Du Deine sexuelle Orientierung?", en: "How do you describe your sexual orientation?", tr: "Cinsel yönelimini nasıl tanımlarsın?", uk: "Як ти описуєш свою сексуальну орієнтацію?" },
  orientation_other:       { de: 'Andere sexuelle Orientierung – bitte angeben', en: "Other sexual orientation – please specify", tr: "Başka bir cinsel yönelim – lütfen belirtin", uk: "Інша сексуальна орієнтація – будь ласка, вкажіть"},
  
  birth_country:      { de: "Wo bist Du geboren?", en: "Where were you born?", tr: "Nerede doğdun?", uk: "Де ти народився/народилася?" },
  insurance:         { de: "Bist Du krankenversichert?", en: "Do you have health insurance?", tr: "Sağlık sigortan var mı?", uk: "Чи маєш медичне страхування?" },
  doctor:            { de: "Hast Du eine Hausärztin oder einen Hausarzt?", en: "Do you have a primary care doctor?", tr: "Bir aile hekimin var mı?", uk: "Чи маєш сімейного лікаря?" },
  hiv_test:          { de: "Möchtest Du heute einen HIV Test machen?", en: "Would you like to take an HIV test today?", tr: "Bugün HIV testi yaptırmak ister misin?", uk: "Хочеш сьогодні здати тест на ВІЛ?" },

  // TAB: HIV-Risiko
  risk_type:          { de: "Warum möchtest Du Dich auf HIV testen lassen?", en: "For what reason would you like to be tested for HIV?", tr: "HIV testi yaptırmak istemenin nedeni nedir?", uk: "З якої причини ти хочеш пройти тест на ВІЛ?" },
  risk_type_other: {
    de: "Warum möchtest Du Dich auf HIV testen lassen? Anderer Grund – bitte angeben",
    en: "Why would you like to get tested for HIV? Other reason – please specify",
    tr: "Neden HIV testi yaptırmak istiyorsunuz? Başka bir neden – lütfen belirtin",
    uk: "Чому ти хочеш пройти тест на ВІЛ? Інша причина — будь ласка, вкажіть",
  },  
  prep_use:          { de: "Nimmst Du aktuell eine HIV-Präexpositionsprophylaxe (PrEP)?", en: "Are you currently taking HIV pre-exposure prophylaxis (PrEP)?", tr: "Şu anda HIV için temas öncesi koruyucu tedavi (PrEP) kullanıyor musun?", uk: "Чи приймаєш ти наразі доконтактну профілактику ВІЛ (PrEP)?" },
  hiv_risk_selfest:  { de: "Wie schätzt Du Dein persönliches Risiko einer HIV-Ansteckung ein?", en: "How do you rate the risk of a possible HIV infection?", tr: "Olası HIV bulaşma riskini nasıl değerlendiriyorsun?", uk: "Як ти оцінюєш ризик можливого зараження ВІЛ?" },
  hiv_test_prev:     { de: "Wurdest Du schon früher auf HIV getestet?", en: "Tested for HIV before?", tr: "Daha önce HIV testi?", uk: "Раніше тест на ВІЛ?" },
  hiv_test_prev_year: {de: "In welchem Jahr zuletzt?", en: "In which year was your last test?", tr: "Son testiniz hangi yıldaydı?", uk: "У якому році був останній тест?",},
  hiv_test_prev_count:{de: "Wie oft?", en: "How many times?", tr: "Kaç kez?", uk: "Скільки разів?",},
  sexual_risk_time:    { de: "Wie lange liegt die letzte Risikosituation zurück?", en: "How long ago was the last risk situation?", tr: "Son riskli durum ne kadar zaman önceydi?", uk: "Скільки часу минуло від твоєї останньої ризикової ситуації?" },
  risk_country:       { de: "In welchem Land hattest Du die Risikosituation?", en: "In which country did the risk situation occur?", tr: "Riskli durum hangi ülkede gerçekleşti?", uk: "У якій країні сталася ризикова ситуація?" },
  risk_situation:    { de: "Wobei oder mit wem hattest Du die Risikosituation?", en: "In what context or with whom did the risk situation occur?", tr: "Riskli durum hangi bağlamda veya kiminle gerçekleşti?", uk: "У якому контексті або з ким сталася ризикова ситуація?" },
  risk_situation_other: {
    de: "Wobei oder mit wem hattest Du die Risikosituation? Anderer Grund – bitte angeben",
    en: "In what situation or with whom did the risk occur? Other reason – please specify",
    tr: "Riskli durum hangi bağlamda ya da kiminle gerçekleşti? Başka bir neden – lütfen belirtin",
    uk: "У якому контексті або з ким сталася ризикова ситуація? Інша причина — будь ласка, вкажіть"
  },
  // TAB: Sex & Schutz
  risk_gv: {
    de: "Ungeschützter Anal- oder Vaginalverkehr?",
    en: "Unprotected anal or vaginal sex?",
    tr: "Korunmasız anal veya vajinal ilişki?",
    uk: "Незахищений анальний або вагінальний секс)?"
  },  
  risk_condom: { de: "Kondom abgerutscht/gerissen?",      en: "Condom slipped/torn?",          tr: "Prezervatif kaydı/yırtıldı?",  uk: "Презерватив зісковзнув/порвався?" },
  risk_oral: { de: "Oralverkehr?",                        en: "Oral sex?",                     tr: "Oral seks?",                   uk: "Оральний секс?" },
  risk_reasons: { de: "Gründe ohne Kondom",                  en: "Reasons for no condom",         tr: "Prezervatifsiz ilişki nedenleri", uk: "Причини без презерватива" },
  risk_reasons_other: {
    de: "Anderer Grund für Sex ohne Kondom – bitte angeben",
    en: "Other reason for sex without a condom – please specify",
    tr: "Prezervatifsiz ilişki için başka bir neden – lütfen belirtin",
    uk: "Інша причина сексу без презерватива – будь ласка, вкажіть"
  },  
  risk_drugs: { de: "Drogenkonsum?",                       en: "Drug use?",                     tr: "Uyuşturucu kullanımı?",       uk: "Вживання наркотиків?" },
  
  // TAB: Gesundheit und Vorsorge
  sti_history_yesno:    { de: "Hattest Du schon einmal eine sexuell übertragbare Infektion (STI)?", en: "Ever diagnosed with an STI?", tr: "Hiç CYBH tanısı oldu mu?", uk: "Колись діагностували ІПСШ?" },
  sti_history_which:    { de: "Welche STI?",                     en: "Which STI?",                 tr: "Hangi CYBH?",              uk: "Яку саме ІПСШ?" },
  sti_history_years: {
    de: "In welchem Jahr hattest du die STI?",
    en: "In which year did you have the STI?",
    tr: "CYBH'yi hangi yılda geçirdin?",
    uk: "У якому році у тебе була ІПСШ?"
  },
  // sti_history_treat_year:    { de: "In welchem Jahr wurde die STI behandelt?", en: "In which year was the STI treated?", tr: "STI hangi yıl tedavi edildi?", uk: "У якому році лікували ІПСШ?" },  // 
  // sti_history_treat_country: { de: "In welchem Land behandelt?", en: "Treated in which country?", tr: "Hangi ülkede tedavi edildi?", uk: "В якій країні лікували?" },
  hep_a_history:      { de: "Hepatitis A geimpft?", en: "Vaccinated against Hep A?", tr: "Hepatit A aşılı mı?", uk: "Щеплення від гепатиту A?" },
  hep_a_infection_year: { de: "Hepatitis A - Jahr der Infektion", en: "Hepatitis A – year of infection", tr: "Hepatit A – enfeksiyon yılı", uk: "Гепатит A – рік інфекції" },
  hep_b_history:      { de: "Hepatitis B geimpft?", en: "Vaccinated against Hep B?", tr: "Hepatit B aşılı mı?", uk: "Щеплення від гепатиту B?" },
  hep_b_infection_year: { de: "Hepatitis B - Jahr der Infektion", en: "Hepatitis B – year of infection", tr: "Hepatit B – enfeksiyon yılı", uk: "Гепатит B – рік інфекції" },
  hep_ab_vax:  { de: "Bei unklarem Schutz gegen Hepatitis A und B: Soll dieser überprüft werden?", en: "Serology Hep A/B if unclear?", tr: "Durum belirsizse A/B serolojisi?", uk: "Серологія A/B при невизначеному статусі?" },
  hep_c_history:      { de: "Wurde jemals eine Hepatitis C Infektion diagnostiziert?", en: "Ever Hep C diagnosis?", tr: "Hepatit C tanısı oldu mu?", uk: "Колись діагностували гепатит C?" },
  hep_c_history_tm:   { de: "Falls Hepatitis C vorlag: Wurde sie medikamentös behandelt?",         en: "Treated with medication?", tr: "İlaçla tedavi edildi mi?", uk: "Медикаментозне лікування?" },

  // TAB: Beratereingabe
  besucher_info:  { de: "Besucher-ID & PLZ (erste 3)",   en: "Visitor ID & PLZ",     tr: "Ziyaretçi kimliği & PLZ",      uk: "Ідентифікатор відвідувача & PLZ" },
  besucherkennung:   { de: "Besucher-ID",   en: "Visitor ID",     tr: "Ziyaretçi kimliği",      uk: "Ідентифікатор відвідувача" },
  plz:   { de: "Besucher Postleitzahl (erste 3 Ziffern)",   en: "Visitor Postcode",     tr: "Posta kodu",      uk: "Поштовий індекс" },
  beraterkennung:    { de: "Beraterkennung", en: "Counselor ID",   tr: "Danışman kimliği",       uk: "Ідентифікатор консультанта" },
  beraterkommentar:  { de: "Kommentar",      en: "Comment",        tr: "Yorum",                  uk: "Коментар" },
  testanforderungen: { de: "Testanforderungen", en: "Test requests", tr: "Test istemleri",        uk: "Запити на тести" },
};

/// ANWERING OPTIONS & TRANSLATIONS
export const YES_NO: Opt[] = [
  { code: "yes", labels: { de: "Ja", en: "Yes", tr: "Evet", uk: "Так" } },
  { code: "no",  labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
];

export const YES_NO_UNKNOWN: Opt[] = [
  ...YES_NO,
  { code: "unknown", labels: { de: "Weiß nicht", en: "Don't know", tr: "Bilmiyorum", uk: "Не знаю" } },
];

export const ORIENTATION: Opt[] = [
  { code: "heterosexual", labels: { de: "Heterosexuell", en: "Heterosexual", tr: "Heteroseksüel", uk: "Гетеросексуальний" } },
  { code: "gay_lesbian", labels: { de: "Schwul/Lesbisch", en: "Gay/Lesbian", tr: "Gey/Lezbiyen", uk: "Гей/Лесбійка" } },
  { code: "bisexual", labels: { de: "Bisexuell", en: "Bisexual", tr: "Biseksüel", uk: "Бісексуальний" } },
  { code: "other", labels: { de: "Anders", en: "Other", tr: "Diğer", uk: "Інше" } },
];

// const SEX_BIRTH: Opt[] = [
//   { code: "male", labels: { de: "Männlich", en: "Male", tr: "Erkek", uk: "Чоловіча" } },
//   { code: "female", labels: { de: "Weiblich", en: "Female", tr: "Kadın", uk: "Жіноча" } },
// ];

export const GENDER: Opt[] = [
  { code: "male", labels: { de: "Männlich", en: "Male", tr: "Erkek", uk: "Чоловіча" } },
  { code: "female", labels: { de: "Weiblich", en: "Female", tr: "Kadın", uk: "Жіноча" } },
  // { code: "intersex", labels: { 
  //   de: "Intersex", 
  //   en: "Intersex", 
  //   tr: "İnterseks", 
  //   uk: "Інтерсекс" 
  // }  },
  // { code: "transman", labels: { de: "Trans Mann", en: "Trans man", tr: "Trans erkek", uk: "Трансчоловік" } },
  // { code: "transwoman", labels: { de: "Trans Frau", en: "Trans woman", tr: "Trans kadın", uk: "Трансжінка" } },
  { code: "diverse", labels: { de: "Nicht-binär / divers", en: "Non-binary / diverse", tr: "Non-binary / diğer", uk: "Небінарна / інша" } },
  { code: "other", labels: { de: "Anders", en: "Other", tr: "Diğer", uk: "Інше" } },
];

export const BIRTH_COUNTRY: Opt[] = [
  { code: "de", labels: { de: "Deutschland", en: "Germany", tr: "Almanya", uk: "Німеччина" } },
  { code: "eu", labels: { de: "EU (nicht DE)", en: "EU (non-DE)", tr: "AB (DE değil)", uk: "ЄС (крім Німеччини)" } },
  { code: "non_eu", labels: { de: "Nicht-EU", en: "Non-EU", tr: "AB dışı", uk: "Поза ЄС" } },
];

export const HIV_RISK: Opt[] = [
  { code: "risk_myself", labels: { de: "Eigene Risikosituation(en)", en: "Own risk situation(s)", tr: "Kendi risk durumu/durumları", uk: "Власна ризикова ситуація/ситуації" } },
  { code: "risk_partner", labels: { de: "Risikosituation(en) bei Partner:in", en: "Partner’s risk situation(s)", tr: "Partnerin risk durumu/durumları", uk: "Ризикова ситуація у партнера/партнерки" } },
  { code: "routine", labels: { de: "Regelmäßige HIV-Kontrolle", en: "Routine HIV testing", tr: "Rutin HIV kontrolü", uk: "Регулярна перевірка ВІЛ" } },
  { code: "new_relationship", labels: { de: "Neue Beziehung", en: "New relationship", tr: "Yeni ilişki", uk: "Нові стосунки" } },
  { code: "partner_hivPositive", labels: { de: "Partner:in oder Sexualkontakt ist HIV-positiv", en: "Partner or sexual contact is HIV-positive", tr: "Partner veya cinsel temas HIV pozitif", uk: "Партнер або сексуальний контакт ВІЛ-позитивний" } },
  { code: "other", labels: { de: "Anderer Grund", en: "Other reason", tr: "Diğer neden", uk: "Інша причина" } },
];

export const PERCEIVED_RISK: Opt[] = [
  { code: "none", labels: { de: "Kein Risiko", en: "No risk", tr: "Risk yok", uk: "Немає ризику" } },
  { code: "low", labels: { de: "Gering", en: "Low", tr: "Düşük", uk: "Низький" } },
  { code: "medium", labels: { de: "Mittel", en: "Medium", tr: "Orta", uk: "Середній" } },
  { code: "high", labels: { de: "Erhöht", en: "High", tr: "Yüksek", uk: "Високий" } },
];

export const LAST_RISK_TIME: Opt[] = [
  { code: "lt3d", labels: { de: "0 - 3 Tage", en: "0 - 3 days", tr: "0 - 3 gün", uk: "0 - 3 дні" } },
  { code: "4t9d", labels: { de: "4 - 9 Tage", en: "4 - 9 days", tr: "4 - 9 gün", uk: "4 - 9 днів" } },
  { code: "10t14d", labels: { de: "10 - 14 Tage", en: "10 - 14 days", tr: "10 - 14 gün", uk: "10 - 14 днів" } },
  { code: "15dt6w", labels: { de: "15 Tage - 6 Wochen", en: "15 days - 6 weeks", tr: "15 gün - 6 hafta", uk: "15 днів - 6 тижнів" } },
  { code: "6wt3m", labels: { de: "6 Wochen - 3 Monate", en: "6 weeks - 3 months", tr: "6 hafta - 3 ay", uk: "6 тижнів - 3 місяці" } },
  { code: "gt3m", labels: { de: "mehr als 3 Monate", en: "more than 3 months", tr: "3 aydan fazla", uk: "більше ніж 3 місяці" } },
];

export const RISK_COUNTRY: Opt[] = [
  { code: "de", labels: { de: "Deutschland", en: "Germany", tr: "Almanya", uk: "Німеччина" } },
  { code: "eu", labels: { de: "EU (nicht DE)", en: "EU (non-DE)", tr: "AB (DE değil)", uk: "ЄС (крім Німеччини)" } },
  { code: "non_eu", labels: { de: "Nicht-EU", en: "Non-EU", tr: "AB dışı", uk: "Поза ЄС" } },
  { code: "multiple", labels: { de: "Mehrere Länder", en: "Multiple countries", tr: "Birden fazla ülke", uk: "Кілька країн" } },
];

export const RISK_SITUATION: Opt[] = [
  { code: "partner", labels: { de: "Mit festem Partner:in", en: "With a steady partner", tr: "Düzenli partner ile", uk: "З постійним партнером/партнеркою" }, },
  { code: "acquaintance", labels: { de: "Mit einer Person, die ich länger kenne", en: "With someone I have known for a long time", tr: "Uzun süredir tanıdığım biriyle", uk: "З людиною, яку давно знаю" } },
  { code: "unknown_person", labels: { de: "Mit einer mir unbekannten Person", en: "With someone unknown to me", tr: "Tanımadığım biriyle", uk: "З незнайомою людиною" }},
  { code: "sexworker", labels: { de: "Mit Sexarbeiter:in oder Escort", en: "With a sex worker or escort", tr: "Seks işçisi veya eskort ile", uk: "Із секс-працівником/працівницею або ескортом" } },

  { code: "professional_risk", labels: { de: "Berufliches Risiko (z.B. Nadelstich, Blutkontakt)", en: "Occupational risk (e.g. needle stick)", tr: "Mesleki risk (örn. iğne batması)", uk: "Професійний ризик (напр., укол голкою)" },},
  { code: "unkwn", labels: { de: "Nicht eindeutig zuzuordnen", en: "Cannot be attributed to a specific source", tr: "Net olarak ilişkilendirilemiyor", uk: "Неможливо однозначно визначити" }, },
  { code: "other", labels: { de: "Andere Risikosituation (z.B. unsterile Injektion, medizinische Behandlung im Ausland)", en: "Other risk situation (e.g. tattoo, blood products)", tr: "Diğer riskli durum (örn. dövme, kan ürünleri)", uk: "Інша ризикова ситуація (напр., тату, препарати крові)" },},
];

export const CONDOM_REASON: Opt[] = [
  { code: "partner_refused", labels: { de: "Mein:e Sexpartner:in wollte ohne Kondom", en: "My sexual partner wanted to have sex without a condom", tr: "Cinsel partnerim prezervatifsiz ilişki istedi", uk: "Мій сексуальний партнер хотів зайнятися сексом без презерватива" } },
  { code: "myself_refused", labels: { de: "Ich wollte ohne Kondom", en: "I wanted to have sex without a condom", tr: "Prezervatifsiz ilişki istedim", uk: "Я хотів/хотіла зайнятися сексом без презерватива" } },
  { code: "partner_said_neg", labels: { de: "Mein:e Sexpartner:in hat mir gesagt, dass sie HIV-negativ ist", en: "My partner told me they are HIV negative", tr: "Partnerim HIV negatif olduğunu söyledi", uk: "Мій партнер сказав мені, що він/вона ВІЛ-негативний/на" } },
  { code: "partner_in_tm", labels: { de: "… wird behandelt und ist nicht mehr ansteckend", en: "… is treated and no longer infectious", tr: "… tedavi görüyor ve artık bulaştırıcı değil", uk: "… лікується і вже не заразний/на" } },
  { code: "trusted_partner", labels: { de: "Ich nahm an, Partner:in ist HIV-negativ", en: "I assumed partner is HIV negative", tr: "Partnerimin HIV negatif olduğunu varsaydım", uk: "Припустив/ла, що партнер ВІЛ-негативний" } },
  { code: "no_hardon", labels: { de: "Mit Kondom schwer Erektion", en: "Difficult erection with condoms", tr: "Prezervatif ile ereksiyon zor", uk: "Важко досягти ерекції з презервативом" } },
  { code: "no_condom", labels: { de: "Kein Kondom dabei", en: "No condom with me", tr: "Yanımda prezervatif yoktu", uk: "Не було презерватива" } },
  { code: "noidea", labels: { de: "Weiß nicht", en: "I don't know", tr: "Bilmiyorum", uk: "Не знаю" } },
  { code: "other", labels: { de: "Andere", en: "Other", tr: "Diğer", uk: "Інше" } },
];

export const STI_HISTORY: Opt[] = [
  { code: "syphilis", labels: { de: "Syphilis", en: "Syphilis", tr: "Frengi", uk: "Сифіліс" } },
  { code: "mkpox", labels: { de: "Affenpocken", en: "Monkeypox", tr: "Maymunpox", uk: "Монкіпокс" } },
 
  { code: "chlamydia", labels: { de: "Chlamydien", en: "Chlamydia", tr: "Klamidya", uk: "Хламідіоз" } },
  { code: "gonorrhea", labels: { de: 'Gonorrhoe ("Tripper")', en: 'Gonorrhea ("the clap")', tr: "Bel soğukluğu", uk: "Гонорея" } },
  // { code: "hpv", labels: { de: "HPV", en: "HPV", tr: "HPV", uk: "HPV" } },
  // { code: "herpes", labels: { de: "Herpes", en: "Herpes", tr: "Uçuk (Herpes)", uk: "Герпес" } },
  { code: "hepa", labels: { de: "Hepatitis A", en: "Hepatitis A", tr: "Hepatit A", uk: "Гепатит A" } },
  { code: "hepb", labels: { de: "Hepatitis B", en: "Hepatitis B", tr: "Hepatit B", uk: "Гепатит B" } },
  { code: "hepc", labels: { de: "Hepatitis C", en: "Hepatitis C", tr: "Hepatit C", uk: "Гепатит C" } },
  { code: "other", labels: { de: "Andere", en: "Other", tr: "Diğer", uk: "Інше" } },
];

export const DRUG_USE: Opt[] = [
  { code: "none", labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
  { code: "smoked_snorted", labels: { de: "Ja, ohne Spritzen (geraucht, geschnupft, oral oder anal)", en: "Yes, smoked/snorted", tr: "Evet, içilmiş/çekilmiş", uk: "Так, курив/нюхав" } },
  { code: "injected", labels: { de: "Ja, mit Spritzen (injiziert)", en: "Yes, injected", tr: "Evet, enjekte", uk: "Так, ін'єкційно" } },
];

export const GONO_CHLAM_MAP: Record<string, string> = {
  go_throat: "chlam_throat",
  go_urine: "chlam_urine",
  go_anal: "chlam_anal",
};

export const YES_NO_UNKNOWN_INF_A: Opt[] = [
  { code: "yes",     labels: { de: "Ja", en: "Yes", tr: "Evet", uk: "Так" } },
  { code: "no",      labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
  { code: "unknown", labels: { de: "Weiß nicht", en: "Don't know", tr: "Bilmiyorum", uk: "Не знаю" } },
  { code: "infection", labels: { de: "Ich hatte Hepatitis A", en: "I had hepatitis A", tr: "Hepatit A geçirdim", uk: "Я переніс/перенесла гепатит A" } },
];

export const YES_NO_UNKNOWN_INF_B: Opt[] = [
  { code: "yes",     labels: { de: "Ja", en: "Yes", tr: "Evet", uk: "Так" } },
  { code: "no",      labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
  { code: "unknown", labels: { de: "Weiß nicht", en: "Don't know", tr: "Bilmiyorum", uk: "Не знаю" } },
  { code: "infection", labels: { de: "Ich hatte Hepatitis B", en: "I had hepatitis B", tr: "Hepatit B geçirdim", uk: "Я переніс/перенесла гепатит B" } },
];

// Sex & Schutz (radio options used by risk_gv + risk_condom)
const YES_NO_ACTIVE_PASSIVE: Opt[] = [
  { code: "no", labels: { de: "Nein", en: "No", tr: "Hayır", uk: "Ні" } },
  { code: "yes_both", labels: { de: "Ja, aktiv & passiv", en: "Yes, insertive and receptive", tr: "Evet, aktif ve pasif", uk: "Так, інсертивно і рецептивно" } },
  { code: "yes_insertive", labels: { de: "Ja, aktiv (insertiv)", en: "Yes, insertive", tr: "Evet, aktif", uk: "Так, інсертивно" } },
  { code: "yes_receptive", labels: { de: "Ja, passiv (rezeptiv)", en: "Yes, receptive", tr: "Evet, pasif", uk: "Так, рецептивно" } },
];

export const RISK_GV: Opt[] = YES_NO_ACTIVE_PASSIVE;
export const RISK_CONDOM: Opt[] = YES_NO_ACTIVE_PASSIVE;

// Berater: Testanforderungen
export const TESTANFORDERUNGEN: Opt[] = [
  { code: "counsel", labels: { de: "Nur Beratung / keine Tests", en: "Counsel only", tr: "Nur Beratung", uk: "Лише консультація" }, group: "Beratung" },

  { code: "hiv_lab", labels: { de: "Labor", en: "HIV lab", tr: "HIV Labor", uk: "Лабораторний тест на ВІЛ" }, group: "HIV Suchtest" },
  { code: "hiv_poc", labels: { de: "Schnelltest (POC)", en: "HIV rapid test", tr: "HIV Schnelltest", uk: "Швидкий тест на ВІЛ" }, group: "HIV Suchtest" },

  { code: "tp", labels: { de: "Labor", en: "Syphilis lab", tr: "Sifiliz Labor", uk: "Сифіліс лаб." }, group: "Syphilis Serologie" },

  { code: "go_ct_throat", labels: { de: "Rachen", en: "Rachen", tr: "Rachen", uk: "Rachen" }, group: "Chlamydien / Gonokokken (PCR)" },
  { code: "go_ct_urine", labels: { de: "Urin", en: "Urin", tr: "Urin", uk: "Urin" }, group: "Chlamydien / Gonokokken (PCR)" },
  { code: "go_ct_vag", labels: { de: "Vaginal", en: "Vaginal", tr: "Vaginal", uk: "Vaginal" }, group: "Chlamydien / Gonokokken (PCR)" },
  { code: "go_ct_anal", labels: { de: "Rektal", en: "Rektal", tr: "Rektal", uk: "Rektal" }, group: "Chlamydien / Gonokokken (PCR)" },

  { code: "hav", labels: { de: "HAV", en: "HAV", tr: "HAV", uk: "HAV" }, group: "Hepatitis-Screening" },
  { code: "anti-hbc", labels: { de: "HBV", en: "HBV", tr: "HBV", uk: "HBV" }, group: "Hepatitis-Screening" },
  { code: "hcv", labels: { de: "HCV", en: "HCV", tr: "HCV", uk: "HCV" }, group: "Hepatitis-Screening" },
];


export const PLACEHOLDERS = {
  birthCountry: {
    de: "Land auswählen…",
    en: "Select a country…",
    tr: "Bir ülke seçin…",
    uk: "Виберіть країну…",
  },
}

export const SEARCH_PLACEHOLDER = {
  de: "Länder suchen…",
  en: "Search countries…",
  tr: "Ülke ara…",
  uk: "Пошук країн…",
}

export const EMPTY_LABEL = {
  de: "Kein Land gefunden.",
  en: "No country found.",
  tr: "Ülke bulunamadı.",
  uk: "Країну не знайдено.",
}

export const SKIP_LABEL: Record<Lang, string> = {
  de: "Möchte ich nicht sagen",
  en: "Prefer not to say",
  tr: "Söylemek istemiyorum",
  uk: "Волію не відповідати",
};

export const ANSWER_LABEL: Record<Lang, string> = {
  de: "Möchte beantworten",
  en: "Answer this question",
  tr: "Bu soruyu yanıtlamak istiyorum",
  uk: "Хочу відповісти",
};

export const HIV_TEST_YEAR_LABEL = {
  de: "In welchem Jahr zuletzt?",
  en: "In which year was your last test?",
  tr: "Son testiniz hangi yıldaydı?",
  uk: "У якому році був останній тест?",
}

export const HIV_TEST_COUNT_LABEL = {
  de: "Wie oft?",
  en: "How many times?",
  tr: "Kaç kez?",
  uk: "Скільки разів?",
}

export const CONFIRM_LABEL = {
  de: "Der HIV-Test wurde bei der AIDS-Hilfe Duisburg & Kreis Wesel durchgeführt",
  en: "The HIV test was carried out at AIDS-Hilfe Duisburg & Kreis Wesel",
  tr: "HIV testi AIDS-Hilfe Duisburg & Kreis Wesel’de yapıldı",
  uk: "Тест на ВІЛ було проведено в «AIDS-Hilfe Duisburg & Kreis Wesel»",
}
