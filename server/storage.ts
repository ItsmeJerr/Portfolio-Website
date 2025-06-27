import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
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

export class MySQLStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    // Parse connection string
    const connectionString =
      process.env.DATABASE_URL ||
      "mysql://root:010304@localhost:3306/portfolio_db";
    const url = new URL(connectionString);

    const pool = mysql.createPool({
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading slash
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.db = drizzle(pool);
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
        .set(profileData)
        .where(eq(profile.id, existingProfile.id));
      const updated = await this.getProfile();
      return updated!;
    } else {
      const insertResult = await this.db
        .insert(profile)
        .values(profileData)
        .$returningId();
      const inserted = await this.db
        .select()
        .from(profile)
        .where(eq(profile.id, insertResult.insertId));
      return inserted[0];
    }
  }

  // Skills methods
  async getSkills(): Promise<Skill[]> {
    return await this.db.select().from(skills).orderBy(skills.proficiency);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const insertResult = await this.db
      .insert(skills)
      .values(skill)
      .$returningId();
    const inserted = await this.db
      .select()
      .from(skills)
      .where(eq(skills.id, insertResult.insertId));
    return inserted[0];
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
    const result = await this.db.delete(skills).where(eq(skills.id, id));
    return result.affectedRows > 0;
  }

  // Experience methods
  async getExperiences(): Promise<Experience[]> {
    const result = await this.db
      .select()
      .from(experiences)
      .orderBy(experiences.startDate);
    // Parse images JSON ke array
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
    // Pastikan images selalu string JSON
    const expToSave = {
      ...experience,
      images:
        typeof experience.images === "string"
          ? experience.images
          : JSON.stringify(experience.images || []),
    };
    const insertResult = await this.db
      .insert(experiences)
      .values(expToSave)
      .$returningId();
    const inserted = await this.db
      .select()
      .from(experiences)
      .where(eq(experiences.id, insertResult.insertId));
    return {
      ...inserted[0],
      images:
        inserted[0].images &&
        typeof inserted[0].images === "string" &&
        inserted[0].images.trim().startsWith("[")
          ? JSON.parse(inserted[0].images)
          : [],
    };
  }

  async updateExperience(
    id: number,
    experience: Partial<InsertExperience>
  ): Promise<Experience | undefined> {
    // Pastikan images selalu string JSON
    const expToSave = {
      ...experience,
      images:
        typeof experience.images === "string"
          ? experience.images
          : JSON.stringify(experience.images || []),
    };
    await this.db
      .update(experiences)
      .set(expToSave)
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
    const result = await this.db
      .delete(experiences)
      .where(eq(experiences.id, id));
    return result.affectedRows > 0;
  }

  // Education methods
  async getEducation(): Promise<Education[]> {
    return await this.db.select().from(education).orderBy(education.year);
  }

  async createEducation(educationData: InsertEducation): Promise<Education> {
    const insertResult = await this.db
      .insert(education)
      .values(educationData)
      .$returningId();
    const inserted = await this.db
      .select()
      .from(education)
      .where(eq(education.id, insertResult.insertId));
    return inserted[0];
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
    const result = await this.db.delete(education).where(eq(education.id, id));
    return result.affectedRows > 0;
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
    const insertResult = await this.db
      .insert(certifications)
      .values(certification)
      .$returningId();
    const inserted = await this.db
      .select()
      .from(certifications)
      .where(eq(certifications.id, insertResult.insertId));
    return inserted[0];
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
    const result = await this.db
      .delete(certifications)
      .where(eq(certifications.id, id));
    return result.affectedRows > 0;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return await this.db.select().from(activities);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const insertResult = await this.db
      .insert(activities)
      .values(activity)
      .$returningId();
    const inserted = await this.db
      .select()
      .from(activities)
      .where(eq(activities.id, insertResult.insertId));
    return inserted[0];
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
    const result = await this.db
      .delete(activities)
      .where(eq(activities.id, id));
    return result.affectedRows > 0;
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
    const insertResult = await this.db
      .insert(articles)
      .values(article)
      .$returningId();
    const inserted = await this.db
      .select()
      .from(articles)
      .where(eq(articles.id, insertResult.insertId));
    return inserted[0];
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
    const result = await this.db.delete(articles).where(eq(articles.id, id));
    return result.affectedRows > 0;
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
    const insertResult = await this.db
      .insert(contactMessages)
      .values(message)
      .$returningId();
    const inserted = await this.db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, insertResult.insertId));
    return inserted[0];
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    await this.db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id));
    return true;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await this.db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id));
    return result.affectedRows > 0;
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
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }
}

export const storage = new MySQLStorage();
