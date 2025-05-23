
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DiveSites from "./pages/DiveSites";
import DiveSiteDetail from "./pages/DiveSiteDetail";
import MarineLife from "./pages/MarineLife";
import Community from "./pages/Community";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/dive-sites" element={<Layout><DiveSites /></Layout>} />
          <Route path="/dive-sites/:id" element={<Layout><DiveSiteDetail /></Layout>} />
          <Route path="/marine-life" element={<Layout><MarineLife /></Layout>} />
          <Route path="/community" element={<Layout><Community /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
