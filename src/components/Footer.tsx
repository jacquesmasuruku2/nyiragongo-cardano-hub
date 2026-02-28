import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simuler l'inscription à la newsletter
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Inscription réussie !",
        description: `Merci ${formData.name}, vous êtes maintenant inscrit à notre newsletter.`,
      });
      
      setFormData({ name: "", email: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Cardano Nyiragongo Hub" className="h-8 w-auto" />
              <span className="text-lg font-bold">Cardano Nyiragongo Hub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecter Nyiragongo au futur du Web3 avec Cardano. Un espace communautaire dédié à l'apprentissage et l'innovation blockchain.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Navigation</h4>
            <div className="space-y-2">
              {[
                { label: "Accueil", path: "/" },
                { label: "Blog", path: "/articles" },
                { label: "Événements", path: "/evenements" },
                { label: "Équipe", path: "/equipe" },
                { label: "FAQ", path: "/faq" },
                { label: "Galerie", path: "/galerie" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>N°752, Not. MAPENDO, TURUNGA</p>
              <p>Nyiragongo, RDC</p>
              <p>Téléphone : +243 975 652 545</p>
              <div className="flex gap-4 pt-2">
                <a href="https://x.com/CARD_Nyiragongo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  X / Twitter
                </a>
              </div>
              <div className="flex gap-4 pt-1">
                <a href="https://www.linkedin.com/in/cardano-nyiragongo-522b38379/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </div>
              <div className="flex gap-4 pt-1">
                <a href="tel:+243975652545" className="hover:text-primary transition-colors">
                  +243 975 652 545
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Restez informé de nos dernières actualités et événements.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full"
                disabled={isSubmitting}
              />
              <Input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
            <div>© 2026 Cardano Nyiragongo Hub. Tous droits réservés.</div>
            <div>
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Politique de confidentialité
              </Link>
            </div>
            <div>
              Designed by{' '}
              <a href="mailto:masudatabusiness@gmail.com" className="hover:text-primary transition-colors">
                Masu Data Business
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
