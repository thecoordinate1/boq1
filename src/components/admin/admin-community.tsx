"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
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
} from "@/components/ui/alert-dialog"
import { communityContributors, communityTarget } from "@/lib/data";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

type Contributor = { name: string; initials: string; image: string; contribution: string; role: string; amount: number };

const formatCurrency = (amount: number) => {
  return `K ${new Intl.NumberFormat("en-US").format(amount)}`;
};

export default function AdminCommunity() {
  const [contributors, setContributors] = useState<Contributor[]>(communityContributors);
  const [target, setTarget] = useState(communityTarget);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(null);

  const handleAddItem = () => {
    setEditingContributor(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (contributor: Contributor) => {
    setEditingContributor(contributor);
    setIsDialogOpen(true);
  };
  
  const handleDeleteItem = (name: string) => {
    setContributors(contributors.filter((c) => c.name !== name));
  };

  const handleFormSubmit = (data: Contributor) => {
    if (editingContributor) {
        setContributors(
            contributors.map((c) =>
            c.name === editingContributor.name ? data : c
            )
        );
    } else {
        setContributors([...contributors, data]);
    }
    setIsDialogOpen(false);
    setEditingContributor(null);
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
          <div>
            <CardTitle className="text-xl md:text-2xl">Community Fundraising</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Manage community contributors and fundraising target.
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Contributor
          </Button>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          <div className="p-4 md:p-0">
            <Label htmlFor="targetAmount">Fundraising Target</Label>
            <div className="flex items-center gap-2 mt-2">
                <Input id="targetAmount" type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} className="max-w-[200px]" />
                <Button>Save Target</Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[40px] md:w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributors.map((contributor) => {
                return (
                  <TableRow key={contributor.name}>
                    <TableCell className="font-medium">
                      {contributor.name}
                    </TableCell>
                    <TableCell>{contributor.contribution}</TableCell>
                    <TableCell><Badge variant={contributor.role === 'Sponsor' ? 'default' : 'secondary'}>{contributor.role}</Badge></TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(contributor.amount)}
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
                            <DropdownMenuItem onClick={() => handleEditItem(contributor)}>
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
                              This action cannot be undone. This will permanently delete the contributor.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(contributor.name)}
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
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingContributor ? "Edit Contributor" : "Add New Contributor"}</DialogTitle>
          </DialogHeader>
          <ContributorForm
            item={editingContributor}
            onSubmit={handleFormSubmit}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function ContributorForm({ item, onSubmit, onClose }: { item: Contributor | null, onSubmit: (data: Contributor) => void, onClose: () => void }) {
    const [name, setName] = useState(item?.name || "");
    const [contribution, setContribution] = useState(item?.contribution || "");
    const [role, setRole] = useState(item?.role || "Volunteer");
    const [amount, setAmount] = useState(item?.amount || 0);
    const [image, setImage] = useState(item?.image || "https://picsum.photos/seed/105/40/40");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const initials = name.split(' ').map(n => n[0]).join('');
        onSubmit({ name, contribution, role, amount, image, initials });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="contribution">Contribution</Label>
                <Input id="contribution" value={contribution} onChange={e => setContribution(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={role} onChange={e => setRole(e.target.value)} required />
            </div>
             <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
            </div>
            <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={image} onChange={e => setImage(e.target.value)} required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{item ? "Save Changes" : "Add Contributor"}</Button>
            </div>
        </form>
    )
}