import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export default function Questionnaire() {
  const [question3Answer, setQuestion3Answer] = useState<string>("")
  const [question3Text, setQuestion3Text] = useState("")

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      {/* Q1: Single choice */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Label className="text-lg font-semibold">
            1. What is your favorite color?
          </Label>
          <RadioGroup
            onValueChange={(val) => console.log("Q1 answer:", val)}
            defaultValue="red"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="red" id="color-red" />
              <Label htmlFor="color-red">Red</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blue" id="color-blue" />
              <Label htmlFor="color-blue">Blue</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="green" id="color-green" />
              <Label htmlFor="color-green">Green</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Q2: Multiple choice */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Label className="text-lg font-semibold">
            2. Which hobbies do you enjoy? (Select all that apply)
          </Label>
          <div className="flex flex-col space-y-2">
            {["Reading", "Traveling", "Gaming", "Cooking"].map((hobby) => (
              <div key={hobby} className="flex items-center space-x-2">
                <Checkbox id={hobby} />
                <Label htmlFor={hobby}>{hobby}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Q3: Conditional input */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Label className="text-lg font-semibold">
            3. Have you ever worked remotely?
          </Label>
          <RadioGroup
            onValueChange={(val) => setQuestion3Answer(val)}
            defaultValue="no"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-remote" />
              <Label htmlFor="yes-remote">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-remote" />
              <Label htmlFor="no-remote">No</Label>
            </div>
          </RadioGroup>

          {question3Answer === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="experience">Describe your experience:</Label>
              <Input
                id="experience"
                placeholder="e.g. 3 years freelance, mostly async..."
                value={question3Text}
                onChange={(e) => setQuestion3Text(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
