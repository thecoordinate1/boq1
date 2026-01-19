"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type ProjectImage = {
  id: string;
  title: string;
  description: string;
  image_url: string;
};

export default function ImageGallery() {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchImages = async () => {
      const { data } = await supabase
        .from('project_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setImages(data);
    };
    fetchImages();
  }, []);

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
          {images.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center">No images uploaded yet.</p>
          ) : (
            images.map((point) => (
              <div key={point.id} className="space-y-2">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={point.image_url}
                    alt={point.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="px-1">
                  <h3 className="font-semibold text-sm">{point.title}</h3>
                  <p className="text-xs text-muted-foreground">{point.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
