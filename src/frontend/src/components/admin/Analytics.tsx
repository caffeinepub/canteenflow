import { IndianRupee, ShoppingBag, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "../../context/AppContext";

const PIE_COLORS = ["#7C3AED", "#A78BFA", "#4ade80", "#94a3b8"];

type FilterType = "daily" | "weekly" | "monthly";

export default function Analytics() {
  const { orders } = useApp();
  const [filter, setFilter] = useState<FilterType>("daily");

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      const diff = now.getTime() - o.createdAt.getTime();
      if (filter === "daily") return diff <= 24 * 60 * 60 * 1000;
      if (filter === "weekly") return diff <= 7 * 24 * 60 * 60 * 1000;
      return diff <= 30 * 24 * 60 * 60 * 1000;
    });
  }, [orders, filter]);

  const totalRevenue = filteredOrders.reduce((s, o) => s + o.totalAmount, 0);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of filteredOrders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const hourlyData = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let h = 8; h <= 20; h++) counts[h] = 0;
    for (const o of filteredOrders) {
      const h = o.createdAt.getHours();
      counts[h] = (counts[h] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));
  }, [filteredOrders]);

  const popularItem = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of filteredOrders) {
      for (const item of o.items) {
        counts[item.menuItem.name] = (counts[item.menuItem.name] ?? 0) + 1;
      }
    }
    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";
  }, [filteredOrders]);

  return (
    <div className="p-6 space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["daily", "weekly", "monthly"] as FilterType[]).map((f) => (
          <button
            type="button"
            key={f}
            data-ocid={`admin.analytics_${f}_tab`}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all border ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "border-border hover:bg-secondary/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Orders",
            value: filteredOrders.length,
            icon: ShoppingBag,
            color: "text-primary",
          },
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toFixed(0)}`,
            icon: IndianRupee,
            color: "text-green-600",
          },
          {
            label: "Most Popular",
            value: popularItem,
            icon: TrendingUp,
            color: "text-amber-600",
          },
        ].map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <m.icon className={`w-5 h-5 ${m.color}`} />
              <p className="text-sm font-semibold text-muted-foreground">
                {m.label}
              </p>
            </div>
            <p className="text-2xl font-extrabold truncate">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h4 className="font-extrabold mb-4">Order Status Distribution</h4>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              No data for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      data-ocid="admin.analytics.chart_point"
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h4 className="font-extrabold mb-4">Orders by Hour</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={hourlyData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="oklch(0.65 0.2 290)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
