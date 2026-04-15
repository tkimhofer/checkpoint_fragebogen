import { writeTextFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";
import { join } from "@tauri-apps/api/path";

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
  apiToken: string,
  timeoutMs = 15_000
): Promise<SubmitResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const API_TOKEN = apiToken.trim();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (API_TOKEN) {
    // const t = API_TOKEN.trim();
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  }


  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
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


export async function submitPayloadJSONToFile(STORE_PATH: string, payload: SubmissionPayload): Promise<SubmitResult> {
//   try {
    // const visitorId =
    //   typeof payload.data.visitor_id === "string"
    //     ? payload.data.visitor_id
    //     : "unknown";
    // console.log("payl:", payload);   
    const fileName = `chp_fragebogen_${tsLocalForFilename()}_${payload.data.besucherkennung}.json`;
    // const dir = await appDataDir();
    const filePath = await join(STORE_PATH, fileName);
    // console.log("Saving payload to:", filePath);

    await writeTextFile(filePath, JSON.stringify(payload, null, 2));

    return { ok: true, data: { filePath } };
//   } catch (err) {
//     const message = err instanceof Error ? err.message : "Unknown error";
//     console.error("Error writing file:", message);
//     return { ok: false, error: `Fehler beim Schreiben der Datei: ${message}` };
//   }
}
