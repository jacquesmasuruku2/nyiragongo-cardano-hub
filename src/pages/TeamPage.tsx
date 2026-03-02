import { Linkedin, Twitter } from "lucide-react";
import teamBaudouin from "@/assets/team-baudouin.jpg";

const teamMembers = [
  {
    name: "Baudouin Muvunga",
    role: "Leader du Hub",
    bio: "Coordinateur principal et mentor communautaire, engagé dans l'adoption de Cardano en RDC.",
    image: teamBaudouin,
    linkedin: "https://www.linkedin.com/in/cardano-nyiragongo-522b38379/",
    twitter: "https://x.com/CARD_Nyiragongo",
  },
];

const TeamPage = () => {
  return (
    <div>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Notre Équipe</h1>
          <p className="text-muted-foreground max-w-2xl">
            Les membres clés qui portent la vision du Cardano Nyiragongo Hub.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-border bg-card p-6 text-center shadow-card hover:border-primary/30 transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-accent font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
