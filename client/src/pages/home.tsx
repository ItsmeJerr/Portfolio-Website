import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Heart,
  ExternalLink,
} from "lucide-react";
import type {
  Profile,
  Skill,
  Experience,
  Education,
  Certification,
  Activity,
} from "@shared/schema";
import { getSkillCategoryConfig } from "@/lib/types";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useState } from "react";

function LoadingSkeleton() {
  return (
    <div className="space-y-16">
      {/* Hero Skeleton */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const { data: profile, isLoading: profileLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: experiences = [], isLoading: experiencesLoading } = useQuery<
    Experience[]
  >({
    queryKey: ["/api/experiences"],
  });

  const { data: education = [], isLoading: educationLoading } = useQuery<
    Education[]
  >({
    queryKey: ["/api/education"],
  });

  const { data: certifications = [], isLoading: certificationsLoading } =
    useQuery<Certification[]>({
      queryKey: ["/api/certifications"],
    });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<
    Activity[]
  >({
    queryKey: ["/api/activities"],
  });

  const aboutReveal = useScrollReveal();
  const experienceReveal = useScrollReveal();
  const educationReveal = useScrollReveal();
  const activitiesReveal = useScrollReveal();

  const [previewImg, setPreviewImg] = useState<string | null>(null);

  if (profileLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreviewImg(null)}
        >
          <div
            className="relative max-w-2xl w-full flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-4 -right-4 bg-white rounded-full shadow p-1 text-black hover:bg-gray-200 z-10"
              onClick={() => setPreviewImg(null)}
              aria-label="Close preview"
            >
              ×
            </button>
            <img
              src={previewImg}
              alt="Preview"
              className="rounded-2xl max-h-[80vh] w-auto object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Hi, I am <span className="text-primary">Developer</span> &{" "}
                <span className="text-accent">Designer</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {profile?.bio ||
                  "Passionate about creating beautiful, functional, and user-centered digital experiences. Specializing in modern web development and interactive design."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get In Touch
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("skillset")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View My Work
                </Button>
              </div>
            </div>
            <div className="animate-slide-up">
              <img
                src={profile?.image || "/pp_bintang.png"}
                alt="Foto Bintang"
                className="rounded-2xl shadow-2xl w-full h-auto max-w-md mx-auto cursor-pointer"
                onClick={() =>
                  setPreviewImg(profile?.image || "/pp_bintang.png")
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutReveal.ref}
        className={`py-16 bg-background ${aboutReveal.className}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              About Me
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn more about my journey as an Informatics Engineering student,
              my passion for web development, IoT systems, and data analysis —
              and how I turn ideas into real, functional projects.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Full Name
                  </h3>
                  <p className="text-muted-foreground">
                    {profile?.fullName || "M. Bintang Alffajry"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Age</h3>
                  <p className="text-muted-foreground">
                    {profile?.age ? `${profile.age} Years Old` : "21 Years Old"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Location
                  </h3>
                  <p className="text-muted-foreground">
                    {profile?.location || "Bekasi, Indonesia"}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Position
                  </h3>
                  <p className="text-muted-foreground">
                    {profile?.position || "Developer & Designer"}
                  </p>
                </div>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Personal Statement
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {profile?.bio ||
                    "Hello! I'm M. Bintang Alffajry, a 4th-semester student majoring in Informatics Engineering. I have a strong interest in web development, IoT-based systems, and data analysis. I actively work on both academic and personal projects to enhance my practical skills and technical experience."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skillset" className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Skills & Expertise
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A collection of technologies and tools I use as an aspiring
              developer to build websites, smart systems, and data-driven
              solutions — from HTML to ESP32 and everything in between.
            </p>
          </div>

          {skillsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => {
                const config = getSkillCategoryConfig(skill.category);
                return (
                  <Card
                    key={skill.id}
                    className="hover:shadow-md transition-shadow duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div
                          className={`bg-${config.color}-100 dark:bg-${config.color}-900/20 p-3 rounded-lg w-fit`}
                        >
                          <i
                            className={`${config.icon} text-${config.color}-600 text-xl`}
                          />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {skill.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {skill.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <div className="bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section
        ref={experienceReveal.ref}
        className={`py-16 bg-background ${experienceReveal.className}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Work Experience
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Although I'm still a student, I've been actively involved in
              various academic and independent projects that simulate real-world
              challenges. These experiences have helped me strengthen my skills
              in web development, IoT, and team collaboration — laying a solid
              foundation for my professional journey ahead.
            </p>
          </div>

          {experiencesLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="relative pl-8 border-l-2 border-primary/20"
                >
                  <Skeleton className="absolute -left-2 top-0 w-4 h-4 rounded-full" />
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-1/3 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="relative pl-8 border-l-2 border-primary/20 group"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                  <Card className="transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden">
                    <CardContent className="p-6">
                      {/* Experience Images Grid */}
                      {Array.isArray(experience.images) &&
                        experience.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {experience.images.map(
                              (img: string, idx: number) => (
                                <div
                                  key={img}
                                  className="relative overflow-hidden rounded-lg cursor-pointer"
                                  onClick={() => setPreviewImg(img)}
                                >
                                  <img
                                    src={img}
                                    alt={`Experience ${idx + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg border transition-transform duration-300 group-hover:scale-110"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}
                      <div className="flex flex-wrap items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          {experience.title}
                        </h3>
                        <span className="text-primary font-medium">
                          {experience.startDate} -{" "}
                          {experience.endDate || "Present"}
                        </span>
                      </div>
                      <p className="text-accent font-medium mb-2">
                        {experience.company}
                      </p>
                      {experience.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {(typeof experience.technologies === "string"
                            ? experience.technologies
                                .split(",")
                                .map((tech) => tech.trim())
                            : experience.technologies
                          ).map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Education Section */}
      <section
        ref={educationReveal.ref}
        className={`py-16 bg-muted/30 ${educationReveal.className}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Education
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My academic journey in Informatics Engineering has shaped the
              foundation of my technical knowledge and critical thinking.
              Through coursework and hands-on projects, I continue to explore
              various areas in technology, including programming, IoT, and data
              systems.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Formal Education */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {education[0]?.degree || "Computer Science"}
                    </h3>
                    <p className="text-accent font-medium">
                      {education[0]?.institution || "University of Indonesia"}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">
                  {education[0]?.year || "2015 - 2019"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {education[0]?.description ||
                    "Focused on software engineering, data structures, algorithms, and web development. Final project: E-commerce platform with AI recommendations."}
                </p>
                {education[0]?.gpa && (
                  <p className="text-sm text-muted-foreground mt-2">
                    GPA: {education[0].gpa}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg mr-4">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Certifications
                    </h3>
                    <p className="text-accent font-medium">
                      Various seminars and leadership programs.
                    </p>
                  </div>
                </div>
                {certificationsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-foreground">{cert.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {cert.year}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section
        ref={activitiesReveal.ref}
        className={`py-16 bg-background ${activitiesReveal.className}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Activities & Interests
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Beyond coding, I enjoy exploring tech communities, contributing to
              team-based projects, and learning about new innovations in IoT and
              web development. I'm also passionate about design, open-source
              collaboration, and helping others through tech-based solutions.
            </p>
          </div>

          {activitiesLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-6 text-center">
                    {/* Activity Image */}
                    {activity.image ? (
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-24 h-24 object-cover rounded-xl mx-auto mb-4 border shadow-md cursor-pointer"
                        onClick={() => setPreviewImg(activity.image)}
                      />
                    ) : (
                      <div
                        className={`bg-${activity.color}-100 dark:bg-${activity.color}-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
                      >
                        <i
                          className={`${activity.icon} text-${activity.color}-600 text-xl`}
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-foreground mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {activity.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
