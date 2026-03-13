import { Toaster } from "@/components/ui/sonner";
import { AppProvider, useApp } from "./context/AppContext";
import AdminDashboard from "./pages/AdminDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";

function AppRouter() {
  const { currentUser } = useApp();

  if (!currentUser) return <LoginPage />;
  if (currentUser.role === "admin") return <AdminDashboard />;
  if (currentUser.role === "chef") return <ChefDashboard />;
  return <UserDashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </AppProvider>
  );
}
