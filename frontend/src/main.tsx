import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"

// import dayjs from "dayjs"
import "dayjs/locale/de"
// dayjs.locale("de")

ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>

    <MantineProvider
       theme={{
    primaryColor: "butah",

    colors: {
      butah: [
        "#E6F4F6",
        "#CCE9EC",
        "#B3DEE2",
        "#99D3D8",
        "#80C8CE",
        "#5FAFB6", // ← main brand tone
        "#4C8C92",
        "#39696E",
        "#26464A",
        "#132326"
      ]
    }
  }}>

       <DatesProvider
      settings={{
        locale: "de",
        firstDayOfWeek: 1
      }}
    >

      <App />
      </DatesProvider>

    </MantineProvider>

  </React.StrictMode>

)

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );