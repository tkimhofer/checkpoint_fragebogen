import React from "react";
import { useState } from "react"
// import CalendarHeatmap from "react-calendar-heatmap"

import "react-calendar-heatmap/dist/styles.css"

export default function CalendarHeatmapView() {

  const dummy = [
    { date: "24 Feb", count: 5 },
    { date: "25 Feb", count: 2 },
    { date: "26 Feb", count: 11 },
    { date: "27 Feb", count: 0 },
    { date: "28 Feb", count: 3 }
  ]

  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ width: "300px" }}>
      {dummy.map(d => {

        const level =
          d.count === 0 ? "#e5e7eb" :
          d.count < 3  ? "#34d399" :
          d.count < 8  ? "#fbbf24" :
                         "#ef4444"

        return (
          <div
            key={d.date}
            onClick={() => setSelected(d.date)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 12px",
              marginBottom: "6px",
              borderRadius: "8px",
              cursor: "pointer",
              background:
                selected === d.date ? "#f1f5f9" : "transparent"
            }}
          >

            <span>{d.date}</span>

            <div style={{ display: "flex", gap: "2px" }}>
              {Array.from({ length: Math.min(d.count,10) }).map((_,i)=>(
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    background: level,
                    borderRadius: "50%"
                  }}
                />
              ))}
            </div>

          </div>
        )
      })}
    </div>
  )
//   const buildCalendar = () => {

//     const days = 90
//     const today = new Date()
//     const arr: {date: string, count: number}[] = []

//     for (let i = 0; i < days; i++) {

//       const d = new Date()
//       d.setDate(today.getDate() - i)

//       arr.push({
//         date: d.toISOString().slice(0,10),
//         count: 0
//       })
//     }

//     // ---- DUMMY INTAKE DATA ----
//     const dummy: Record<string, number> = {
//       "2026-02-20": 2,
//       "2026-02-21": 5,
//       "2026-02-22": 9,
//       "2026-02-23": 1,
//       "2026-02-24": 7,
//       "2026-02-25": 12
//     }

//     return arr.map(day => ({
//       ...day,
//       count: dummy[day.date] ?? 0
//     }))
//   }

//   const [values] = useState(buildCalendar())

//   return (
//     <div style={{
//         padding: "10px",
//         maxWidth: "420px"
//         }}>

//       <CalendarHeatmap
//         startDate={new Date(new Date().setDate(new Date().getDate() - 90))}
//         endDate={new Date()}
//         values={values}

//         classForValue={(v:any) => {
//           if (!v || v.count === 0) return 'color-empty'
//           if (v.count < 3) return 'color-low'
//           if (v.count < 10) return 'color-med'
//           return 'color-high'
//         }}

//         onClick={(v:any) => {
//           if (v?.date) {
//             console.log("Selected Intake Day:", v.date)
//           }
//         }}

//       />

//     </div>
//   )
}

// export default function CalendarHeatmapView() {

//   const emptyCalendar = () => {

//     const days = 90
//     const today = new Date()
//     const arr = []

//     for (let i = 0; i < days; i++) {

//       const d = new Date()
//       d.setDate(today.getDate() - i)

//       arr.push({
//         date: d.toISOString().slice(0,10),
//         count: 0
//       })
//     }

//     return arr
//   }

//   const [values] = useState(emptyCalendar())

//   return (
//     <div style={{ padding: "20px" }}>
//       <CalendarHeatmap
//         startDate={new Date(new Date().setDate(new Date().getDate() - 90))}
//         endDate={new Date()}
//         values={values}
//         classForValue={(v:any) => {
//           if (!v) return 'color-empty'
//           if (v.count < 3) return 'color-low'
//           if (v.count < 10) return 'color-med'
//           return 'color-high'
//         }}
//       />
//     </div>
//   )
// }