
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "./ui/progress";

const contributors = [
  { name: "Alice Johnson", initials: "AJ", image: "https://picsum.photos/seed/101/40/40", contribution: "Debris clean-up", role: "Volunteer", amount: 5000 },
  { name: "Bob Williams", initials: "BW", image: "https://picsum.photos/seed/102/40/40", contribution: "Reported blockage", role: "Resident", amount: 1000 },
  { name: "Charlie Brown", initials: "CB", image: "https://picsum.photos/seed/103/40/40", contribution: "Financial donation", role: "Sponsor", amount: 25000 },
  { name: "Diana Miller", initials: "DM", image: "https://picsum.photos/seed/104/40/40", contribution: "Organized event", role: "Coordinator", amount: 10000 },
];

const targetAmount = 50000;
const totalContributions = contributors.reduce((acc, c) => acc + c.amount, 0);
const progress = (totalContributions / targetAmount) * 100;

const formatCurrency = (amount: number) => {
  return `K ${new Intl.NumberFormat("en-US").format(amount)}`;
};

export default function CommunityView() {
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
            {contributors.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
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
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
