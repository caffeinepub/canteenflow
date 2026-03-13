import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetTime: Date;
  onExpire?: () => void;
}

export default function CountdownTimer({
  targetTime,
  onExpire,
}: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, targetTime.getTime() - Date.now());
      setRemaining(diff);
      if (diff === 0 && onExpire) onExpire();
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (remaining === 0) {
    return <span className="text-green-600 font-bold text-sm">Ready!</span>;
  }

  return (
    <span className="font-mono font-bold text-primary text-sm">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}
