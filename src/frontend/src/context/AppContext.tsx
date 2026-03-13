import { type ReactNode, createContext, useContext, useState } from "react";
import { initialCanteens, initialMenuItems } from "../data/mockData";

export interface Canteen {
  id: string;
  name: string;
  description: string;
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  canteenId: string;
  name: string;
  category: "Regular" | "Veg Thali" | "Instant Snacks" | "Packaged Snacks";
  price: number;
  popularity: number;
  avgPickupMinutes: number;
  available: boolean;
  availableAfter?: string;
  isCustomizable?: boolean;
  customizations?: { name: string; priceAdj: number }[];
  image?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations?: string[];
  totalPrice: number;
}

export interface Order {
  id: string;
  token: string;
  canteenId: string;
  canteenName: string;
  userId: string;
  items: CartItem[];
  status: "Pending" | "Preparing" | "Ready" | "Picked";
  paymentMethod: "GPay" | "PhonePe";
  totalAmount: number;
  pickupTime: string | undefined;
  createdAt: Date;
  preparationStartedAt?: Date;
  estimatedReadyAt?: Date;
  feedback?: { rating: number; comment: string };
}

export interface AppUser {
  id: string;
  name: string;
  role: "customer" | "admin" | "chef";
}

interface AppContextType {
  currentUser: AppUser | null;
  canteens: Canteen[];
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  tokenCounter: number;
  login: (role: "customer" | "admin" | "chef") => void;
  logout: () => void;
  addToCart: (item: MenuItem, qty: number, customizations?: string[]) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: (
    canteenId: string,
    paymentMethod: "GPay" | "PhonePe",
    pickupTime?: string,
  ) => Order[];
  startPreparing: (orderId: string) => void;
  markReady: (orderId: string) => void;
  markPicked: (orderId: string) => void;
  toggleMenuAvailability: (itemId: string) => void;
  setMenuAvailableAfter: (itemId: string, time: string) => void;
  submitFeedback: (orderId: string, rating: number, comment: string) => void;
  updateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  cancelOrder: (orderId: string) => void;
  toggleCanteenStatus: (canteenId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [canteens, setCanteens] = useState<Canteen[]>(initialCanteens);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tokenCounter, setTokenCounter] = useState(0);

  const login = (role: "customer" | "admin" | "chef") => {
    if (role === "customer") {
      setCurrentUser({ id: "user-1", name: "Priya Sharma", role: "customer" });
    } else if (role === "admin") {
      setCurrentUser({ id: "admin-1", name: "Canteen Manager", role: "admin" });
    } else {
      setCurrentUser({ id: "chef-1", name: "Chef Kumar", role: "chef" });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const addToCart = (
    item: MenuItem,
    qty: number,
    customizations?: string[],
  ) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      const customAdj = customizations
        ? (item.customizations
            ?.filter((c) => customizations.includes(c.name))
            .reduce((s, c) => s + c.priceAdj, 0) ?? 0)
        : 0;
      const unitPrice = item.price + customAdj;
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id
            ? {
                ...c,
                quantity: c.quantity + qty,
                totalPrice: unitPrice * (c.quantity + qty),
              }
            : c,
        );
      }
      return [
        ...prev,
        {
          menuItem: item,
          quantity: qty,
          selectedCustomizations: customizations,
          totalPrice: unitPrice * qty,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (
    canteenId: string,
    paymentMethod: "GPay" | "PhonePe",
    pickupTime?: string,
  ): Order[] => {
    const canteen = canteens.find((c) => c.id === canteenId);
    if (!canteen || !currentUser) return [];

    let counter = tokenCounter;
    const newOrders: Order[] = [];

    for (const cartItem of cart) {
      for (let i = 0; i < cartItem.quantity; i++) {
        counter++;
        const isInstant =
          cartItem.menuItem.category === "Instant Snacks" ||
          cartItem.menuItem.category === "Packaged Snacks" ||
          cartItem.menuItem.avgPickupMinutes <= 5;
        const order: Order = {
          id: `order-${Date.now()}-${counter}`,
          token: `T-${String(counter).padStart(3, "0")}`,
          canteenId,
          canteenName: canteen.name,
          userId: currentUser.id,
          items: [
            {
              ...cartItem,
              quantity: 1,
              totalPrice: cartItem.totalPrice / cartItem.quantity,
            },
          ],
          status: isInstant ? "Ready" : "Pending",
          paymentMethod,
          totalAmount: cartItem.totalPrice / cartItem.quantity,
          pickupTime,
          createdAt: new Date(),
        };
        newOrders.push(order);
      }
    }

    setTokenCounter(counter);
    setOrders((prev) => [...prev, ...newOrders]);
    clearCart();
    return newOrders;
  };

  const startPreparing = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Preparing",
              preparationStartedAt: new Date(),
              estimatedReadyAt: new Date(
                Date.now() +
                  (o.items[0]?.menuItem.avgPickupMinutes ?? 20) * 60 * 1000,
              ),
            }
          : o,
      ),
    );
  };

  const markReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Ready" } : o)),
    );
  };

  const markPicked = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Picked" } : o)),
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.filter((o) => !(o.id === orderId && o.status === "Pending")),
    );
  };

  const toggleMenuAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((m) =>
        m.id === itemId ? { ...m, available: !m.available } : m,
      ),
    );
  };

  const setMenuAvailableAfter = (itemId: string, time: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, availableAfter: time } : m)),
    );
  };

  const submitFeedback = (orderId: string, rating: number, comment: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, feedback: { rating, comment } } : o,
      ),
    );
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, ...updates } : m)),
    );
  };

  const toggleCanteenStatus = (canteenId: string) => {
    setCanteens((prev) =>
      prev.map((c) => (c.id === canteenId ? { ...c, isOpen: !c.isOpen } : c)),
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        canteens,
        menuItems,
        orders,
        cart,
        tokenCounter,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        startPreparing,
        markReady,
        markPicked,
        toggleMenuAvailability,
        setMenuAvailableAfter,
        submitFeedback,
        updateMenuItem,
        cancelOrder,
        toggleCanteenStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
