import {
  pgTable,
  varchar,
  integer,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const profile = pgTable("profile", {
  id: integer("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 100 }),
  bio: varchar("bio", { length: 1000 }),
  age: integer("age"),
  linkedinUrl: varchar("linkedin_url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  twitterUrl: varchar("twitter_url", { length: 255 }),
  instagramUrl: varchar("instagram_url", { length: 255 }),
  youtubeUrl: varchar("youtube_url", { length: 255 }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  proficiency: integer("proficiency").notNull(),
  description: varchar("description", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: integer("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }).notNull(),
  startDate: varchar("start_date", { length: 20 }).notNull(),
  endDate: varchar("end_date", { length: 20 }),
  description: varchar("description", { length: 1000 }),
  technologies: varchar("technologies", { length: 1000 }),
  images: text("images"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const education = pgTable("education", {
  id: integer("id").primaryKey(),
  degree: varchar("degree", { length: 100 }).notNull(),
  institution: varchar("institution", { length: 100 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  description: varchar("description", { length: 1000 }),
  gpa: varchar("gpa", { length: 10 }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  issuer: varchar("issuer", { length: 100 }).notNull(),
  year: varchar("year", { length: 10 }).notNull(),
  credentialUrl: varchar("credential_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: integer("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: integer("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 1000 }).notNull(),
  content: varchar("content", { length: 4000 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  readTime: integer("read_time").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  image: varchar("image", { length: 255 }),
  url: varchar("url", { length: 255 }),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: integer("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: varchar("message", { length: 2000 }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

const optionalString = (maxLength: number) =>
  z.string().max(maxLength).optional();

// Insert schemas
export const insertUserSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(255),
});

export const insertProfileSchema = z.object({
  fullName: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  email: z.string().email().max(100),
  phone: optionalString(50),
  location: optionalString(100),
  bio: optionalString(1000),
  age: z.number().int().optional(),
  linkedinUrl: optionalString(255),
  githubUrl: optionalString(255),
  twitterUrl: optionalString(255),
  instagramUrl: optionalString(255),
  youtubeUrl: optionalString(255),
  image: optionalString(255),
});

export const insertSkillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  proficiency: z.number().int(),
  description: optionalString(500),
});

export const insertExperienceSchema = z.object({
  title: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  startDate: z.string().min(1).max(20),
  endDate: optionalString(20),
  description: optionalString(1000),
  technologies: optionalString(1000),
  images: z.union([z.string(), z.array(z.string())]).optional(),
});

export const insertEducationSchema = z.object({
  degree: z.string().min(1).max(100),
  institution: z.string().min(1).max(100),
  year: z.string().min(1).max(20),
  description: optionalString(1000),
  gpa: optionalString(10),
  image: optionalString(255),
});

export const insertCertificationSchema = z.object({
  name: z.string().min(1).max(100),
  issuer: z.string().min(1).max(100),
  year: z.string().min(1).max(10),
  credentialUrl: optionalString(255),
});

export const insertActivitySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  icon: z.string().min(1).max(50),
  color: z.string().min(1).max(20),
  image: optionalString(255),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(1000),
  content: z.string().min(1).max(4000),
  category: z.string().min(1).max(100),
  readTime: z.number().int(),
  imageUrl: optionalString(255),
  image: optionalString(255),
  url: optionalString(255),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const insertContactMessageSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(100),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  isRead: z.boolean().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Experience = typeof experiences.$inferSelect & {
  images?: string[] | string;
};
export type InsertExperience = z.infer<typeof insertExperienceSchema> & {
  images?: string[] | string;
};

export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Template activity
export const activity = pgTable("activity", {
  id: integer("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
