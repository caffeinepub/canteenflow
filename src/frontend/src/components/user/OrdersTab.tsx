import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import CountdownTimer from "../shared/CountdownTimer";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Preparing: "bg-blue-100 text-blue-700 border-blue-200",
  Ready: "bg-green-100 text-green-700 border-green-200",
  Picked: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function OrdersTab() {
  const { orders, currentUser, cancelOrder } = useApp();

  const myOrders = orders
    .filter((o) => o.userId === currentUser?.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (myOrders.length === 0) {
    return (
      <div
        data-ocid="orders.empty_state"
        className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground"
      >
        <Package className="w-16 h-16 opacity-20" />
        <p className="font-semibold text-lg">No orders yet</p>
        <p className="text-sm">Place an order from the Menu tab</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" data-ocid="orders.list">
      <h3 className="font-extrabold text-lg">My Orders</h3>
      {myOrders.map((order, idx) => (
        <motion.div
          key={order.id}
          data-ocid={`orders.item.${idx + 1}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="font-extrabold text-primary text-xl">
                {order.token}
              </span>
              <span className="ml-3 text-sm text-muted-foreground">
                {order.canteenName}
              </span>
            </div>
            <Badge
              className={statusColors[order.status]}
              data-ocid={`orders.status.${idx + 1}`}
            >
              {order.status}
            </Badge>
          </div>

          <div className="space-y-1 mb-3">
            {order.items.map((item) => (
              <p key={item.menuItem.id} className="text-sm">
                {item.menuItem.name}
                {item.selectedCustomizations &&
                  item.selectedCustomizations.length > 0 && (
                    <span className="text-muted-foreground ml-1">
                      ({item.selectedCustomizations.join(", ")})
                    </span>
                  )}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" /> Pickup: {order.pickupTime}
            </span>
            <span className="font-extrabold text-primary">
              ₹{order.totalAmount.toFixed(0)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              {order.status === "Preparing" && order.estimatedReadyAt && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Ready in:</span>
                  <CountdownTimer targetTime={order.estimatedReadyAt} />
                </div>
              )}
              {order.status === "Ready" && (
                <span className="text-green-600 font-bold text-sm">
                  ✓ Ready for pickup!
                </span>
              )}
              {order.status === "Picked" && (
                <span className="text-muted-foreground text-sm">
                  Order collected
                </span>
              )}
            </div>
            {order.status === "Pending" && (
              <Button
                data-ocid={`orders.cancel_button.${idx + 1}`}
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => {
                  cancelOrder(order.id);
                  toast.info("Order cancelled");
                }}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
