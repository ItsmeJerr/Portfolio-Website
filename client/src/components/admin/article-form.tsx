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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  insertArticleSchema,
  type Article,
  type InsertArticle,
} from "@shared/schema";
import { generateSlug } from "@/lib/types";
import { useState, useRef } from "react";

interface ArticleFormProps {
  article?: Article;
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "Technology",
  "React",
  "JavaScript",
  "Design",
  "Backend",
  "DevOps",
  "Tutorial",
  "Opinion",
];

export function ArticleForm({ article, isOpen, onClose }: ArticleFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [autoSlug, setAutoSlug] = useState(true);
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InsertArticle>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: article
      ? {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          readTime: article.readTime,
          imageUrl: article.imageUrl || "",
          published: article.published,
          featured: article.featured,
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          category: "Technology",
          readTime: 5,
          imageUrl: "",
          published: true,
          featured: false,
        },
  });

  const title = watch("title");

  // Auto-generate slug when title changes
  if (autoSlug && title && !article) {
    const newSlug = generateSlug(title);
    if (newSlug !== watch("slug")) {
      setValue("slug", newSlug);
    }
  }

  const articleMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const url = article ? `/api/articles/${article.id}` : "/api/articles";
      const method = article ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      if (!response.ok) {
        const errorData = await response
          .text()
          .then((t) => (t ? JSON.parse(t) : {}))
          .catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${article ? "update" : "create"} article`
        );
      }
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    },
    onSuccess: () => {
      toast({
        title: article ? "Artikel Diperbarui" : "Artikel Ditambahkan",
        description: `Artikel berhasil ${
          article ? "diperbarui" : "ditambahkan"
        }.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/articles?published=true"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/articles?featured=true"],
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          `Gagal ${article ? "update" : "tambah"} artikel. Coba lagi!`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertArticle) => {
    articleMutation.mutate(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setValue("imageUrl", data.url, { shouldValidate: true });
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? "Edit Article" : "Add New Article"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register("slug")}
              className="mt-2"
              onChange={(e) => {
                setAutoSlug(false);
                setValue("slug", e.target.value);
              }}
            />
            {errors.slug && (
              <p className="text-sm text-destructive mt-1">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register("category", { required: "Category is required" })}
                placeholder="e.g., Web Development"
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <Input
                id="readTime"
                type="number"
                {...register("readTime", {
                  required: "Read time is required",
                  valueAsNumber: true,
                  min: 1,
                })}
                placeholder="e.g., 5"
              />
              {errors.readTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.readTime.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="url">Article URL (Optional)</Label>
            <Input
              id="url"
              type="url"
              {...register("url")}
              placeholder="https://example.com/article"
            />
            <p className="text-sm text-muted-foreground mt-1">
              External link to the article. If empty, will show notification.
            </p>
          </div>

          <div>
            <Label>Article Image</Label>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded mb-2 border shadow"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2"
            >
              {uploading
                ? "Uploading..."
                : imageUrl
                ? "Change Image"
                : "Upload Image"}
            </Button>
            {errors.imageUrl && (
              <p className="text-sm text-destructive mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              rows={3}
              {...register("excerpt")}
              className="mt-2 resize-none"
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive mt-1">
                {errors.excerpt.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              rows={8}
              {...register("content")}
              className="mt-2 resize-none"
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={watch("published")}
                onCheckedChange={(v) => setValue("published", !!v)}
              />
              <Label htmlFor="published">Published</Label>
              <span className="text-xs text-muted-foreground ml-2">
                (Article will be displayed on public page immediately if
                checked)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={watch("featured")}
                onCheckedChange={(v) => setValue("featured", !!v)}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={articleMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {articleMutation.isPending ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : article ? (
                "Update Article"
              ) : (
                "Add Article"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
