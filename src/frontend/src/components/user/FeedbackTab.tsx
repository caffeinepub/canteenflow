import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

export default function FeedbackTab() {
  const { orders, currentUser, submitFeedback } = useApp();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [hovered, setHovered] = useState<Record<string, number>>({});

  const pendingFeedback = orders.filter(
    (o) => o.userId === currentUser?.id && o.status === "Picked" && !o.feedback,
  );

  if (pendingFeedback.length === 0) {
    return (
      <div
        data-ocid="feedback.empty_state"
        className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground"
      >
        <MessageSquare className="w-16 h-16 opacity-20" />
        <p className="font-semibold text-lg">No feedback pending</p>
        <p className="text-sm">Collect your orders to leave feedback</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4" data-ocid="feedback.list">
      <h3 className="font-extrabold text-lg">Rate Your Experience</h3>
      {pendingFeedback.map((order, idx) => (
        <motion.div
          key={order.id}
          data-ocid={`feedback.item.${idx + 1}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="font-extrabold text-primary">{order.token}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {order.canteenName}
            </span>
          </div>

          <div className="space-y-1 mb-4">
            {order.items.map((item) => (
              <p key={item.menuItem.id} className="text-sm font-medium">
                {item.menuItem.name}
              </p>
            ))}
          </div>

          {/* Star Rating */}
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Rating</p>
            <div
              className="flex gap-1"
              data-ocid={`feedback.rating.${idx + 1}`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() =>
                    setHovered((p) => ({ ...p, [order.id]: star }))
                  }
                  onMouseLeave={() =>
                    setHovered((p) => ({ ...p, [order.id]: 0 }))
                  }
                  onClick={() =>
                    setRatings((p) => ({ ...p, [order.id]: star }))
                  }
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hovered[order.id] || ratings[order.id] || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <Textarea
            placeholder="Share your experience..."
            value={comments[order.id] ?? ""}
            onChange={(e) =>
              setComments((p) => ({ ...p, [order.id]: e.target.value }))
            }
            className="mb-4 resize-none"
            rows={3}
          />

          <Button
            data-ocid={`feedback.submit_button.${idx + 1}`}
            className="w-full bg-primary text-primary-foreground"
            disabled={!ratings[order.id]}
            onClick={() => {
              submitFeedback(
                order.id,
                ratings[order.id],
                comments[order.id] ?? "",
              );
              toast.success("Feedback submitted! Thank you 🌟");
            }}
          >
            Submit Feedback
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
