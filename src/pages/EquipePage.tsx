import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Linkedin, Twitter, Mail } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  email?: string | null;
  photo_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  created_at: string;
  updated_at: string;
}

const EquipePage = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Notre Équipe</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-muted mb-4"></div>
                    <div className="h-6 w-32 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-24 bg-muted rounded"></div>
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
        <h1 className="text-4xl font-bold mb-4">Notre Équipe</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez les passionnés qui travaillent à connecter Nyiragongo au futur du Web3
        </p>
      </div>

      {teamMembers && teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="relative cursor-pointer mb-4"
                    onClick={() => setSelectedMember(member)}
                  >
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover group-hover:ring-4 group-hover:ring-primary/20 transition-all"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">Voir plus</span>
                    </div>
                  </div>
                  
                  <h3 
                    className="text-lg font-semibold mb-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setSelectedMember(member)}
                  >
                    {member.name}
                  </h3>
                  
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {member.bio}
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.twitter_url && (
                      <a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun membre de l'équipe disponible pour le moment.</p>
        </div>
      )}

      {/* Modal pour voir le profil complet */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {selectedMember.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  {selectedMember.photo_url ? (
                    <img
                      src={selectedMember.photo_url}
                      alt={selectedMember.name}
                      className="w-32 h-32 rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold mb-4">
                      {selectedMember.name.charAt(0)}
                    </div>
                  )}
                  
                  <Badge variant="default" className="mb-2 text-sm px-3 py-1">
                    {selectedMember.role}
                  </Badge>
                  
                  <div className="flex gap-2">
                    {selectedMember.linkedin_url && (
                      <a
                        href={selectedMember.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {selectedMember.twitter_url && (
                      <a
                        href={selectedMember.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {selectedMember.email && (
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-lg">Biographie</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMember.bio}
                  </p>
                </div>
                
                {selectedMember.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${selectedMember.email}`} className="hover:text-primary transition-colors">
                      {selectedMember.email}
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipePage;
