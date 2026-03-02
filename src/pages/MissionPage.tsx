import { Target, Heart, Globe, Lightbulb } from "lucide-react";

const MissionPage = () => {
  return (
    <div>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Notre Mission</h1>
          <p className="text-muted-foreground max-w-2xl">
            Découvrez pourquoi et comment nous œuvrons pour démocratiser la blockchain Cardano dans la région de Nyiragongo.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {[
            {
              icon: Target,
              title: "Notre Vision",
              desc: "Faire de Nyiragongo un pôle d'innovation blockchain en Afrique, où chaque jeune a accès aux outils et connaissances pour participer à l'économie numérique mondiale via Cardano.",
            },
            {
              icon: Heart,
              title: "Nos Valeurs",
              desc: "Inclusion, éducation et collaboration. Nous croyons que la technologie blockchain doit être accessible à tous, indépendamment du niveau socio-économique. Chaque événement est gratuit et ouvert à la communauté.",
            },
            {
              icon: Globe,
              title: "Impact Local, Portée Mondiale",
              desc: "En formant les jeunes et étudiants de Nyiragongo aux technologies Web3, nous contribuons à connecter notre communauté locale à l'écosystème Cardano international et à créer des opportunités économiques durables.",
            },
            {
              icon: Lightbulb,
              title: "Notre Approche",
              desc: "À travers des hackathons, masterclass et ateliers pratiques, nous offrons un apprentissage immersif qui permet aux participants de passer de la théorie à la pratique, en développant des projets concrets sur la blockchain Cardano.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-6 items-start rounded-xl border border-border bg-card p-8 shadow-card">
              <div className="shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MissionPage;
