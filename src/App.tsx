import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Index from "./pages/Index";
import MissionPage from "./pages/MissionPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import EvenementsPage from "./pages/EvenementsPage";
import EventDetailPage from "./pages/EventDetailPage";
import EquipePage from "./pages/EquipePage";
import GalleryPage from "./pages/GalleryPage";
import NewsletterPage from "./pages/NewsletterPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import PrivacyPage from "./pages/PrivacyPage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes publiques avec Layout standard */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/mission" element={<Layout><MissionPage /></Layout>} />
          <Route path="/articles" element={<Layout><ArticlesPage /></Layout>} />
          <Route path="/articles/:id" element={<Layout><ArticleDetailPage /></Layout>} />
          <Route path="/evenements" element={<Layout><EvenementsPage /></Layout>} />
          <Route path="/evenements/:slug" element={<Layout><EventDetailPage /></Layout>} />
          <Route path="/equipe" element={<Layout><EquipePage /></Layout>} />
          <Route path="/galerie" element={<Layout><GalleryPage /></Layout>} />
          <Route path="/newsletter" element={<Layout><NewsletterPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/faq" element={<Layout><FaqPage /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
          <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
          
          {/* Route admin avec AdminLayout (pas de navbar/footer) */}
          <Route path="/admin" element={<AdminLayout><AdminPage /></AdminLayout>} />
          
          {/* 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
