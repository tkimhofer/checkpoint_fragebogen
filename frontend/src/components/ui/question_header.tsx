import * as React from "react"
export function QuestionHeader({
  no,
  title,
  right,
}: {
  no: number,
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-medium">{no !== 0 && `${no}. `}{title}</h3>
      {right}
    </div>
  );
}