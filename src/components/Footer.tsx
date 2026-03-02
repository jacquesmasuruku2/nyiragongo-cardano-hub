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
                <a href="https://x.com/CARD_Nyiragongo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X / Twitter
                </a>
              </div>
              <div className="flex gap-4 pt-1">
                <a href="https://www.linkedin.com/in/cardano-nyiragongo-522b38379/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
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
