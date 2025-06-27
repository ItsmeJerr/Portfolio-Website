import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { Menu, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Artikel" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            `relative transition-colors duration-200
            ${
              mobile
                ? "block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                : "text-sm font-medium hover:text-primary"
            }
            ${
              location === item.href
                ? mobile
                  ? "bg-accent text-accent-foreground"
                  : "text-primary"
                : mobile
                ? "text-muted-foreground"
                : "text-muted-foreground"
            }
            after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left`,
            "transition-transform duration-200 hover:scale-105 hover:underline hover:underline-offset-8 hover:decoration-primary"
          )}
          onClick={mobile ? () => setIsOpen(false) : undefined}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <NavLinks />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-1 mt-6">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
