"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
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
import { progressData as initialProgressData } from "@/lib/data";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ProgressItem = { id?: string; title: string; value: number; target: string };

export default function AdminProgress() {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgressItem | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from('project_progress')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) setProgressItems(data);
    if (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load progress", variant: "destructive" });
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: ProgressItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from('project_progress').delete().eq('id', id);
    if (!error) {
      setProgressItems(progressItems.filter((item) => item.id !== id));
      toast({ title: "Success", description: "Task deleted" });
    } else {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleFormSubmit = async (data: ProgressItem) => {
    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('project_progress')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('project_progress')
          .insert([data]);
        if (error) throw error;
      }

      fetchProgress();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({ title: "Success", description: "Progress saved" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save progress", variant: "destructive" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
          <div>
            <CardTitle className="text-xl md:text-2xl">Project Progress</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Update completion status of key tasks.
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6">
          {progressItems.map((item) => (
            <div key={item.title} className="space-y-2 relative group">
              <div className="flex justify-between">
                <span className="font-medium text-sm">{item.title}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
              <Progress value={item.value} aria-label={`${item.title} progress`} />
              <p className="text-xs text-muted-foreground text-right">Target: {item.target}</p>

              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        This action cannot be undone. This will permanently delete this progress task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteItem(item.id!)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Task" : "Add New Task"}</DialogTitle>
          </DialogHeader>
          <ProgressForm
            item={editingItem}
            onSubmit={handleFormSubmit}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProgressForm({ item, onSubmit, onClose }: { item: ProgressItem | null, onSubmit: (data: ProgressItem) => void, onClose: () => void }) {
  const [title, setTitle] = useState(item?.title || "");
  const [value, setValue] = useState(item?.value || 0);
  const [target, setTarget] = useState(item?.target || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, value, target });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required disabled={!!item} />
        {!!item && <p className="text-xs text-muted-foreground mt-1">Title cannot be edited.</p>}
      </div>
      <div>
        <Label htmlFor="target">Target</Label>
        <Input id="target" value={target} onChange={e => setTarget(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="value">Progress ({value}%)</Label>
        <Slider id="value" value={[value]} onValueChange={([val]) => setValue(val)} max={100} step={1} />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{item ? "Save Changes" : "Add Task"}</Button>
      </div>
    </form>
  )
}
