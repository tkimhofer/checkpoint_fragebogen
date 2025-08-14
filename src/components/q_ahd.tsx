import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import clsx from "clsx";


import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "@/components/ui/tabs";
import { useEffect } from "react";



// const [hadSexRisk, setHadSexRisk] = useState<string | null>(null);
function getValueFromLabel(questionKey: string, label: string, lang: string) {
  const options = OPTION_DEFS[questionKey];
  return options.find(opt => opt.labels[lang] === label)?.value;
}

const LANGUAGES = [
  { code: "de", label: "Deutsch 🇩🇪" },
  { code: "en", label: "English 🇬🇧" },
  { code: "uk", label: "Українська 🇺🇦" },
  { code: "tr", label: "Türkçe 🇹🇷" },
//   { code: "ar", label: "العربية" },
];

const TRANSLATIONS = {
  de: {

    intro1: "Die folgenden Fragen helfen uns, das Testangebot zu verbessern und weiter zu finanzieren.",
    intro2: "Alle Angaben sind freiwillig, anonym und werden ausschließlich intern ausgewertet. Es werden keine Daten erhoben, die Rückschlüsse auf deine Identität ermöglichen.",
    intro3: "Die folgenden Fragen helfen uns zu ermitteln, welche Tests durchgeführt werden sollten.",
    sections: {
      general: "Allgemeine Angaben",
      risk: "Risiken und Sexualverhalten",
      health: "Gesundheit und Einstellung"
    },
    questions: {
    //   age: "Wie alt bist du?",
      orientation: "1. Wie würdest du deine sexuelle Orientierung beschreiben?",
      birthCountry: "2. In welchem Land bist du geboren?",
    //   gender: "Wie würdest du dein Geschlecht beschreiben?",
      insurance: "3. Bist du krankenversichert?",
      doctor: "4. Hast du einen Arzt/Arztin?",
      hiv_: 'Möchtest Du dich auf HIV testen lassen?',
      hiv_test: "5. Aus welchem Grund möchtest Du Dich auf HIV testen lassen?", //mehrere AW mgl, freitext mgl
    //   riskType: "Welche Risikosituation hat stattgefunden?",
      hiv_risk_selfest: "6. Wie hoch schätzt Du das Risiko einer möglichen Ansteckung mit HIV ein?", //4 x aw checkbox
      sexualRiskTime: "7. Wie lange liegt die letzte Risikosituation zurück?",
      riskCountry: "8. In welchem Land hattest Du eine Risikosituation?", //Dt, freitexxt
      riskType: "9. Mit wem oder wobei hattest Du die Risikosituation?", // 4 x aw checkbox
    // Falls testen auf HIV
      hiv_test_sexPractices: "10. Welche Risikosituation(en) hattest Du, in denen es zu einer möglichen Ansteckung kam?",
      hiv_test_sexPractices_1: "Hattest Du Geschlechtsverkehr (anal/vaginal)?",
      hiv_test_sexPractices_1_a: "ungeschützt (ohne Kondom)?", // radio nein, ja: aktiv eindringend, passiv aufnehmend
      hiv_test_sexPractices_1_b: "Kondom abgerutscht/gerissen?", // radio nein, ja: aktiv eindringend, passiv aufnehmend
      hiv_test_sexPractices_2: "Hattest Du Oralverkehr?", // raio nein, ja
      hiv_test_sexPractices_3: "Hast Du Drogen konsumiert?",
      hiv_test_sexPractices_3a: "Gemeinsamer gebrauch von Spritzen?", // radio ja, nein
      hiv_test_sexPractices_4: "Andere Risikosituation", // freitext
      condomless: "11. Sofern ein Risiko darin bestand, kein Kondom benutzt zu haben, was waren die Gründe?", // 10 x checkboxes
      testhistory: "12. Hast Du dich bereits früher auf HIV testen lassen?", // 10 x checkboxes
      testhistory_1: "Ja, wie oft, wann zuletzt, wo zuletzt?", // bool, mit conditional einblednung wenn ja: integer type, Jahreszahl
      stihistory: "13. Ist bei Dir schon einmal eine STI (sexuell übetragbare Krankheit) festgestellt worden? Wenn ja, welche und wo wurde sie behandelt?",
      druguse_gen: "14. Hast Du schon einmal Drogen konsumiert?", // checkbox: ja, gespritzt, ja, geschnupft/geraucht, nein
      druguse_risk6m: "15. Kam es beim Drogengebrauch zu Risikosituationen in den letzten 6 Monaten?", // ja, nein, weiß nicht
      vacc_hav: "16. Bist du gegen Hepatitis A geimpft?", // checkboxes ja, nein, weiß nicht, hatte HAV Infektion. Cond: Inf: Wann? 
      vacc_hbv: "17. Bist du gegen Hepatitis B geimpft?", // checkboxes ja, nein, weiß nicht, hatte HAV Infektion. Cond: Inf: Wann? 
      vaccAB_sero: "18. Möchtest Du eine Hepatitis A und/oder Hepatitis B Serologie durchführen?", // checkboxes ja, HAV, ja HBV, ja HAV und HBV, nein
      vacc_hcv: "19. Ist bei dir jemals eine Hepatitis C Infektion festgestellt worden?", // checkboxes ja, nein, weiß nicht, wenn ja: checkboxes Antikörper positiv, Antigen (PCR) positiv, weiß nicht
      hcv_therapy: "20. Bist Du medikamentös behandelt worden?", //
      hcv_therapy_1a: "Ja, wird noch durchgeführt. Beginn der Behandlung", // Jahreszahl
      hcv_therapy_1b: "Ja, erfolgreich. Ende der Behandlung", // Jahreszahl
      hcv_therapy_1c: "Ja, erfolgreich aber reinfiziert", // Jahreszahl
      hcv_therapy_1d: "Ja, aber nicht erfolgreich, da abgebrochen. Ende Der Bahandlung", // Jahreszahl
      hcv_therapy_1e: "Ja, aber nicht erfolgreich, da keine Heilung. Ende Der Bahandlung", // Jahreszahl
      hcv_therapy_1f: "Nein, noch nie und zwar weil", // Jahreszahl
      hcv_test: "21. Hast Du dich bereits einmal auf eine Hepatitis C Virusinfektion testen lassen?", // Ja/nein/ka, wenn ja: monat/jahr
      beraterkasten: "ANFORDERUNGEN",
      noAnswer: "Ich möchte keine Angabe machen.",
      chemsex: "Hast du beim Sex Drogen (Chemsex) konsumiert?",
      drugsUsed: "Welche Drogen hast du konsumiert?",

    },
    options: {
      birthCountry: ["Deutschland", "EU (außer Deutschland)", "Nicht-EU"],
    //   gender: ["Männlich", "Weiblich", "Nicht-binär", "Trans*", "Anderes"],
      orientation: ["Heterosexuell", "Homosexuell", "Bisexuell", "Pansexuell", "Asexuell", "Queer", "Anderes"],
      insurance: ["Ja", "Nein", "Ich weiß nicht"],
      doctor: ["Ja", "Nein"],
    //   riskType: ["Sexuell", "Medizinisch (z. B. Bluttransfusion)", "Tattooing / Piercing"],
    hiv_: ["Ja", "Nein"],
      hiv_test: [
        "Ich hatte eine/mehrere Risikosituation(en)", 
        "Meine Partner/meine Partnerin hatte eine/mehrere Risikosituation(en)",
        "Ich lasse meinen HIV-Status regelmäßig kontrollieren (Routine)",
        "Ich bin in einer neuen Beziehung",
        "Meine Partner/meine Partnerin ist HIV positiv",
        // "Ich möchte keinen HIV Test machen",
        "Anderer Grund"
    ],
    hiv_risk_selfest: ["kein Risiko","niedrigeres Risiko", "mittleres Risiko",  "hohes Risiko"],
      sexualRiskTime: ["0-3 Tage", "4-9 Tage", "10-14 Tage", "15 Tage - 6 Wochen", "6 Wochen - 3 Monate", "mehr als 3 Monate"],
      riskCountry: ["Deutschland", "EU (außer Deutschland)", "Nicht-EU"],
      riskType: [
        "mit festem/fester Partner/in",
        "mit jemandem den ich schon länger kenne",
        "mit einer mir unbekannten Person",
        "Sexarbeiter*in oder Escort",
        "berufliches Risiko",
        "Infektionsrisiko ist nicht zu ermitteln"
    ],
    hiv_test_sexPractices_1_a: ["Ja, aktiv eindringend", "Ja, passiv aufnehmend", "Ja, aktiv und passiv", "Nein"],
    hiv_test_sexPractices_1_b: ["Ja, aktiv eindringend", "Ja, passiv aufnehmend", "Ja, aktiv und passiv", "Nein"],
    hiv_test_sexPractices_2: ["Ja", "Nein"],
    hiv_test_sexPractices_3: ["Ja", "Nein"],
    hiv_test_sexPractices_3a: ["Ja", "Nein"],
    // hiv_test_sexPractices_4: [],
    condomless: [
        "Mein*e Sexpartner*in wollte ohne Kondom",
        "Ich wollte ohne Kondom",
        "Mein*e Partner*in hat mir gesagt, dass er/sie HIV-negativ ist",
        "Mein*e Partner*in hat mir gesagt, dass er/sie behandelt ist und nicht mehr ansteckend ist",
        "Ich bin davon ausgegangen, dass mein*e Partner*in HIV-negativ ist",
        "Ich bekomme mit Kondomen keine oder nur schwer eine Erektion",
        "Ich hatte kein Kondom dabei",
        "Ich habe Drogen und/oder Alkohol konsumiert und die Kontrolle verloren",
        "Ich weiß nicht, wie es dazu kam",
        "Ich hatte keinen Sex ohne Kondom",
        "Anderer Grund"
    ],
      sexPractices: [
        "Rezeptiver (passiver) Analsex",
        "Insertiver (aktiver) Analsex",
        "Vaginalverkehr",
        "Oralverkehr"
      ],
      sexPracticesOther: [
        "Keine Kondomnutzung bei Anal- oder Vaginalverkehr",
        // "Keine Kondom bei Anal- oder Vaginalverkehr geplatzt",
        "Kontakt mit Körperflüssigkeiten (z. B. Blut, Sperma, Muttermilch)",
        "Nutzung von gemeinsamem Sexspielzeug (z. B. Dildo, Buttplug)",
        "Fisting (mit oder ohne Handschuhe)",
        "BDSM-Praktiken mit Verletzungsrisiko (z. B. Spanking, Fesselspiele, Nadelspiele)",
        "Praktiken mit Hautverletzungen oder Blutkontakt",
        "Sex mit mehreren Personen (Gruppensex)",
        "Sex unter Drogeneinfluss (z. B. Chemsex)",
      ],
      chemsex: ["Ja", "Nein"],
      drugsUsed: ["Crystal Meth", "GHB/GBL", "Kokain", "Ketamin", "MDMA", "Speed", "Andere"],

    }
  },
  en: {
    intro1: "The following questions help us improve and continue funding the testing services.",
    intro2: "All information is voluntary, anonymous, and evaluated internally only. No data is collected that could identify you.",
    intro3: "The following questions help determine which tests should be performed.",
    sections: {
      general: "General Information",
      risk: "Risks and Sexual Behavior",
      health: "Health and Attitude"
    },
    questions: {
      orientation: "1. How would you describe your sexual orientation?",
      birthCountry: "2. In which country were you born?",
      insurance: "3. Are you health insured?",
      doctor: "4. Do you have a doctor?",
      hiv_: "Would you like to be tested for HIV?",
      hiv_test: "5. Why would you like to be tested for HIV?",
      hiv_risk_selfest: "6. How do you assess the risk of a possible HIV infection?",
      sexualRiskTime: "7. How long ago was the last risk situation?",
      riskCountry: "8. In which country did you experience a risk situation?",
      riskType: "9. With whom or in what situation did the risk occur?",
      hiv_test_sexPractices: "10. What risk situations did you experience that could have led to an infection?",
      hiv_test_sexPractices_1: "Did you have sexual intercourse (anal/vaginal)?",
      hiv_test_sexPractices_1_a: "Unprotected (without condom)?",
      hiv_test_sexPractices_1_b: "Condom slipped or broke?",
      hiv_test_sexPractices_2: "Did you have oral sex?",
      hiv_test_sexPractices_3: "Did you use drugs?",
      hiv_test_sexPractices_3a: "Shared use of syringes?",
      hiv_test_sexPractices_4: "Other risk situation",
      condomless: "11. If not using a condom was a risk, what were the reasons?",
      testhistory: "12. Have you ever been tested for HIV before?",
      testhistory_1: "Yes, how often, when last, where last?",
      stihistory: "13. Have you ever been diagnosed with an STI (sexually transmitted infection)? If yes, which and where was it treated?",
      druguse_gen: "14. Have you ever used drugs?",
      druguse_risk6m: "15. Did any risk situations occur during drug use in the last 6 months?",
      vacc_hav: "16. Are you vaccinated against Hepatitis A?",
      vacc_hbv: "17. Are you vaccinated against Hepatitis B?",
      vaccAB_sero: "18. Would you like to test for Hepatitis A and/or B antibodies?",
      vacc_hcv: "19. Have you ever been diagnosed with a Hepatitis C infection?",
      hcv_therapy: "20. Have you been medically treated?",
      hcv_therapy_1a: "Yes, ongoing. Start of treatment:",
      hcv_therapy_1b: "Yes, successfully completed. End of treatment:",
      hcv_therapy_1c: "Yes, successful but reinfected:",
      hcv_therapy_1d: "Yes, not successful due to discontinuation. End of treatment:",
      hcv_therapy_1e: "Yes, not successful, not cured. End of treatment:",
      hcv_therapy_1f: "No, never, because:",
      hcv_test: "21. Have you ever been tested for a Hepatitis C infection?",
      beraterkasten: "REQUIREMENTS",
      noAnswer: "I prefer not to answer.",
      chemsex: "Have you used drugs during sex (chemsex)?",
      drugsUsed: "Which drugs have you used?"
    },
    options: {
      birthCountry: ["Germany", "EU (except Germany)", "Non-EU"],
      orientation: ["Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual", "Queer", "Other"],
      insurance: ["Yes", "No", "I don't know"],
      doctor: ["Yes", "No"],
      hiv_: ["Yes", "No"],
      hiv_test: [
        "I experienced one or more risk situations",
        "My partner experienced one or more risk situations",
        "I regularly check my HIV status (routine)",
        "I am in a new relationship",
        "My partner is HIV positive",
        "Other reason"
      ],
      hiv_risk_selfest: ["no risk", "low risk", "medium risk", "high risk"],
      sexualRiskTime: ["0-3 days", "4-9 days", "10-14 days", "15 days - 6 weeks", "6 weeks - 3 months", "more than 3 months"],
      riskCountry: ["Germany", "EU (except Germany)", "Non-EU"],
      riskType: [
        "with steady partner",
        "with someone I’ve known longer",
        "with someone I didn't know",
        "Sex worker or escort",
        "Occupational risk",
        "Infection risk unclear"
      ],
      hiv_test_sexPractices_1_a: ["Yes, insertive", "Yes, receptive", "Yes, both", "No"],
      hiv_test_sexPractices_1_b: ["Yes, insertive", "Yes, receptive", "Yes, both", "No"],
      hiv_test_sexPractices_2: ["Yes", "No"],
      hiv_test_sexPractices_3: ["Yes", "No"],
      hiv_test_sexPractices_3a: ["Yes", "No"],
      condomless: [
        "My partner wanted to have sex without a condom",
        "I wanted to have sex without a condom",
        "My partner told me they were HIV negative",
        "My partner told me they were treated and no longer infectious",
        "I assumed my partner was HIV negative",
        "I can’t get or maintain an erection with a condom",
        "I didn’t have a condom with me",
        "I used drugs and/or alcohol and lost control",
        "I don’t know how it happened",
        "I didn’t have sex without a condom",
        "Other reason"
      ],
      sexPractices: [
        "Receptive (passive) anal sex",
        "Insertive (active) anal sex",
        "Vaginal sex",
        "Oral sex"
      ],
      sexPracticesOther: [
        "No condom use during anal or vaginal sex",
        "Contact with body fluids (e.g., blood, semen, breast milk)",
        "Shared use of sex toys (e.g., dildo, buttplug)",
        "Fisting (with or without gloves)",
        "BDSM practices with risk of injury (e.g., spanking, bondage, needle play)",
        "Practices with skin injuries or blood contact",
        "Sex with multiple people (group sex)",
        "Sex under influence of drugs (e.g., chemsex)"
      ],
      chemsex: ["Yes", "No"],
      drugsUsed: ["Crystal Meth", "GHB/GBL", "Cocaine", "Ketamine", "MDMA", "Speed", "Other"]
    }
  },
  uk: {
    intro1: "Наступні питання допомагають покращити та продовжити фінансування сервісів для тестування.",
    intro2: "Вся інформація — добровільна, анонімна і аналізується лише всередині. Жодні дані, які дозволяють вас ідентифікувати, не збираються.",
    intro3: "Наступні запитання допомагають визначити, які тести варто провести.",
    sections: {
      general: "Загальна інформація",
      risk: "Ризики та сексуальна поведінка",
      health: "Здоров’я та ставлення"
    },
    questions: {
      orientation: "1. Як би ви описали свою сексуальну орієнтацію?",
      birthCountry: "2. У якій країні ви народилися?",
      insurance: "3. У вас є медичне страхування?",
      doctor: "4. У вас є лікар?",
      hiv_: "Чи хотіли б ви пройти тест на ВІЛ?",
      hiv_test: "5. З якої причини ви хочете пройти тест на ВІЛ?",
      hiv_risk_selfest: "6. Як ви оцінюєте ризик можливої інфекції ВІЛ?",
      sexualRiskTime: "7. Коли сталася остання ризикована ситуація?",
      riskCountry: "8. У якій країні ви стикалися з ризикованою ситуацією?",
      riskType: "9. З ким або в якій ситуації це сталося?",
      hiv_test_sexPractices: "10. Які ситуації могли призвести до можливого зараження?",
      hiv_test_sexPractices_1: "Чи був у вас анальний або вагінальний секс?",
      hiv_test_sexPractices_1_a: "Без презерватива?",
      hiv_test_sexPractices_1_b: "Презерватив зірвався або з’їхав?",
      hiv_test_sexPractices_2: "Чи був у вас оральний секс?",
      hiv_test_sexPractices_3: "Чи вживали ви наркотики?",
      hiv_test_sexPractices_3a: "Чи використовували ви одні й ті ж шприци з кимось ще?",
      hiv_test_sexPractices_4: "Інша ризикова ситуація",
      condomless: "11. Якщо секс без презервативів був ризиковим, то чому це сталося?",
      testhistory: "12. Чи робили ви колись тест на ВІЛ?",
      testhistory_1: "Якщо так — скільки разів, коли востаннє і де?",
      stihistory: "13. Чи коли-небудь вам діагностували ЗПСШ? Якщо так, яку саме і де лікували?",
      druguse_gen: "14. Чи коли-небудь ви вживали наркотики?",
      druguse_risk6m: "15. Чи були ризикові ситуації під час вживання наркотиків протягом останніх 6 місяців?",
      vacc_hav: "16. Чи вакциновані ви проти гепатиту A?",
      vacc_hbv: "17. Чи вакциновані ви проти гепатиту B?",
      vaccAB_sero: "18. Чи хотіли б ви пройти серологію на антитіла до гепатиту A та/або B?",
      vacc_hcv: "19. Чи коли-небудь вам діагностували інфекцію гепатиту C?",
      hcv_therapy: "20. Чи проходили ви лікування?",
      hcv_therapy_1a: "Так, воно триває. Початок лікування:",
      hcv_therapy_1b: "Так, успішно завершено. Кінець лікування:",
      hcv_therapy_1c: "Так, успішно, але було повторне інфікування:",
      hcv_therapy_1d: "Так, але лікування припинено. Закінчення:",
      hcv_therapy_1e: "Так, не успішно, не вилікувано. Закінчення:",
      hcv_therapy_1f: "Ні, ніколи, тому що:",
      hcv_test: "21. Чи проходили ви колись тест на гепатит C?",
      beraterkasten: "ВИМОГИ",
      noAnswer: "Я волію не відповідати.",
      chemsex: "Чи вживали ви наркотики під час сексу (Chemsex)?",
      drugsUsed: "Які наркотики ви вживали?"
    },
    options: {
      birthCountry: ["Німеччина", "ЄС (крім Німеччини)", "Не з ЄС"],
      orientation: ["Гетеросексуал", "Гомосексуал", "Бісексуал", "Пансексуал", "Асексуа́л", "Квір", "Інше"],
      insurance: ["Так", "Ні", "Не знаю"],
      doctor: ["Так", "Ні"],
      hiv_: ["Так", "Ні"],
      hiv_test: [
        "Я мав одну або кілька ризикових ситуацій",
        "Мій партнер мав одну або кілька ризикових ситуацій",
        "Я регулярно перевіряю свій ВІЛ-статус (згідно з рекомендаціями)",
        "Я у нових стосунках",
        "Мій партнер ВІЛ‑позитивний",
        "Інша причина"
      ],
      hiv_risk_selfest: ["немає ризику", "низький ризик", "середній ризик", "високий ризик"],
      sexualRiskTime: ["0–3 дні", "4–9 днів", "10–14 днів", "15 днів – 6 тижнів", "6 тижнів – 3 місяці", "більше 3 місяців"],
      riskCountry: ["Німеччина", "ЄС (крім Німеччини)", "Не з ЄС"],
      riskType: [
        "з постійним партнером",
        "з кимось, кого я знаю давно",
        "з незнайомою людиною",
        "працівник сексуальних послуг або ескорт",
        "професійний ризик",
        "неможливо визначити ризик"
      ],
      hiv_test_sexPractices_1_a: ["Так, активний", "Так, пасивний", "Так, активний і пасивний", "Ні"],
      hiv_test_sexPractices_1_b: ["Так, активний", "Так, пасивний", "Так, активний і пасивний", "Ні"],
      hiv_test_sexPractices_2: ["Так", "Ні"],
      hiv_test_sexPractices_3: ["Так", "Ні"],
      hiv_test_sexPractices_3a: ["Так", "Ні"],
      condomless: [
        "Мій партнер хотів секс без презерватива",
        "Я хотів секс без презерватива",
        "Мій партнер сказав, що він ВІЛ-негативний",
        "Мій партнер сказав, що він лікується і більше не заразний",
        "Я припускав(ла), що мій партнер ВІЛ-негативний",
        "Мені важко отримати або зберегти ерекцію з презервативом",
        "У мене не було презерватива з собою",
        "Я вживав наркотики та/або алкоголь і втратив контроль",
        "Я не знаю, як це сталося",
        "У мене не було незахищеного сексу",
        "Інша причина"
      ],
      sexPractices: [
        "Рецептивний (пасивний) анальний секс",
        "Інсертивний (активний) анальний секс",
        "Вагінальний секс",
        "Оральний секс"
      ],
      sexPracticesOther: [
        "Без презерватива під час анального або вагінального сексу",
        "Контакт з тілесними рідинами (наприклад, кров, сперма, молоко)",
        "Використання спільних секс-іграшок (наприклад, дилдо, батлплаг)",
        "Фістинг (з або без рукавичок)",
        "BDSM, що може спричинити травму (наприклад, спанкінг, звʼязування, ігри з голками)",
        "Практики з порізами або кровоточивістю",
        "Груповий секс",
        "Секс під впливом наркотиків (наприклад, Chemsex)"
      ],
      chemsex: ["Так", "Ні"],
      drugsUsed: ["Crystal Meth", "GHB/GBL", "Кокаїн", "Кетамін", "MDMA", "Speed", "Інше"]
    }
  
},
    tr: {
    intro1: "Aşağıdaki sorular, test hizmetlerini geliştirmemize ve sürdürmemize yardımcı olur.",
    intro2: "Tüm bilgiler gönüllülük esasına dayanır, anonimdir ve yalnızca dahili olarak değerlendirilir. Kimliğinizi tanımlayabilecek hiçbir veri toplanmaz.",
    intro3: "Aşağıdaki sorular, hangi testlerin yapılması gerektiğini belirlememize yardımcı olur.",
    sections: {
      general: "Genel Bilgiler",
      risk: "Riskler ve Cinsel Davranış",
      health: "Sağlık ve Tutum"
    },
    questions: {
      orientation: "1. Cinsel yöneliminizi nasıl tanımlarsınız?",
      birthCountry: "2. Hangi ülkede doğdunuz?",
      insurance: "3. Sağlık sigortanız var mı?",
      doctor: "4. Bir doktorunuz var mı?",
      hiv_: "HIV testi yaptırmak ister misiniz?",
      hiv_test: "5. HIV testi yaptırmak istemenizin nedeni nedir?",
      hiv_risk_selfest: "6. HIV enfeksiyonu riskinizi nasıl değerlendiriyorsunuz?",
      sexualRiskTime: "7. Son riskli durum ne zaman yaşandı?",
      riskCountry: "8. Hangi ülkede riskli bir durum yaşadınız?",
      riskType: "9. Riskli durum kiminle veya hangi durumda oldu?",
      hiv_test_sexPractices: "10. Hangi durumlar enfeksiyon riskine neden olabilir?",
      hiv_test_sexPractices_1: "Anal veya vajinal cinsel ilişki yaşadınız mı?",
      hiv_test_sexPractices_1_a: "Kondomsuz muydunuz?",
      hiv_test_sexPractices_1_b: "Kondom kaydı mı ya da yırtıldı mı?",
      hiv_test_sexPractices_2: "Oral seks yaptınız mı?",
      hiv_test_sexPractices_3: "Uyuşturucu kullandınız mı?",
      hiv_test_sexPractices_3a: "Şırınga paylaştınız mı?",
      hiv_test_sexPractices_4: "Diğer riskli durum",
      condomless: "11. Kondomsuz ilişkide risk varsa, nedeni neydi?",
      testhistory: "12. Daha önce HIV testi yaptınız mı?",
      testhistory_1: "Evetse — kaç kez, en son ne zaman ve nerede?",
      stihistory: "13. Daha önce STI (cinsel yolla bulaşan hastalık) teşhis edildi mi? Hangi hastalık ve nerede tedavi edildi?",
      druguse_gen: "14. Hiç uyuşturucu kullandınız mı?",
      druguse_risk6m: "15. Son 6 ayda uyuşturucu kullanımına bağlı riskli durum yaşandı mı?",
      vacc_hav: "16. Hepatit A'ya karşı aşı oldunuz mu?",
      vacc_hbv: "17. Hepatit B'ye karşı aşı oldunuz mu?",
      vaccAB_sero: "18. Hepatit A ve/veya B antikor testi yaptırmak ister misiniz?",
      vacc_hcv: "19. Hepatit C enfeksiyonu teşhis edildi mi?",
      hcv_therapy: "20. Tıbbi tedavi gördünüz mü?",
      hcv_therapy_1a: "Evet, halen devam ediyor. Tedavi başlangıcı:",
      hcv_therapy_1b: "Evet, başarıyla tamamlandı. Tedavi sonu:",
      hcv_therapy_1c: "Evet, başarılı ama yeniden enfekte oldum:",
      hcv_therapy_1d: "Evet, başarısız oldu (tedavi durduruldu). Sonlanma tarihi:",
      hcv_therapy_1e: "Evet, başarılamadı (iyileşme olmadı). Bitiş tarihi:",
      hcv_therapy_1f: "Hayır, hiç — çünkü:",
      hcv_test: "21. Hepatit C testi yaptırdınız mı?",
      beraterkasten: "GEREKSİNİMLER",
      noAnswer: "Cevap vermek istemiyorum.",
      chemsex: "Sekste uyuşturucu (Chemsex) kullandınız mı?",
      drugsUsed: "Hangi uyuşturucuları kullandınız?"
    },
    options: {
      birthCountry: ["Almanya", "Almanya dışındaki AB ülkeleri", "AB dışı"],
      orientation: ["Heteroseksüel", "Homoseksüel", "Biseksüel", "Panseksüel", "Aseksüel", "Queer", "Diğer"],
      insurance: ["Evet", "Hayır", "Bilmiyorum"],
      doctor: ["Evet", "Hayır"],
      hiv_: ["Evet", "Hayır"],
      hiv_test: [
        "Bir veya daha fazla riskli durum yaşadım",
        "Partnerim bir veya daha fazla riskli durum yaşamış olabilir",
        "Düzenli olarak HIV durumumu kontrol ediyorum (rutin)",
        "Yeni bir ilişkim var",
        "Partnerim HIV pozitif",
        "Diğer neden"
      ],
      hiv_risk_selfest: ["risk yok", "düşük risk", "orta risk", "yüksek risk"],
      sexualRiskTime: ["0‑3 gün", "4‑9 gün", "10‑14 gün", "15 gün – 6 hafta", "6 hafta – 3 ay", "3 aydan fazla"],
      riskCountry: ["Almanya", "Almanya dışındaki AB ülkeleri", "AB dışı"],
      riskType: [
        "sabit partner ile",
        "uzun süredir tanıdığım biriyle",
        "tanımadığım biriyle",
        "seks işçisi / escort",
        "mesleki risk",
        "risk belirlenemiyor"
      ],
      hiv_test_sexPractices_1_a: ["Evet, aktif (insertif)", "Evet, pasif (reseptif)", "Evet, her ikisi", "Hayır"],
      hiv_test_sexPractices_1_b: ["Evet, aktif", "Evet, pasif", "Evet, her ikisi", "Hayır"],
      hiv_test_sexPractices_2: ["Evet", "Hayır"],
      hiv_test_sexPractices_3: ["Evet", "Hayır"],
      hiv_test_sexPractices_3a: ["Evet", "Hayır"],
      condomless: [
        "Partnerim prezervatif olmadan seks istemişti",
        "Ben prezervatif olmadan seks istedim",
        "Partnerim HIV negatif olduğunu söyledi",
        "Partnerim tedavi görüyor ve artık bulaşıcı değil",
        "Partnerim HIV negatif olduğunu varsaydım",
        "Prezervatifle ereksiyon elde etmek ya da sürdürmek zor",
        "Yanımda prezervatif yoktu",
        "Uyuşturucu ve/veya alkol kullanıp kontrolü kaybettim",
        "Nasıl olduğunu bilmiyorum",
        "Prezervatifsiz seks yapmadım",
        "Diğer neden"
      ],
      sexPractices: [
        "Reseptif (pasif) anal seks",
        "İnsertif (aktif) anal seks",
        "Vajinal seks",
        "Oral seks"
      ],
      sexPracticesOther: [
        "Anal veya vajinal seks sırasında prezervatif kullanılmadı",
        "Vücut sıvıları ile temas (örneğin kan, semen, anne sütü)",
        "Paylaşılan seks oyuncakları (örneğin dildo, butt‑plug)",
        "Fisting (eldivenli veya eldivensiz)",
        "Yaralanma riski taşıyan BDSM (örneğin spanking, bağlama, iğne oyunu)",
        "Kesik veya kan teması içeren uygulamalar",
        "Grup seks",
        "Uyuşturucu etkisi altında seks (örneğin Chemsex)"
      ],
      chemsex: ["Evet", "Hayır"],
      drugsUsed: ["Crystal Meth", "GHB/GBL", "Kokain", "Ketamin", "MDMA", "Speed", "Diğer"]
    }
  }
};

