"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";

type ProgressItem = { title: string; value: number; target: string };

export default function ProgressView() {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('project_progress')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) {
        setProgressItems(data);
      }
      if (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [supabase]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
        <CardDescription>Overall completion status of key tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {progressItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No progress data available.</p>
        ) : (
          progressItems.map((item) => (
            <div key={item.title} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-sm">{item.title}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
              <Progress value={item.value} aria-label={`${item.title} progress`} />
              <p className="text-xs text-muted-foreground text-right">Target: {item.target}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
