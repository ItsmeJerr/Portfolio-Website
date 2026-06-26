import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  position: z.string().min(1, "Position is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  age: z.number().optional(),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  image: z.string().optional(),
});

export const insertSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(0).max(100),
  description: z.string().optional(),
});

export const insertExperienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
  images: z.string().optional(),
});

export const insertEducationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().optional(),
  gpa: z.string().optional(),
  image: z.string().optional(),
});

export const insertCertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  year: z.string().min(1, "Year is required"),
  credentialUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const insertActivitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
  image: z.string().optional(),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  readTime: z.number().min(1, "Read time must be at least 1 minute"),
  imageUrl: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const insertContactMessageSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