export default function Questionnaire() {
    const tabIds = ["allgemein", "hiv", "sti", "summary"] as const;
    type TabId = typeof tabIds[number];

    const [activeTab, setActiveTab] = useState<TabId>(tabIds[0]);
    const goToNextTab = () => {
        const i = tabIds.indexOf(activeTab);
        const next = tabIds[i + 1];
        if (next) {
          setActiveTab(next);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      };

      const goNextFromGeneral = () => {
        const yesValues = ["Ja", "Yes", "Evet", "Так"];
        const wantsHiv = yesValues.includes((responses.hiv_ || "").trim());
        const next: TabId = wantsHiv ? "hiv" : "sti";
        setActiveTab(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

    const [lang, setLang] = useState("de");
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const t = TRANSLATIONS[lang];
    const [riskType, setRiskType] = useState<string | null>(null);
    const [selectedSexPracticesOther, setSelectedSexPracticesOther] = useState<string[]>([]);
    const [chemsexUsed, setChemsexUsed] = useState<string | null>(null);
    const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const NO_ANSWER = "__kA__";

   

    // at the bottom of your Questionnaire component:
    useEffect(() => {
        (window as any).responses = responses;
    }, [responses]);
    

    const handleToggle = (key: string) => {
        setCollapsed((prev) => {
        const newCollapsed = { ...prev, [key]: !prev[key] };
    
        // If collapsed (user doesn't want to answer), store a special marker
        if (!prev[key]) {
            setResponses((prev) => ({ ...prev, [key]: NO_ANSWER }));
        } else {
            // If user re-enables the question, remove the no-answer marker
            const { [key]: _, ...rest } = responses;
            setResponses(rest);
        }
    
        return newCollapsed;
        });
    };
 
    const renderRadioOptions = (
        options: string[],
        inputName: string
      ) => (
        <RadioGroup
          value={responses[inputName] || ""}
          onValueChange={(val) =>
            setResponses((prev) => ({ ...prev, [inputName]: val }))
          }
        >
          {options.map((option, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={option} id={`${inputName}-${index}`} />
              <Label htmlFor={`${inputName}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );

    const renderCheckboxOptions = (
    options: string[],
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
    inputName: string
    ) => (
    <div className="space-y-2">
        {options.map((option, index) => {
        const handleChange = (checked: boolean) => {
            const newValues = checked
            ? [...selectedValues, option]
            : selectedValues.filter((v) => v !== option);

            setSelectedValues(newValues);
            setResponses((prev) => ({ ...prev, [inputName]: newValues }));
        };

        return (
            <div className="flex items-center space-x-2" key={index}>
            <Checkbox
                id={`${inputName}-${index}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={handleChange}
            />
            <Label htmlFor={`${inputName}-${index}`}>{option}</Label>
            </div>
        );
        })}
    </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Language Switch */}
      <div className="mb-4 flex space-x-4 justify-end">
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`text-sm underline ${lang === code ? "font-bold" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Intro */}
      <p className="mb-2 text-sm text-muted-foreground">{t.intro1}</p>
      <p className="mb-6 text-sm text-muted-foreground">{t.intro2}</p>
      <p className="mb-6 text-sm text-muted-foreground">{t.intro3}</p>

      
      

    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)} className="w-full">
      <TabsList className="flex w-full justify-between mb-4">
        <TabsTrigger value="allgemein">✏️ Allgemein</TabsTrigger>
        <TabsTrigger
  value="hiv"
  onClick={(e) => {
    const hivNoValues = ["Nein", "No", "Hayır", "Ні"];
    if (hivNoValues.includes(responses.hiv_)) {
      e.preventDefault(); // Block switching
    }
  }}
  aria-disabled={["Nein", "No", "Hayır", "Ні"].includes(responses.hiv_)}
  className={clsx(
    ["Nein", "No", "Hayır", "Ні"].includes(responses.hiv_) &&
      "opacity-50 pointer-events-none cursor-not-allowed"
  )}
>
  {["Nein", "No", "Hayır", "Ні"].includes(responses.hiv_) ? "🚫 HIV" : "✏️ HIV"}
</TabsTrigger>
        <TabsTrigger value="sti">✏️ Andere STI</TabsTrigger>
        <TabsTrigger value="summary">✅ Übersicht & Absenden</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
    <p>Fragenübersicht</p>
    <button
    onClick={async () => {
        try {
        const res = await fetch("http://127.0.0.1:8000/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responses),
        });
        if (!res.ok) throw new Error("Failed");
        alert("Submitted successfully!");
        } catch (err) {
        alert("Submission error.");
        console.error(err);
        }
    }}
    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    
    >Absenden </button>
    <details className="mt-6 bg-gray-100 rounded p-4 text-sm">
    <summary className="cursor-pointer mb-2">🧪 Debug: responses</summary>
    <pre>{JSON.stringify(responses, null, 2)}</pre>
    </details>
  </TabsContent>

      <TabsContent value="sti">
    <p>Inhalt für Andere STI's und Tests</p>
    <Button type="button" className="mt-4" onClick={goToNextTab}>
            Weiter
          </Button>
  </TabsContent>

      <TabsContent value="allgemein">
            <div className="space-y-4">
            {/* Section: General Info */}
        <h2 className="text-xl font-semibold mb-2">{t.sections.general}</h2>
        <Separator className="mb-4" />

        {["orientation", "birthCountry", "insurance", "doctor", "hiv_"].map((key) => (
            <div className="mb-6" key={key}>
            <h3 className="font-medium mb-2">{t.questions[key]}</h3>
            {!collapsed[key] ? (
                <>
                {t.options[key] ? (
                    renderRadioOptions(t.options[key], key)
                ) : (
                    <Input 
                        className="w-32"
                        onChange={(e) =>
                            setResponses((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                    />
                )}
                </>
            ) : (
                <p className="text-muted-foreground italic text-sm">{t.questions.noAnswer}</p>
            )}
            <button
                className="mt-1 text-sm underline text-muted-foreground"
                onClick={() => handleToggle(key)}
            >
                {/* {collapsed[key] ?  t.questions.noAnswer.replace(/\.$/, " zurücknehmen") : t.questions.noAnswer} */}
                {collapsed[key] ?  "zurücknehmen" : t.questions.noAnswer}
            </button>
            </div>
            
        ))}
        <Button type="button" className="mt-4" onClick={goNextFromGeneral}>
            Weiter
          </Button>


            </div>
        
      </TabsContent>

      <TabsContent value="hiv">
        <div className="space-y-4">
         
            {/* HIV Test Grund */}
            <div className="mb-6">
            <h3 className="font-medium mb-2">{t.questions.hiv_test}</h3>
            {!collapsed.hiv_test ? (
                <>
                {/* <div className="mb-4">
                    <p className="font-medium">Art des sexuellen Kontakts</p>
                    {renderRadioOptions(t.options.hiv_test, "sexPractices")}
                </div> */}

                <div className="mb-4">
                    {renderCheckboxOptions(
                    t.options.hiv_test,
                    selectedSexPracticesOther,
                    setSelectedSexPracticesOther,
                    "hiv_test"
                    )}
                </div>
                </>
            ) : (
                <p className="text-muted-foreground italic text-sm">{t.questions.noAnswer}</p>
            )}
            <button
                className="mt-1 text-sm underline text-muted-foreground"
                onClick={() => handleToggle("hiv_test")}
            >
                {collapsed["hiv_test"] ?  "zurücknehmen" : t.questions.noAnswer}
            </button>
            </div>

            {["hiv_risk_selfest", "sexualRiskTime", "riskCountry", "riskType"].map((key) => (
                <div className="mb-6" key={key}>
                <h3 className="font-medium mb-2">{t.questions[key]}</h3>
                {!collapsed[key] ? (
                    <>
                    {t.options[key] ? (
                        renderRadioOptions(t.options[key], key)
                    ) : (
                        <Input 
                            className="w-32"
                            onChange={(e) =>
                                setResponses((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                        />
                    )}
                    </>
                ) : (
                    <p className="text-muted-foreground italic text-sm">{t.questions.noAnswer}</p>
                )}
                <button
                    className="mt-1 text-sm underline text-muted-foreground"
                    onClick={() => handleToggle(key)}
                >
                    {/* {collapsed[key] ?  t.questions.noAnswer.replace(/\.$/, " zurücknehmen") : t.questions.noAnswer} */}
                    {collapsed[key] ?  "zurücknehmen" : t.questions.noAnswer}
                </button>
                </div>
            ))}
                </div>
                <Button type="button" className="mt-4" onClick={goToNextTab}>
            Weiter
          </Button>
      </TabsContent>
    </Tabs>

     

        
   
    </div>
    
    );
}
