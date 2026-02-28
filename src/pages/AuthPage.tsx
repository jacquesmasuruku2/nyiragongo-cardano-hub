import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin");
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Try to sign in first
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        // If user doesn't exist, sign up
        if (signInError.message.includes("Invalid login")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError) throw signUpError;
          if (signUpData.user) {
            // Setup profile and role
            await supabase.rpc("setup_user_profile", { p_user_id: signUpData.user.id, p_email: email });
            toast({ title: "Compte créé !", description: "Vérification du rôle admin..." });
            // Check if admin
            const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", signUpData.user.id);
            if (roles?.some((r) => r.role === "admin")) {
              navigate("/admin");
            } else {
              toast({ title: "Accès refusé", description: "Vous n'avez pas les droits administrateur.", variant: "destructive" });
              await supabase.auth.signOut();
            }
          }
        } else {
          throw signInError;
        }
      } else {
        // Sign in succeeded — setup profile if not exists
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.rpc("setup_user_profile", { p_user_id: user.id, p_email: email });
          const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
          if (roles?.some((r) => r.role === "admin")) {
            navigate("/admin");
          } else {
            toast({ title: "Accès refusé", description: "Vous n'avez pas les droits administrateur.", variant: "destructive" });
            await supabase.auth.signOut();
          }
        }
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-gradient-hero flex items-center justify-center">
            <LogIn className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Panel Admin</h1>
            <p className="text-xs text-muted-foreground">Connexion réservée aux administrateurs</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full bg-gradient-hero border-0 hover:opacity-90" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
