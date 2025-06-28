import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Articles from "@/pages/articles";
import ArticleDetail from "@/pages/article-detail";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import AdminLogin from "./pages/admin-login";
import { FlyingStarsBackground } from "@/components/ui/flying-stars-background";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { Footer } from "@/components/ui/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/articles" component={Articles} />
      <Route path="/article" component={ArticleDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground relative">
            <FlyingStarsBackground />
            <div className="relative z-10">
              <Navigation />
              <main className="pt-16">
                <Router />
              </main>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
      <BackToTopButton />
      <Footer />
    </QueryClientProvider>
  );
}

export default App;
