import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, ExternalLink, Phone, Navigation } from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-muted-foreground max-w-2xl">
            Posez vos questions ou proposez des collaborations. Nous serions ravis de vous entendre.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-8 shadow-card">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sujet</label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Sujet de votre message" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Votre message..." rows={5} required />
              </div>
              <Button type="submit" className="w-full bg-gradient-hero border-0 hover:opacity-90">
                Envoyer
              </Button>
            </form>

            {/* Info */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-sm text-muted-foreground">N°752, Not. MAPENDO, TURUNGA<br />Nyiragongo, RDC</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <a href="tel:+243975652545" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      +243 975 652 545
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Réseaux sociaux</h3>
                    <div className="space-y-2 mt-2">
                      <a href="https://x.com/CARD_Nyiragongo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" /> X / Twitter
                      </a>
                      <a href="https://www.linkedin.com/in/cardano-nyiragongo-522b38379/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" /> LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Localisation</h3>
                </div>
                <div className="rounded-lg overflow-hidden mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63800.0!2d29.2!3d-1.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca68f0b1fa4f5%3A0x0!2zMcKwMzAnMDAuMCJTIDI5wrAxMicwMC4wIkU!5e0!3m2!1sfr!2scd!4v1700000000000!5m2!1sfr!2scd"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Cardano Nyiragongo"
                  />
                </div>
                <a
                  href="https://share.google/4Fb4VXIth3Q4iSuyh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Navigation className="h-4 w-4" /> Suivre l'itinéraire sur Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
