
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Lang = "de" | "en" | "tr" | "uk";
type Opt = { code: string; labels: Record<Lang,string> };

function optionsFor(opts: Opt[], lang: Lang) {
  return opts.map(o => ({ value: o.code, label: o.labels[lang] ?? o.code }));
}

export default function EQuestionnaireFull() {
  const [lang, setLang] = useState<Lang>("de");
  const [responses, setResponses] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem("responses_draft");
    return saved ? JSON.parse(saved) : {};
  });
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    localStorage.setItem("responses_draft", JSON.stringify(responses));
  }, [responses]);

  const renderRadio = (name: string, opts: Opt[]) => {
    const o = optionsFor(opts, lang);
    return (
      <RadioGroup
        value={responses[name] || ""}
        onValueChange={(val) => setResponses(prev => ({ ...prev, [name]: val }))}
      >
        {o.map((item, i) => (
          <div className="flex items-center space-x-2" key={`${name}-${item.value}`}>
            <RadioGroupItem value={item.value} id={`${name}-${i}`} />
            <Label htmlFor={`${name}-${i}`}>{item.label}</Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const renderCheckboxes = (name: string, opts: Opt[]) => {
    const selected: string[] = responses[name] || [];
    const o = optionsFor(opts, lang);
    return (
      <div role="group" aria-labelledby={`${name}-legend`}>
        {o.map((item, i) => {
          const checked = selected.includes(item.value);
          return (
            <div className="flex items-center space-x-2" key={`${name}-${item.value}`}>
              <Checkbox
                id={`${name}-${i}`}
                checked={checked}
                onCheckedChange={(c) => {
                  setResponses(prev => {
                    const arr = new Set<string>(prev[name] || []);
                    if (c) arr.add(item.value); else arr.delete(item.value);
                    return { ...prev, [name]: Array.from(arr) };
                  });
                }}
              />
              <Label htmlFor={`${name}-${i}`}>{item.label}</Label>
            </div>
          );
        })}
      </div>
    );
  };





  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">E-Questionnaire (Full Draft)</h1>
        <div className="flex items-center space-x-2">
          {(["de","en","tr","uk"] as Lang[]).map(l => (
            <Button key={l} variant={l===lang?"default":"outline"} onClick={()=>setLang(l)}>{l.toUpperCase()}</Button>
          ))}
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hiv">HIV</TabsTrigger>
          <TabsTrigger value="other">Other STIs</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="general">

<h3 className="mt-6 mb-2 text-lg font-medium">age</h3>
<input className="w-full border rounded p-2" value={responses["age"]||""} onChange={e=>setResponses(p=>({ ...p, "age": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">orientation</h3>
<input className="w-full border rounded p-2" value={responses["orientation"]||""} onChange={e=>setResponses(p=>({ ...p, "orientation": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">gender</h3>
<input className="w-full border rounded p-2" value={responses["gender"]||""} onChange={e=>setResponses(p=>({ ...p, "gender": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">insurance</h3>
<input className="w-full border rounded p-2" value={responses["insurance"]||""} onChange={e=>setResponses(p=>({ ...p, "insurance": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">doctor</h3>
<input className="w-full border rounded p-2" value={responses["doctor"]||""} onChange={e=>setResponses(p=>({ ...p, "doctor": e.target.value }))} />
        </TabsContent>

        <TabsContent value="hiv">

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_risk_selfest</h3>
<input className="w-full border rounded p-2" value={responses["hiv_risk_selfest"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_risk_selfest": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices_1</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices_1"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices_1": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices_1_a</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices_1_a"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices_1_a": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices_1_b</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices_1_b"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices_1_b": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices_2</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices_2"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices_2": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices_3</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices_3"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices_3": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices_3a</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices_3a"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices_3a": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hiv_test_sexPractices_4</h3>
<input className="w-full border rounded p-2" value={responses["hiv_test_sexPractices_4"]||""} onChange={e=>setResponses(p=>({ ...p, "hiv_test_sexPractices_4": e.target.value }))} />
        </TabsContent>

        <TabsContent value="other">

<h3 className="mt-6 mb-2 text-lg font-medium">birthCountry</h3>
<input className="w-full border rounded p-2" value={responses["birthCountry"]||""} onChange={e=>setResponses(p=>({ ...p, "birthCountry": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">riskType</h3>
<input className="w-full border rounded p-2" value={responses["riskType"]||""} onChange={e=>setResponses(p=>({ ...p, "riskType": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">sexualRiskTime</h3>
<input className="w-full border rounded p-2" value={responses["sexualRiskTime"]||""} onChange={e=>setResponses(p=>({ ...p, "sexualRiskTime": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">riskCountry</h3>
<input className="w-full border rounded p-2" value={responses["riskCountry"]||""} onChange={e=>setResponses(p=>({ ...p, "riskCountry": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">riskType</h3>
<input className="w-full border rounded p-2" value={responses["riskType"]||""} onChange={e=>setResponses(p=>({ ...p, "riskType": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">condomless</h3>
<input className="w-full border rounded p-2" value={responses["condomless"]||""} onChange={e=>setResponses(p=>({ ...p, "condomless": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">testhistory</h3>
<input className="w-full border rounded p-2" value={responses["testhistory"]||""} onChange={e=>setResponses(p=>({ ...p, "testhistory": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">testhistory_1</h3>
<input className="w-full border rounded p-2" value={responses["testhistory_1"]||""} onChange={e=>setResponses(p=>({ ...p, "testhistory_1": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">stihistory</h3>
<input className="w-full border rounded p-2" value={responses["stihistory"]||""} onChange={e=>setResponses(p=>({ ...p, "stihistory": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">druguse_gen</h3>
<input className="w-full border rounded p-2" value={responses["druguse_gen"]||""} onChange={e=>setResponses(p=>({ ...p, "druguse_gen": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">druguse_risk6m</h3>
<input className="w-full border rounded p-2" value={responses["druguse_risk6m"]||""} onChange={e=>setResponses(p=>({ ...p, "druguse_risk6m": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">vacc_hav</h3>
<input className="w-full border rounded p-2" value={responses["vacc_hav"]||""} onChange={e=>setResponses(p=>({ ...p, "vacc_hav": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">vacc_hbv</h3>
<input className="w-full border rounded p-2" value={responses["vacc_hbv"]||""} onChange={e=>setResponses(p=>({ ...p, "vacc_hbv": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">vaccAB_sero</h3>
<input className="w-full border rounded p-2" value={responses["vaccAB_sero"]||""} onChange={e=>setResponses(p=>({ ...p, "vaccAB_sero": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">vacc_hcv</h3>
<input className="w-full border rounded p-2" value={responses["vacc_hcv"]||""} onChange={e=>setResponses(p=>({ ...p, "vacc_hcv": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_therapy</h3>
<input className="w-full border rounded p-2" value={responses["hcv_therapy"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_therapy": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_therapy_1a</h3>
<input className="w-full border rounded p-2" value={responses["hcv_therapy_1a"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_therapy_1a": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_therapy_1b</h3>
<input className="w-full border rounded p-2" value={responses["hcv_therapy_1b"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_therapy_1b": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_therapy_1c</h3>
<input className="w-full border rounded p-2" value={responses["hcv_therapy_1c"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_therapy_1c": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_therapy_1d</h3>
<input className="w-full border rounded p-2" value={responses["hcv_therapy_1d"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_therapy_1d": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_therapy_1e</h3>
<input className="w-full border rounded p-2" value={responses["hcv_therapy_1e"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_therapy_1e": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_therapy_1f</h3>
<input className="w-full border rounded p-2" value={responses["hcv_therapy_1f"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_therapy_1f": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">hcv_test</h3>
<input className="w-full border rounded p-2" value={responses["hcv_test"]||""} onChange={e=>setResponses(p=>({ ...p, "hcv_test": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">beraterkasten</h3>
<input className="w-full border rounded p-2" value={responses["beraterkasten"]||""} onChange={e=>setResponses(p=>({ ...p, "beraterkasten": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">noAnswer</h3>
<input className="w-full border rounded p-2" value={responses["noAnswer"]||""} onChange={e=>setResponses(p=>({ ...p, "noAnswer": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">chemsex</h3>
<input className="w-full border rounded p-2" value={responses["chemsex"]||""} onChange={e=>setResponses(p=>({ ...p, "chemsex": e.target.value }))} />

<h3 className="mt-6 mb-2 text-lg font-medium">drugsUsed</h3>
<input className="w-full border rounded p-2" value={responses["drugsUsed"]||""} onChange={e=>setResponses(p=>({ ...p, "drugsUsed": e.target.value }))} />
        </TabsContent>

        <TabsContent value="summary">
          <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(responses, null, 2)}</pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
