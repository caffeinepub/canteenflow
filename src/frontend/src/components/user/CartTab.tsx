import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Clock,
  Loader2,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

interface CartTabProps {
  onOrderPlaced: () => void;
}

export default function CartTab({ onOrderPlaced }: CartTabProps) {
  const { cart, removeFromCart, placeOrder, canteens } = useApp();
  const [selectedPickup, setSelectedPickup] = useState("");
  const [paymentState, setPaymentState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const [selectedPayment, setSelectedPayment] = useState<
    "GPay" | "PhonePe" | null
  >(null);

  const total = cart.reduce((s, c) => s + c.totalPrice, 0);

  // Determine canteen from cart
  const cartCanteenId = cart[0]?.menuItem.canteenId ?? canteens[0]?.id;

  // Calculate min pickup time: max avgPickupMinutes across cart
  const minMinutes = useMemo(() => {
    if (cart.length === 0) return 15;
    return Math.max(...cart.map((c) => c.menuItem.avgPickupMinutes), 15);
  }, [cart]);

  // Generate time slots every 15 minutes starting from minMinutes from now
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const now = new Date();
    const start = new Date(now.getTime() + minMinutes * 60 * 1000);
    // Round up to next 15-min mark
    const minutes = start.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    start.setMinutes(roundedMinutes, 0, 0);
    for (let i = 0; i < 8; i++) {
      const slot = new Date(start.getTime() + i * 15 * 60 * 1000);
      slots.push(
        `${String(slot.getHours()).padStart(2, "0")}:${String(slot.getMinutes()).padStart(2, "0")}`,
      );
    }
    return slots;
  }, [minMinutes]);

  const handlePayment = async (method: "GPay" | "PhonePe") => {
    setSelectedPayment(method);
    setPaymentState("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setPaymentState("success");
    await new Promise((r) => setTimeout(r, 800));
    placeOrder(cartCanteenId, method, selectedPickup || undefined);
    setPaymentState("idle");
    toast.success("Order placed successfully! 🎉");
    onOrderPlaced();
  };

  if (cart.length === 0 && paymentState === "idle") {
    return (
      <div
        data-ocid="cart.empty_state"
        className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground"
      >
        <ShoppingCart className="w-16 h-16 opacity-20" />
        <p className="font-semibold text-lg">Your cart is empty</p>
        <p className="text-sm">Add items from the menu to get started</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Cart Items */}
      <div data-ocid="cart.list">
        <h3 className="font-extrabold text-lg mb-4">Your Order</h3>
        <div className="space-y-3">
          <AnimatePresence>
            {cart.map((item, idx) => (
              <motion.div
                key={item.menuItem.id}
                data-ocid={`cart.item.${idx + 1}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex-1">
                  <p className="font-bold">{item.menuItem.name}</p>
                  {item.selectedCustomizations &&
                    item.selectedCustomizations.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {item.selectedCustomizations.join(", ")}
                      </p>
                    )}
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-extrabold text-primary">
                  ₹{item.totalPrice}
                </p>
                <button
                  type="button"
                  data-ocid={`cart.delete_button.${idx + 1}`}
                  onClick={() => removeFromCart(item.menuItem.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Pickup Time (optional) */}
      <div className="bg-secondary/40 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <p className="font-bold text-sm">
            Pickup Time
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Leave unset to pick up whenever ready — avg. wait ~{minMinutes} min
        </p>
        <Select value={selectedPickup} onValueChange={setSelectedPickup}>
          <SelectTrigger
            data-ocid="cart.pickup_time_select"
            className="bg-card"
          >
            <SelectValue placeholder="Choose a time slot (optional)" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPickup && (
          <button
            type="button"
            onClick={() => setSelectedPickup("")}
            className="mt-2 text-xs text-muted-foreground underline hover:text-foreground transition-colors"
          >
            Clear pickup time
          </button>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center px-2">
        <span className="font-bold text-lg">Total</span>
        <span className="text-2xl font-extrabold text-primary">₹{total}</span>
      </div>

      {/* Payment Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          data-ocid="cart.gpay_button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handlePayment("GPay")}
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
        >
          <span className="text-lg">G</span> Pay with GPay
        </motion.button>
        <motion.button
          data-ocid="cart.phonepe_button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handlePayment("PhonePe")}
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
        >
          📱 PhonePe
        </motion.button>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentState !== "idle" && (
          <motion.div
            data-ocid="cart.payment_modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-3xl p-10 shadow-xl text-center min-w-72"
            >
              {paymentState === "loading" && (
                <div data-ocid="cart.payment_loading_state">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <p className="font-bold text-lg">
                    Processing {selectedPayment}...
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Please wait
                  </p>
                </div>
              )}
              {paymentState === "success" && (
                <div data-ocid="cart.payment_success_state">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <p className="font-bold text-lg">Payment Successful!</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your order is being confirmed
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
