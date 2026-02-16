import React, { /*useEffect, useMemo, */ useState } from "react"; // useMemo unused
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { invoke } from "@tauri-apps/api/core";
import { CountryCombobox } from "@/components/ui/country_select";
import {ConditionalField} from "@/components/ui/hivTest_history";
import "@radix-ui/themes/styles.css";
import { YesNoSeparatedChips } from "@/components/ui/yesNoModeChips";
import { YesNoChips } from "@/components/ui/yesNoChips";
import { StiHistoryBlock } from "@/components/ui/StiHistoryBlock";
import { VaxInfectionChips } from "@/components/ui/vaxInfectionChips";
import { BrandTheme, BrandPage, BrandHeader } from "@/components/ui/brandTheme";
import { AppBurger } from "@/components/ui/app_burger";
import { Toaster } from "@/components/ui/toaster";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { TwoInputRow } from "./ui/besucher_id_pls";
import * as C from "./translations";
import * as R from "./question_registry";
import { optionsFor, titleFor, labelFor, questionNo} from "./helpers";
import { useQuestionnaireState } from "./questionnaire_state";
import {TestNotes} from "@/components/ui/notes_list"
import { QuestionHeader} from "@/components/ui/question_header";
import {  getRelevantVars, getVarsWithQuestionNo} from "@/components/domain/fragebogen/schema_v1";

const CURR_VERSION = "0.70";
const SCHEMA_VERSION = 2; // bump if question set changes
const SUBMIT_LABELS = false; // true -> submit localized labels instead of codes
const LOCAL_STORE_VAR = `chp_draft_${CURR_VERSION}`
const STORE_PATH = "/Users/tk/js/chp_ahd/test.csv"

const ANSWER_INDENT = "pl-6 md:pl-8";
// const OPTION_STACK  = "space-y-1";
// const ANSWER_INDENT = "pl-3 border-l border-muted/30"; // alternate style
const LINK_PRIMARY = "text-blue-600 hover:text-blue-700";
const LINK_MUTED   = "text-muted-foreground hover:text-foreground";







// wenn aw-mlg als code "other" enthält wird freitext-feld eingeblendet um angabe zu präzisieren
export const OTHER_CODE = "other" as const;

