
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const contributors = [
  { name: "Alice Johnson", initials: "AJ", image: "https://picsum.photos/seed/101/40/40", contribution: "Debris clean-up", role: "Volunteer" },
  { name: "Bob Williams", initials: "BW", image: "https://picsum.photos/seed/102/40/40", contribution: "Reported blockage", role: "Resident" },
  { name: "Charlie Brown", initials: "CB", image: "https://picsum.photos/seed/103/40/40", contribution: "Financial donation", role: "Sponsor" },
  { name: "Diana Miller", initials: "DM", image: "https://picsum.photos/seed/104/40/40", contribution: "Organized event", role: "Coordinator" },
];

export default function CommunityView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Contributions</CardTitle>
        <CardDescription>Acknowledgements for community support.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
              <Badge variant={c.role === 'Sponsor' ? 'default' : 'secondary'}>{c.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
