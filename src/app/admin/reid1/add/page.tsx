
"use client";

import BoqTable from "@/components/boq-table";
import { Icons } from "@/components/icons";
import AdminCommunity from "@/components/admin/admin-community";
import AdminImages from "@/components/admin/admin-images";
import AdminProgress from "@/components/admin/admin-progress";

export default function AdminBoqPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Icons.Logo className="h-6 w-6 text-primary" />
           <div className="flex flex-col">
            <span className="text-lg font-semibold md:text-xl">BOQ Admin</span>
            <span className="text-xs text-muted-foreground">
              powered by Bluetick
            </span>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-2 md:gap-8 md:p-8">
        <BoqTable isEditable={true} />
        <AdminImages />
        <AdminProgress />
        <AdminCommunity />
      </main>
    </div>
  );
}