export default function EQuestionnaireWired() {
  /// this functions defines the UI



  const { toast, lang, setLang, responses, setResponses, backup, setBackup } =
    useQuestionnaireState(LOCAL_STORE_VAR);


  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  function isSkipped(qid: string): boolean {
    const v = responses[qid];
    return v === "pnr" || (Array.isArray(v) && v.length === 1 && v[0] === "pnr");
  }

  function skipQuestion(qid: string) {
    const def = R.Q[qid];
    setBackup(prev => ({ ...prev, [qid]: responses[qid] }));
    setResponses(prev => {
    const next: Record<string, any> = {
    ...prev,
    [qid]: (def.type === "radio" || def.type === "country" || def.type === "yesno" || def.type === "vax4")
    ? "pnr"
    : ["pnr"],
    };
    if (def.type === "vax4") delete next[`${qid}_infection_year`];
    return next;
  });
    // setResponses(prev => ({ ...prev, [qid]: (def.type === "radio"  || def.type === "country" || def.type === "yesno") ? "pnr" : ["pnr"] }));
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
  code: string, // anforderung identifier
  checked: boolean, // angefordert: yes/no
  qid: string // question/anfordering text / short description
  ) {
    setResponses((prev) => {
      const arr = new Set<string>(prev[qid] || []);

      if (checked) {
        arr.add(code);

        // Nur Beratung clears all others
        if (code === "counsel") {
          return { ...prev, [qid]: ["counsel"] };
        }

        // Any other clears "counsel"
        arr.delete("counsel");


        // NOTE: not sure why deselection/selection gon/chlam logic exists below, since chlam/gon are always tested together
        /// this might be a relict from changing variables -> refactor at some point and make sure output written is fine

        // Gonorrhoe auto-selects Chlamydien
        if (C.GONO_CHLAM_MAP[code]) {
          const chl = C.GONO_CHLAM_MAP[code];
          const chlamArr = new Set<string>(prev[qid] || []);
          chlamArr.add(chl);
          arr.add(chl); // ensure in same set
        }
      } else {
        arr.delete(code);

        // Gonorrhoe auto-deselects Chlamydien
        if (C.GONO_CHLAM_MAP[code]) {
          const chl = C.GONO_CHLAM_MAP[code];
          arr.delete(chl);
        }
      }

      return { ...prev, [qid]: Array.from(arr) };
    });
  }

  function toggleCheckboxGeneric(
    qid: string, 
    code: string, 
    checked: boolean
  ) {
    setResponses(prev => {
      const curr = new Set<string>(Array.isArray(prev[qid]) ? prev[qid] : []);
      if (checked) curr.add(code);
      else curr.delete(code);

      const next: Record<string, any> = { ...prev, [qid]: Array.from(curr) };

      // if OTHER was just unchecked, wipe its text
      if (code === OTHER_CODE && !checked) {
        const otherKey = `${qid}__other`;
        delete next[otherKey];  // or: next[otherKey] = "";
      }

      return next;
    });
  }

  function onCheckboxToggle(qid: string, code: string, checked: boolean) {
   if (qid === "testanforderungen") {
      // your special rules
      handleTestanforderungChange(code, checked, qid);

      // ALSO clear if "other" unchecked inside the special handler path
      if (code === OTHER_CODE && !checked) {
        setResponses(prev => {
          const next = { ...prev };
          delete next[`${qid}__other`];
          return next;
        });
      }
    } else {
      toggleCheckboxGeneric(qid, code, checked);
    }
  }

  const renderQuestion = (qid: string) => {
    /// renders ui given question id as input str)

    const def = R.Q[qid]; // -> mapping qid to actual question record in question registry (R.Q)
    const title = titleFor(qid, lang); // -> obtain title in resp. language
    const qno = questionNo(qid)
    if (isSkipped(qid)) {
      /// möchte nicht antworten ("skipped") -> button "möchte antworten" auf der rechten bildseite einblenden
      return (
      <div key={qid} className="mb-6 border rounded-md p-3 bg-muted/30">
        <QuestionHeader
          no={qno}
          title={title}
          right={
            <Button
              variant="link"
              size="sm"
              className={LINK_PRIMARY}
              onClick={() => unskipQuestion(qid)}
            >
              {C.ANSWER_LABEL[lang]}
            </Button>
          }
        />
        <p className="text-sm text-muted-foreground">{C.SKIP_LABEL[lang]}</p>
      </div>
    );
    }

     // some questions are renderd as ui-sub-components, respective question/answer logic (see below: sti_history_yesno)
    const STI_QIDS_HIDE = new Set(["sti_history_which","sti_history_treat","sti_history_treat_country"]);
    if (STI_QIDS_HIDE.has(qid)) return null;

    // below come custom ui-components
    if (qid === "sti_history_yesno") {
      return (
        <StiHistoryBlock
          lang={lang}
          responses={responses}
          setResponses={setResponses}
          indentClass={ANSWER_INDENT}
          stiOptions={C.STI_HISTORY}
          titles={{
            yesno: `${qno}. ${titleFor("sti_history_yesno", lang)}`,
            which: titleFor("sti_history_which", lang),
            treat: titleFor("sti_history_treat", lang),
            country: titleFor("sti_history_treat_country", lang),
          }}
          countryTexts={{
            placeholder: C.PLACEHOLDERS.birthCountry[lang],
            searchPlaceholder: C.SEARCH_PLACEHOLDER[lang],
            emptyLabel: C.EMPTY_LABEL[lang],
          }}
          onSkip={() => {
            // use your existing skip + clear dependents
            skipQuestion("sti_history_yesno");
            setResponses(prev => {
              const next = { ...prev };
              next["sti_history_which"] = [];
              delete next["sti_history_which__other"];
              next["sti_history_treat"] = "";
              next["sti_history_treat_country"] = "";
              return next;
            });
          }}
        />
      );
    }

    // const invalid = !responses["plz"] || !responses["besucherkennung"];

    if (qid === "besucher_info") {
      // besucher informationen in einer reihe (id und plz)
      return(
        // <div
        //   className={clsx(
        //     "rounded-md p-3 transition-colors",
        //     invalid && "border border-red-400 bg-red-50/40"
        //   )}
        // >
        <TwoInputRow
          title={titleFor(qid, lang)}
          leftValue={String(responses["besucherkennung"] ?? "")}
          rightValue={String(responses["plz"] ?? "")}
          onLeftChange={(v) =>
            setResponses(p => ({ ...p, besucherkennung: v }))
          }
          onRightChange={(v) =>
            setResponses(p => ({ ...p, plz: v }))
          }
        />
        // </div>
      )
    }

    if (def.type === "vax4") {
      /// vaxination
      const v = (responses[qid] as "yes" | "no" | "unknown" | "infection" | "" | undefined) ?? "";
      const yrKey = `${qid}_infection_year`;
      const yrVal = responses[yrKey] ?? "";

      return (
        <div key={qid} className="mb-6">
        <QuestionHeader
          no={qno}
          title={title}
          right={
            <Button
              variant="link"
              size="sm"
              className={LINK_MUTED}
              onClick={() => skipQuestion(qid)}
            >
              {C.SKIP_LABEL[lang]}
            </Button>
          }
        />
        <div className={ANSWER_INDENT}>
          <VaxInfectionChips
            lang={lang}
            value={v}
            year={yrVal}
            onChange={(next) =>
              setResponses(prev => {
                const n = { ...prev, [qid]: next };
                if (next !== "infection") delete n[yrKey];
                return n;
              })
            }
            onYearChange={(y) =>
              setResponses(prev => ({ ...prev, [yrKey]: y }))
            }
          />
        </div>
        {/* <div className="mt-2">
          <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => skipQuestion(qid)}>
            {SKIP_LABEL[lang]}
          </Button>
        </div> */}
      </div>
      );
    }

    const FOUR_MODE_QIDS = ["risk_situation_d1_1", "risk_situation_d1_2"] as const; // four mode is no or yes-aktiv, yes-passiv, yes-beides
    if (def.type === "radio" && (FOUR_MODE_QIDS as readonly string[]).includes(qid)) {
      // const v = responses[qid] ?? "";
      return (
        <div key={qid} className="mb-6">
          <h3 className="mb-2 text-lg font-medium">{qno}. {title}</h3>
          <div className={ANSWER_INDENT}>
            <YesNoSeparatedChips
              lang={lang}
              value={responses[qid] ?? ""}
              onChange={(next) => setResponses(p => ({ ...p, [qid]: next }))}
              separator="space"     // or "line" or "label"
            />
          </div>
          <div className="mt-2">
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground"  onClick={() => skipQuestion(qid)}>
              {C.SKIP_LABEL[lang]}
            </Button>
          </div>
        </div>
      );
    }

    if (qid === "hiv_test_prev") {
      const title = titleFor(qid, lang)
      // const answer = (responses[qid] as "yes" | "no" | "" | undefined) ?? ""
      // const year   = responses["hiv_test_prev_year"] ?? null
      // const count  = responses["hiv_test_prev_count"] ?? null
      // const checked = !!responses["hiv_test_prev_confirm"]

      return (
        <div key={qid} className="mb-6">
        <QuestionHeader
          no={qno}
          title={title}
          right={
            <Button
              variant="link"
              size="sm"
              className={LINK_MUTED}
              onClick={() => skipQuestion(qid)}
            >
              {C.SKIP_LABEL[lang]}
            </Button>
          }
        />

        <div className={ANSWER_INDENT}>
          <ConditionalField
            lang={lang} // "de" | "en" | "tr" | "uk"
            answer={responses["hiv_test_prev"] ?? ""}
            year={responses["hiv_test_prev_year"] || null}
            count={responses["hiv_test_prev_count"] || null}
            checked={!!responses["hiv_test_prev_confirm"]}
            onChange={(val) => {
              setResponses(prev => ({
                ...prev,
                hiv_test_prev: val.answer,
                hiv_test_prev_count: Number.isFinite(val.count) ? val.count : "",
                hiv_test_prev_year: val.year ?? "",
                hiv_test_prev_confirm: !!val.checked,
              }))
            }}
          />
        </div>

        {/* <div className="mt-2">
          <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground"  onClick={() => skipQuestion(qid)}>
            {SKIP_LABEL[lang]}
          </Button>
        </div> */}
      </div>
      )
    }


    /// definition generische typen der ui components (radio, switcher, checkbox, textfield, selector)

    if (def.type === "radio") {
      // const o = optionsFor(def.options!, lang);
      const value = responses[qid] || "";
      const otherKey = `${qid}__other`;
      const otherValue = responses[otherKey] ?? "";

      const ui_skip_question = <Button
              variant="link"
              size="sm"
              className={LINK_MUTED}
              onClick={() => skipQuestion(qid)}
            >
              {C.SKIP_LABEL[lang]}
            </Button>

      const out = qid !== "hiv_test" ? ui_skip_question : undefined; /// diese frage muss beantwortet werden

      return (
        <div key={qid} className="mb-6">
       
        <QuestionHeader
          no={qno}
          title={title}
          right={out}
        />
        
          {/* <h3 className="mb-2 text-lg font-medium">{title}</h3> */}
          <RadioGroup
            className={ANSWER_INDENT}
            value={responses[qid] || ""}
            onValueChange={(val) =>
              setResponses(prev => {
                const next = { ...prev, [qid]: val };
                // if we moved away from OTHER, wipe the text
                if (val !== OTHER_CODE) {
                  delete next[otherKey]; // or: next[otherKey] = "";
                }
                return next;
              })
            }
          >
            {optionsFor(def.options!, lang).map((item, i) => (
              <div className="flex items-center space-x-2" key={`${qid}-${item.value}`}>
                <RadioGroupItem value={item.value} id={`${qid}-${i}`} />
                <Label htmlFor={`${qid}-${i}`}>{item.label}</Label>
              </div>
            ))}
          </RadioGroup>

          {value === OTHER_CODE && (
            <div className={`${ANSWER_INDENT} mt-2`}>
              <Input
                value={otherValue}
                placeholder={def.placeholder?.[lang] ?? "Bitte angeben..."}
                onChange={(e) =>
                  setResponses(p => ({ ...p, [otherKey]: e.target.value }))
                }
              />
            </div>
          )}

          {/* {qid !== "testanforderungen" && (
            <div className="mt-2">
              <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground"  onClick={() => skipQuestion(qid)}>
                {SKIP_LABEL[lang]}
              </Button>
            </div>
          )} */}
        </div>
      );
    }

    if (def.type === "yesno") {
      const v = (responses[qid] as "yes" | "no" | "" | undefined) ?? "";
      return (
        <div key={qid} className="mb-6">
        <QuestionHeader
          no={qno}
          title={title}
          right={
            <Button
              variant="link"
              size="sm"
              className={LINK_MUTED}
              onClick={() => skipQuestion(qid)}
            >
              {C.SKIP_LABEL[lang]}
            </Button>
          }
        />
        <div className={ANSWER_INDENT}>
          <YesNoChips
            lang={lang}
            value={v}
            onChange={(next) => setResponses(p => ({ ...p, [qid]: next }))}
          />
        </div>
        {/* <div className="mt-2">
          <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground"  onClick={() => skipQuestion(qid)}>
            {SKIP_LABEL[lang]}
          </Button>
        </div> */}
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
      // inside your checkbox branch
      const selected: string[] = responses[qid] || [];
      const otherKey = `${qid}__other`;
      const otherValue = responses[otherKey] ?? "";
      
      const groups = def.options.reduce((acc, opt) => {
        const g = opt.group ?? "";
        if (!acc[g]) acc[g] = [];
        acc[g].push(opt);
        return acc;
      }, {} as Record<string, C.Opt[]>);

      return (
        <div key={qid} className="mb-6">
        <QuestionHeader
          no={qno}
          title={titleFor(qid, lang)}
          right={
            qid !== "testanforderungen" ? (
              <Button
                variant="link"
                size="sm"
                className={LINK_MUTED}
                onClick={() => skipQuestion(qid)}
              >
                {C.SKIP_LABEL[lang]}
              </Button>
            ) : null
          }
        />

        {/* <h3 className="mb-2 text-lg font-medium">{titleFor(qid, lang)}</h3> */}
        <div className={`${ANSWER_INDENT} `}>
    
          {Object.entries(groups).map(([group, opts]) => {
            const hasOtherInThisGroup = opts.some(o => o.code === OTHER_CODE);

            return (
              <div key={group} className="mb-6">
                {group && <p className="font-semibold text-sm text-blue-600 mb-1">{group}</p>}

                <div className={qid === "testanforderungen" ? "flex flex-wrap gap-x-4 gap-y-2" : "flex flex-col space-y-2"}>
                  {opts.map((item) => {
                    const checked = selected.includes(item.code);
                    return (
                      <label key={`${qid}-${item.code}`} htmlFor={`${qid}-${item.code}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${qid}-${item.code}`}
                          checked={checked}
                          disabled={responses[qid]?.includes("counsel") && item.code !== "counsel"}  // keep your special disabling if you need it
                          onCheckedChange={(c) => onCheckboxToggle(qid, item.code, c === true)}     // ← changed line
                        />
                        <span>{item.labels[lang]}</span>
                      </label>
                    );
                  })}
                </div>

                {/* only show free text under the group that actually contains the "other" option */}
                {hasOtherInThisGroup && selected.includes(OTHER_CODE) && (
                  <div className="mt-2">
                    <Input
                      value={otherValue}
                      placeholder={def.placeholder?.[lang] ?? "Bitte angeben..."}
                      onChange={(e) => setResponses(p => ({ ...p, [otherKey]: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            );
          }
        )
        }
        {/* {qid !== "testanforderungen" && (
          <div className="mt-2">
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground"  onClick={() => skipQuestion(qid)}>
              {SKIP_LABEL[lang]}
            </Button>
          </div>
        )}  */}
      </div>
      </div>
      );
    }

    if (def.type === "country") {
        // const raw = (responses[qid] as string | undefined) ?? "";
        // const codeOrNull = raw ? raw : "DE"; // default selection for display
      const codeOrNull = (responses[qid] as string | null) ?? null;

      // const handleCountryChange = (code: string | null) => {
      //   console.log("[Parent] onChange received", { qid, code, type: typeof code });
      //   setResponses(prev => ({ ...prev, [qid]: code ?? "" }));
      // };
      


      return (
        <div key={qid} className="mb-6">
        <QuestionHeader
          no={qno}
          title={title}
          right={
            <Button
              variant="link"
              size="sm"
              className={LINK_MUTED}
              onClick={() => skipQuestion(qid)}
            >
              {C.SKIP_LABEL[lang]}
            </Button>
          }
        />
         <div className={ANSWER_INDENT}>
          <CountryCombobox
            value={codeOrNull}
            onChange={(code) => {
              setResponses(prev => ({
                ...prev,
                [qid]: code, // "DE" | "DZ" | null
              }));
            }}
            lang={lang}
            placeholder={C.PLACEHOLDERS.birthCountry[lang] ?? C.PLACEHOLDERS.birthCountry.de}
            searchPlaceholder={C.SEARCH_PLACEHOLDER[lang] ?? C.SEARCH_PLACEHOLDER.de}
            emptyLabel={C.EMPTY_LABEL[lang] ?? C.EMPTY_LABEL.de}
          />
        </div>
        </div>
      );
    }
  };

  const [activeTab, setActiveTab] = useState<"general"|"hiv"|"sexpractices"|"other"|"summary"|"berater">("general");
  const hivDisabled = responses["hiv_test"] === "no";




  //// get keys for schema
  const relevantVars = getRelevantVars(responses)
  const test = getVarsWithQuestionNo(responses)
  // console.log("relevantVars", relevantVars)
  console.log("test", test)


  const isEmptyAnswer = (v: unknown) => {
    if (v == null) return true;
    if (typeof v === "string") return v.trim().length === 0;
    if (Array.isArray(v)) return v.length === 0;
    return false;
  };

  const unansweredDE_nb = test
   .filter(({ var: qid }) => isEmptyAnswer(responses[qid]))
  .map(({ questionNo, var: qid }) => {
    const title = titleFor(qid, "de") ?? qid;
    return `F${questionNo}: ${title}?`;
  });

  const unansweredDE = [...relevantVars]
  .filter((qid) => isEmptyAnswer(responses[qid]))
  .map((qid) => titleFor(qid, "de") ?? qid);
  
  console.log("responses2", unansweredDE_nb)
  // const unansweredDE = QUESTION_ORDER
  //   .filter(qid => responses[qid] === undefined || responses[qid] === "" || (Array.isArray(responses[qid]) && responses[qid].length === 0))
  //   .map(qid => titleFor(qid, "de"));


  // const pretty = Object.fromEntries(
  //   QUESTION_ORDER
  //   .filter(qid => responses[qid] !== undefined && responses[qid] !== "")
  //   .map(qid => {
  //     const val = responses[qid];
  //     const def = R.Q[qid];
  //     const title = titleFor(qid, "de");
  //     if (def?.options) {
  //       return [
  //         title,
  //         Array.isArray(val)
  //           ? val.map(c => labelFor(qid, c, "de"))
  //           : labelFor(qid, val, "de"),
  //       ];
  //     }
  //     return [title, val];
  //   })
  // );

  const [submitState, setSubmitState] = useState<{ status: "idle" | "submitting" | "success" | "error"; message?: string }>({ status: "idle" });

  function buildPayload() {
    // by default submit raw codes; optionally include a label view for humans
    const labeled = Object.fromEntries(
      Object.entries(responses).map(([qid, val]) => {
        const def = R.Q[qid];
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
        // visitorId: responses["besucherkennung"] ?? null, /// this needs to be adde back in as besucherkennung is important
      },
      data: SUBMIT_LABELS ? labeled : responses,
    };
  }

  // define the order of all questions in CSV
  const QUESTION_ORDER_OUT = [
    "besucherkennung",
    "beraterkennung",
    "beraterkommentar",
    "testanforderungen",  

    "gender",
    "orientation",
    "birthCountry",
    "insurance",
    "doctor",
    "hiv_test",
    "riskType",
    "hiv_risk_selfest",
    "hiv_test_prev",
    "hiv_test_prev_year",
    "hiv_test_prev_count",
    "hiv_test_prev_confirm", //
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
    "hepA_infection_year",
    "hepB",
    "hepB_infection_year",
    "hepABVac",
    "hepC",
    "hepC_tm",
    "plz",
  ];

  async function submitResponses() {

    // validation: Besucher-ID and Beraterkennung required
    if (!responses["besucherkennung"] || !responses["beraterkennung"]) {
      alert("Bitte Besucher-ID und Beraterkennung eingeben, bevor Du absendest.");
      return;
    }

    // validate: if any radio == other → require text; if any checkbox contains other → require text
    for (const qid of Object.keys(R)) {
      const def = R.Q[qid];
      if (!def) continue;

      // radio: value is string
      if (def.type === "radio" && responses[qid] === OTHER_CODE) {
        const txt = (responses[`${qid}__other`] ?? "").trim();
        if (!txt) {
          alert(`Bitte geben Sie eine Freitext-Antwort für "${qid}" an.`);
          return;
        }
      }

      // checkbox: value is string[]
      if (def.type === "checkbox" && Array.isArray(responses[qid]) && responses[qid].includes(OTHER_CODE)) {
        const txt = (responses[`${qid}__other`] ?? "").trim();
        if (!txt) {
          alert(`Bitte geben Sie eine Freitext-Antwort für "${qid}" an.`);
          return;
        }
      }
    }

    setSubmitState({ status: "submitting" });
    const payload = buildPayload();

    try {
      // const filePath = "Z:\\Projekt(e), Arbeitsbereich(e)\\Check-up Duisburg Kreis Wesel\\fuertorben\\chekpoint_daten.csv";
      // const filePath = "/Users/tk/js/chp_ahd/test.csv"

      const header = [
        "timestamp",
        "visitorId",
        ...QUESTION_ORDER_OUT.flatMap(qid => {
          const def = R.Q[qid];
          if (def?.type === "checkbox" && def.options) {
            const cols = def.options.map(opt => `${qid}_${opt.code}`);
            // add one text column if "other" exists among options
            const hasOther = def.options.some(o => o.code === OTHER_CODE);
            return hasOther ? [...cols, `${qid}_other_text`] : cols;
          }
          // radio/text/textarea -> single column
          return [qid];
        })
      ].join(",");

      const flatRow: string[] = [];
      flatRow.push(payload.meta.timestamp);
      flatRow.push(payload.meta.visitorId ?? "");

      for (const qid of QUESTION_ORDER_OUT) {
        const def = R.Q[qid];
        const val = responses[qid];

        if (def?.type === "checkbox" && def.options) {
          // 1) booleans for each option (fixed order)
          for (const opt of def.options) {
            flatRow.push(Array.isArray(val) && val.includes(opt.code) ? "true" : "false");
          }
          // 2) append the *_other_text column if schema has "other"
          const hasOther = def.options.some(o => o.code === OTHER_CODE);
          if (hasOther) {
            const txt = Array.isArray(val) && val.includes(OTHER_CODE)
              ? String(responses[`${qid}__other`] ?? "")
              : "";
            flatRow.push(txt ? `"${txt.replace(/"/g, '""')}"` : "");
          }
        } else if (def?.type === "radio") {
          // if "other" selected, write the free text into the single qid column
          if (val === OTHER_CODE) {
            const txt = String(responses[`${qid}__other`] ?? "");
            flatRow.push(txt ? `"${txt.replace(/"/g, '""')}"` : "");
          } else {
            flatRow.push(val ? `"${String(val).replace(/"/g, '""')}"` : "");
          }
        } else {
          // text / textarea / any scalar (including country)
          // map the skip sentinel "pnr" to empty on export:
          const out = val === "pnr" ? "" : String(val ?? "");
          flatRow.push(out ? `"${out.replace(/"/g, '""')}"` : "");
          // flatRow.push(val ? `"${String(val).replace(/"/g, '""')}"` : "");
        }
      }

      const row = flatRow.join(",");

      // One single call to Rust
      await invoke("append_csv", {
        path: STORE_PATH,
        row,
        header, // plain string
      });

      // setSubmitState({ status: "success" });
      setSubmitState({
        status: "success",
        message: `Besucher-ID: ${responses["besucherkennung"] || "-"}\nBerater-ID: ${responses["beraterkennung"] || "-"}`
      });


      // RESET FOR NEXT VISITOR
      setResponses(prev => { 
                
        const next = {
          beraterkennung: prev.beraterkennung ?? "",
          birthCountry: "DE",
        };

        localStorage.removeItem(LOCAL_STORE_VAR);
        localStorage.setItem(LOCAL_STORE_VAR, JSON.stringify(next));

        return next

        });

      setBackup({});
      setActiveTab("general");


      toast({
        title: "Gespeichert",
        description: `Besucher-ID: ${responses["besucherkennung"] || "-"}\nBerater-ID: ${responses["beraterkennung"] || "-"}`,
        duration: 2500, // optional
        variant: "success",
      });
          
    } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : typeof err === "string"
                ? err
                : JSON.stringify(err);

            console.error("CSV append failed", err);
            setSubmitState({
              status: "error",
              message,
            });
            toast({
              variant: "destructive",
              title: "Fehler beim Speichern",
              description: message,
            });
      }
  }

  type Section = "general" | "hiv" | "sexpractices" | "other" | "berater" | "summary";

  const SECTION_TITLES: Record<Section, string> = {
    general: "Allgemein",
    hiv: "HIV-Risiko",
    sexpractices: "Sex & Schutz",
    other: "Gesundheit & Vorsorge",
    berater: "Beratereingaben",
    summary: "Prüfen & Senden",
  };

  const qidsIn = (section: Section) =>
      Object.keys(R.Q).filter(
        qid => R.Q[qid].section === section && (R.Q[qid].no ?? 0) !== 0
      );
  // const qidsIn = (s: Section) =>
  //   Object.entries(R.Q).filter(([, v]) => v.section === s && v.no !== 0).map(([qid]) => qid);

  // const isAnswered = (qid: string) => {
  //   const v = responses[qid];
  //   return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== "";
  // };

  const isAnswered = (qid: string) => {
      // const v = responses[qid];
      const v = responses[qid];

      // null / undefined => not answered
      if (v == null) return false;

      // your CountryCombobox stores string | null
      if (typeof v === "string") return v.trim().length > 0;

      // other components might store arrays
      if (Array.isArray(v)) return v.length > 0;

      // fallback: treat other values as answered only if they’re meaningful
      return v !== "";
    };

  const totalInSection = Math.max(1, qidsIn(activeTab as Section).length);
  const answeredInSection = qidsIn(activeTab as Section).filter(isAnswered).length;
  const percent = Math.round((answeredInSection / totalInSection) * 100);

  const section_after_allgemein = hivDisabled ? "sexpractices": "hiv";
  const section_after_allgemein_str = hivDisabled ? "Sex & Schutz": "HIV Risiko";

  //  const tabTriggerBase = "justify-start rounded-md px-3 py-2 text-sm " +
  //                       "data-[state=active]:bg-muted data-[state=active]:font-semibold " +
  //                       "data-[state=active]:border-l-4 data-[state=active]:border-primary";
    const tabTriggerBase =
                          "justify-start w-full rounded-md px-3 py-2 text-sm relative " +
                          "data-[state=active]:bg-muted data-[state=active]:font-semibold " +
                          "before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-transparent " +
                          "data-[state=active]:before:bg-primary";


  return (
    <BrandTheme /* dark={false} background */>
      <BrandPage>
        <BrandHeader
          logoSrc="/logo-ah-91db5ab3.png"
          // logoSrc="/BuTAH-8c0843ce.jpeg"
          right={
            <AppBurger
              lang={lang}
              onLangChange={(l) => setLang(l)}
              version={CURR_VERSION}
              // releaseUrl="https://github.com/<org>/<repo>/releases/latest"
              // repoUrl="https://github.com/tkimhofer/checkpoint_fragebogen/issues"
              contactEmail="feedback@tkimhofer.dev"
              endpoint={STORE_PATH}
              onClearDraft={() => {
                setResponses(prev => { 
                
                  const next = {
                    beraterkennung: prev.beraterkennung ?? "",
                    birthCountry: "DE",
                  };

                  localStorage.removeItem(LOCAL_STORE_VAR);
                  localStorage.setItem(LOCAL_STORE_VAR, JSON.stringify(next));

                  return next

                 });

                 setBackup({});
                 setActiveTab("general");
             
                
              }}
            />
          }
        />

        <div className="sticky top-0 z-40 -mx-6 mb-4 px-6 py-3
             bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
             border-b">
          <div className="flex items-center gap-4">
            <div className="min-w-[220px]">
                {/* <div 
                className="text-sm font-semibold"
                > */}
                  <div className={"text-sm font-semibold"}>
                  {SECTION_TITLES[activeTab as Section]}
                </div>
              <div className="text-xs text-muted-foreground">
                {answeredInSection}/{totalInSection} beantwortet
              </div>
            </div>

            <div className="flex-1">
              <Progress value={percent} className="h-2" />
            </div>

            <Separator orientation="vertical" className="hidden md:block h-6" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="hidden sm:inline text-xs text-muted-foreground cursor-default">
                    Deine Antworten werden lokal zwischengespeichert.
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm">
                  Automatische Zwischenspeicherung (lokal). Über „Prüfen &amp; Senden“ werden Daten exportiert.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="ml-auto inline-flex items-center rounded-full px-2.5 py-0.5
             text-[11px] font-bold uppercase tracking-wide
             bg-red-500/30 text-red-900
             ring-1 ring-red-400/50
             shadow-[0_0_10px_rgba(239,68,68,0.6)]">
              TEST V{CURR_VERSION}
            </span>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v)=>{ setActiveTab(v); scrollTop(); }}
          orientation="vertical"
          className="flex items-start gap-6"
        >
       

      <TabsList className="
        sticky z-20 top-[72px] md:top-[88px]
        flex h-auto w-56 flex-col items-stretch justify-start
        p-0 gap-1
        max-h-[calc(100vh-72px-1rem)] md:max-h-[calc(100vh-88px-1rem)]
        overflow-auto
        bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
        self-start
      ">
        <TabsTrigger value="general" className={tabTriggerBase}>Allgemein</TabsTrigger>

        <TabsTrigger
          value="hiv"
          disabled={hivDisabled}
          className={clsx(tabTriggerBase, hivDisabled && "opacity-50")}
        >
          HIV-Risiko
        </TabsTrigger>

        <TabsTrigger value="sexpractices" className={tabTriggerBase}>Sex &amp; Schutz</TabsTrigger>
        <TabsTrigger value="other" className={tabTriggerBase}>Gesundheit &amp; Vorsorge</TabsTrigger>

        {/* separator + spacing before staff/final steps */}
        <div className="mt-3 pt-3 border-t border-muted-foreground/20">
          <TabsTrigger value="berater" className={tabTriggerBase}>Beratereingaben</TabsTrigger>
          <TabsTrigger value="summary" className={tabTriggerBase}>Prüfen &amp; Senden</TabsTrigger>
        </div>
      </TabsList>
         
          {/* Right: content area */}
          <div className="flex-1">
            <TabsContent value="general">
              {Object.entries(R.Q).filter(([_, v]) => v.section === "general").map(([qid]) => renderQuestion(qid))}
              <div className="flex justify-end">
                <Button onClick={() => { setActiveTab(section_after_allgemein); scrollTop(); }}>Weiter zu: {section_after_allgemein_str}</Button>
              </div>
            </TabsContent>

            <TabsContent value="hiv">
              {Object.entries(R.Q).filter(([_, v]) => v.section === "hiv").map(([qid]) => renderQuestion(qid))}
              <div className="flex justify-end">
                <Button onClick={() => { setActiveTab("sexpractices"); scrollTop(); }}>Weiter zu: Sex & Schutz</Button>
              </div>
            </TabsContent>

            <TabsContent value="sexpractices">
              <h1 className="mb-8 text-l font-semibold">
                Sofern ein Risiko darin bestand, kein Kondom benutzt zu haben, welche Risikosituation(en) hattest Du?
              </h1>
              {Object.entries(R.Q).filter(([_, v]) => v.section === "sexpractices").map(([qid]) => renderQuestion(qid))}
              <div className="flex justify-end">
                <Button onClick={() => { setActiveTab("other"); scrollTop(); }}>Weiter zu: Gesundheit &amp; Vorsorge</Button>
              </div>
            </TabsContent>

            <TabsContent value="other">
              {Object.entries(R.Q).filter(([_, v]) => v.section === "other").map(([qid]) => renderQuestion(qid))}
              <div className="flex justify-end">
                <Button onClick={() => { setActiveTab("berater"); scrollTop(); }}>Weiter zu: Beratereingaben</Button>
              </div>
            </TabsContent>

            <TabsContent value="berater">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-start">
                <div className="space-y-6 md:col-span-3">
                   <div className="space-y-6 md:col-span-1
                rounded-xl bg-white
                border border-slate-200
                shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                p-6">
                  {/* {["besucher_info", "testanforderungen"].map(renderQuestion)} */}
                  {["testanforderungen"].map(renderQuestion)}
                </div>
                </div>
                <div className="space-y-6 md:col-span-3">
                  {/* <div className="space-y-6 md:col-span-1
                rounded-xl bg-white
                border border-slate-200
                shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                p-6"> */}
                   {["besucher_info", "beraterkennung", "beraterkommentar"].map(renderQuestion)}
                  {TestNotes()}
                 
                  {/* {["beraterkennung", "beraterkommentar"].map(renderQuestion)} */}
                  {/* </div> */}
                </div>
              </div>
               
              <div className="mt-4 flex items-center justify-end">
               {/* <div className="flex justify-end"> */}
                <Button onClick={() => { setActiveTab("summary"); scrollTop(); }}>
                  Weiter zu: Prüfen &amp; Senden
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              {/* <h3 className="font-semibold mb-2">Beantwortet:</h3>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                {JSON.stringify(pretty, null, 2)}
              </pre> */}

              {unansweredDE_nb.length > 0 ? (
                <>
                  <h3 className="font-semibold mt-4 mb-2">Offene Fragen:</h3>
                  <ul className="list-disc pl-5 text-sm">
                    {unansweredDE_nb.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Keine offenen Fragen.
                </p>
              )}


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
                <p className="mt-2 text-sm text-green-700 text-right">{submitState.message} ✓</p>
              )}
              {submitState.status === "error" && (
                <p className="mt-2 text-sm text-red-700 text-right">Submission failed: {submitState.message}</p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </BrandPage>

      {/* Toasts viewport */}
      <Toaster />
    </BrandTheme>
  );
}
