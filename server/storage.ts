import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import {
  users,
  profile,
  skills,
  experiences,
  education,
  certifications,
  activities,
  articles,
  contactMessages,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Skill,
  type InsertSkill,
  type Experience,
  type InsertExperience,
  type Education,
  type InsertEducation,
  type Certification,
  type InsertCertification,
  type Activity,
  type InsertActivity,
  type Article,
  type InsertArticle,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";

export class PostgresStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgres://postgres:password@localhost:5432/portfolio_db";

    const sql = postgres(connectionString, {
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });

    this.db = drizzle(sql);
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    const result = await this.db.select().from(profile).limit(1);
    return result[0];
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const existingProfile = await this.getProfile();
    if (existingProfile) {
      await this.db
        .update(profile)
        .set(profileData as Record<string, any>)
        .where(eq(profile.id, existingProfile.id));
      const updated = await this.getProfile();
      return updated!;
    }

    const [inserted] = await this.db
      .insert(profile)
      .values(profileData as any)
      .returning();
    return inserted;
  }

  // Skills methods
  async getSkills(): Promise<Skill[]> {
    return await this.db.select().from(skills).orderBy(skills.proficiency);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [inserted] = await this.db
      .insert(skills)
      .values(skill as any)
      .returning();
    return inserted;
  }

  async updateSkill(
    id: number,
    skill: Partial<InsertSkill>
  ): Promise<Skill | undefined> {
    await this.db.update(skills).set(skill).where(eq(skills.id, id));
    const updated = await this.db
      .select()
      .from(skills)
      .where(eq(skills.id, id));
    return updated[0];
  }

  async deleteSkill(id: number): Promise<boolean> {
    const deleted = await this.db
      .delete(skills)
      .where(eq(skills.id, id))
      .returning({ id: skills.id });
    return deleted.length > 0;
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    const result = await this.db
      .select()
      .from(experiences)
      .orderBy(experiences.startDate);
    return result.map((exp) => ({
      ...exp,
      images:
        exp.images &&
        typeof exp.images === "string" &&
        exp.images.trim().startsWith("[")
          ? JSON.parse(exp.images)
          : [],
    }));
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const expToSave = {
      ...experience,
      images:
        typeof experience.images === "string"
          ? experience.images
          : JSON.stringify(experience.images || []),
    };
    const [inserted] = await this.db
      .insert(experiences)
      .values(expToSave as any)
      .returning();
    return {
      ...inserted,
      images:
        inserted.images &&
        typeof inserted.images === "string" &&
        inserted.images.trim().startsWith("[")
          ? JSON.parse(inserted.images)
          : [],
    };
  }

  async updateExperience(
    id: number,
    experience: Partial<InsertExperience>
  ): Promise<Experience | undefined> {
    const expToSave = {
      ...experience,
      images:
        typeof experience.images === "string"
          ? experience.images
          : JSON.stringify(experience.images || []),
    };
    await this.db
      .update(experiences)
      .set(expToSave as any)
      .where(eq(experiences.id, id));
    const updated = await this.db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id));
    return updated[0]
      ? {
          ...updated[0],
          images:
            updated[0].images &&
            typeof updated[0].images === "string" &&
            updated[0].images.trim().startsWith("[")
              ? JSON.parse(updated[0].images)
              : [],
        }
      : undefined;
  }

  async deleteExperience(id: number): Promise<boolean> {
    await this.db.delete(experiences).where(eq(experiences.id, id));
    return true;
  }

  // Education methods
  async getEducation(): Promise<Education[]> {
    return await this.db.select().from(education).orderBy(education.year);
  }

  async createEducation(educationData: InsertEducation): Promise<Education> {
    const [inserted] = await this.db
      .insert(education)
      .values(educationData as any)
      .returning();
    return inserted;
  }

  async updateEducation(
    id: number,
    educationData: Partial<InsertEducation>
  ): Promise<Education | undefined> {
    await this.db
      .update(education)
      .set(educationData)
      .where(eq(education.id, id));
    const updated = await this.db
      .select()
      .from(education)
      .where(eq(education.id, id));
    return updated[0];
  }

  async deleteEducation(id: number): Promise<boolean> {
    await this.db.delete(education).where(eq(education.id, id));
    return true;
  }

  // Certification methods
  async getCertifications(): Promise<Certification[]> {
    return await this.db
      .select()
      .from(certifications)
      .orderBy(certifications.year);
  }

  async createCertification(
    certification: InsertCertification
  ): Promise<Certification> {
    const [inserted] = await this.db
      .insert(certifications)
      .values(certification as any)
      .returning();
    return inserted;
  }

  async updateCertification(
    id: number,
    certification: Partial<InsertCertification>
  ): Promise<Certification | undefined> {
    await this.db
      .update(certifications)
      .set(certification)
      .where(eq(certifications.id, id));
    const updated = await this.db
      .select()
      .from(certifications)
      .where(eq(certifications.id, id));
    return updated[0];
  }

  async deleteCertification(id: number): Promise<boolean> {
    await this.db.delete(certifications).where(eq(certifications.id, id));
    return true;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return await this.db.select().from(activities);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [inserted] = await this.db
      .insert(activities)
      .values(activity as any)
      .returning();
    return inserted;
  }

  async updateActivity(
    id: number,
    activity: Partial<InsertActivity>
  ): Promise<Activity | undefined> {
    await this.db.update(activities).set(activity).where(eq(activities.id, id));
    const updated = await this.db
      .select()
      .from(activities)
      .where(eq(activities.id, id));
    return updated[0];
  }

  async deleteActivity(id: number): Promise<boolean> {
    await this.db.delete(activities).where(eq(activities.id, id));
    return true;
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    return await this.db.select().from(articles).orderBy(articles.createdAt);
  }

  async getPublishedArticles(): Promise<Article[]> {
    return await this.db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(articles.createdAt);
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return await this.db
      .select()
      .from(articles)
      .where(and(eq(articles.featured, true), eq(articles.published, true)))
      .orderBy(articles.createdAt);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await this.db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    return result[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [inserted] = await this.db
      .insert(articles)
      .values(article as any)
      .returning();
    return inserted;
  }

  async updateArticle(
    id: number,
    article: Partial<InsertArticle>
  ): Promise<Article | undefined> {
    await this.db.update(articles).set(article).where(eq(articles.id, id));
    const updated = await this.db
      .select()
      .from(articles)
      .where(eq(articles.id, id));
    return updated[0];
  }

  async deleteArticle(id: number): Promise<boolean> {
    await this.db.delete(articles).where(eq(articles.id, id));
    return true;
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return await this.db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);
  }

  async createContactMessage(
    message: InsertContactMessage
  ): Promise<ContactMessage> {
    const [inserted] = await this.db
      .insert(contactMessages)
      .values(message as any)
      .returning();
    return inserted;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    await this.db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id));
    return true;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    await this.db.delete(contactMessages).where(eq(contactMessages.id, id));
    return true;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [inserted] = await this.db
      .insert(users)
      .values(insertUser as any)
      .returning();
    return inserted;
  }
}

export const storage = new PostgresStorage();
