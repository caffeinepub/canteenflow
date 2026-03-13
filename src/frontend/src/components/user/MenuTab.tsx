import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Clock, Minus, Plus, Sliders, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import type { MenuItem } from "../../context/AppContext";

const CATEGORIES = [
  "Regular",
  "Veg Thali",
  "Instant Snacks",
  "Packaged Snacks",
] as const;

export default function MenuTab() {
  const { canteens, menuItems, addToCart } = useApp();
  const [selectedCanteen, setSelectedCanteen] = useState(canteens[0]?.id ?? "");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [selectedCustom, setSelectedCustom] = useState<string[]>([]);

  const canteenItems = menuItems.filter((m) => m.canteenId === selectedCanteen);
  const selectedCanteenData = canteens.find((c) => c.id === selectedCanteen);
  const isCanteenClosed = selectedCanteenData
    ? !selectedCanteenData.isOpen
    : false;

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, q: number) =>
    setQuantities((p) => ({ ...p, [id]: Math.max(1, q) }));

  const handleAdd = (item: MenuItem) => {
    if (isCanteenClosed) return;
    addToCart(item, getQty(item.id));
    toast.success(`${item.name} added to cart!`);
  };

  const handleCustomize = (item: MenuItem) => {
    if (isCanteenClosed) return;
    setCustomizeItem(item);
    setSelectedCustom([]);
  };

  const handleAddCustomized = () => {
    if (!customizeItem) return;
    addToCart(customizeItem, getQty(customizeItem.id), selectedCustom);
    toast.success(`${customizeItem.name} added with customizations!`);
    setCustomizeItem(null);
  };

  const categoryGroups = CATEGORIES.map((cat) => ({
    cat,
    items: canteenItems.filter((m) => m.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex h-full gap-0">
      {/* Canteen Sidebar */}
      <div
        data-ocid="menu.canteen_list"
        className="w-56 shrink-0 border-r border-border bg-sidebar p-4 space-y-2"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2 mb-4">
          Canteens
        </p>
        {canteens.map((c, i) => (
          <motion.button
            key={c.id}
            data-ocid={`menu.canteen.item.${i + 1}`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedCanteen(c.id)}
            className={`w-full text-left px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              selectedCanteen === c.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-accent/60"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="truncate">{c.name}</span>
              {!c.isOpen && (
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    selectedCanteen === c.id
                      ? "bg-red-400/30 text-red-100"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  Closed
                </span>
              )}
            </div>
            <div
              className={`text-xs mt-0.5 font-normal ${
                selectedCanteen === c.id
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {c.description}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Closed Canteen Banner */}
        <AnimatePresence>
          {isCanteenClosed && (
            <motion.div
              key="closed-banner"
              data-ocid="menu.canteen_closed_banner"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-start gap-4 px-5 py-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 shadow-sm"
            >
              <div className="mt-0.5 p-2 bg-orange-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-orange-800 text-base">
                  This canteen is currently closed
                </p>
                <p className="text-sm text-orange-600 mt-0.5">
                  Orders are not available right now. Please check back later or
                  choose another canteen.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {categoryGroups.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            No items available
          </div>
        )}
        {categoryGroups.map(({ cat, items }) => (
          <div key={cat}>
            <h3 className="text-lg font-extrabold tracking-tight mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 rounded-full bg-primary" />
              {cat}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  data-ocid={`menu.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 8px 30px rgba(124,58,237,0.12)",
                  }}
                  className={`bg-card border border-border rounded-2xl overflow-hidden transition-shadow ${
                    !item.available || isCanteenClosed ? "opacity-60" : ""
                  }`}
                >
                  {/* Food Image */}
                  {item.image && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {item.available ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200 shadow-sm">
                            Available
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-600 border-red-200 shadow-sm"
                          >
                            {item.availableAfter
                              ? `After ${item.availableAfter}`
                              : "Unavailable"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">
                          {item.name}
                        </h4>
                        <p className="text-lg font-extrabold text-primary mt-1">
                          ₹{item.price}
                        </p>
                      </div>
                      {!item.image && (
                        <div className="flex flex-col items-end gap-1">
                          {item.available ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Available
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-600 border-red-200"
                            >
                              {item.availableAfter
                                ? `After ${item.availableAfter}`
                                : "Unavailable"}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(
                          (star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= item.popularity
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ),
                        )}
                      </span>
                      {item.avgPickupMinutes > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.avgPickupMinutes} min
                        </span>
                      )}
                      {item.avgPickupMinutes === 0 && (
                        <span className="text-green-600 font-semibold">
                          Instant pickup
                        </span>
                      )}
                    </div>

                    {item.available && !isCanteenClosed && (
                      <div className="flex items-center gap-2">
                        {/* Quantity stepper */}
                        <div className="flex items-center gap-1 border border-border rounded-xl bg-secondary/40">
                          <button
                            type="button"
                            onClick={() => setQty(item.id, getQty(item.id) - 1)}
                            className="p-1.5 hover:bg-accent rounded-l-xl transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">
                            {getQty(item.id)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.id, getQty(item.id) + 1)}
                            className="p-1.5 hover:bg-accent rounded-r-xl transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {item.isCustomizable ? (
                          <Button
                            data-ocid={`menu.customize_button.${idx + 1}`}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => handleCustomize(item)}
                          >
                            <Sliders className="w-3 h-3 mr-1" /> Customize
                          </Button>
                        ) : (
                          <Button
                            data-ocid={`menu.add_button.${idx + 1}`}
                            size="sm"
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => handleAdd(item)}
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add to Cart
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Customize Modal */}
      <AnimatePresence>
        {customizeItem && (
          <Dialog open onOpenChange={() => setCustomizeItem(null)}>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-extrabold">
                  Customize {customizeItem.name}
                </DialogTitle>
              </DialogHeader>
              {customizeItem.image && (
                <div className="rounded-xl overflow-hidden h-36 w-full mb-2">
                  <img
                    src={customizeItem.image}
                    alt={customizeItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-3 py-2">
                {customizeItem.customizations?.map((c) => (
                  <label
                    key={c.name}
                    htmlFor={`custom-${c.name}`}
                    className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 rounded-xl p-2 transition-colors"
                  >
                    <Checkbox
                      id={`custom-${c.name}`}
                      checked={selectedCustom.includes(c.name)}
                      onCheckedChange={(checked) => {
                        setSelectedCustom((p) =>
                          checked
                            ? [...p, c.name]
                            : p.filter((x) => x !== c.name),
                        );
                      }}
                    />
                    <span className="flex-1 font-medium">{c.name}</span>
                    <span className="text-primary font-bold">
                      +₹{c.priceAdj}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setCustomizeItem(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground"
                  onClick={handleAddCustomized}
                >
                  Add to Cart
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
