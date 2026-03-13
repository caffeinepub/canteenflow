import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  ClipboardList,
  LayoutList,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Analytics from "../components/admin/Analytics";
import MenuManagement from "../components/admin/MenuManagement";
import OrdersQueue from "../components/admin/OrdersQueue";
import { useApp } from "../context/AppContext";

export default function AdminDashboard() {
  const { currentUser, logout, orders } = useApp();
  const [activeTab, setActiveTab] = useState("menu");

  if (!currentUser || currentUser.role !== "admin") return null;

  const readyCount = orders.filter((o) => o.status === "Ready").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">
                Canzie
              </span>
              <span className="ml-2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col"
        >
          <TabsList className="mx-6 mt-6 mb-0 bg-secondary/60 rounded-2xl p-1 h-auto gap-1">
            <TabsTrigger
              data-ocid="admin.menu_tab"
              value="menu"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <LayoutList className="w-4 h-4" /> Menu
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.orders_tab"
              value="orders"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <ClipboardList className="w-4 h-4" /> Orders
              {readyCount > 0 && (
                <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {readyCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.analytics_tab"
              value="analytics"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent
                value="menu"
                className="mt-0 h-[calc(100vh-180px)] overflow-y-auto"
                forceMount
                style={{ display: activeTab === "menu" ? undefined : "none" }}
              >
                <MenuManagement />
              </TabsContent>
              <TabsContent
                value="orders"
                className="mt-0 h-[calc(100vh-180px)] overflow-y-auto"
                forceMount
                style={{ display: activeTab === "orders" ? undefined : "none" }}
              >
                <OrdersQueue />
              </TabsContent>
              <TabsContent
                value="analytics"
                className="mt-0 h-[calc(100vh-180px)] overflow-y-auto"
                forceMount
                style={{
                  display: activeTab === "analytics" ? undefined : "none",
                }}
              >
                <Analytics />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}
