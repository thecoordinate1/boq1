
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "./ui/progress";
import { communityTarget } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

type Contributor = {
  id: string;
  name: string;
  initials: string;
  amount: number;
  role: string;
  contribution: string;
  image: string;
};

export default function CommunityView() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const targetAmount = communityTarget;
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('community_contributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setContributors(data);
        const total = data.reduce((acc, c) => acc + c.amount, 0);
        setTotalContributions(total);
      }
    };
    fetchData();
  }, []);

  const progress = (totalContributions / targetAmount) * 100;

  const formatCurrency = (amount: number) => {
    return `K ${new Intl.NumberFormat("en-US").format(amount)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Fundraising</CardTitle>
        <CardDescription>Support the project through financial contributions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span>{formatCurrency(totalContributions)}</span>
              <span className="text-muted-foreground">Target: {formatCurrency(targetAmount)}</span>
            </div>
            <Progress value={progress} aria-label="Fundraising progress" />
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="font-semibold">Top Contributors</h4>
            {contributors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contributions yet. Be the first!</p>
            ) : (
              contributors.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={c.image} alt={c.name} />
                      <AvatarFallback>{c.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.contribution}</p>
                    </div>
                  </div>
                  <Badge variant={c.role === 'Sponsor' ? 'default' : 'secondary'}>{formatCurrency(c.amount)}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
