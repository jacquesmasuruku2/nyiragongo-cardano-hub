import { Link } from "react-router-dom";
import { ArrowRight, Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.jpg";
import eventHackathon from "@/assets/event-hackathon.jpg";
import eventMasterclass from "@/assets/event-masterclass.jpg";
import teamBaudouin from "@/assets/team-baudouin.jpg";
import { useState, useEffect } from "react";

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(0.8);

  const { data: events } = useQuery({
    queryKey: ["events-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("id, reserved_seats");
      if (error) throw error;
      return data;
    },
  });

  // Images et contenus associés pour le hero
  const heroContent = [
    {
      image: heroBanner,
      badge: "Communauté Blockchain à Nyiragongo",
      title: "Connecter Nyiragongo au futur du Web3 avec Cardano",
      description: "Le Cardano Nyiragongo Hub est un espace communautaire dédié à l'apprentissage, à l'innovation et à la collaboration autour de la blockchain Cardano."
    },
    {
      image: eventHackathon,
      badge: "Innovation Technologique",
      title: "Transformez vos idées en prototypes sur Cardano",
      description: "Participez à nos hackathons pour développer des solutions innovantes et contribuer à l'écosystème blockchain africain."
    },
    {
      image: eventMasterclass,
      badge: "Formation Expertise",
      title: "Maîtrisez le développement Smart Contracts",
      description: "Apprenez à créer des contrats intelligents sécurisés avec Plutus et Aiken lors de nos masterclasses techniques."
    },
    {
      image: teamBaudouin,
      badge: "Leadership Communautaire",
      title: "Rejoignez une communauté passionnée",
      description: "Connectez-vous avec des experts, développeurs et entrepreneurs qui partagent votre vision pour le Web3 en Afrique."
    }
  ];

  // Changer d'image dynamiquement toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animation d'opacité entre les images
  useEffect(() => {
    setImageOpacity(0.8); // 80% d'opacité pour un bon équilibre
  }, [currentImageIndex]);

  const totalEvents = events?.length ?? 0;
  const totalBeneficiaries = 150;
  const currentContent = heroContent[currentImageIndex];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* Image dynamique avec opacité de 80% */}
          <img 
            src={currentContent.image} 
            alt="Cardano Nyiragongo Hub community" 
            className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
            style={{ opacity: imageOpacity }}
          />
          {/* Réduire les overlays pour plus de visibilité */}
          <div className="absolute inset-0 bg-background/30 backdrop-blur-none" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)" }} />
        </div>

        <div className="container relative mx-auto px-4 py-20">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              {currentContent.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {currentContent.title.split(' ').map((word, index) => 
                word === 'Web3' || word === 'Cardano' || word === 'prototypes' || word === 'Smart' || word === 'Contracts' || word === 'communauté' 
                  ? <span key={index} className="text-gradient">{word} </span> 
                  : word + ' '
              )}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              {currentContent.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="btn-primary">
                <Link to="/articles">
                  Lire nos blogs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-secondary">
                <Link to="/evenements">Voir les événements</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-accent" />
              <p className="text-3xl font-bold text-gradient">{totalEvents}</p>
              <p className="text-sm text-muted-foreground mt-1">Événements organisés</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-3xl font-bold text-gradient">{totalBeneficiaries}+</p>
              <p className="text-sm text-muted-foreground mt-1">Étudiants formés</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-accent" />
              <p className="text-3xl font-bold text-gradient">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Événements gratuits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Communauté",
                desc: "Nous équipons les jeunes, étudiants et entrepreneurs locaux pour participer activement à l'écosystème mondial du Web3.",
              },
              {
                icon: BookOpen,
                title: "Formation",
                desc: "Des masterclass, ateliers techniques et sessions de mentorat pour maîtriser la blockchain Cardano.",
              },
              {
                icon: Calendar,
                title: "Événements",
                desc: "Hackathons, meetups et conférences pour connecter la communauté locale à l'écosystème Cardano international.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border bg-card p-8 shadow-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez le mouvement</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Participez à la construction du Web3 en Afrique. Que vous soyez développeur, étudiant ou entrepreneur, il y a une place pour vous.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="btn-primary">
              <Link to="/contact">Nous rejoindre</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/equipe">Découvrir l'équipe</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
