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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  insertCertificationSchema,
  type Certification,
  type InsertCertification,
} from "@shared/schema";

interface CertificationFormProps {
  certification?: Certification;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificationForm({
  certification,
  isOpen,
  onClose,
}: CertificationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsertCertification>({
    resolver: zodResolver(insertCertificationSchema),
    defaultValues: certification
      ? {
          name: certification.name,
          issuer: certification.issuer,
          year: certification.year,
          credentialUrl: certification.credentialUrl || "",
        }
      : {
          name: "",
          issuer: "",
          year: "",
          credentialUrl: "",
        },
  });

  const certificationMutation = useMutation({
    mutationFn: async (data: InsertCertification) => {
      const url = certification
        ? `/api/certifications/${certification.id}`
        : "/api/certifications";
      const method = certification ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      if (!response.ok) {
        const errorData = await response
          .text()
          .then((t) => (t ? JSON.parse(t) : {}))
          .catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${certification ? "update" : "create"} certification`
        );
      }
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    },
    onSuccess: () => {
      toast({
        title: certification
          ? "Certification Updated"
          : "Certification Created",
        description: `Certification has been ${
          certification ? "updated" : "created"
        } successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error?.message ||
          `Failed to ${
            certification ? "update" : "create"
          } certification. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCertification) => {
    certificationMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {certification ? "Edit Certification" : "Add New Certification"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} className="mt-2" />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="issuer">Issuer</Label>
            <Input id="issuer" {...register("issuer")} className="mt-2" />
            {errors.issuer && (
              <p className="text-sm text-destructive mt-1">
                {errors.issuer.message}
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
            <Label htmlFor="credentialUrl">Credential URL (optional)</Label>
            <Input
              id="credentialUrl"
              {...register("credentialUrl")}
              className="mt-2"
            />
            {errors.credentialUrl && (
              <p className="text-sm text-destructive mt-1">
                {errors.credentialUrl.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={certificationMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {certificationMutation.isPending ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : certification ? (
                "Update Certification"
              ) : (
                "Add Certification"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
