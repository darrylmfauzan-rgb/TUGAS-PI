import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import articlesData from "@/data/articles.json";
import * as Icons from "lucide-react";

const BlogArticle = () => {
  const { id } = useParams();
  const article = articlesData.find((a) => a.id === Number(id));

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Artikel tidak ditemukan</h1>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = Icons[
    article.icon as keyof typeof Icons
  ] as React.ComponentType<{ className?: string }>;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Blog
            </Button>
          </Link>

          <article className="bg-card rounded-lg p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {article.date}
                </p>
              </div>
            </div>

            <p className="text-xl text-muted-foreground mb-8 italic border-l-4 border-primary pl-4">
              {article.excerpt}
            </p>

            <div className="prose prose-lg max-w-none">
              {article.content.split("\n").map((paragraph, index) => {
                if (paragraph.trim() === "") return null;

                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                      {paragraph.replace(/\*\*/g, "")}
                    </h2>
                  );
                }

                if (paragraph.trim().match(/^\d+\./)) {
                  return (
                    <p key={index} className="mb-4 text-foreground">
                      {paragraph}
                    </p>
                  );
                }

                if (paragraph.startsWith("-")) {
                  return (
                    <li key={index} className="ml-6 mb-2 text-foreground">
                      {paragraph.substring(1).trim()}
                    </li>
                  );
                }

                return (
                  <p
                    key={index}
                    className="mb-4 text-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>

          <div className="mt-12 text-center">
            <Link to="/blog">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Lihat Artikel Lainnya
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;
