import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Lightbulb,
  Handshake,
  Star,
  Leaf,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import type { Profile, InsertContactMessage } from "@shared/schema";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Always exploring new technologies and creative solutions to push boundaries.",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description:
      "Believing in the power of teamwork and open communication for success.",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "Committed to delivering high-quality work that exceeds expectations.",
  },
  {
    icon: Leaf,
    title: "Growth",
    description:
      "Continuous learning and adaptation to evolving technology landscapes.",
  },
];

const socialLinks = [
  {
    icon: Youtube,
    href: "https://youtube.com/@mbalffajry",
    label: "YouTube",
    color: "red",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/mbalffa.jry",
    label: "Instagram",
    color: "pink",
  },
  {
    icon: Github,
    href: "https://github.com/ItsmeJerr",
    label: "GitHub",
    color: "slate",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionReveal = useScrollReveal();

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact-messages", data);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        throw new Error("Response is not JSON");
      }
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 ${sectionReveal.className}`}
          ref={sectionReveal.ref}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Me
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Feel free to reach out for collaborations, project inquiries, or
            just to say hi!
          </p>
        </div>
        <div className={sectionReveal.className} ref={sectionReveal.ref}>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Contact Information
              </h2>

              {/* Contact Details */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">
                      {profile?.email || "john.doe@example.com"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">
                      {profile?.phone || "+62 812-3456-7890"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Location</h3>
                    <p className="text-muted-foreground">
                      {profile?.location || "Jakarta, Indonesia"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Follow Me
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Button
                        key={social.label}
                        size="icon"
                        className={`bg-${social.color}-600 hover:bg-${social.color}-700 text-white`}
                        asChild
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Harga Jasa Section */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Values
                </h3>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-primary">$400</p>
                  <p className="text-muted-foreground text-sm">
                    Harga jasa pembuatan website portfolio profesional.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send Message
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        className="mt-2"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        className="mt-2"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
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
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      className="mt-2"
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      {...register("message")}
                      className="mt-2 resize-none"
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || contactMutation.isPending}
                  >
                    {isSubmitting || contactMutation.isPending ? (
                      <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
