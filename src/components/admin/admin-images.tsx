"use client";

import { useState } from "react";
import Image from "next/image";
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
import { mapPoints } from "@/lib/data";
import type { MapPoint } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function AdminImages() {
  const [images, setImages] = useState<MapPoint[]>(mapPoints);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<MapPoint | null>(null);

  const handleAddItem = () => {
    setEditingImage(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (image: MapPoint) => {
    setEditingImage(image);
    setIsDialogOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleFormSubmit = (data: MapPoint) => {
    if (editingImage) {
        setImages(
            images.map((img) =>
            img.id === editingImage.id ? data : img
            )
        );
    } else {
        setImages([...images, { ...data, id: crypto.randomUUID() }]);
    }
    setIsDialogOpen(false);
    setEditingImage(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
          <div>
            <CardTitle className="text-xl md:text-2xl">Project Images</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Manage images for the gallery and map.
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead className="w-[40px] md:w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => {
                return (
                  <TableRow key={image.id}>
                    <TableCell>
                      <Image
                        src={image.image.url}
                        alt={image.title}
                        width={80}
                        height={60}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {image.title}
                    </TableCell>
                    <TableCell>{image.description}</TableCell>
                    <TableCell>{`${image.position.lat}, ${image.position.lng}`}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditItem(image)}>
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
                              This action cannot be undone. This will permanently delete the image data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(image.id)}
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
            <DialogTitle>{editingImage ? "Edit Image" : "Add New Image"}</DialogTitle>
          </DialogHeader>
          <ImageForm
            item={editingImage}
            onSubmit={handleFormSubmit}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}


function ImageForm({ item, onSubmit, onClose }: { item: MapPoint | null, onSubmit: (data: MapPoint) => void, onClose: () => void }) {
    const [title, setTitle] = useState(item?.title || "");
    const [description, setDescription] = useState(item?.description || "");
    const [imageUrl, setImageUrl] = useState(item?.image.url || "");
    const [imageHint, setImageHint] = useState(item?.image.hint || "");
    const [lat, setLat] = useState(item?.position.lat || 0);
    const [lng, setLng] = useState(item?.position.lng || 0);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = item?.id || crypto.randomUUID();
        onSubmit({ 
            id,
            title,
            description,
            image: { url: imageUrl, hint: imageHint },
            position: { lat, lng },
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
            </div>
            <div>
                <Label htmlFor="imageHint">Image Hint (for AI)</Label>
                <Input id="imageHint" value={imageHint} onChange={e => setImageHint(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input id="lat" type="number" step="any" value={lat} onChange={e => setLat(Number(e.target.value))} required />
                </div>
                <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input id="lng" type="number" step="any" value={lng} onChange={e => setLng(Number(e.target.value))} required />
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{item ? "Save Changes" : "Add Image"}</Button>
            </div>
        </form>
    )
}
