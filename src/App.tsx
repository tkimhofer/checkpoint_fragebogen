import React from "react"
// import Questionnaire from "@/components/Questionnaire"
import Questionnaire from "@/components/q_ahd_wired"


export default function App() {
  // return <div>Basic render test ✅</div>;
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <Questionnaire />
    </main>
  );
}