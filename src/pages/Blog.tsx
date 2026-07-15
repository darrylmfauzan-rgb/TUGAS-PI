import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import articlesData from "@/data/articles.json";
import * as Icons from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Home
            </Button>
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">Blog & Artikel</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Panduan, dan inspirasi untuk liburan sempurna di Puncak
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesData.map((article) => {
              const IconComponent = Icons[
                article.icon as keyof typeof Icons
              ] as React.ComponentType<{ className?: string }>;
              return (
                <Card
                  key={article.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
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
                      <p className="text-sm text-white/80 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-white mb-4 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="prose prose-sm max-w-none text-sm mb-4 text-white/80 line-clamp-4">
                        {article.content.substring(0, 200)}...
                      </div>
                      <Link to={`/blog/${article.id}`}>
                        <Button
                          variant="ghost"
                          className="w-full group/btn text-white border border-white/50 bg-white/10 hover:border-white hover:bg-white/20"
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
        </div>
      </div>
    </div>
  );
};

export default Blog;
