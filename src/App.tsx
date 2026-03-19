import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ModalManager } from "./components/modals/ModalManager";
import { ToastContainer } from "./components/ui/Toast";
import { HomePage } from "./pages/HomePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { PropertyDetailPage } from "./pages/PropertyDetailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="dark">
          <Routes>
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/marketplace"
              element={
                <PublicLayout>
                  <MarketplacePage />
                </PublicLayout>
              }
            />
            <Route
              path="/property/:id"
              element={
                <PublicLayout>
                  <PropertyDetailPage />
                </PublicLayout>
              }
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="*"
              element={
                <PublicLayout>
                  <NotFoundPage />
                </PublicLayout>
              }
            />
          </Routes>
          <ModalManager />
          <ToastContainer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
