import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  insertProfileSchema,
  type Profile,
  type InsertProfile,
} from "@shared/schema";
import { useRef, useState } from "react";

interface ProfileFormProps {
  profile?: Profile;
  isLoading: boolean;
}

export function ProfileForm({ profile, isLoading }: ProfileFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(profile?.image || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: profile
      ? {
          fullName: profile.fullName,
          position: profile.position,
          email: profile.email,
          phone: profile.phone || "",
          location: profile.location || "",
          bio: profile.bio || "",
          age: profile.age || undefined,
          linkedinUrl: profile.linkedinUrl || "",
          githubUrl: profile.githubUrl || "",
          twitterUrl: profile.twitterUrl || "",
          instagramUrl: profile.instagramUrl || "",
          youtubeUrl: profile.youtubeUrl || "",
        }
      : undefined,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: InsertProfile) => {
      const response = await apiRequest("PUT", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        toast({
          title: "Upload failed",
          description: err.message || "Failed to upload image.",
          variant: "destructive",
        });
        return;
      }
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        toast({
          title: "Success",
          description: "Image uploaded successfully.",
          variant: "success",
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

  const onSubmit = (data: InsertProfile) => {
    updateProfileMutation.mutate({ ...data, image: imageUrl });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-12 w-32" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Foto Profile */}
      <div className="flex flex-col items-center gap-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground border">
            No Photo
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
            ? "Edit Photo"
            : "Upload Photo"}
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register("fullName")} className="mt-2" />
          {errors.fullName && (
            <p className="text-sm text-destructive mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input id="position" {...register("position")} className="mt-2" />
          {errors.position && (
            <p className="text-sm text-destructive mt-1">
              {errors.position.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="mt-2"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} className="mt-2" />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} className="mt-2" />
          {errors.location && (
            <p className="text-sm text-destructive mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            className="mt-2"
          />
          {errors.age && (
            <p className="text-sm text-destructive mt-1">
              {errors.age.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={4}
          {...register("bio")}
          className="mt-2 resize-none"
        />
        {errors.bio && (
          <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            {...register("linkedinUrl")}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input id="githubUrl" {...register("githubUrl")} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input id="twitterUrl" {...register("twitterUrl")} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            {...register("instagramUrl")}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="youtubeUrl">YouTube URL</Label>
          <Input id="youtubeUrl" {...register("youtubeUrl")} className="mt-2" />
        </div>
      </div>

      <Button
        type="submit"
        disabled={updateProfileMutation.isPending}
        className="bg-primary hover:bg-primary/90"
      >
        {updateProfileMutation.isPending ? (
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          "Update Profile"
        )}
      </Button>
    </form>
  );
}
