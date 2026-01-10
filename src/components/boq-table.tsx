
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import BoqForm from "./boq-form";
import type { BOQItem } from "@/lib/types";
import { initialBoqItems } from "@/lib/data";

export default function BoqTable() {
  const [items, setItems] = useState<BOQItem[]>(initialBoqItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BOQItem | null>(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: BOQItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleFormSubmit = (data: Omit<BOQItem, "id">) => {
    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id ? { ...item, ...data } : item
        )
      );
    } else {
      setItems([...items, { id: crypto.randomUUID(), ...data }]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const grandTotal = items.reduce(
    (total, item) => total + item.quantity * item.rate,
    0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
          <div>
            <CardTitle className="text-xl md:text-2xl">Bill of Quantities</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Drainage clearing project estimates.
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] pl-4 md:pl-auto">Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right pr-4 md:pr-auto">Amount</TableHead>
                <TableHead className="w-[40px] md:w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const amount = item.quantity * item.rate;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium pl-4 md:pl-auto">
                      {item.description}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.rate)}
                    </TableCell>
                    <TableCell className="text-right pr-4 md:pr-auto">
                      {formatCurrency(amount)}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditItem(item)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the BOQ item.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold text-base md:text-lg">
                  Grand Total
                </TableCell>
                <TableCell className="text-right font-bold text-base md:text-lg pr-4 md:pr-auto">
                  {formatCurrency(grandTotal)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the details for this BOQ item."
                : "Fill in the details for the new BOQ item."}
            </DialogDescription>
          </DialogHeader>
          <BoqForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
