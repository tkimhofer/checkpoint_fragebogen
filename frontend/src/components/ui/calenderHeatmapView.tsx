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

}
