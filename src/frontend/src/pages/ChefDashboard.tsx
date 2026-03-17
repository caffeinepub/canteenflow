import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  ChefHat,
  Clock,
  LogOut,
  Play,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import CountdownTimer from "../components/shared/CountdownTimer";
import { type Order, useApp } from "../context/AppContext";

const isInstantOrPackaged = (order: Order) =>
  order.items.every(
    (i) =>
      i.menuItem.category === "Instant Snacks" ||
      i.menuItem.category === "Packaged Snacks" ||
      i.menuItem.avgPickupMinutes <= 0,
  );

export default function ChefDashboard() {
  const { currentUser, logout, orders, startPreparing, markReady } = useApp();

  if (!currentUser || currentUser.role !== "chef") return null;

  const chefOrders = orders.filter((o) => !isInstantOrPackaged(o));
  const pending = chefOrders.filter((o) => o.status === "Pending");
  const preparing = chefOrders.filter((o) => o.status === "Preparing");
  const ready = orders.filter((o) => o.status === "Ready");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">
                CanZie
              </span>
              <span className="ml-2 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Chef
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChefHat className="w-4 h-4 text-amber-500" />
              <span className="font-medium">{currentUser.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              data-ocid="chef.logout.button"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-extrabold tracking-tight">
            Kitchen Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage incoming orders from the kitchen
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-extrabold text-amber-600">
              {pending.length}
            </div>
            <div className="text-xs font-semibold text-amber-700 mt-0.5">
              Pending
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-extrabold text-blue-600">
              {preparing.length}
            </div>
            <div className="text-xs font-semibold text-blue-700 mt-0.5">
              Preparing
            </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-extrabold text-green-600">
              {ready.length}
            </div>
            <div className="text-xs font-semibold text-green-700 mt-0.5">
              Ready
            </div>
          </div>
        </motion.div>

        {/* Pending Orders */}
        <section data-ocid="chef.pending_section">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-extrabold mb-4 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            Pending Orders ({pending.length})
          </motion.h3>
          {pending.length === 0 ? (
            <div
              data-ocid="chef.pending.empty_state"
              className="text-muted-foreground text-sm py-8 text-center bg-secondary/30 rounded-2xl"
            >
              <ChefHat className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              No pending orders — enjoy the calm!
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {pending.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card border-l-4 border-l-amber-400 border border-border rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-extrabold text-amber-600 font-mono">
                          {order.token}
                        </span>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">
                        {order.items.map((i) => i.menuItem.name).join(", ")}
                      </p>
                      {order.pickupTime && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pickup:{" "}
                          {order.pickupTime}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.canteenName}
                      </p>
                    </div>
                    <Button
                      data-ocid={`chef.start_preparing_button.${idx + 1}`}
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700 gap-1.5 shrink-0"
                      onClick={() => {
                        startPreparing(order.id);
                        toast.success(
                          `Started preparing ${order.token} — customer can no longer cancel`,
                        );
                      }}
                    >
                      <Play className="w-3 h-3" /> Start Preparing
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Preparing */}
        <section data-ocid="chef.preparing_section">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg font-extrabold mb-4 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            Preparing ({preparing.length})
          </motion.h3>
          {preparing.length === 0 ? (
            <div className="text-muted-foreground text-sm py-8 text-center bg-secondary/30 rounded-2xl">
              No orders currently being prepared
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {preparing.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card border-l-4 border-l-blue-500 border border-border rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-extrabold text-blue-600 font-mono">
                          {order.token}
                        </span>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          Preparing
                        </Badge>
                        {order.estimatedReadyAt && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ETA:{" "}
                            <CountdownTimer
                              targetTime={order.estimatedReadyAt}
                            />
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">
                        {order.items.map((i) => i.menuItem.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.canteenName}
                      </p>
                    </div>
                    <Button
                      data-ocid={`chef.mark_ready_button.${idx + 1}`}
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700 gap-1.5 shrink-0"
                      onClick={() => {
                        markReady(order.id);
                        toast.success(
                          `${order.token} marked as ready — canteen admin will handle pickup!`,
                        );
                      }}
                    >
                      <CheckCheck className="w-3 h-3" /> Mark as Ready
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Ready for Pickup — read-only, admin handles pickup */}
        <section data-ocid="chef.ready_section">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-extrabold mb-1 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            Ready for Pickup ({ready.length})
          </motion.h3>
          <p className="text-xs text-muted-foreground mb-4">
            Handed off to canteen admin — pickup will be confirmed by admin
          </p>
          {ready.length === 0 ? (
            <div
              data-ocid="chef.ready.empty_state"
              className="text-muted-foreground text-sm py-8 text-center bg-secondary/30 rounded-2xl"
            >
              No orders ready for pickup yet
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {ready.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      height: 0,
                      marginBottom: 0,
                    }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-green-50/60 border border-green-100 rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-extrabold text-green-600 font-mono">
                          {order.token}
                        </span>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          Ready
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">
                        {order.items.map((i) => i.menuItem.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.canteenName}
                      </p>
                    </div>
                    <div className="shrink-0 text-green-500">
                      <CheckCheck className="w-5 h-5" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        &copy; {new Date().getFullYear()}. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
