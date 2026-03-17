import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  LogOut,
  MessageSquare,
  Package,
  ShoppingBag,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AnalyticsTab from "../components/user/AnalyticsTab";
import CartTab from "../components/user/CartTab";
import FeedbackTab from "../components/user/FeedbackTab";
import MenuTab from "../components/user/MenuTab";
import OrdersTab from "../components/user/OrdersTab";
import { useApp } from "../context/AppContext";

export default function UserDashboard() {
  const { currentUser, logout, cart } = useApp();
  const [activeTab, setActiveTab] = useState("menu");

  if (!currentUser || currentUser.role !== "customer") return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              CanZie
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground hidden sm:block">
              👋 {currentUser.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full"
        >
          <TabsList className="mx-6 mt-6 mb-0 bg-secondary/60 rounded-2xl p-1 h-auto gap-1">
            <TabsTrigger
              data-ocid="user.menu_tab"
              value="menu"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="user.cart_tab"
              value="cart"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              data-ocid="user.orders_tab"
              value="orders"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="user.feedback_tab"
              value="feedback"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="user.analytics_tab"
              value="analytics"
              className="flex-1 rounded-xl gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm py-3 font-semibold"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <TabsContent
                value="menu"
                className="mt-0 h-[calc(100vh-180px)]"
                forceMount
                style={{ display: activeTab === "menu" ? undefined : "none" }}
              >
                <MenuTab />
              </TabsContent>
              <TabsContent
                value="cart"
                className="mt-0 h-[calc(100vh-180px)] overflow-y-auto"
                forceMount
                style={{ display: activeTab === "cart" ? undefined : "none" }}
              >
                <CartTab onOrderPlaced={() => setActiveTab("orders")} />
              </TabsContent>
              <TabsContent
                value="orders"
                className="mt-0 h-[calc(100vh-180px)] overflow-y-auto"
                forceMount
                style={{ display: activeTab === "orders" ? undefined : "none" }}
              >
                <OrdersTab />
              </TabsContent>
              <TabsContent
                value="feedback"
                className="mt-0 h-[calc(100vh-180px)] overflow-y-auto"
                forceMount
                style={{
                  display: activeTab === "feedback" ? undefined : "none",
                }}
              >
                <FeedbackTab />
              </TabsContent>
              <TabsContent
                value="analytics"
                className="mt-0 h-[calc(100vh-180px)] overflow-y-auto"
                forceMount
                style={{
                  display: activeTab === "analytics" ? undefined : "none",
                }}
              >
                <AnalyticsTab />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}
