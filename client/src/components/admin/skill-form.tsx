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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  insertSkillSchema,
  type Skill,
  type InsertSkill,
} from "@shared/schema";
import { skillCategories } from "@/lib/types";

interface SkillFormProps {
  skill?: Skill;
  isOpen: boolean;
  onClose: () => void;
}

export function SkillForm({ skill, isOpen, onClose }: SkillFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InsertSkill>({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: skill
      ? {
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          description: skill.description || "",
        }
      : {
          name: "",
          category: "Frontend Development",
          proficiency: 50,
          description: "",
        },
  });

  const proficiency = watch("proficiency");

  const skillMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      const url = skill ? `/api/skills/${skill.id}` : "/api/skills";
      const method = skill ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      if (!response.ok) {
        const errorData = await response
          .text()
          .then((t) => (t ? JSON.parse(t) : {}))
          .catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to ${skill ? "update" : "create"} skill`
        );
      }
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    },
    onSuccess: () => {
      toast({
        title: skill ? "Skill Updated" : "Skill Created",
        description: `Skill has been ${
          skill ? "updated" : "created"
        } successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          `Failed to ${skill ? "update" : "create"} skill. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSkill) => {
    skillMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{skill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Skill Name</Label>
            <Input id="name" {...register("name")} className="mt-2" />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              defaultValue={watch("category")}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive mt-1">
                {errors.category.message}
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
            <Label htmlFor="proficiency">Proficiency ({proficiency}%)</Label>
            <div className="mt-2">
              <Slider
                value={[proficiency]}
                onValueChange={([value]) => setValue("proficiency", value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            {errors.proficiency && (
              <p className="text-sm text-destructive mt-1">
                {errors.proficiency.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={skillMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {skillMutation.isPending ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : skill ? (
                "Update Skill"
              ) : (
                "Add Skill"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
