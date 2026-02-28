import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Image as ImageIcon, Calendar, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      if (!roles?.some((r) => r.role === "admin")) { navigate("/auth"); return; }
      setUser(session.user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel Admin</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="mb-6">
          <TabsTrigger value="events"><Calendar className="h-4 w-4 mr-2" /> Événements</TabsTrigger>
          <TabsTrigger value="gallery"><ImageIcon className="h-4 w-4 mr-2" /> Galerie</TabsTrigger>
        </TabsList>

        <TabsContent value="events"><EventsManager /></TabsContent>
        <TabsContent value="gallery"><GalleryManager /></TabsContent>
      </Tabs>
    </div>
  );
};

/* ========== Events Manager ========== */
const EventsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", full_content: "", date_start: "", date_end: "",
    location: "", moderator: "", total_seats: "50", is_upcoming: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date_start", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async () => {
      let image_url: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("event-images").upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("events").insert({
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: form.description,
        full_content: form.full_content || null,
        date_start: form.date_start,
        date_end: form.date_end || null,
        location: form.location,
        moderator: form.moderator || null,
        total_seats: parseInt(form.total_seats) || 50,
        is_upcoming: form.is_upcoming,
        image_url,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Événement créé !" });
      setOpen(false);
      setForm({ title: "", slug: "", description: "", full_content: "", date_start: "", date_end: "", location: "", moderator: "", total_seats: "50", is_upcoming: true });
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Événement supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gérer les événements</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nouvel événement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Créer un événement</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createEvent.mutate(); }} className="space-y-4 mt-4">
              <Input placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Slug (auto-généré si vide)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Textarea placeholder="Description courte" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              <Textarea placeholder="Contenu complet" value={form.full_content} onChange={(e) => setForm({ ...form, full_content: e.target.value })} rows={5} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date début</label>
                  <Input type="datetime-local" value={form.date_start} onChange={(e) => setForm({ ...form, date_start: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date fin (optionnel)</label>
                  <Input type="datetime-local" value={form.date_end} onChange={(e) => setForm({ ...form, date_end: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Lieu" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                <Input placeholder="Modérateur" value={form.moderator} onChange={(e) => setForm({ ...form, moderator: e.target.value })} />
              </div>
              <Input type="number" placeholder="Nombre de places" value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: e.target.value })} />
              <div>
                <label className="text-sm font-medium mb-1 block">Image de l'événement</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_upcoming} onChange={(e) => setForm({ ...form, is_upcoming: e.target.checked })} id="upcoming" />
                <label htmlFor="upcoming" className="text-sm">Événement à venir</label>
              </div>
              <Button type="submit" className="w-full" disabled={createEvent.isPending}>
                {createEvent.isPending ? "Création..." : "Créer l'événement"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {events?.map((event) => (
            <div key={event.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              {event.image_url && <img src={event.image_url} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{event.title}</h3>
                <p className="text-xs text-muted-foreground">{event.location} • {event.reserved_seats}/{event.total_seats} réservations</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${event.is_upcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {event.is_upcoming ? "À venir" : "Passé"}
              </span>
              <Button variant="ghost" size="icon" onClick={() => { if (confirm("Supprimer ?")) deleteEvent.mutate(event.id); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========== Gallery Manager ========== */
const GalleryManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: photos, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_photos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);

      const { error } = await supabase.from("gallery_photos").insert({
        title: title || null,
        description: description || null,
        image_url: urlData.publicUrl,
      });
      if (error) throw error;

      toast({ title: "Photo ajoutée !" });
      setTitle("");
      setDescription("");
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery_photos"] });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id: string) => {
    const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Photo supprimée" });
    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery_photos"] });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Gérer la galerie</h2>

      <form onSubmit={handleUpload} className="rounded-xl border border-border bg-card p-6 mb-8 space-y-4">
        <h3 className="font-medium flex items-center gap-2"><Upload className="h-4 w-4" /> Ajouter une photo</h3>
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        <Input placeholder="Titre (optionnel)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Description (optionnel)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit" disabled={uploading || !file}>
          {uploading ? "Upload..." : "Ajouter la photo"}
        </Button>
      </form>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square rounded-xl bg-card animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos?.map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-border">
              <img src={photo.image_url} alt={photo.title || ""} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={() => { if (confirm("Supprimer ?")) deletePhoto(photo.id); }}>
                  <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                </Button>
              </div>
              {photo.title && <p className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">{photo.title}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
