import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { articles } from "@/data/articles";
import { ArrowLeft, Twitter, Linkedin, Facebook, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const article = articles.find((a) => a.id === Number(id));
  const { toast } = useToast();

  const [comments, setComments] = useState<{ name: string; text: string; date: string }[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  if (!article) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Article introuvable</h1>
        <Link to="/articles" className="text-primary hover:underline">
          ← Retour au blog
        </Link>
      </section>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(currentUrl);

  const shareLinks = [
    {
      label: "X",
      icon: Twitter,
      url: `https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      label: "Discord",
      icon: MessageCircle,
      url: `https://discord.com/channels/@me`,
    },
  ];

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setComments((prev) => [
      { name: name.trim(), text: text.trim(), date: new Date().toLocaleDateString("fr-FR") },
      ...prev,
    ]);
    setName("");
    setText("");
    toast({ title: "Commentaire ajouté", description: "Merci pour votre contribution !" });
  };

  // Render markdown-like content
  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-foreground">
            {block.replace("## ", "")}
          </h2>
        );
      }
      if (block.startsWith("### ")) {
        return (
          <h3 key={i} className="text-xl font-semibold mt-6 mb-3 text-foreground">
            {block.replace("### ", "")}
          </h3>
        );
      }
      if (block.startsWith("> ")) {
        return (
          <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
            {block.replace("> ", "")}
          </blockquote>
        );
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc pl-6 space-y-2 my-4 text-muted-foreground">
            {items.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: item.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
            ))}
          </ul>
        );
      }
      if (block.match(/^\d+\./)) {
        const items = block.split("\n").filter((l) => l.match(/^\d+\./));
        return (
          <ol key={i} className="list-decimal pl-6 space-y-2 my-4 text-muted-foreground">
            {items.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
            ))}
          </ol>
        );
      }
      return (
        <p key={i} className="text-muted-foreground leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
      );
    });
  };

  return (
    <article className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back link */}
        <Link to="/articles" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Retour au blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-muted-foreground">{article.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">{article.title}</h1>
          <p className="text-lg text-muted-foreground">{article.summary}</p>
        </header>

        {/* Article image */}
        {article.image && (
          <div className="rounded-xl overflow-hidden mb-10 border border-border">
            <img src={article.image} alt={article.title} className="w-full h-auto object-cover max-h-[400px]" />
          </div>
        )}

        {/* Content */}
        <div className="prose-custom">{renderContent(article.content)}</div>

        {/* Share */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold mb-4">Partager cet article</h3>
          <div className="flex flex-wrap gap-3">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold mb-6">
            Commentaires ({comments.length})
          </h3>

          <form onSubmit={handleComment} className="space-y-4 mb-10">
            <Input
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-card"
              maxLength={100}
            />
            <Textarea
              placeholder="Écrivez votre commentaire..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-card min-h-[100px]"
              maxLength={1000}
            />
            <Button type="submit" className="gap-2">
              <Send className="w-4 h-4" /> Publier
            </Button>
          </form>

          {comments.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">
              Soyez le premier à commenter cet article !
            </p>
          )}

          <div className="space-y-6">
            {comments.map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.date}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetailPage;
