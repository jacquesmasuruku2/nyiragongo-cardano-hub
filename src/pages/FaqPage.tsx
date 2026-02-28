import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Qu'est-ce que le Cardano Nyiragongo Hub ?",
    answer:
      "Le Cardano Nyiragongo Hub est un espace communautaire dédié à l'apprentissage, à l'innovation et à la collaboration autour de la blockchain Cardano. Nous équipons les jeunes, étudiants et entrepreneurs locaux pour participer activement à l'écosystème mondial du Web3.",
  },
  {
    question: "Qui peut participer aux activités du Hub ?",
    answer:
      "Tout le monde est le bienvenu ! Que vous soyez étudiant, développeur, entrepreneur ou simplement curieux de la technologie blockchain, nos événements et formations sont ouverts à tous, sans prérequis technique.",
  },
  {
    question: "Comment participer à un hackathon ?",
    answer:
      "Suivez notre page Événements pour les prochains hackathons. Inscrivez-vous via le formulaire en ligne ou contactez-nous directement. Les hackathons sont gratuits et ouverts à tous les niveaux.",
  },
  {
    question: "Qu'est-ce que Cardano ?",
    answer:
      "Cardano est une plateforme blockchain de troisième génération, conçue pour être plus sécurisée, évolutive et durable. Elle utilise un mécanisme de consensus par preuve d'enjeu (Proof of Stake) et est développée selon une approche scientifique rigoureuse.",
  },
  {
    question: "Qu'est-ce que Midnight ?",
    answer:
      "Midnight est un protocole de protection des données construit sur Cardano. Il permet aux développeurs de créer des applications décentralisées qui protègent les informations sensibles tout en permettant la conformité réglementaire.",
  },
  {
    question: "Les formations sont-elles gratuites ?",
    answer:
      "Oui, la majorité de nos masterclass et formations sont gratuites. Certains événements spéciaux peuvent avoir des frais d'inscription minimes pour couvrir les coûts logistiques.",
  },
  {
    question: "Comment puis-je soutenir le Hub ?",
    answer:
      "Vous pouvez soutenir le Hub en participant à nos événements, en partageant nos publications sur les réseaux sociaux, en proposant des collaborations ou en nous contactant pour des partenariats via la page Contact.",
  },
  {
    question: "Où se trouve le Hub ?",
    answer:
      "Le Cardano Nyiragongo Hub est situé au N°752, Not. MAPENDO, TURUNGA, Nyiragongo, République Démocratique du Congo.",
  },
];

const FaqPage = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Foire Aux Questions</h1>
          <p className="text-muted-foreground text-lg">
            Retrouvez les réponses aux questions les plus fréquentes sur le Hub, la participation et les hackathons.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-5 bg-card">
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqPage;
