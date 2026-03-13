import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

export default function OrdersQueue() {
  const { orders, markPicked } = useApp();

  const ready = orders.filter((o) => o.status === "Ready");
  const done = orders.filter((o) => o.status === "Picked");

  return (
    <div className="p-6 space-y-8" data-ocid="admin.orders_queue">
      {/* Ready for Pickup */}
      <section>
        <h3 className="text-lg font-extrabold mb-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          Ready for Pickup ({ready.length})
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Orders prepared by the kitchen — confirm handoff when customer
          collects
        </p>
        {ready.length === 0 && (
          <div
            data-ocid="admin.orders_queue.empty_state"
            className="text-muted-foreground text-sm py-6 text-center bg-secondary/30 rounded-2xl"
          >
            No orders ready for pickup yet
          </div>
        )}
        <div className="space-y-3">
          {ready.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-l-4 border-l-green-500 border border-border rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-extrabold text-green-600 font-mono">
                    {order.token}
                  </span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Ready
                  </Badge>
                </div>
                <p className="text-sm">
                  {order.items.map((i) => i.menuItem.name).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.canteenName}
                </p>
              </div>
              <Button
                data-ocid={`admin.mark_picked_button.${idx + 1}`}
                size="sm"
                variant="outline"
                className="border-green-500 text-green-700 hover:bg-green-50 gap-1.5"
                onClick={() => {
                  markPicked(order.id);
                  toast.success(`${order.token} picked up!`);
                }}
              >
                <Package className="w-3 h-3" /> Mark Picked
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Completed */}
      {done.length > 0 && (
        <section>
          <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
            Completed ({done.length})
          </h3>
          <div className="space-y-2">
            {done.slice(-5).map((order) => (
              <div
                key={order.id}
                className="bg-secondary/30 border border-border rounded-xl p-3 flex items-center gap-3 opacity-60"
              >
                <span className="font-bold text-sm text-primary font-mono">
                  {order.token}
                </span>
                <span className="text-sm text-muted-foreground">
                  {order.items.map((i) => i.menuItem.name).join(", ")}
                </span>
                <Badge className="ml-auto bg-gray-100 text-gray-500 border-gray-200 text-xs">
                  Picked
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
