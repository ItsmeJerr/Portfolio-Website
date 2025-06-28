import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  insertActivitySchema,
  type Activity,
  type InsertActivity,
} from "@shared/schema";
import { useRef, useState } from "react";

interface ActivityFormProps {
  activity?: Activity;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityForm({ activity, isOpen, onClose }: ActivityFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(activity?.image || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InsertActivity>({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: activity
      ? {
          title: activity.title,
          description: activity.description,
          icon: activity.icon,
          color: activity.color,
          image: activity.image || "",
        }
      : {
          title: "",
          description: "",
          icon: "",
          color: "",
          image: "",
        },
  });

  const activityMutation = useMutation({
    mutationFn: async (data: InsertActivity) => {
      const url = activity
        ? `/api/activities/${activity.id}`
        : "/api/activities";
      const method = activity ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      if (!response.ok) {
        const errorData = await response
          .text()
          .then((t) => (t ? JSON.parse(t) : {}))
          .catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${activity ? "update" : "create"} activity`
        );
      }
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    },
    onSuccess: () => {
      toast({
        title: activity ? "Activity Updated" : "Activity Created",
        description: `Activity has been ${
          activity ? "updated" : "created"
        } successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          `Failed to ${
            activity ? "update" : "create"
          } activity. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        setValue("image", data.url as any, { shouldValidate: true });
      } else {
        toast({
          title: "Upload failed",
          description: data.message || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: InsertActivity) => {
    activityMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activity ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Upload & Preview Image */}
          <div className="flex flex-col items-center gap-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Activity"
                className="w-24 h-24 rounded-lg object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : imageUrl
                ? "Edit Image"
                : "Upload Image"}
            </Button>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} className="mt-2" />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...register("description")}
              className="mt-2 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="icon">Icon (e.g., lucide-heart)</Label>
            <Input id="icon" {...register("icon")} className="mt-2" />
            {errors.icon && (
              <p className="text-sm text-destructive mt-1">
                {errors.icon.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="color">Color (e.g., pink, blue, green)</Label>
            <Input id="color" {...register("color")} className="mt-2" />
            {errors.color && (
              <p className="text-sm text-destructive mt-1">
                {errors.color.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={activityMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {activityMutation.isPending ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : activity ? (
                "Update Activity"
              ) : (
                "Add Activity"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
