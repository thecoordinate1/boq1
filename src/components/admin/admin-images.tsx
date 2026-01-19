"use client";

import { useState, useEffect } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { useToast } from "@/hooks/use-toast";

type ProjectImage = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  lat: number;
  lng: number;
};

export default function AdminImages() {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ProjectImage | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setImages(data);
    if (error) console.error(error);
  };

  const handleAddItem = () => {
    setEditingImage(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (image: ProjectImage) => {
    setEditingImage(image);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from('project_images').delete().eq('id', id);
    if (!error) {
      setImages(images.filter((img) => img.id !== id));
      toast({ title: "Success", description: "Image deleted" });
    } else {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleFormSubmit = async (data: Omit<ProjectImage, "id">) => {
    try {
      if (editingImage) {
        const { error } = await supabase
          .from('project_images')
          .update(data)
          .eq('id', editingImage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('project_images')
          .insert([data]);
        if (error) throw error;
      }

      fetchImages();
      setIsDialogOpen(false);
      setEditingImage(null);
      toast({ title: "Success", description: "Image saved" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save image", variant: "destructive" });
    }
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
              {images.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No images found.
                  </TableCell>
                </TableRow>
              ) : (
                images.map((image) => {
                  return (
                    <TableRow key={image.id}>
                      <TableCell>
                        <div className="relative h-16 w-20">
                          <Image
                            src={image.image_url}
                            alt={image.title}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {image.title}
                      </TableCell>
                      <TableCell>{image.description}</TableCell>
                      <TableCell>{`${image.lat}, ${image.lng}`}</TableCell>
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
                })
              )}
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


function ImageForm({ item, onSubmit, onClose }: { item: ProjectImage | null, onSubmit: (data: Omit<ProjectImage, "id">) => void, onClose: () => void }) {
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [lat, setLat] = useState(item?.lat || 0);
  const [lng, setLng] = useState(item?.lng || 0);
  const [imageUrl, setImageUrl] = useState(item?.image_url || "");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const url = await uploadImage(file);
    if (url) {
      setImageUrl(url);
    }
    setUploading(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      image_url: imageUrl,
      lat,
      lng,
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

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" onChange={handleFileChange} disabled={uploading} accept="image/*" />
        {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
        {imageUrl && (
          <div className="relative h-20 w-32 mt-2">
            <Image src={imageUrl} alt="Preview" fill className="object-cover rounded-md" />
          </div>
        )}
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
        <Button type="submit" disabled={uploading || !imageUrl}>{item ? "Save Changes" : "Save Image"}</Button>
      </div>
    </form>
  )
}
