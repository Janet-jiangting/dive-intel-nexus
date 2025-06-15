
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
import ManageData from "./pages/ManageData";
import MyOcean from "./pages/MyOcean";
import { MarineLifeDataProvider } from "./contexts/MarineLifeDataContext"; // Added import
import ChatAssistant from "./components/ChatAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MarineLifeDataProvider> {/* Added Provider */}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/dive-sites" element={<Layout fullHeight={true}><DiveSites /></Layout>} />
            <Route path="/dive-sites/:id" element={<Layout><DiveSiteDetail /></Layout>} />
            <Route path="/marine-life" element={<Layout><MarineLife /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />
            <Route path="/manage-data" element={<Layout><ManageData /></Layout>} />
            <Route path="/my-ocean" element={<Layout><MyOcean /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatAssistant />
        </BrowserRouter>
      </MarineLifeDataProvider> {/* Closed Provider */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
