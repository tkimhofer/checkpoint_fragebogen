import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useEffect } from "react";



// const [hadSexRisk, setHadSexRisk] = useState<string | null>(null);
function getValueFromLabel(questionKey: string, label: string, lang: string) {
  const options = OPTION_DEFS[questionKey];
  return options.find(opt => opt.labels[lang] === label)?.value;
}

const LANGUAGES = [
  { code: "de", label: "Deutsch 🇩🇪" },
//   { code: "en", label: "English 🇬🇧" },
//   { code: "tr", label: "Türkçe 🇹🇷" },
//   { code: "ar", label: "العربية" },
];

const TRANSLATIONS = {
  de: {

    intro1: "Die folgenden Fragen helfen uns, das Testangebot zu verbessern und weiter zu finanzieren.",
    intro2: "Alle Angaben sind freiwillig, anonym und werden ausschließlich intern ausgewertet. Es werden keine Daten erhoben, die Rückschlüsse auf deine Identität ermöglichen.",
    intro3: "Fragen zu Risikosituationen helfen uns zu ermitteln, welche Tests durchgeführt werden müssen.",
    sections: {
      general: "Allgemeine Angaben",
      risk: "Risiken und Sexualverhalten",
      health: "Gesundheit und Einstellung"
    },
    questions: {
      age: "Wie alt bist du?",
      birthCountry: "In welchem Land wurdest du geboren?",
      gender: "Wie würdest du dein Geschlecht beschreiben?",
      orientation: "Wie würdest du deine sexuelle Orientierung beschreiben?",
      insurance: "Bist du krankenversichert?",
      doctor: "Hast du einen Hausarzt in Deutschland?",
      riskType: "Welche Risikosituation hat stattgefunden?",
      sexualRiskTime: "Wie lange liegt der letzte Risikokontakt zurück?",
      sexPractices: "Welche sexuellen Praktiken wurden ausgeführt?",
      noAnswer: "Ich möchte keine Angabe machen.",
      chemsex: "Hast du beim Sex Drogen (Chemsex) konsumiert?",
      drugsUsed: "Welche Drogen hast du konsumiert?",

    },
    options: {
      birthCountry: ["Deutschland", "EU (außer Deutschland)", "Nicht-EU"],
      gender: ["Männlich", "Weiblich", "Nicht-binär", "Trans*", "Anderes"],
      orientation: ["Heterosexuell", "Homosexuell", "Bisexuell", "Pansexuell", "Asexuell", "Queer", "Anderes"],
      insurance: ["Ja", "Nein", "Ich weiß nicht"],
      doctor: ["Ja", "Nein"],
      riskType: ["Sexuell", "Medizinisch (z. B. Bluttransfusion)", "Tattooing / Piercing"],
      sexualRiskTime: ["Vor weniger als 6 Wochen", "6 Wochen oder länger"],
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
    intro2: "All information is voluntary, anonymous, and used exclusively for internal analysis. No data is collected that could reveal your identity.",
    intro3: "Only honest answers can contribute to meaningful changes.",
    sections: {
      general: "General Information",
      risk: "Risks and Sexual Behavior",
      health: "Health and Attitudes"
    },
    questions: {
      age: "How old are you?",
      birthCountry: "In which country were you born?",
      gender: "How would you describe your gender?",
      orientation: "How would you describe your sexual orientation?",
      insurance: "Are you health insured?",
      doctor: "Do you have a general practitioner in Germany?",
      riskType: "What type of risk situation occurred?",
      sexualRiskTime: "When was your most recent risk contact?",
      sexPractices: "Which sexual practices were involved?",
      noAnswer: "I prefer not to answer.",
      chemsex: "Did you use drugs (Chemsex) during sex?",
      drugsUsed: "Which drugs did you use?"
    },
    options: {
      birthCountry: ["Germany", "EU (excluding Germany)", "Non-EU"],
      gender: ["Male", "Female", "Non-binary", "Trans*", "Other"],
      orientation: ["Heterosexual", "Homosexual", "Bisexual", "Pansexual", "Asexual", "Queer", "Other"],
      insurance: ["Yes", "No", "I don’t know"],
      doctor: ["Yes", "No"],
      riskType: ["Sexual", "Medical (e.g. blood transfusion)", "Tattooing / Piercing"],
      sexualRiskTime: ["Less than 6 weeks ago", "6 weeks or more"],
      sexPracticesAnal: ["Active", "Passive", "Both"],
      sexPracticesOral: ["Active", "Passive", "Both"],
      sexPracticesOther: ["Contact with bodily fluids (blood, semen, breast milk)", "Use of sex toys (e.g. dildos)", "Fisting", "Rough BDSM practices"],
      chemsex: ["Yes", "No"],
      drugsUsed: ["Crystal Meth", "GHB/GBL", "Cocaine", "Ketamine", "MDMA", "Speed", "Other"]
    }
  },
  tr: {
    intro1: "Aşağıdaki sorular, test hizmetini geliştirmemize ve finanse etmeye devam etmemize yardımcı olur.",
    intro2: "Tüm bilgiler gönüllüdür, anonimdir ve yalnızca dahili analiz için kullanılacaktır. Kimliğinizi ortaya çıkarabilecek herhangi bir veri toplanmaz.",
    intro3: "Yalnızca dürüst cevaplar anlamlı değişikliklere katkıda bulunabilir.",
    sections: {
      general: "Genel Bilgiler",
      risk: "Riskler ve Cinsel Davranış",
      health: "Sağlık ve Tutumlar"
    },
    questions: {
      age: "Kaç yaşındasın?",
      birthCountry: "Hangi ülkede doğdun?",
      gender: "Cinsiyetini nasıl tanımlarsın?",
      orientation: "Cinsel yönelimini nasıl tanımlarsın?",
      insurance: "Sağlık sigortan var mı?",
      doctor: "Almanya'da bir aile hekimin var mı?",
      riskType: "Hangi riskli durum yaşandı?",
      sexualRiskTime: "Son riskli temas ne kadar önceydi?",
      sexPractices: "Hangi cinsel uygulamalar gerçekleştirildi?",
      noAnswer: "Yanıt vermek istemiyorum.",
      chemsex: "Cinsel ilişki sırasında uyuşturucu (Chemsex) kullandın mı?",
      drugsUsed: "Hangi uyuşturucuları kullandın?"
    },
    options: {
      birthCountry: ["Almanya", "AB (Almanya hariç)", "AB dışı"],
      gender: ["Erkek", "Kadın", "İkili olmayan", "Trans*", "Diğer"],
      orientation: ["Heteroseksüel", "Homoseksüel", "Biseksüel", "Panseksüel", "Aseksüel", "Queer", "Diğer"],
      insurance: ["Evet", "Hayır", "Bilmiyorum"],
      doctor: ["Evet", "Hayır"],
      riskType: ["Cinsel", "Tıbbi (ör. kan transfüzyonu)", "Dövme / Piercing"],
      sexualRiskTime: ["6 haftadan kısa süre önce", "6 hafta veya daha uzun süre önce"],
      sexPracticesAnal: ["Aktif", "Pasif", "Her ikisi"],
      sexPracticesOral: ["Aktif", "Pasif", "Her ikisi"],
      sexPracticesOther: ["Vücut sıvılarıyla temas (kan, meni, anne sütü)", "Seks oyuncakları kullanımı (ör. dildo)", "Fisting", "Sert BDSM uygulamaları"],
      chemsex: ["Evet", "Hayır"],
      drugsUsed: ["Kristal Met", "GHB/GBL", "Kokain", "Ketamin", "MDMA", "Speed", "Diğer"]
    }
  },
  ar: {
    intro1: "تساعدنا الأسئلة التالية على تحسين خدمة الفحص واستمرار تمويلها.",
    intro2: "جميع المعلومات اختيارية ومجهولة الهوية وتُستخدم فقط لأغراض التحليل الداخلي. لا يتم جمع أي بيانات يمكن أن تكشف عن هويتك.",
    intro3: "فقط من يجيب بصدق يمكنه أن يساهم في تغييرات ذات معنى.",
    sections: {
      general: "معلومات عامة",
      risk: "المخاطر والسلوك الجنسي",
      health: "الصحة والمواقف"
    },
    questions: {
      age: "كم عمرك؟",
      birthCountry: "في أي بلد وُلدت؟",
      gender: "كيف تصف جنسك؟",
      orientation: "كيف تصف ميولك الجنسية؟",
      insurance: "هل لديك تأمين صحي؟",
      doctor: "هل لديك طبيب عائلة في ألمانيا؟",
      riskType: "ما نوع الموقف الذي حدث ويشكل خطراً؟",
      sexualRiskTime: "متى كان آخر اتصال محفوف بالمخاطر؟",
      sexPractices: "ما الممارسات الجنسية التي تمت؟",
      noAnswer: "لا أرغب بالإجابة.",
      chemsex: "هل استخدمت المخدرات أثناء العلاقة الجنسية (Chemsex)؟",
      drugsUsed: "ما المخدرات التي استخدمتها؟"
    },
    options: {
      birthCountry: ["ألمانيا", "الاتحاد الأوروبي (باستثناء ألمانيا)", "خارج الاتحاد الأوروبي"],
      gender: ["ذكر", "أنثى", "غير ثنائي", "ترانس*", "أخرى"],
      orientation: ["غيري الجنس", "مثلي الجنس", "ثنائي الجنس", "بانجنس", "لاجنسي", "كوير", "أخرى"],
      insurance: ["نعم", "لا", "لا أعلم"],
      doctor: ["نعم", "لا"],
      riskType: ["جنسي", "طبي (مثال: نقل دم)", "وشم / بيرسينغ"],
      sexualRiskTime: ["منذ أقل من 6 أسابيع", "منذ 6 أسابيع أو أكثر"],
      sexPracticesAnal: ["فاعل", "مفعول به", "الاثنين معاً"],
      sexPracticesOral: ["فاعل", "مفعول به", "الاثنين معاً"],
      sexPracticesOther: ["الاتصال بسوائل الجسم (دم، سائل منوي، حليب الثدي)", "استخدام ألعاب جنسية (مثلاً: ديلدو)", "الـFisting", "ممارسات BDSM العنيفة"],
      chemsex: ["نعم", "لا"],
      drugsUsed: ["كريستال ميث", "GHB/GBL", "كوكايين", "كيتامين", "MDMA", "سبيد", "أخرى"]
    }
  }
};

export default function Questionnaire() {
  const [lang, setLang] = useState("de");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const t = TRANSLATIONS[lang];
  const [riskType, setRiskType] = useState<string | null>(null);
  const [selectedSexPracticesOther, setSelectedSexPracticesOther] = useState<string[]>([]);
  const [chemsexUsed, setChemsexUsed] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const NO_ANSWER = "__no_answer__";


//   function getValueFromLabel(questionKey: string, label: string, lang: string) {
//   const options = OPTION_DEFS[questionKey];
//   return options.find(opt => opt.labels[lang] === label)?.value;
// }
// at the bottom of your Questionnaire component:
useEffect(() => {
    (window as any).responses = responses;
  }, [responses]);
  

//   const handleToggle = (key: string) => {
//     setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
//   };
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
  

//   const renderRadioOptions = (options: string[], inputName: string) => (
//     <RadioGroup>
//       {options.map((option, index) => (
//         <div className="flex items-center space-x-2" key={index}>
//           <RadioGroupItem value={option} id={`${inputName}-${index}`} />
//           <Label htmlFor={`${inputName}-${index}`}>{option}</Label>
//         </div>
//       ))}
//     </RadioGroup>
//   );

    // const renderRadioOptions = (
    //     options: string[],
    //     inputName: string,
    //     selectedValue: string | null,
    //     setSelectedValue: (val: string) => void
    // ) => (
    //     <RadioGroup
    //     value={selectedValue || ""}
    //     onValueChange={(val) => {
    //         setSelectedValue(val);
    //         setResponses((prev) => ({ ...prev, [inputName]: val }));
    //     }}
    //     >
    //     {options.map((option, index) => (
    //         <div className="flex items-center space-x-2" key={index}>
    //         <RadioGroupItem value={option} id={`${inputName}-${index}`} />
    //         <Label htmlFor={`${inputName}-${index}`}>{option}</Label>
    //         </div>
    //     ))}
    //     </RadioGroup>
    // );

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
  

//   const renderCheckboxOptions = (
//     options: string[],
//     selectedValues: string[],
//     setSelectedValues: (values: string[]) => void,
//     inputName: string
//   ) => (
//     <div className="space-y-2">
//       {options.map((option, index) => (
//         <div className="flex items-center space-x-2" key={index}>
//           <Checkbox
//             id={`${inputName}-${index}`}
//             checked={selectedValues.includes(option)}
//             onCheckedChange={(checked) => {
//                 if (checked) {
//                     setSelectedValues([...selectedValues, option]);
//                 } else {
//                     setSelectedValues(selectedValues.filter((v) => v !== option));
//                 }
//             }}
//           />
//           <Label htmlFor={`${inputName}-${index}`}>{option}</Label>
//         </div>
//       ))}
//     </div>
//   );

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

      {/* Section: General Info */}
      <h2 className="text-xl font-semibold mb-2">{t.sections.general}</h2>
      <Separator className="mb-4" />

      {["age", "birthCountry", "gender", "orientation", "insurance", "doctor"].map((key) => (
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

      {/* Section: Risk Behavior */}
      <h2 className="text-xl font-semibold mt-10 mb-2">{t.sections.risk}</h2>
      <Separator className="mb-4" />

      {/* Risk Type */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">{t.questions.riskType}</h3>
        {!collapsed.riskType ? (
            <RadioGroup onValueChange={(val) => {
                setRiskType(val);
                setResponses((prev) => ({...prev, riskType:val}));
            }
            }>
            {t.options.riskType.map((option, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={option} id={`riskType-${index}`} />
                <Label htmlFor={`riskType-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        //   renderRadioOptions(t.options.riskType, "riskType")
        ) : (
          <p className="text-muted-foreground italic text-sm">{t.questions.noAnswer}</p>
        )}
        <button
          className="mt-1 text-sm underline text-muted-foreground"
          onClick={() => handleToggle("riskType")}
        >
          {collapsed.riskType ? t.questions.noAnswer.replace(/\.$/, " zurücknehmen") : t.questions.noAnswer}
        </button>
      </div>

      {riskType === "Sexuell" && (
  <>
    {/* Sexual Risk Time */}
    <div className="mb-6">
      <h3 className="font-medium mb-2">{t.questions.sexualRiskTime}</h3>
      {!collapsed.sexualRiskTime ? (
        renderRadioOptions(t.options.sexualRiskTime, "sexualRiskTime")
      ) : (
        <p className="text-muted-foreground italic text-sm">{t.questions.noAnswer}</p>
      )}
      <button
        className="mt-1 text-sm underline text-muted-foreground"
        onClick={() => handleToggle("sexualRiskTime")}
      >
        {collapsed.sexualRiskTime ? t.questions.noAnswer.replace(/\.$/, " zurücknehmen") : t.questions.noAnswer}
      </button>
    </div>

    {/* Sexual Practices */}
    <div className="mb-6">
      <h3 className="font-medium mb-2">{t.questions.sexPractices}</h3>
      {!collapsed.sexPractices ? (
        <>
          <div className="mb-4">
            <p className="font-medium">Art des sexuellen Kontakts</p>
            {renderRadioOptions(t.options.sexPractices, "sexPractices")}
          </div>

          <div className="mb-4">
            <p className="font-medium">Weitere Praktiken mit Infektionsrisiko</p>
            {renderCheckboxOptions(
              t.options.sexPracticesOther,
              selectedSexPracticesOther,
              setSelectedSexPracticesOther,
              "sexPracticesOther"
            )}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground italic text-sm">{t.questions.noAnswer}</p>
      )}
      <button
        className="mt-1 text-sm underline text-muted-foreground"
        onClick={() => handleToggle("sexPractices")}
      >
        {collapsed.sexPractices ? t.questions.noAnswer.replace(/\.$/, " zurücknehmen") : t.questions.noAnswer}
      </button>
    </div>

    {/* Chemsex Question */}
    <div className="mb-6">
      <h3 className="font-medium mb-2">{t.questions.chemsex}</h3>
      {!collapsed.chemsex ? (
        <RadioGroup onValueChange={(val) => {
            setChemsexUsed(val);
            setResponses((prev) => ({ ...prev, chemsexUsed: val }));
        }
            }>
          {t.options.chemsex.map((option, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={option} id={`chemsex-${index}`} />
              <Label htmlFor={`chemsex-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <p className="text-muted-foreground italic text-sm">{t.questions.noAnswer}</p>
      )}
      <button
        className="mt-1 text-sm underline text-muted-foreground"
        onClick={() => handleToggle("chemsex")}
      >
        {collapsed.chemsex ? t.questions.noAnswer.replace(/\.$/, " zurücknehmen") : t.questions.noAnswer}
      </button>
    </div>

    {chemsexUsed === "Ja" && (
      <div className="mb-6">
        <h3 className="font-medium mb-2">{t.questions.drugsUsed}</h3>
        {renderCheckboxOptions(
          t.options.drugsUsed,
          selectedDrugs,
          setSelectedDrugs,
          "drugsUsed"
        )}
      </div>
    )}
  </>
)}
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
  
>
  Submit
</button>
<details className="mt-6 bg-gray-100 rounded p-4 text-sm">
  <summary className="cursor-pointer mb-2">🧪 Debug: responses</summary>
  <pre>{JSON.stringify(responses, null, 2)}</pre>
</details>
 </div>
 
  );
}
