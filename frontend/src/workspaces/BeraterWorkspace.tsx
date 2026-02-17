import React, { /*useEffect, useMemo, */ useState } from "react"; // useMemo unused
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { invoke } from "@tauri-apps/api/core";
import { CountryCombobox } from "@/components/ui/country_select";
import {ConditionalField} from "@/components/ui/hiv_test_history";
import "@radix-ui/themes/styles.css";
import { YesNoSeparatedChips } from "@/components/ui/yesNoModeChips";
import { YesNoChips } from "@/components/ui/yesNoChips";
import { StiHistoryBlock } from "@/components/ui/sti_history_block";
import { VaxInfectionChips } from "@/components/ui/vaxInfectionChips";
import { BrandTheme, BrandPage, BrandHeader } from "@/components/ui/brandTheme";
// import { AppBurger } from "@/components/ui/app_burger";
import { AppSettingsSheet } from "@/components/ui/appSettingsSheet";
import { Toaster } from "@/components/ui/toaster";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { TwoInputRow } from "@/components/ui/besucher_id_pls";
import type { Question, } from "@/components/domain/fragebogen/types";
import { useAppSettings } from "@/AppSettings";

// import { getVarsWithQuestionNo, isEmptyAnswer, isSkipped } from "@/components/domain/fragebogen/derive";


// import * as R from "@/components/question_registry";
// import { optionsFor, titleFor, labelFor, questionNo} from "@/components/helpers";
// import {  getRelevantVars, getVarsWithQuestionNo} from "@/components/domain/fragebogen/schema_v1";

import * as C from "@/i18n/translations"; // labels like SKIP_LABEL etc live here now
import { QUESTION_BY_QID, qidsBySection } from "@/components/domain/fragebogen/bank";
import { titleFor, questionNo, optionsFor, } from "@/components/domain/fragebogen/i18n";
import { getVarsWithQuestionNo, isEmptyAnswer, isSkipped } from "@/components/domain/fragebogen/derive";


import { useQuestionnaireState } from "@/components/questionnaire_state";
import {TestNotes} from "@/components/ui/notes_list"
import { QuestionHeader} from "@/components/ui/question_header";
import {submitPayload, submitPayloadJSONToFile, type SubmitResult} from "@/components/backend"
import { buildPayloadData } from "@/components/domain/fragebogen/derive";
import { rehydrateResponsesFromPayloadData } from "@/components/domain/fragebogen/derive";

const CURR_VERSION = "0.80";
const SCHEMA_VERSION = "1"; // bump if question set changes
// const SUBMIT_LABELS = false; // true -> submit localized labels instead of codes
const LOCAL_STORE_VAR = `chp_draft_${CURR_VERSION}`
// const STORE_PATH = "/Users/tk/js/chp_ahd/"

const ANSWER_INDENT = "pl-6 md:pl-8";
// const OPTION_STACK  = "space-y-1";
// const ANSWER_INDENT = "pl-3 border-l border-muted/30"; // alternate style
const LINK_PRIMARY = "text-blue-600 hover:text-blue-700";
const LINK_MUTED   = "text-muted-foreground hover:text-foreground";
export const OTHER_CODE = "other" as const;


// import type { BackendTarget } from "@/components/ui/exportSelector";
// import { text } from "stream/consumers";

/// defining context for ui rendering based on INPUT TYPE, QID, COND. RULEs
type RenderCtx = {
  qid: string;
  def: Question;
  title: string;
  qno: number;
};

type Renderer = (ctx: RenderCtx) => React.ReactNode;



