
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mapPoints } from "@/lib/data";

export default function ImageGallery() {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
        <CardTitle className="text-xl md:text-2xl">Project Images</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Photos from the drainage clearing project sites.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 md:p-6 md:pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
          {mapPoints.map((point) => (
            <div key={point.id} className="space-y-2">
              <Image
                src={point.image.url}
                alt={point.title}
                width={400}
                height={300}
                className="rounded-lg object-cover w-full aspect-[4/3]"
                data-ai-hint={point.image.hint}
              />
               <div className="px-1">
                  <h3 className="font-semibold text-sm">{point.title}</h3>
                  <p className="text-xs text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
