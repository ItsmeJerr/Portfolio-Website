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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { uploadImage } from "@/lib/supabaseClient";
import { type Experience, type InsertExperience } from "@/lib/types";
import { insertExperienceSchema } from "@/lib/schemas";
import { useState, useRef } from "react";

interface ExperienceFormProps {
  experience?: Experience;
  isOpen: boolean;
  onClose: () => void;
}

export function ExperienceForm({
  experience,
  isOpen,
  onClose,
}: ExperienceFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCurrent, setIsCurrent] = useState(!experience?.endDate);
  const [technologies, setTechnologies] = useState<string[]>(
    experience?.technologies
      ? typeof experience.technologies === "string"
        ? experience.technologies.split(",").map((tech: string) => tech.trim())
        : experience.technologies
      : []
  );
  const [techInput, setTechInput] = useState("");
  const [images, setImages] = useState<string[]>(Array.isArray(experience?.images) ? experience.images : []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsertExperience>({
    resolver: zodResolver(insertExperienceSchema),
    defaultValues: experience
      ? {
          title: experience.title,
          company: experience.company,
          startDate: experience.startDate,
          endDate: experience.endDate || undefined,
          description: experience.description || "",
          technologies: experience.technologies || "",
        }
      : {
          title: "",
          company: "",
          startDate: "",
          endDate: undefined,
          description: "",
          technologies: "",
        },
  });

  const experienceMutation = useMutation({
    mutationFn: async (data: InsertExperience) => {
      const url = experience
        ? `/api/experiences/${experience.id}`
        : "/api/experiences";
      const method = experience ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      if (!response.ok) {
        const errorData = await response
          .text()
          .then((t) => (t ? JSON.parse(t) : {}))
          .catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${experience ? "update" : "create"} experience`
        );
      }
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    },
    onSuccess: () => {
      toast({
        title: experience ? "Experience Updated" : "Experience Created",
        description: `Experience has been ${
          experience ? "updated" : "created"
        } successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"], refetchType: "all" });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          `Failed to ${
            experience ? "update" : "create"
          } experience. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await uploadImage(files[i]);
          uploaded.push(url);
        } catch (err: any) {
          toast({
            title: "Upload failed",
            description: err?.message || "Failed to upload image.",
            variant: "destructive",
          });
        }
      }
      setImages((prev) => [...prev, ...uploaded]);
      if (uploaded.length > 0) {
        toast({
          title: "Success",
          description: `${uploaded.length} images uploaded successfully.`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while uploading the image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const onSubmit = (data: InsertExperience) => {
    const submitData = {
      ...data,
      endDate: isCurrent ? undefined : data.endDate,
      technologies: technologies.join(", "),
      images: JSON.stringify(images),
    };
    experienceMutation.mutate(submitData);
  };

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit Experience" : "Add New Experience"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Upload Multi Gambar Experience */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {images.length > 0 ? (
                images.map((img, idx) => (
                  <div key={img} className="relative group">
                    <img
                      src={img}
                      alt={`Experience ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border text-xs">
                  No Image
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImagesChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
          <div>
            <Label htmlFor="title" className="text-sm">Job Title</Label>
            <Input id="title" {...register("title")} className="mt-1 h-9" />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company" className="text-sm">Company</Label>
            <Input id="company" {...register("company")} className="mt-1 h-9" />
            {errors.company && (
              <p className="text-xs text-destructive mt-1">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startDate" className="text-sm">Start Date</Label>
              <Input
                id="startDate"
                {...register("startDate")}
                placeholder="2022 or Jan 2022"
                className="mt-1 h-9"
              />
              {errors.startDate && (
                <p className="text-xs text-destructive mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endDate" className="text-sm">End Date</Label>
              <Input
                id="endDate"
                {...register("endDate")}
                placeholder="2023 or Present"
                disabled={isCurrent}
                className="mt-1 h-9"
              />
              {errors.endDate && (
                <p className="text-xs text-destructive mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="current"
              checked={isCurrent}
              onCheckedChange={(checked) => setIsCurrent(checked as boolean)}
            />
            <Label htmlFor="current" className="text-sm">Current position</Label>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              rows={2}
              {...register("description")}
              className="mt-1 resize-none text-sm"
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="technologies" className="text-sm">Technologies</Label>
            <div className="flex space-x-1 mt-1">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add tech..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTechnology())
                }
                className="h-9 text-sm"
              />
              <Button type="button" onClick={addTechnology} size="sm">
                Add
              </Button>
            </div>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {technologies.map((tech) => (
                  <div
                    key={tech}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs flex items-center space-x-1"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={experienceMutation.isPending}
              className="bg-primary hover:bg-primary/90"
              size="sm"
            >
              {experienceMutation.isPending ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : experience ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
