import { ChefHat, Shield, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const { login } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/40 to-accent/60 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/60 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg mb-4">
            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            CanZie
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Your campus dining, simplified
          </p>
        </motion.div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-xl border border-border p-8">
          <h2 className="text-xl font-bold text-center mb-2">
            Welcome back 👋
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Choose how you want to sign in
          </p>

          <div className="space-y-4">
            {/* Customer */}
            <motion.button
              type="button"
              data-ocid="login.customer_button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login("customer")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-secondary/60 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-foreground">
                  I&apos;m a Customer
                </div>
                <div className="text-sm text-muted-foreground">
                  Browse menu &amp; place orders
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  aria-hidden="true"
                >
                  <title>Google</title>
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </div>
            </motion.button>

            {/* Admin */}
            <motion.button
              type="button"
              data-ocid="login.admin_button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login("admin")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-secondary/60 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-foreground">Canteen Admin</div>
                <div className="text-sm text-muted-foreground">
                  Manage orders &amp; menu
                </div>
              </div>
              <div className="flex items-center gap-2 bg-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                Admin Portal
              </div>
            </motion.button>

            {/* Chef */}
            <motion.button
              type="button"
              data-ocid="login.chef_button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login("chef")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-amber-300 hover:bg-amber-50/60 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <ChefHat className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-foreground">I&apos;m a Chef</div>
                <div className="text-sm text-muted-foreground">
                  Manage kitchen orders
                </div>
              </div>
              <div className="flex items-center gap-2 bg-amber-500 rounded-xl px-3 py-1.5 text-xs font-semibold text-white">
                Kitchen Portal
              </div>
            </motion.button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our campus dining terms
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; {new Date().getFullYear()}. Built with &hearts; using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
