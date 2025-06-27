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
