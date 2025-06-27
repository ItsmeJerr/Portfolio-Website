import { Instagram, Github, Youtube } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} mbalffajry. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a
            href="https://instagram.com/mbalffa.jry"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/ItsmeJerr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com/@mbalffajry"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-primary transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
