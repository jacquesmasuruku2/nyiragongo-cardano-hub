import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, MapPin, Users, User, Clock, Share2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const fetchEventComments = async (eventId: string) => {
  const { data, error } = await supabase
    .from("event_comments")
    .select("*")
    .eq("event_id", eventId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
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
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent(slug!),
    enabled: !!slug,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["event-comments", event?.id],
    queryFn: () => fetchEventComments(event!.id),
    enabled: !!event?.id,
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

  const commentMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("event_comments").insert({
        event_id: event!.id,
        author_name: commentName,
        author_email: commentEmail,
        content: commentContent,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Commentaire publié !", description: "Votre commentaire a été ajouté avec succès." });
      setCommentName("");
      setCommentEmail("");
      setCommentContent("");
      queryClient.invalidateQueries({ queryKey: ["event-comments", event?.id] });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de publier le commentaire. Réessayez.", variant: "destructive" });
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
          <div className="rounded-xl border border-border bg-card p-6 mb-8">
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

          {/* Comments Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" /> Commentaires ({comments?.length || 0})
            </h3>

            {/* Comment Form */}
            <div className="mb-8 p-4 border border-border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">Laisser un commentaire</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commentMutation.mutate();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Votre nom"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    required
                  />
                </div>
                <Textarea
                  placeholder="Votre commentaire..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  required
                />
                <Button type="submit" className="w-full sm:w-auto" disabled={commentMutation.isPending}>
                  {commentMutation.isPending ? "Publication..." : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publier le commentaire
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border border-border rounded-lg bg-muted/30 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">{comment.author_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Soyez le premier à commenter cet événement !</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
