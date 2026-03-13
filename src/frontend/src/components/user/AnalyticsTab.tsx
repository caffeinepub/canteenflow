import {
  BarChart2,
  Heart,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "../../context/AppContext";

export default function AnalyticsTab() {
  const { orders, currentUser } = useApp();

  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter(
      (o) => o.userId === currentUser.id && o.status !== "Pending",
    );
  }, [orders, currentUser]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthOrders = useMemo(
    () =>
      userOrders.filter(
        (o) =>
          o.createdAt.getMonth() === currentMonth &&
          o.createdAt.getFullYear() === currentYear,
      ),
    [userOrders, currentMonth, currentYear],
  );

  const ordersThisMonth = monthOrders.length;
  const moneySpentThisMonth = monthOrders.reduce(
    (s, o) => s + o.totalAmount,
    0,
  );

  const favoriteItem = useMemo(() => {
    if (userOrders.length === 0) return "—";
    const freq: Record<string, number> = {};
    for (const order of userOrders) {
      for (const item of order.items) {
        const name = item.menuItem.name;
        freq[name] = (freq[name] ?? 0) + 1;
      }
    }
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [userOrders]);

  // Daily spending chart for current month
  const dailyData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const data: { day: number; amount: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOrders = monthOrders.filter((o) => o.createdAt.getDate() === d);
      data.push({
        day: d,
        amount: dayOrders.reduce((s, o) => s + o.totalAmount, 0),
      });
    }
    return data;
  }, [monthOrders, currentMonth, currentYear]);

  const monthName = now.toLocaleString("default", { month: "long" });

  const stats = [
    {
      label: "Orders this month",
      value: ordersThisMonth,
      icon: ShoppingBag,
      color: "text-violet-600",
      bg: "bg-violet-50",
      ocid: "analytics.orders_card",
    },
    {
      label: "Money spent",
      value: `₹${moneySpentThisMonth.toFixed(0)}`,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      ocid: "analytics.money_card",
    },
    {
      label: "Favorite item",
      value: favoriteItem,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-50",
      ocid: "analytics.favorite_card",
    },
  ];

  if (userOrders.length === 0) {
    return (
      <div
        data-ocid="analytics.empty_state"
        className="flex flex-col items-center justify-center h-full gap-4 py-20 text-muted-foreground"
      >
        <BarChart2 className="w-16 h-16 opacity-20" />
        <p className="font-semibold text-lg">No orders yet</p>
        <p className="text-sm text-center max-w-xs">
          Start ordering to see your personal food analytics here!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            My Food Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            {monthName} {currentYear}
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            data-ocid={stat.ocid}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4"
          >
            <div
              className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                {stat.label}
              </p>
              <p className="text-2xl font-extrabold tracking-tight truncate">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Daily Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-bold mb-1 text-sm">Daily spending — {monthName}</h3>
        <p className="text-xs text-muted-foreground mb-5">
          ₹ spent per day this month
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={dailyData}
            margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              formatter={(value: number) => [`₹${value}`, "Spent"]}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="amount"
              fill="hsl(var(--primary))"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
