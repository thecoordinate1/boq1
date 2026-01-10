
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GOOGLE_MAPS_API_KEY } from "@/lib/maps-api";
import { mapPoints } from "@/lib/data";

export default function MapView() {
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const selectedPoint = mapPoints.find((p) => p.id === selectedPointId);
  const mapCenter = { lat: 51.515, lng: -0.09 }; // Center of London

  return (
    <Card className="h-full">
      <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
        <CardTitle className="text-xl md:text-2xl">Project Map</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Drainage clearing locations and points of interest.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0 h-[calc(100%-80px)]">
        <div className="h-full rounded-lg overflow-hidden">
          {GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? (
             <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-center p-4">
                <p className="font-semibold text-lg">Map Unavailable</p>
                <p className="text-muted-foreground text-sm">Please provide a Google Maps API key in <code className="bg-secondary px-1 py-0.5 rounded">src/lib/maps-api.ts</code> to display the map.</p>
             </div>
          ) : (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={mapCenter}
              defaultZoom={13}
              mapId="boq-tracker-map"
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            >
              {mapPoints.map((point) => (
                <AdvancedMarker
                  key={point.id}
                  position={point.position}
                  onClick={() => setSelectedPointId(point.id)}
                >
                  <Pin
                    background={"hsl(var(--primary))"}
                    borderColor={"hsl(var(--primary))"}
                    glyphColor={"hsl(var(--primary-foreground))"}
                  />
                </AdvancedMarker>
              ))}

              {selectedPoint && (
                <InfoWindow
                  position={selectedPoint.position}
                  onCloseClick={() => setSelectedPointId(null)}
                  pixelOffset={[0,-40]}
                >
                  <div className="p-1 max-w-xs">
                    <h3 className="font-semibold mb-1 text-base">{selectedPoint.title}</h3>
                    <Image
                      src={selectedPoint.image.url}
                      alt={selectedPoint.title}
                      width={200}
                      height={150}
                      className="rounded-md object-cover mb-2 w-full"
                      data-ai-hint={selectedPoint.image.hint}
                    />
                    <p className="text-xs text-muted-foreground">{selectedPoint.description}</p>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
