import { Calendar, ExternalLink, Clock, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, isPast, format } from "date-fns";
import { fr } from "date-fns/locale";

const fetchEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date_start", { ascending: false });
  if (error) throw error;
  return data;
};

const CountdownBadge = ({ dateStart }: { dateStart: string }) => {
  const now = new Date();
  const start = new Date(dateStart);
  const days = differenceInDays(start, now);

  if (days < 0) return null;
  if (days === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 text-accent px-3 py-1 text-xs font-bold">
        <Clock className="h-3 w-3" /> Aujourd'hui !
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
      <Clock className="h-3 w-3" /> J-{days}
    </span>
  );
};

const EventsPage = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const upcoming = events?.filter((e) => e.is_upcoming) ?? [];
  const past = events?.filter((e) => !e.is_upcoming) ?? [];

  return (
    <div>
      {/* Header */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Événements & Masterclass</h1>
          <p className="text-muted-foreground max-w-2xl">
            Découvrez nos hackathons, ateliers techniques et sessions de mentorat pour rester connecté avec la communauté Cardano.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-accent" />
            Événements à venir
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card h-80 animate-pulse" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-muted-foreground">Aucun événement à venir pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcoming.map((event) => (
                <Link
                  to={`/evenements/${event.slug}`}
                  key={event.id}
                  className="group rounded-xl border border-border bg-card overflow-hidden shadow-card hover:border-primary/30 transition-all"
                >
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-accent">
                        {format(new Date(event.date_start), "d MMMM yyyy", { locale: fr })}
                      </span>
                      <CountdownBadge dateStart={event.date_start} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {event.total_seats - event.reserved_seats} places
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Événements passés</h2>
          {past.length === 0 ? (
            <p className="text-muted-foreground">Aucun événement passé.</p>
          ) : (
            <div className="space-y-4">
              {past.map((event) =>
                event.external_link ? (
                  <a
                    key={event.id}
                    href={event.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground mt-1 shrink-0 group-hover:text-primary transition-colors" />
                  </a>
                ) : (
                  <Link
                    key={event.id}
                    to={`/evenements/${event.slug}`}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
