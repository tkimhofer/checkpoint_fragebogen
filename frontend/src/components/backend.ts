import { writeTextFile } from "@tauri-apps/plugin-fs";
import { appDataDir, join } from "@tauri-apps/api/path";

export type SubmissionPayload = {
  meta: {
    system_created_at: string;
    system_source: string;
  };
  data: Record<string, unknown>; // dynamic questionnaire content
};

export type SubmitResult =
  | { ok: true; status?: number; data: unknown }
  | { ok: false; status?: number; error: string };

export async function submitPayload(
  endpoint: string,
  payload: unknown,
  timeoutMs = 15_000
): Promise<SubmitResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const API_TOKEN = 'token-change-me';

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Token": API_TOKEN,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type");
    const data =
      contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error:
          typeof data === "string"
            ? data
            : JSON.stringify(data),
      };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "Request timed out" };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function tsLocalForFilename(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  // safer: HH-MM instead of HH:MM
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`;
}

// function isObject(x: unknown): x is Record<string, any> {
//   return typeof x === "object" && x !== null;
// }

export async function submitPayloadJSONToFile(STORE_PATH: string, payload: SubmissionPayload): Promise<SubmitResult> {
//   try {


    // const visitorId =
    //   typeof payload.data.visitor_id === "string"
    //     ? payload.data.visitor_id
    //     : "unknown";
    console.log("payl:", payload);   
    const fileName = `chp_fragebogen_${tsLocalForFilename()}_${payload.data.visitor_id}.json`;
    // const dir = await appDataDir();
    const filePath = await join(STORE_PATH, fileName);
    console.log("Saving payload to:", filePath);

    await writeTextFile(filePath, JSON.stringify(payload, null, 2));

    return { ok: true, data: { filePath } };
//   } catch (err) {
//     const message = err instanceof Error ? err.message : "Unknown error";
//     console.error("Error writing file:", message);
//     return { ok: false, error: `Fehler beim Schreiben der Datei: ${message}` };
//   }
}

// export async function submitPayloadJSON(payload: any) {

//     function ts_local_filename(date = new Date()): string {
//         const pad = (n: number) => String(n).padStart(2, "0");
//         return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`;
//     }

//     try {

//         const fileName = `chp_fragebogen_${ts_local_filename()}_${payload["data"]["visitor_id"]}.json`;
//         await writeTextFile(
//             `/Users/tk/js/chp_ahd/${fileName}`,
//             JSON.stringify(payload, null, 2)
//         );
//     } catch (err) {
//         const message = err instanceof Error ? err.message : "Unknown error";
//         console.error("Error writing file:", message);
//         return {
//            ok: false,
//            error: `Fehler beim Schreiben der Datei: ${message}`,
//          };
//     }
// }

/// CSV SUBMISSION
// // const filePath = "Z:\\Projekt(e), Arbeitsbereich(e)\\Check-up Duisburg Kreis Wesel\\fuertorben\\chekpoint_daten.csv";
      // // const filePath = "/Users/tk/js/chp_ahd/test.csv"

      // const header = [
      //   "timestamp",
      //   "visitorId",
      //   ...QUESTION_ORDER_OUT.flatMap(qid => {
      //     const def = R.Q[qid];
      //     if (def?.type === "checkbox" && def.options) {
      //       const cols = def.options.map(opt => `${qid}_${opt.code}`);
      //       // add one text column if "other" exists among options
      //       const hasOther = def.options.some(o => o.code === OTHER_CODE);
      //       return hasOther ? [...cols, `${qid}_other_text`] : cols;
      //     }
      //     // radio/text/textarea -> single column
      //     return [qid];
      //   })
      // ].join(",");

      // const flatRow: string[] = [];
      // flatRow.push(payload.meta.timestamp);
      // flatRow.push(payload.meta.visitorId ?? "");

      // for (const qid of QUESTION_ORDER_OUT) {
      //   const def = R.Q[qid];
      //   const val = responses[qid];

      //   if (def?.type === "checkbox" && def.options) {
      //     // 1) booleans for each option (fixed order)
      //     for (const opt of def.options) {
      //       flatRow.push(Array.isArray(val) && val.includes(opt.code) ? "true" : "false");
      //     }
      //     // 2) append the *_other_text column if schema has "other"
      //     const hasOther = def.options.some(o => o.code === OTHER_CODE);
      //     if (hasOther) {
      //       const txt = Array.isArray(val) && val.includes(OTHER_CODE)
      //         ? String(responses[`${qid}__other`] ?? "")
      //         : "";
      //       flatRow.push(txt ? `"${txt.replace(/"/g, '""')}"` : "");
      //     }
      //   } else if (def?.type === "radio") {
      //     // if "other" selected, write the free text into the single qid column
      //     if (val === OTHER_CODE) {
      //       const txt = String(responses[`${qid}__other`] ?? "");
      //       flatRow.push(txt ? `"${txt.replace(/"/g, '""')}"` : "");
      //     } else {
      //       flatRow.push(val ? `"${String(val).replace(/"/g, '""')}"` : "");
      //     }
      //   } else {
      //     // text / textarea / any scalar (including country)
      //     // map the skip sentinel "pnr" to empty on export:
      //     const out = val === "pnr" ? "" : String(val ?? "");
      //     flatRow.push(out ? `"${out.replace(/"/g, '""')}"` : "");
      //     // flatRow.push(val ? `"${String(val).replace(/"/g, '""')}"` : "");
      //   }
      // }

      // const row = flatRow.join(",");

      // // One single call to Rust
      // await invoke("append_csv", {
      //   path: STORE_PATH,
      //   row,
      //   header, // plain string
      // });

      // setSubmitState({ status: "success" });
      // setSubmitState({
      //   status: "success",
      //   message: `Besucher-IDdddd: ${responses["besucherkennung"] || "-"}\nBerater-ID: ${responses["beraterkennung"] || "-"}`
      // });
