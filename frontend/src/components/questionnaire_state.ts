import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import type { Lang } from "@/i18n/translations";

type Responses = Record<string, unknown>;


export function useQuestionnaireState(storageKey: string) {
  const { toast } = useToast();

  const [lang, setLang] = useState<Lang>("de");

  const [responses, setResponses] = useState<Responses>(() => {
    const saved = localStorage.getItem(storageKey);
    try {
      return saved ? (JSON.parse(saved) as Responses) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    setResponses(prev => {
      let next = prev;

      if (prev.birthCountry === undefined) {
        next = { ...next, birthCountry: "DE" };
      }

      // if (prev.riskCountry === undefined) {
      //   next = { ...next, riskCountry: "DE" }; // or another default if needed
      // }

      return next;
    });
  }, []);


  const [backup, setBackup] = useState<Responses>({});

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(responses));
  }, [responses, storageKey]);

  return { toast, lang, setLang, responses, setResponses, backup, setBackup };
}