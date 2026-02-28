import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const NewsletterPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", interest: "Hackathon" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscription réussie !",
      description: "Merci de rejoindre notre communauté. Vous recevrez bientôt nos actualités.",
    });
    setForm({ name: "", email: "", interest: "Hackathon" });
  };

  return (
    <div>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Newsletter</h1>
          <p className="text-muted-foreground max-w-2xl">
            Rejoignez notre newsletter et recevez toutes les actualités du Cardano Nyiragongo Hub directement dans votre boîte mail !
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-8 shadow-card">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Votre nom"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Intérêt principal</label>
              <select
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Hackathon</option>
                <option>Masterclass</option>
                <option>Articles</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-gradient-hero border-0 hover:opacity-90">
              S'inscrire
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default NewsletterPage;
