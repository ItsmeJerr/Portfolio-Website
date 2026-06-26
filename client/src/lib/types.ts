// Data models (client-safe, no Drizzle)
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Profile {
  id: number;
  fullName: string;
  position: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  age?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  description?: string;
  createdAt?: Date;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
  technologies?: string;
  images?: string;
  createdAt?: Date;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
  description?: string;
  gpa?: string;
  image?: string;
  createdAt?: Date;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
  createdAt?: Date;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
  createdAt?: Date;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  imageUrl?: string;
  image?: string;
  url?: string;
  published: boolean;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
}

// Insert types
export type InsertUser = Omit<User, "id">;
export type InsertProfile = Omit<Profile, "id" | "createdAt" | "updatedAt">;
export type InsertSkill = Omit<Skill, "id" | "createdAt">;
export type InsertExperience = Omit<Experience, "id" | "createdAt">;
export type InsertEducation = Omit<Education, "id" | "createdAt">;
export type InsertCertification = Omit<Certification, "id" | "createdAt">;
export type InsertActivity = Omit<Activity, "id" | "createdAt">;
export type InsertArticle = Omit<Article, "id" | "createdAt" | "updatedAt">;
export type InsertContactMessage = Omit<ContactMessage, "id" | "isRead" | "createdAt">;

// UI/UX types
export interface SkillCategory {
  name: string;
  color: string;
  icon: string;
}

export const skillCategories: SkillCategory[] = [
  { name: "Frontend Development", color: "blue", icon: "fas fa-code" },
  { name: "Backend Development", color: "green", icon: "fas fa-server" },
  { name: "UI/UX Design", color: "purple", icon: "fas fa-palette" },
  { name: "DevOps & Cloud", color: "orange", icon: "fas fa-cloud" },
  { name: "Mobile Development", color: "indigo", icon: "fas fa-mobile-alt" },
  { name: "Soft Skills", color: "rose", icon: "fas fa-users" },
];

export const getSkillCategoryConfig = (category: string): SkillCategory => {
  return skillCategories.find(cat => cat.name === category) || skillCategories[0];
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "Present";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return as-is if not a valid date
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
