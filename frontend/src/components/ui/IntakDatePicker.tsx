import React, { useState, useEffect, useRef } from "react"
import { DatePickerInput } from "@mantine/dates"
// import { DatePicker } from "@mantine/dates"
// import { Indicator, Box } from "@mantine/core"
import { buildApiUrl } from "@/lib/api/config"
import dayjs from "dayjs"
import { fetch } from "@tauri-apps/plugin-http";


// type IntakeDay = {
//   date: string
//   count: number
// }


export default function IntakeDatePicker({
  value1,
  apiOrigin,
  apiToken,
  onSelectDate,
}: {
  value1: string | null;
  apiOrigin: string
  apiToken: string
  onSelectDate: (isoDate: string | null) => void;
}) {

  // console.log("IntakeDatePicker render")
  // console.log("token:", apiToken)
  // const [internal, setInternal] = useState<Date | null>(null);

  const [value, setValue] = useState<Date | null>(null) 
  const [intakeDays, setIntakeDays] = useState<string[]>([]) // what is returned from api (nb of intakes per day)
  // const [month, setMonth] = useState<Date>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date()); //useState(new Date())

  // add items state if you want list here
  const [items, setItems] = useState<any[]>([]);
  const lastIsoRef = useRef<string | null>(null);

  // sync external value → Date
  useEffect(() => {
    if (!value1) {
      setValue(null);
      return;
    }

    const d = dayjs(value1).toDate();
    setValue(d);
    setCalendarMonth(d);
  }, [value1]);


  useEffect(() => {
    if (!apiToken) return;
    if (!value) return;

    const iso = dayjs(value).format("YYYY-MM-DD");

    if (lastIsoRef.current === iso) return;
    lastIsoRef.current = iso;

    const url = buildApiUrl(apiOrigin, `/inbox/entries?day=${encodeURIComponent(iso)}`);
    const headers: Record<string, string> = {Accept: "application/json"};
    const token = apiToken.trim();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    // console.log("url-endpoint", url);

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(json));
        // console.log("ce status:", res.status);
        // console.log("ce payload:", json);
        return json;
      })
      .then((list) => setItems(list))
      .catch((err) => console.error(err));

  }, [value, apiOrigin, apiToken]);


  useEffect(() => {
    //// this is catching month-wise number of questionnaire entries for the indicator dots in the calendar
    // console.log("Fetching for:", calendarMonth, apiOrigin)

    const y = calendarMonth.getFullYear()
    const m = calendarMonth.getMonth() + 1
    if (!apiToken) return;
    if (!y || !m) return;
    // console.log("year amd month", y, m)

    const url = buildApiUrl(apiOrigin, `/intake/by-day?year=${y}&month=${m}`)
    const headers: Record<string, string> = {Accept: "application/json"};
    const token = apiToken.trim();
    if (token) headers["Authorization"] = `Bearer ${token}`;
    // console.log("url-endpoint", url);

    fetch(url, { method: "GET", headers: headers})
      .then(
        async res => {
          const json = await res.json();
          // console.log("ce status:", res.status);
          // console.log("ce payload:", json);
            return json;}
      )
      .then(data => {
        setIntakeDays(data.map((d: any) => d.date))
      })
      .catch(err => console.error(err))
  }, [calendarMonth, apiOrigin, apiToken])

  return (
    <DatePickerInput
      value={value}
      onChange={(d) => {
        setValue(d);
        onSelectDate(d ? dayjs(d).format("YYYY-MM-DD") : null);
      }}
      locale="de"
      valueFormat="DD.MM.YYYY"
      placeholder="Datum wählen"
      maw={220}
      date={calendarMonth}
      onDateChange={(d) => {
        const next = d instanceof Date ? d : new Date(d);
        setCalendarMonth(next);
      }}
      getDayProps={(date) => {
        const iso = dayjs(date).format("YYYY-MM-DD");
        const hasData = intakeDays.includes(iso);

        return hasData
        ? {
          style: {
            // backgroundColor: "#EEF4F4", //"transparent",
            // color: "#24343A",
            boxShadow: "0 0 0 3px #A8D6D8 inset",
            borderRadius: "6px",
            fontWeight: 700,
          }}
        : {};
      }}
    />
  )
}
