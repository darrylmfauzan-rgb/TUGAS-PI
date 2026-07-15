import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import articlesData from "@/data/articles.json";
import * as Icons from "lucide-react";

export const BlogPreviewSection = () => {
  return (
    <section
      id="blog-section"
      style={{ scrollMarginTop: "5rem" }}
      className="py-20 bg-gradient-to-b from-background to-accent/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Blog & Artikel</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Panduan lengkap untuk membuat liburan Anda di Puncak lebih berkesan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {articlesData.slice(0, 3).map((article) => {
            const IconComponent = Icons[
              article.icon as keyof typeof Icons
            ] as React.ComponentType<{ className?: string }>;
            return (
              <Card
                key={article.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{ backgroundImage: `url(${article.image})` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-white">
                      {article.title}
                    </CardTitle>
                    <p className="text-sm text-white/80">{article.date}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white mb-4">{article.excerpt}</p>
                    <Link to={`/blog/${article.id}`}>
                      <Button
                        variant="ghost"
                        className="group/btn p-0 h-auto text-white bg-white/10 hover:bg-white/20"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button size="lg" className="group">
              Lihat Semua Artikel
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
