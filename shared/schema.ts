import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const profile = mysqlTable("profile", {
  id: int("id").primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 100 }),
  bio: varchar("bio", { length: 1000 }),
  age: int("age"),
  linkedinUrl: varchar("linkedin_url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  twitterUrl: varchar("twitter_url", { length: 255 }),
  instagramUrl: varchar("instagram_url", { length: 255 }),
  youtubeUrl: varchar("youtube_url", { length: 255 }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = mysqlTable("skills", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  proficiency: int("proficiency").notNull(),
  description: varchar("description", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const experiences = mysqlTable("experiences", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }).notNull(),
  startDate: varchar("start_date", { length: 20 }).notNull(),
  endDate: varchar("end_date", { length: 20 }),
  description: varchar("description", { length: 1000 }),
  technologies: varchar("technologies", { length: 1000 }),
  images: text("images"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const education = mysqlTable("education", {
  id: int("id").primaryKey().autoincrement(),
  degree: varchar("degree", { length: 100 }).notNull(),
  institution: varchar("institution", { length: 100 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  description: varchar("description", { length: 1000 }),
  gpa: varchar("gpa", { length: 10 }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const certifications = mysqlTable("certifications", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  issuer: varchar("issuer", { length: 100 }).notNull(),
  year: varchar("year", { length: 10 }).notNull(),
  credentialUrl: varchar("credential_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = mysqlTable("activities", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = mysqlTable("articles", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 1000 }).notNull(),
  content: varchar("content", { length: 4000 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  readTime: int("read_time").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  image: varchar("image", { length: 255 }),
  url: varchar("url", { length: 255 }),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: varchar("message", { length: 2000 }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profile).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertExperienceSchema = createInsertSchema(experiences)
  .omit({
  id: true,
  createdAt: true,
  })
  .extend({
    images: z.string().optional().or(z.array(z.string()).optional()),
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
  createdAt: true,
});

export const insertCertificationSchema = createInsertSchema(
  certifications
).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(
  contactMessages
).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Experience = typeof experiences.$inferSelect & {
  images?: string[];
};
export type InsertExperience = z.infer<typeof insertExperienceSchema> & {
  images?: string[];
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
export const activity = mysqlTable("activity", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
