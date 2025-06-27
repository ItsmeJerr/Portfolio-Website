import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendContactEmail, sendAutoReply } from "./email";
import {
  insertProfileSchema,
  insertSkillSchema,
  insertExperienceSchema,
  insertEducationSchema,
  insertCertificationSchema,
  insertActivitySchema,
  insertArticleSchema,
  insertContactMessageSchema,
} from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storageMulter = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skillData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, skillData);
      if (skill) {
        res.json(skill);
      } else {
        res.status(404).json({ message: "Skill not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSkill(id);
      if (deleted) {
        res.json({ message: "Skill deleted successfully" });
      } else {
        res.status(404).json({ message: "Skill not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Experiences routes
  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      console.error("Error GET /api/experiences:", error);
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  app.post("/api/experiences", async (req, res) => {
    try {
      const experienceData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(experienceData);
      res.json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.put("/api/experiences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experienceData = insertExperienceSchema.partial().parse(req.body);
      const experience = await storage.updateExperience(id, experienceData);
      if (experience) {
        res.json(experience);
      } else {
        res.status(404).json({ message: "Experience not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.delete("/api/experiences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteExperience(id);
      if (deleted) {
        res.json({ message: "Experience deleted successfully" });
      } else {
        res.status(404).json({ message: "Experience not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  // Education routes
  app.get("/api/education", async (req, res) => {
    try {
      const education = await storage.getEducation();
      res.json(education);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education" });
    }
  });

  app.post("/api/education", async (req, res) => {
    try {
      const educationData = insertEducationSchema.parse(req.body);
      const education = await storage.createEducation(educationData);
      res.json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.put("/api/education/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const educationData = insertEducationSchema.partial().parse(req.body);
      const education = await storage.updateEducation(id, educationData);
      if (education) {
        res.json(education);
      } else {
        res.status(404).json({ message: "Education not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.delete("/api/education/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEducation(id);
      if (deleted) {
        res.json({ message: "Education deleted successfully" });
      } else {
        res.status(404).json({ message: "Education not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete education" });
    }
  });

  // Certifications routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getCertifications();
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const certificationData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(
        certificationData
      );
      res.json(certification);
    } catch (error) {
      res.status(400).json({ message: "Invalid certification data" });
    }
  });

  app.put("/api/certifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const certificationData = insertCertificationSchema
        .partial()
        .parse(req.body);
      const certification = await storage.updateCertification(
        id,
        certificationData
      );
      if (certification) {
        res.json(certification);
      } else {
        res.status(404).json({ message: "Certification not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid certification data" });
    }
  });

  app.delete("/api/certifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCertification(id);
      if (deleted) {
        res.json({ message: "Certification deleted successfully" });
      } else {
        res.status(404).json({ message: "Certification not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete certification" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activityData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(id, activityData);
      if (activity) {
        res.json(activity);
      } else {
        res.status(404).json({ message: "Activity not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.delete("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteActivity(id);
      if (deleted) {
        res.json({ message: "Activity deleted successfully" });
      } else {
        res.status(404).json({ message: "Activity not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete activity" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const published = req.query.published === "true";
      const featured = req.query.featured === "true";

      let articles;
      if (featured) {
        articles = await storage.getFeaturedArticles();
      } else if (published) {
        articles = await storage.getPublishedArticles();
      } else {
        articles = await storage.getArticles();
      }

      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (article) {
        res.json(article);
      } else {
        res.status(404).json({ message: "Article not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const articleData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, articleData);
      if (article) {
        res.json(article);
      } else {
        res.status(404).json({ message: "Article not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteArticle(id);
      if (deleted) {
        res.json({ message: "Article deleted successfully" });
      } else {
        res.status(404).json({ message: "Article not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Contact messages routes
  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  app.post("/api/contact-messages", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);

      // Kirim response ke client SEBELUM proses email
      res.json({
        success: true,
        message: "Pesan berhasil dikirim!",
        data: message,
      });

      // Proses email di background (tidak mempengaruhi response)
      sendContactEmail(messageData)
        .then(() => console.log("Email contact berhasil dikirim"))
        .catch((emailError) =>
          console.error("Error mengirim email contact:", emailError)
        );

      sendAutoReply(messageData.email, messageData.firstName)
        .then(() => console.log("Auto-reply berhasil dikirim"))
        .catch((autoReplyError) =>
          console.error("Error mengirim auto-reply:", autoReplyError)
        );
    } catch (error) {
      console.error("Error dalam contact-messages:", error);
      res
        .status(400)
        .json({ message: "Gagal mengirim pesan", error: error.message });
    }
  });

  app.put("/api/contact-messages/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const marked = await storage.markMessageAsRead(id);
      if (marked) {
        res.json({ message: "Message marked as read" });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.delete("/api/contact-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContactMessage(id);
      if (deleted) {
        res.json({ message: "Message deleted successfully" });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Endpoint upload gambar
  app.post("/api/upload-image", storageMulter.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Serve static uploads
import express from "express";
export function serveUploads(app: Express) {
  app.use("/uploads", express.static(uploadDir));
}
