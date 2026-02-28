import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center font-bold text-sm text-primary-foreground">C</div>
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
                { label: "Newsletter", path: "/newsletter" },
                { label: "Contact", path: "/contact" },
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
              <div className="flex gap-4 pt-2">
                <a href="https://x.com/CARD_Nyiragongo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  X / Twitter
                </a>
                <a href="https://www.linkedin.com/in/cardano-nyiragongo-522b38379/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Cardano Nyiragongo Hub. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
