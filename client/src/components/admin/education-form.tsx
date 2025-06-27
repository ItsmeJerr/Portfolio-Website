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
  insertEducationSchema,
  type Education,
  type InsertEducation,
} from "@shared/schema";
import { useRef, useState } from "react";

interface EducationFormProps {
  education?: Education;
  isOpen: boolean;
  onClose: () => void;
}

export function EducationForm({
  education,
  isOpen,
  onClose,
}: EducationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(education?.image || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InsertEducation>({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: education
      ? {
          degree: education.degree,
          institution: education.institution,
          year: education.year,
          description: education.description || "",
          gpa: education.gpa || undefined,
          image: education.image || "",
        }
      : {
          degree: "",
          institution: "",
          year: "",
          description: "",
          gpa: undefined,
          image: "",
        },
  });

  const educationMutation = useMutation({
    mutationFn: async (data: InsertEducation) => {
      const url = education
        ? `/api/education/${education.id}`
        : "/api/education";
      const method = education ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      if (!response.ok) {
        const errorData = await response
          .text()
          .then((t) => (t ? JSON.parse(t) : {}))
          .catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${education ? "update" : "create"} education`
        );
      }
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    },
    onSuccess: () => {
      toast({
        title: education ? "Education Updated" : "Education Created",
        description: `Education has been ${
          education ? "updated" : "created"
        } successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          `Failed to ${
            education ? "update" : "create"
          } education. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEducation) => {
    educationMutation.mutate(data);
  };

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
          title: "Upload gagal",
          description: data.message || "Gagal upload gambar",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Upload gagal",
        description: "Gagal upload gambar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {education ? "Edit Education" : "Add New Education"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Upload & Preview Gambar */}
          <div className="flex flex-col items-center gap-2">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Education"
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
            <Label htmlFor="degree">Degree</Label>
            <Input id="degree" {...register("degree")} className="mt-2" />
            {errors.degree && (
              <p className="text-sm text-destructive mt-1">
                {errors.degree.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              {...register("institution")}
              className="mt-2"
            />
            {errors.institution && (
              <p className="text-sm text-destructive mt-1">
                {errors.institution.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input id="year" {...register("year")} className="mt-2" />
            {errors.year && (
              <p className="text-sm text-destructive mt-1">
                {errors.year.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="gpa">GPA (optional)</Label>
            <Input
              id="gpa"
              type="text"
              inputMode="decimal"
              {...register("gpa")}
              className="mt-2"
            />
            {errors.gpa && (
              <p className="text-sm text-destructive mt-1">
                {errors.gpa.message}
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
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={educationMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {educationMutation.isPending ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : education ? (
                "Update Education"
              ) : (
                "Add Education"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