export default function CollectorWorkspace({
  // backend,
  // setBackend,
  // dataFolder,
  // setDataFolder,
  rehydrateData,
  onRehydrated,

  readOnly = false,
  openedEntryMeta,
  onCloseReadOnly,
  resetToken
}: {
  // backend: BackendTarget;
  // setBackend: (b: BackendTarget) => void;
  // dataFolder: string | null;
  // setDataFolder: (p: string | null) => void;
  rehydrateData?: any;
  onRehydrated?: () => void;

  readOnly?: boolean;
  openedEntryMeta?: { entryId?: string; createdAt?: string } | null;
  onCloseReadOnly?: () => void;
  resetToken?: number
}) {



  //// get keys for schema
  // const test = getVarsWithQuestionNo(responses)
  // console.log("responses", responses)
  const { meta } = useAppSettings();

  // console.log('openedEntryMeta', openedEntryMeta)
  const { backend, dataFolder, lang, apiBase, apiToken} = useAppSettings();
  const { toast, responses, setResponses, backup, setBackup } =
    useQuestionnaireState(LOCAL_STORE_VAR);

  React.useEffect(() => {
    if (!rehydrateData) return;

    console.log("rehydrating with data", rehydrateData);

    const payload =
    rehydrateData && typeof rehydrateData === "object" && "payloadData" in rehydrateData
      ? (rehydrateData as any).payloadData
      : rehydrateData;


    const restored = rehydrateResponsesFromPayloadData(payload);
    setResponses(restored);

    onRehydrated?.(); // clear trigger
  }, [rehydrateData]);

  const resetForm = React.useCallback(() => {
    setResponses(prev => {
      const next = {
        beraterkennung: prev?.beraterkennung ?? "",
        birth_country: "DE",
        risk_country: "DE",
      };

      localStorage.setItem(LOCAL_STORE_VAR, JSON.stringify(next));
      return next;
    });

    setBackup({});
    setActiveTab("general");
  }, []);

  
  React.useEffect(() => {
  if (resetToken !== undefined) {
    resetForm();
  }
}, [resetToken]);

  
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const renderVax4 = ({ qid, title, qno }: RenderCtx) => {
    const v = (responses[qid] as "yes" | "no" | "unknown" | "infection" | "" | undefined) ?? "";
    const yrKey = `${qid}_infection_year`;
    const yrVal = (responses[yrKey] ?? "") as string | number | "";

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
              setResponses((prev) => {
                const n = { ...prev, [qid]: next };
                if (next !== "infection") delete n[yrKey];
                return n;
              })
            }
            onYearChange={(y) => setResponses((prev) => ({ ...prev, [yrKey]: y }))}
          />
        </div>
      </div>
    );
  };

  const renderRadio = ({ qid, def, title, qno }: RenderCtx) => {
    const value = (responses[qid] as string) || "";
    const otherKey = `${qid}_other`;
    const otherValue = (responses[otherKey] ?? "") as string;

    const out =
      qid !== "hiv_test" ? (
        <Button variant="link" size="sm" className={LINK_MUTED} onClick={() => skipQuestion(qid)}>
          {C.SKIP_LABEL[lang]}
        </Button>
      ) : undefined;

    return (
      <div key={qid} className="mb-6">
        <QuestionHeader no={qno} title={title} right={out} />
        <RadioGroup
          className={ANSWER_INDENT}
          value={value}
          onValueChange={(val) =>
            setResponses((prev) => {
              const next = { ...prev, [qid]: val };
              if (val !== OTHER_CODE) delete next[otherKey];
              return next;
            })
          }
        >
          {optionsFor(def, lang).map((item, i) => (
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
              onChange={(e) => setResponses((p) => ({ ...p, [otherKey]: e.target.value }))}
            />
          </div>
        )}
      </div>
    );
  };

  const renderYesNo = ({ qid, title, qno }: RenderCtx) => {
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

  const renderText = ({ qid, title, def }: RenderCtx) => {
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

  const renderCountry = ({ qid, title, qno }: RenderCtx) => {
      const codeOrNull = (responses[qid] as string | null) ?? null;

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

  const renderCheckbox = ({ qid, def, title, qno }: RenderCtx) => {
    if (def.type !== "checkbox" || !def.options) return null;

    const selected: string[] = Array.isArray(responses[qid]) ? (responses[qid] as string[]) : [];
    const otherKey = `${qid}_other`;
    const otherValue = (responses[otherKey] ?? "") as string;

    const groups = def.options.reduce((acc, opt) => {
      const g = opt.group ?? "";
      (acc[g] ??= []).push(opt);
      return acc;
    }, {} as Record<string, C.Opt[]>);

    return (
      <div key={qid} className="mb-6">
        <QuestionHeader
          no={qno}
          title={title}
          right={
            // qid !== "testanforderungen" ? (
              <Button
                variant="link"
                size="sm"
                className={LINK_MUTED}
                onClick={() => skipQuestion(qid)}
              >
                {C.SKIP_LABEL[lang]}
              </Button>
            // ) : null
          }
        />

        <div className={ANSWER_INDENT}>
          {Object.entries(groups).map(([group, opts]) => {
            const hasOtherInThisGroup = opts.some((o) => o.code === OTHER_CODE);

            return (
              <div key={group} className="mb-6">
                {group && <p className="font-semibold text-sm text-blue-600 mb-1">{group}</p>}

                <div className={"flex flex-col space-y-2"}>
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
                          // disabled={selected.includes("counsel") && item.code !== "counsel"}
                          onCheckedChange={(c) => onCheckboxToggle(qid, item.code, c === true)}
                        />
                        <span>{item.labels[lang]}</span>
                      </label>
                    );
                  })}
                </div>

                {hasOtherInThisGroup && selected.includes(OTHER_CODE) && (
                  <div className="mt-2">
                    <Input
                      value={otherValue}
                      placeholder={def.placeholder?.[lang] ?? "Bitte angeben..."}
                      onChange={(e) => setResponses((p) => ({ ...p, [otherKey]: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const renderTestanforderungen = ({ qid, def, title, qno }: RenderCtx) => {
    if (def.type !== "checkbox" || !def.options) return null;

    const selected: string[] = Array.isArray(responses[qid])
      ? (responses[qid] as string[])
      : [];

    const otherKey = `${qid}_other`;
    const otherValue = (responses[otherKey] ?? "") as string;

    const groups = def.options.reduce((acc, opt) => {
      const g = opt.group ?? "";
      (acc[g] ??= []).push(opt);
      return acc;
    }, {} as Record<string, C.Opt[]>);

    return (
      <div key={qid} className="mb-6">
        <QuestionHeader no={qno} title={title} />

        <div className={ANSWER_INDENT}>
          {Object.entries(groups).map(([group, opts]) => {
            const hasOtherInThisGroup = opts.some(o => o.code === OTHER_CODE);

            return (
              <div key={group} className="mb-6">
                {group && (
                  <p className="font-semibold text-sm text-blue-600 mb-1">
                    {group}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-2">
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
                            selected.includes("counsel") &&
                            item.code !== "counsel"
                          }
                          onCheckedChange={(c) =>
                            onCheckboxToggle(qid, item.code, c === true)
                          }
                        />
                        <span>{item.labels[lang]}</span>
                      </label>
                    );
                  })}
                </div>

                {hasOtherInThisGroup && selected.includes(OTHER_CODE) && (
                  <div className="mt-2">
                    <Input
                      value={otherValue}
                      placeholder={
                        def.placeholder?.[lang] ?? "Bitte angeben..."
                      }
                      onChange={(e) =>
                        setResponses((p) => ({
                          ...p,
                          [otherKey]: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }


  const renderStiHistoryBlock = ({ qid, title, qno }: RenderCtx) => {
    return (
     
    <StiHistoryBlock
      lang={lang}
      qno={qno}
      title={title}
      stiOptions={C.STI_HISTORY}
      responses={responses}
      setResponses={setResponses}
      indentClass={ANSWER_INDENT}
      onSkip={() => {
        skipQuestion(qid); // or your own skip handler
        setResponses(prev => {
          const next = { ...prev };
          next["sti_history_yesno"] = "pnr"; // if you use skip marker
          next["sti_history_which"] = [];
          delete next["sti_history_which_other"];
          delete next["sti_history_years"];
          return next;
        });
      }}
      skipLabel={C.SKIP_LABEL[lang]}
    />
    )
  } 

  const renderBesucherInfo = ({ qid, title, qno }: RenderCtx) => {
    return(
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
        )
  }

  const renderHivTestPrev = ({ qid, title, qno }: RenderCtx) => {

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

  const renderFourModeRadio = ({ qid, title, qno }: RenderCtx) => (
    <div key={qid} className="mb-6">
      <QuestionHeader
        no={qno}
        title={title}
        right={
          <Button variant="link" size="sm" className={LINK_MUTED} onClick={() => skipQuestion(qid)}>
            {C.SKIP_LABEL[lang]}
          </Button>
        }
      />
      <div className={ANSWER_INDENT}>
        <YesNoSeparatedChips
          lang={lang}
          value={responses[qid] ?? ""}
          onChange={(next) => setResponses((p) => ({ ...p, [qid]: next }))}
          separator="space"
        />
      </div>
    </div>
  );


  const TYPE_RENDERERS: Partial<Record<QuestionType, Renderer>> = {
    vax4: renderVax4,
    radio: renderRadio,
    yesno: renderYesNo,
    text: renderText,
    textarea: renderText,
    checkbox: renderCheckbox,
    country: renderCountry,
  };

  const QID_RENDERERS: Record<string, Renderer> = {
  besucher_info: (ctx) => renderBesucherInfo(ctx),
  hiv_test_prev: (ctx) => renderHivTestPrev(ctx),
  sti_history_yesno: (ctx) => renderStiHistoryBlock(ctx),
  testanforderungen:  (ctx) => renderTestanforderungen(ctx),
};

  const FOUR_MODE_QIDS = new Set(["risk_gv", "risk_condom"]);

  const RULE_RENDERERS: Array<{ when: (ctx: RenderCtx) => boolean; render: Renderer }> = [
    {
      when: (ctx) => ctx.def.type === "radio" && FOUR_MODE_QIDS.has(ctx.qid),
      render: renderFourModeRadio,
    },
  ];





  function skipQuestion(qid: string) {
    // const def = R.Q[qid];
    const def = QUESTION_BY_QID[qid];
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
        const otherKey = `${qid}_other`;
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
          delete next[`${qid}_other`];
          return next;
        });
      }
    } else {
      toggleCheckboxGeneric(qid, code, checked);
    }
  }

 
  const renderQuestion = (qid: string) => {
    const def = QUESTION_BY_QID[qid];
    if (!def) return null;

    const ctx: RenderCtx = {
      qid,
      def,
      title: titleFor(qid, lang),
      qno: questionNo(qid),
    };

    let content: React.ReactNode = null;

    if (isSkipped(responses[qid])) {
      content = (
        <div className="border rounded-md p-3 bg-muted/30">
          <QuestionHeader
            no={ctx.qno}
            title={ctx.title}
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
          <p className="text-sm text-muted-foreground">
            {C.SKIP_LABEL[lang]}
          </p>
        </div>
      );
    } else {

      const qidRenderer = QID_RENDERERS[qid];
      if (qidRenderer) content = qidRenderer(ctx);
      else {
        for (const rule of RULE_RENDERERS) {
          if (rule.when(ctx)) {
            content = rule.render(ctx);
            break;
          }
        }
        if (!content) {
          const typeRenderer = TYPE_RENDERERS[def.type];
          if (typeRenderer) content = typeRenderer(ctx);
        }
      }
    }

    if (!content) return null;

    return (
      <div key={qid} className="mb-10">
        {content}
      </div>
    );
  };


  const [activeTab, setActiveTab] = useState<"general"|"hiv"|"sexpractices"|"other"|"summary"|"berater">("general");
  const [submitState, setSubmitState] = useState<{ status: "idle" | "submitting" | "success" | "error"; message?: string }>({ status: "idle" });
  
  const hivDisabled = responses["hiv_test"] === "no";

  

  
  const varsWithNo = getVarsWithQuestionNo(responses);
  // bankt.ts -> variable superset (can be multiple per question)
  // quenstions answered requires conditional set (e.g, iff other/andere -> free text field)
  // therefore, including relevance filter
  console.log("varsWithNo", varsWithNo)

  const unansweredDE_nb = varsWithNo
  .filter(({ var: v }) => isEmptyAnswer(responses[v]) && !isSkipped(responses[v]))
  .map(({ questionNo, var: v }) =>
    questionNo === 0 ? (
      <>
        <strong className="text-amber-700">{titleFor(v, "de")}</strong>
      </>
    ) : (
      <>
        F{questionNo}: {titleFor(v, "de")}?
      </>
    )
  );
  // .filter(({ var: v }) => isEmptyAnswer(responses[v]) && !isSkipped(responses[v]))
  // .map(({ questionNo, var: v }) =>
  // questionNo === 0
  //   ? `Beratereingabe: ${titleFor(v, "de")}?`
  //   : `F${questionNo}: ${titleFor(v, "de")}?`
  // );
  // .map(({ questionNo, var: v }) => `F${questionNo}: ${titleFor(v, "de")}?`);


 function buildPayload() {
    const data = buildPayloadData(responses);

    return {
      payload: {
        meta: {
          system_created_at: new Date().toISOString(),
          system_source: "tauri_fe",
          feVersion: CURR_VERSION,
          schemaVersion: SCHEMA_VERSION,
          lang,
        },
        data: {
          testanforderungen: responses["testanforderungen"], // keep explicit fields if you want
          beraterkennung: responses["beraterkennung"],
          beraterkommentar: responses["beraterkommentar"],
          plz3: responses["plz"],
          besucherkennung: responses["besucherkennung"],
          ...data,
        },
      },
    };
  }

  async function submitResponses() {

    // // validation: Besucher-ID and Beraterkennung required
    // if (!responses["besucherkennung"] || !responses["beraterkennung"]) {
    //   alert("Bitte Besucher-ID und Beraterkennung eingeben, bevor Du absendest.");
    //   return;
    // }

    // if (!responses['testanforderungen']){
    //    alert("Bitte Testanforderungen eingeben. Falls keine Labortests nötig sind, „Nur Beratung“ auswählen.");
    //   return;
    // }

    // // validate: if any radio == other → require text; if any checkbox contains other → require text
    // for (const qid of Object.keys(R)) {
    //   const def = R.Q[qid];
    //   if (!def) continue;

    //   // radio: value is string
    //   if (def.type === "radio" && responses[qid] === OTHER_CODE) {
    //     const txt = (responses[`${qid}__other`] ?? "").trim();
    //     if (!txt) {
    //       alert(`Bitte geben Sie eine Freitext-Antwort für "${qid}" an.`);
    //       return;
    //     }
    //   }

    //   // checkbox: value is string[]
    //   if (def.type === "checkbox" && Array.isArray(responses[qid]) && responses[qid].includes(OTHER_CODE)) {
    //     const txt = (responses[`${qid}__other`] ?? "").trim();
    //     if (!txt) {
    //       alert(`Bitte geben Sie eine Freitext-Antwort für "${qid}" an.`);
    //       return;
    //     }
    //   }
    // }

    setSubmitState({ status: "submitting" });

    const payload = buildPayload();
    console.log('pl', payload)

    try {
        let r: SubmitResult;

        if (backend === 'datenbank') {
          r = await submitPayload(new URL("/submissions", apiBase.endsWith("/") ? apiBase : apiBase + "/").toString(), payload, apiToken)
        } else{
        //json
          console.log('json backend selected, submitting to file')
          console.log('dataFolder', dataFolder)
          if (!dataFolder) return;
          
          
          r = await submitPayloadJSONToFile(dataFolder, payload.payload)
        }
      
      console.log('endpoint_resp', r)

      if (!r.ok){
        
        setSubmitState({
              status: "error",
              message: "Übertragung zum Backend Fehlgeschlagen!"
            });

        toast({
            title: "Übertragung zum Backend Fehlgeschlagen!",
            description: `Check Container Logs ("chp-fastapi") oder Tauri Console (${r.error})`,
            variant: "destructive",
          });

      } else {
        // RESET FOR NEXT VISITOR
        setResponses(prev => { 
                  
          const next = {
            beraterkennung: prev.beraterkennung ?? "",
            birth_country: "DE",
            risk_country: "DE",
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

        setSubmitState({ status: "idle" });
      }
  
    } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : typeof err === "string"
                ? err
                : JSON.stringify(err);

            console.error("Backend Error", err);

            setSubmitState({
              status: "error",
              message,
            });

            toast({
              // variant: "destructive",
              title: "Fehler beim Speichern!",
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

  const qidsIn = (section: Section) => qidsBySection(section, { includeNo0: true });


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

  // const ids_in_section = qidsIn(activeTab as Section)
  // console.log('ids_in_section', ids_in_section)

  // const answered_sec =  qidsIn(activeTab as Section).filter(isAnswered)
  // console.log('answered_sec', answered_sec) 

  const totalInSection = Math.max(1, qidsIn(activeTab as Section).length);
  const answeredInSection = qidsIn(activeTab as Section).filter(isAnswered).length;
  const percent = Math.round((answeredInSection / totalInSection) * 100);

  const section_after_allgemein = hivDisabled ? "sexpractices": "hiv";
  const section_after_allgemein_str = hivDisabled ? "Sex & Schutz": "HIV Risiko";

  //  const tabTriggerBase = "justify-start rounded-md px-3 py-2 text-sm " +
  //                       "data-[state=active]:bg-muted data-[state=active]:font-semibold " +
  //                       "data-[state=active]:border-l-4 data-[state=active]:border-primary";
  const tabTriggerBase =  "justify-start w-full rounded-md px-3 py-2 text-sm relative " +
                          "data-[state=active]:bg-muted data-[state=active]:font-semibold " +
                          "before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-transparent " +
                          "data-[state=active]:before:bg-primary";

  const missingBesucherId = !responses["besucherkennung"];
  const missingBeraterkennung = !responses["beraterkennung"];
  const missingTestanforderungen = responses["testanforderungen"] === undefined || (Array.isArray(responses["testanforderungen"]) && responses["testanforderungen"].length === 0)

  // console.log('missingBesucherId', missingBesucherId)
  // console.log('missingBeraterkennung', missingBeraterkennung)
  // console.log('missingTestanforderungen', missingTestanforderungen)
  // console.log('submitState', submitState)

  return (
    <>
        <BrandTheme /* dark={false} background */>
            <BrandPage>
                <BrandHeader
                  logoSrc="/logo-ah-91db5ab3.png"
                  right={
                    <div className="flex items-center gap-3">
                                  <span
                                    className="inline-flex items-center rounded-full px-2.5 py-0.5
                                    text-[11px] font-bold uppercase tracking-wide
                                    bg-red-500/30 text-red-900
                                    ring-1 ring-red-400/50
                                    shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                                  >
                                    TESTVERSION {meta.version}
                                  </span>
                    
                                
                               
                    <AppSettingsSheet
                      mode="collector"
                      onClearDraft= {() => {
                          setResponses(prev => { 
                          
                          const next = {
                              beraterkennung: prev.beraterkennung ?? "",
                              birth_country: "DE",
                              risk_country: "DE",
                          };

                          localStorage.removeItem(LOCAL_STORE_VAR);
                          localStorage.setItem(LOCAL_STORE_VAR, JSON.stringify(next));

                          return next

                        });

                        setBackup({});
                        setActiveTab("general");
                    
                        
                        }}
                        
                    />
                       </div>
                  }
                />
                {readOnly ? (
            
                  <div className="sticky top-0 z-50 -mx-6 mb-4 px-6 py-3 border-b bg-amber-50/90 backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-amber-900">
                          Nur Ansicht: bereits gespeicherter Fragebogen
                        </div>
                        <div className="text-xs text-amber-900/80">
                          {openedEntryMeta?.entryId ? `ID: ${openedEntryMeta.entryId} · ` : ""}
                          {openedEntryMeta?.createdAt ? `Erstellt: ${openedEntryMeta.createdAt}` : ""}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={onCloseReadOnly}>
                          Zurück zum Labor
                        </Button>
                        {/* <Button variant="outline" size="sm" onClick={onCloseReadOnly}>
                          Schließen
                        </Button> */}
                      </div>
                    </div>
                  </div>

                ) : (
               

                <div className="sticky top-0 z-40 -mx-6 mb-4 px-6 py-3
                  bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60
                  border-b">
                <div className="flex items-center gap-4">
                    <div className="min-w-[220px]">
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
{/* 
                    <span className="ml-auto inline-flex items-center rounded-full px-2.5 py-0.5
                    text-[11px] font-bold uppercase tracking-wide
                    bg-red-500/30 text-red-900
                    ring-1 ring-red-400/50
                    shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                    TEST V{CURR_VERSION}
                    </span> */}
                </div>
                </div>
         
                 )}

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
                    <div className={readOnly ? "pointer-events-none opacity-95" : ""}>   
                    {/* Right: content area */}
                      <div className="flex-1">
                        <TabsContent value="general">
                          {qidsBySection("general", { includeNo0: true }).map(renderQuestion)}
                        {/* {Object.entries(R.Q).filter(([_, v]) => v.section === "general").map(([qid]) => renderQuestion(qid))} */}
                        <div className="flex justify-end">
                            <Button onClick={() => { setActiveTab(section_after_allgemein); scrollTop(); }}>Weiter zu: {section_after_allgemein_str}</Button>
                        </div>
                        </TabsContent>

                        <TabsContent value="hiv">
                          {qidsBySection("hiv", { includeNo0: true }).map(renderQuestion)}
                        {/* {Object.entries(R.Q).filter(([_, v]) => v.section === "hiv").map(([qid]) => renderQuestion(qid))} */}
                        <div className="flex justify-end">
                            <Button onClick={() => { setActiveTab("sexpractices"); scrollTop(); }}>Weiter zu: Sex & Schutz</Button>
                        </div>
                        </TabsContent>

                        <TabsContent value="sexpractices">
                        {/* <h1 className="mb-8 text-l font-semibold">
                            Sofern ein Risiko darin bestand, kein Kondom benutzt zu haben, welche Risikosituation(en) hattest Du?
                        </h1>

                        <div className="mb-6 rounded-lg border bg-muted/30 px-4 py-3">
  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
    Hinweis
  </div>
  <p className="mt-1 text-sm leading-relaxed text-foreground">
    Sofern ein Risiko darin bestand, kein Kondom benutzt zu haben: Welche Risikosituation(en) hattest Du?
  </p> */}
{/* </div> */}
<div className="mb-6 rounded-lg border bg-muted/30 px-4 py-3">
      {/* {(
        <div className="text-sm font-semibold text-foreground">{"Sex & Schutz"}</div>
      )} */}
      <p className={"Sex & Schutz" + " mt-1" }>
        {"Sofern ein Risiko darin bestand, kein Kondom benutzt zu haben: Welche Risikosituation(en) hattest Du?"}
      </p>
    </div>

{/* <div className="mb-6">
  <div className="text-sm font-semibold text-foreground">
    Sex & Schutz
  </div>
  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
    Sofern ein Risiko darin bestand, kein Kondom benutzt zu haben: Welche Risikosituation(en) hattest Du?
  </p>
</div>

<div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-primary">ℹ️</div>
    <div>
      <div className="text-sm font-semibold text-foreground">
        Bitte nur ausfüllen, wenn relevant
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        Falls ein Risiko bestand (z.B. Sex ohne Kondom): Welche Risikosituation(en) hattest Du?
      </p>
    </div>
  </div>
</div> */}
                          {qidsBySection("sexpractices", { includeNo0: true }).map(renderQuestion)}
                        {/* {Object.entries(R.Q).filter(([_, v]) => v.section === "sexpractices").map(([qid]) => renderQuestion(qid))} */}
                        <div className="flex justify-end">
                            <Button onClick={() => { setActiveTab("other"); scrollTop(); }}>Weiter zu: Gesundheit &amp; Vorsorge</Button>
                        </div>
                        </TabsContent>

                        <TabsContent value="other">
                           {qidsBySection("other", { includeNo0: true }).map(renderQuestion)}
                        {/* {Object.entries(R.Q).filter(([_, v]) => v.section === "other").map(([qid]) => renderQuestion(qid))} */}
                        <div className="flex justify-end">
                            <Button onClick={() => { setActiveTab("berater"); scrollTop(); }}>Weiter zu: Beratereingaben</Button>
                        </div>
                        </TabsContent>

                        <TabsContent value="berater">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-stretch">
                            <div className="space-y-6 md:col-span-3">
                            <div
                            className="
                                h-full
                                rounded-xl bg-white
                                border border-slate-200
                                shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                                p-6">
                            {["testanforderungen"].map(renderQuestion)}
                            </div>
                            </div>
                            <div className="space-y-6 md:col-span-3">
                            <div
                                className="h-full">
                                {["besucher_info", "beraterkennung", "beraterkommentar"].map(renderQuestion)}
                                <TestNotes />
                            </div>
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
                            <h3 className="font-semibold mt-4 mb-2">Noch nicht erfasste Angaben:</h3>
                            <ul className="list-disc pl-5 text-sm">
                                {unansweredDE_nb.map((q) => (
                                <li key={q}>{q}</li>
                                ))}
                            </ul>
                            </>
                        ) : (
                            <p className="mt-4 text-sm text-muted-foreground">
                            Angaben vollständig erfasst. Bitte auf „Absenden“ klicken.
                            </p>
                        )}

                        <div className="mt-4 flex flex-col items-end space-y-2">
                            <Button
                            onClick={submitResponses}
                            disabled={
                                submitState.status === "submitting" ||
                                missingBesucherId ||
                                missingBeraterkennung  ||
                                missingTestanforderungen
                            }
                            >
                            {readOnly ? "Nur Ansicht" : submitState.status === "submitting" ? "Absenden…" : "Absenden"}
                            </Button>

                            {readOnly && (
                              <p className="text-sm text-amber-700 text-right">
                                Dieser Fragebogen wurde bereits gespeichert und kann hier nicht erneut abgesendet werden.
                              </p>
                            )}

                            {missingBesucherId && (
                            <p className="text-sm text-red-600 text-right">
                                Absenden ist nur möglich, wenn eine <strong>Besucher-ID</strong> eingetragen ist.
                            </p>
                            )}
                            {missingBeraterkennung && (
                            <p className="text-sm text-red-600 text-right">
                                Absenden ist nur möglich, wenn eine <strong>Beraterkennung</strong> eingetragen ist.
                            </p>
                            )}
                             {missingTestanforderungen && (
                            <p className="text-sm text-red-600 text-right">
                                Absenden ist nur möglich, wenn eine <strong>Testanforderung</strong> eingetragen ist - falls keine Labortests nötig sind, „Nur Beratung“ auswählen.
                            </p>
                            )}
                        </div>

                        {submitState.status === "success" && (
                            <p className="mt-2 text-sm text-green-700 text-right">{submitState.message} ✓</p>
                        )}
                        {submitState.status === "error" && (
                            <p className="mt-2 text-sm text-red-700 text-right">{submitState.message}</p>
                        )}
                        </TabsContent>
                      </div>
                    </div>
                </Tabs>

            </BrandPage>


            <Toaster />
        </BrandTheme>

    </>
  );
}

