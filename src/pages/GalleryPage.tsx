import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Image as ImageIcon } from "lucide-react";

const fetchPhotos = async () => {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

const GalleryPage = () => {
  const { data: photos, isLoading } = useQuery({
    queryKey: ["gallery_photos"],
    queryFn: fetchPhotos,
  });

  return (
    <div>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Galerie</h1>
          <p className="text-muted-foreground max-w-2xl">
            Revivez nos événements à travers les photos de la communauté Cardano Nyiragongo.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          ) : !photos || photos.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">Aucune photo pour le moment.</p>
              <p className="text-muted-foreground text-sm mt-1">Les photos seront ajoutées prochainement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-border shadow-card">
                  <img
                    src={photo.image_url}
                    alt={photo.title || "Photo de la galerie"}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(photo.title || photo.description) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        {photo.title && <h3 className="font-semibold text-sm">{photo.title}</h3>}
                        {photo.description && <p className="text-xs text-muted-foreground mt-1">{photo.description}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
