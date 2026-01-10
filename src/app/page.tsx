
"use client";

import BoqTable from "@/components/boq-table";
import { Icons } from "@/components/icons";
import ImageGallery from "@/components/image-gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Icons.Logo className="h-6 w-6 text-primary" />
          <span className="text-lg md:text-xl">BOQ Tracker</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-2 md:gap-8 md:p-8">
        {isMobile ? (
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">BOQ Table</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-4">
               <BoqTable />
            </TabsContent>
            <TabsContent value="images" className="mt-4">
              <div className="h-[calc(100vh-200px)]">
                <ImageGallery />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid flex-1 gap-4 md:gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <BoqTable />
            </div>
            <div className="lg:col-span-2">
              <ImageGallery />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
