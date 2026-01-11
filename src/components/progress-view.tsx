
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { progressData } from "@/lib/data";

export default function ProgressView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>Overall completion status of key tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {progressData.map((item) => (
          <div key={item.title} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-sm">{item.title}</span>
              <span className="text-sm text-muted-foreground">{item.value}%</span>
            </div>
            <Progress value={item.value} aria-label={`${item.title} progress`} />
            <p className="text-xs text-muted-foreground text-right">Target: {item.target}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
