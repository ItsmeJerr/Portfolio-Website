import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, ExternalLink } from "lucide-react";
import type { Article } from "@shared/schema";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useState } from "react";
import { Link, useLocation } from "wouter";

function LoadingSkeleton() {
  return (
    <div className="space-y-12">
      {/* Featured Article Skeleton */}
      <div className="gradient-primary p-8 rounded-2xl text-white">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Skeleton className="h-6 w-20 mb-4 bg-white/20" />
            <Skeleton className="h-8 w-3/4 mb-4 bg-white/20" />
            <Skeleton className="h-4 w-full mb-2 bg-white/20" />
            <Skeleton className="h-4 w-2/3 mb-6 bg-white/20" />
            <Skeleton className="h-4 w-32 mb-6 bg-white/20" />
            <Skeleton className="h-12 w-32 bg-white/20" />
          </div>
          <Skeleton className="h-64 w-full bg-white/20 rounded-xl" />
        </div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <Skeleton className="h-5 w-16 mr-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Articles() {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles?published=true"],
  });

  const { data: featuredArticles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles?featured=true"],
  });

  const regularArticles = articles.filter((article) => !article.featured);
  const [displayCount, setDisplayCount] = useState(6);
  const [, setLocation] = useLocation();

  const displayedArticles = regularArticles.slice(0, displayCount);
  const hasMoreArticles = displayCount < regularArticles.length;

  const handleReadArticle = (article: Article) => {
    if (article.url && article.url.startsWith("http")) {
      window.open(article.url, "_blank");
    } else {
      setLocation(`/article?slug=${article.slug}`);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  const sectionReveal = useScrollReveal();

  const [previewImg, setPreviewImg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Articles & Insights
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sharing knowledge and experiences about web development, design,
              and technology trends
            </p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 ${sectionReveal.className}`}
          ref={sectionReveal.ref}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Articles & Insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sharing knowledge and experiences about web development, design, and
            technology trends
          </p>
        </div>
        {/* Featured Articles List */}
        {featuredArticles.length > 0 && (
          <div
            className={sectionReveal.className + " mb-12"}
            ref={sectionReveal.ref}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Featured Articles
            </h2>
            <div className="flex flex-col gap-8">
              {featuredArticles.map((fa) => (
                <div
                  key={fa.id}
                  className="gradient-primary p-8 rounded-2xl text-white flex flex-col md:flex-row gap-8 items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl group"
                >
                  <div className="flex-1">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">
                      Featured
                    </Badge>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                      {fa.title}
                    </h2>
                    <p className="text-white/90 mb-6">{fa.excerpt}</p>
                    <div className="flex items-center text-sm text-white/80 mb-6">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(fa.createdAt!).toLocaleDateString()}
                      </span>
                      <Clock className="h-4 w-4 ml-4 mr-2" />
                      <span>{fa.readTime} min read</span>
                    </div>
                    <Button
                      className="bg-white text-primary hover:bg-white/90"
                      onClick={() => handleReadArticle(fa)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </div>
                  <div className="flex-1">
                    {fa.imageUrl && (
                      <img
                        src={fa.imageUrl}
                        alt={fa.title}
                        className="rounded-xl shadow-lg w-full h-auto transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                        onClick={() => setPreviewImg(fa.imageUrl)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedArticles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden transition-transform duration-300 group hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                    onClick={() => setPreviewImg(article.imageUrl)}
                  />
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Badge variant="secondary" className="mr-2">
                    {article.category}
                  </Badge>
                  <span>
                    {new Date(article.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {article.readTime} min read
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    onClick={() => handleReadArticle(article)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {article.url && article.url.startsWith("http")
                      ? "Read"
                      : "Read More"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreArticles && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={handleLoadMore}
            >
              Load More Articles ({regularArticles.length - displayCount}{" "}
              remaining)
            </Button>
          </div>
        )}

        {/* Show all loaded message */}
        {!hasMoreArticles && regularArticles.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              All articles have been displayed ({regularArticles.length}{" "}
              articles)
            </p>
          </div>
        )}

        {/* Empty State */}
        {articles.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Articles Yet
            </h3>
            <p className="text-muted-foreground">
              Articles will appear here once published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
