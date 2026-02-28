import { useState } from "react";
import { Link } from "react-router-dom";
import { articles, categories } from "@/data/articles";

const ArticlesPage = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = activeCategory === "Tous" ? articles : articles.filter((a) => a.category === activeCategory);

  return (
    <div>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Articles & Blog</h1>
          <p className="text-muted-foreground max-w-2xl">
            Actualités, tutoriels et récits d'événements de la communauté Cardano à Nyiragongo.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((article) => (
              <Link
                to={`/articles/${article.id}`}
                key={article.id}
                className="group rounded-xl border border-border bg-card shadow-card hover:border-primary/30 transition-all overflow-hidden"
              >
                {article.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{article.summary}</p>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Aucun article dans cette catégorie pour le moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticlesPage;
