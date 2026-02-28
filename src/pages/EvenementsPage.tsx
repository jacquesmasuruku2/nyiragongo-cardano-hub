import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_content?: string | null;
  date_start: string;
  date_end?: string | null;
  location: string;
  moderator?: string | null;
  total_seats: number;
  reserved_seats: number;
  image_url?: string | null;
  is_upcoming: boolean;
  external_link?: string | null;
  created_at: string;
  updated_at: string;
}

type EventFilter = "all" | "upcoming" | "past";

const EvenementsPage = () => {
  const [filter, setFilter] = useState<EventFilter>("all");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date_start", { ascending: false });
      
      if (error) throw error;
      return data as Event[];
    },
  });

  const filteredEvents = events?.filter((event) => {
    const now = new Date();
    const eventDate = new Date(event.date_start);
    
    switch (filter) {
      case "upcoming":
        return event.is_upcoming && eventDate > now;
      case "past":
        return !event.is_upcoming || eventDate <= now;
      default:
        return true;
    }
  }) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventFull = (event: Event) => {
    return event.reserved_seats >= event.total_seats;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Événements</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Événements</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Participez à nos événements pour découvrir et apprendre davantage sur Cardano et la blockchain
        </p>
      </div>

      {/* Filtres */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-md"
          >
            Tous
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("upcoming")}
            className="rounded-md"
          >
            À venir
          </Button>
          <Button
            variant={filter === "past" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("past")}
            className="rounded-md"
          >
            Passés
          </Button>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300">
              {event.image_url && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={event.is_upcoming ? "default" : "secondary"}
                      className="bg-white/90 backdrop-blur-sm"
                    >
                      {event.is_upcoming ? "À venir" : "Passé"}
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  {event.external_link && (
                    <a
                      href={event.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date_start)}</span>
                  </div>
                  
                  {event.date_end && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Fin: {formatDate(event.date_end)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.reserved_seats}/{event.total_seats} places
                      {isEventFull(event) && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Complet
                        </Badge>
                      )}
                    </span>
                  </div>
                  
                  {event.moderator && (
                    <div className="text-muted-foreground">
                      <span className="font-medium">Animateur:</span> {event.moderator}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  {event.is_upcoming && !isEventFull(event) && (
                    <Link to={`/evenements/${event.slug}`}>
                      <Button className="flex-1">
                        Réserver ma place
                      </Button>
                    </Link>
                  )}
                  
                  {event.is_upcoming && isEventFull(event) && (
                    <Button variant="outline" disabled className="flex-1">
                      Événement complet
                    </Button>
                  )}
                  
                  {!event.is_upcoming && (
                    <Button variant="outline" className="flex-1">
                      Événement terminé
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {filter === "upcoming" 
              ? "Aucun événement à venir pour le moment."
              : filter === "past"
              ? "Aucun événement passé trouvé."
              : "Aucun événement disponible."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default EvenementsPage;
