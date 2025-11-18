import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/formatters";

export function useTimeAgo(date: Date | string, refreshIntervalMs = 60000) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    const updateTime = () => setTimeAgo(formatTimeAgo(date));

    updateTime();

    if (refreshIntervalMs === null) {
      return;
    }

    const intervalId = window.setInterval(updateTime, refreshIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [date, refreshIntervalMs]);

  return timeAgo;
}
