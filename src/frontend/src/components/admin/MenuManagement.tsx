import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "motion/react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function MenuManagement() {
  const {
    menuItems,
    canteens,
    toggleMenuAvailability,
    setMenuAvailableAfter,
    toggleCanteenStatus,
  } = useApp();
  const [filter, setFilter] = useState<string | null>(null);

  const grouped = canteens.map((c) => ({
    canteen: c,
    items: menuItems.filter(
      (m) => m.canteenId === c.id && (!filter || m.category === filter),
    ),
  }));

  return (
    <div className="p-6 space-y-6" data-ocid="admin.menu_list">
      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          null,
          "Regular",
          "Veg Thali",
          "Instant Snacks",
          "Packaged Snacks",
        ].map((cat) => (
          <button
            type="button"
            key={cat ?? "all"}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
              filter === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-secondary/60"
            }`}
          >
            {cat ?? "All"}
          </button>
        ))}
      </div>

      {grouped.map((g) => (
        <div key={g.canteen.id}>
          {/* Canteen header with open/close toggle */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primary inline-block" />
              {g.canteen.name}
            </h3>

            {/* Canteen Open/Closed Toggle */}
            <motion.div
              animate={{
                backgroundColor: g.canteen.isOpen
                  ? "oklch(0.95 0.05 145)"
                  : "oklch(0.95 0.04 25)",
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 px-4 py-2 rounded-2xl border"
              style={{
                borderColor: g.canteen.isOpen
                  ? "oklch(0.75 0.15 145)"
                  : "oklch(0.75 0.12 25)",
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  g.canteen.isOpen
                    ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)]"
                    : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]"
                }`}
              />
              <span
                className={`text-sm font-bold ${
                  g.canteen.isOpen ? "text-green-700" : "text-red-700"
                }`}
              >
                {g.canteen.isOpen ? "Canteen Open" : "Canteen Closed"}
              </span>
              <Switch
                data-ocid="admin.canteen_toggle.switch"
                checked={g.canteen.isOpen}
                onCheckedChange={() => toggleCanteenStatus(g.canteen.id)}
                className={`${
                  g.canteen.isOpen
                    ? "data-[state=checked]:bg-green-500"
                    : "data-[state=unchecked]:bg-red-400"
                }`}
              />
            </motion.div>
          </div>

          {/* Closed notice */}
          {!g.canteen.isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium flex items-center gap-2"
            >
              <span className="text-base">⚠️</span>
              Students will see this canteen as closed. Orders are disabled.
            </motion.div>
          )}

          <div className="space-y-3">
            {g.items.map((item, idx) => (
              <motion.div
                key={item.id}
                data-ocid={`admin.menu.item.${idx + 1}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    ₹{item.price} · {item.avgPickupMinutes} min avg
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Availability after input */}
                  {!item.available && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">
                        After:
                      </Label>
                      <Input
                        data-ocid={`admin.available_after.input.${idx + 1}`}
                        type="time"
                        value={item.availableAfter ?? ""}
                        onChange={(e) =>
                          setMenuAvailableAfter(item.id, e.target.value)
                        }
                        className="w-28 h-8 text-xs"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <Switch
                      data-ocid={`admin.availability.checkbox.${idx + 1}`}
                      checked={item.available}
                      onCheckedChange={() => toggleMenuAvailability(item.id)}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
