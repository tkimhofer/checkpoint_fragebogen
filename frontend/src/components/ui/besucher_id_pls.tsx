import * as React from "react";
import { Input } from "@/components/ui/input";


type TwoInputRowProps = {
  title: string;
  leftValue: string;
  rightValue: string;
  leftPlaceholder?: string;
  rightPlaceholder?: string;
  onLeftChange: (v: string) => void;
  onRightChange: (v: string) => void;
};

export function TwoInputRow({
  title='besucher info',
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
}: TwoInputRowProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-1 text-lg font-medium">{title}</h3>

      <div className="grid grid-cols-4 gap-4">
        <Input
          className="col-span-2"
          value={leftValue}
          placeholder={"ID (zB. XY0199)"}
          onChange={(e) => onLeftChange(e.target.value)}
        />

        <Input
          className="col-span-2"
          value={rightValue}
          placeholder={"PLZ (zB. 470xx)"}
          maxLength={3}
          onChange={(e) => onRightChange(e.target.value)}
        />
      </div>
    </div>
  );
}
