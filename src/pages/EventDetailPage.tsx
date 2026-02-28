import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, MapPin, Users, User, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";

const fetchEvent = async (slug: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
};

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent(slug!),
    enabled: !!slug,
  });

  const reserveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("event_reservations").insert({
        event_id: event!.id,
        full_name: name,
        email,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Réservation confirmée !", description: "Vous recevrez un email de confirmation." });
      setDialogOpen(false);
      setName("");
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["event", slug] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de réserver. Réessayez.", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="h-96 rounded-xl bg-card animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Événement introuvable</h1>
        <Link to="/evenements" className="text-primary hover:underline">← Retour aux événements</Link>
      </div>
    );
  }

  const daysLeft = differenceInDays(new Date(event.date_start), new Date());
  const seatsLeft = event.total_seats - event.reserved_seats;
  const isFull = seatsLeft <= 0;
  const eventUrl = window.location.href;
  const shareText = `${event.title} — ${event.description}`;

  const shareLinks = [
    { name: "X", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`, color: "hover:text-foreground" },
    { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, color: "hover:text-primary" },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, color: "hover:text-primary" },
    { name: "Discord", url: `https://discord.com/channels/@me`, color: "hover:text-accent" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <Link to="/evenements" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Retour aux événements
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

          {event.image_url && (
            <img src={event.image_url} alt={event.title} className="w-full max-h-96 object-cover rounded-xl mb-6" />
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-accent" />
              {format(new Date(event.date_start), "d MMMM yyyy", { locale: fr })}
              {event.date_end && ` – ${format(new Date(event.date_end), "d MMMM yyyy", { locale: fr })}`}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" /> {event.location}
            </span>
            {event.moderator && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-accent" /> {event.moderator}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-accent" /> {seatsLeft} / {event.total_seats} places disponibles
            </span>
            {event.is_upcoming && daysLeft >= 0 && (
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                <Clock className="h-4 w-4" /> {daysLeft === 0 ? "Aujourd'hui !" : `J-${daysLeft}`}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-invert max-w-none mb-12">
            <p className="text-lg text-muted-foreground mb-6">{event.description}</p>
            {event.full_content && (
              <div className="whitespace-pre-line text-foreground/90 leading-relaxed">
                {event.full_content}
              </div>
            )}
          </div>

          {/* Reserve button */}
          {event.is_upcoming && (
            <div className="rounded-xl border border-border bg-card p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Réserver ma place</h3>
              {isFull ? (
                <p className="text-destructive font-medium">Cet événement est complet.</p>
              ) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full sm:w-auto">
                      Réserver ma place ({seatsLeft} restantes)
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Réserver pour « {event.title} »</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        reserveMutation.mutate();
                      }}
                      className="space-y-4 mt-4"
                    >
                      <Input
                        placeholder="Nom complet"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button type="submit" className="w-full" disabled={reserveMutation.isPending}>
                        {reserveMutation.isPending ? "Réservation..." : "Confirmer la réservation"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}

          {/* Share */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Share2 className="h-5 w-5" /> Partager cet événement
            </h3>
            <div className="flex flex-wrap gap-3">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground ${link.color} hover:border-primary/30 transition-all`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
