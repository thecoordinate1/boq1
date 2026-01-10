import BoqTable from "@/components/boq-table";
import { Icons } from "@/components/icons";
import MapView from "@/components/map-view";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Icons.Logo className="h-6 w-6 text-primary" />
          <span className="text-xl">BOQ Tracker</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BoqTable />
          </div>
          <div className="lg:col-span-2">
            <MapView />
          </div>
        </div>
      </main>
    </div>
  );
}
