import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Image as ImageIcon, Calendar, Upload, Users, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // For hardcoded admin, allow direct access
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Allow access without session for hardcoded admin
        setUser({ email: "cardanonyiragongo@gmail.com", id: "hardcoded-admin" });
        return;
      }
      
      // Check if hardcoded admin email
      if (session.user.email?.toLowerCase().trim() === "cardanonyiragongo@gmail.com") {
        setUser(session.user);
        return;
      }
      
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      if (!roles?.some((r) => r.role === "admin")) { 
        navigate("/auth"); 
        return; 
      }
      setUser(session.user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        // Allow access without session for hardcoded admin
        setUser({ email: "cardanonyiragongo@gmail.com", id: "hardcoded-admin" });
        return;
      }
      
      // Check if hardcoded admin email
      if (session.user.email?.toLowerCase().trim() === "cardanonyiragongo@gmail.com") {
        setUser(session.user);
        return;
      }
      
      navigate("/auth");
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
          <TabsTrigger value="team"><Users className="h-4 w-4 mr-2" /> Équipe</TabsTrigger>
          <TabsTrigger value="blog"><FileText className="h-4 w-4 mr-2" /> Blog</TabsTrigger>
          <TabsTrigger value="gallery"><ImageIcon className="h-4 w-4 mr-2" /> Galerie</TabsTrigger>
        </TabsList>

        <TabsContent value="events"><EventsManager /></TabsContent>
        <TabsContent value="team"><TeamManager /></TabsContent>
        <TabsContent value="blog"><BlogManager /></TabsContent>
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

/* ========== Team Manager ========== */
const TeamManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", role: "", bio: "", email: "", photo_url: "", linkedin_url: "", twitter_url: ""
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createTeamMember = useMutation({
    mutationFn: async () => {
      let photo_url: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `team-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("team-photos").upload(path, photoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("team-photos").getPublicUrl(path);
        photo_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("team_members").insert({
        name: form.name,
        role: form.role,
        bio: form.bio,
        email: form.email || null,
        photo_url: photo_url || form.photo_url,
        linkedin_url: form.linkedin_url || null,
        twitter_url: form.twitter_url || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Membre de l'équipe ajouté !" });
      setOpen(false);
      setForm({ name: "", role: "", bio: "", email: "", photo_url: "", linkedin_url: "", twitter_url: "" });
      setPhotoFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
    },
    onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });

  const deleteTeamMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Membre supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gérer l'équipe</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nouveau membre</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Ajouter un membre</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createTeamMember.mutate(); }} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Nom complet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input placeholder="Rôle" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
              <Textarea placeholder="Biographie" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} required />
              <Input placeholder="Email (optionnel)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="URL photo (optionnel)" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
              <div>
                <label className="text-sm font-medium mb-1 block">OU télécharger une photo</label>
                <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="LinkedIn (optionnel)" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
                <Input placeholder="Twitter (optionnel)" value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={createTeamMember.isPending}>
                {createTeamMember.isPending ? "Ajout..." : "Ajouter le membre"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {teamMembers?.map((member) => (
            <div key={member.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              {member.photo_url && <img src={member.photo_url} alt="" className="h-14 w-14 rounded-full object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground truncate">{member.bio}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { if (confirm("Supprimer ce membre ?")) deleteTeamMember.mutate(member.id); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ========== Blog Manager ========== */
const BlogManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", author: "", category: "general", image_url: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: articles, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createArticle = useMutation({
    mutationFn: async () => {
      let image_url: string | null = null;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `blog-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("blog-images").upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("articles").insert({
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        category: form.category,
        image_url: image_url || form.image_url,
        published: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Article publié !" });
      setOpen(false);
      setForm({ title: "", slug: "", excerpt: "", content: "", author: "", category: "general", image_url: "" });
      setImageFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Article supprimé" });
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gérer le blog</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Nouvel article</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Publier un article</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createArticle.mutate(); }} className="space-y-4 mt-4">
              <Input placeholder="Titre de l'article" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Slug (auto-généré si vide)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Auteur" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
                <select 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="general">Général</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="cardano">Cardano</option>
                  <option value="education">Éducation</option>
                  <option value="events">Événements</option>
                </select>
              </div>
              <Textarea placeholder="Extrait (résumé de l'article)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} required />
              <Textarea placeholder="Contenu complet de l'article" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} required />
              <Input placeholder="URL image (optionnel)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <div>
                <label className="text-sm font-medium mb-1 block">OU télécharger une image</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" className="w-full" disabled={createArticle.isPending}>
                {createArticle.isPending ? "Publication..." : "Publier l'article"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-xl bg-card animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {articles?.map((article) => (
            <div key={article.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
              {article.image_url && <img src={article.image_url} alt="" className="h-20 w-20 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">{article.excerpt}</p>
                <p className="text-xs text-muted-foreground">{article.author} • {article.category} • {new Date(article.created_at).toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { if (confirm("Supprimer cet article ?")) deleteArticle.mutate(article.id); }}>
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
