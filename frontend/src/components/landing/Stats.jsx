import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboardService";

export default function Stats() {
  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();

        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
  {
    value: stats.total,
    label: "Total Issues",
    color: "text-white",
  },
  {
    value: stats.reported,
    label: "Reported",
    color: "text-blue-500",
  },
  {
    value: stats.inProgress,
    label: "In Progress",
    color: "text-amber-500",
  },
  {
    value: stats.resolved,
    label: "Resolved",
    color: "text-emerald-500",
  },
];

  return (
    <section
      id="stats"
      className="bg-slate-900 text-slate-300 py-10 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-16 rounded-lg bg-slate-800 animate-pulse"
              />
            ))
          : statsData.map(({ value, label, color }) => (
              <div key={label} className="space-y-1">
                <span className={`text-3xl font-extrabold tracking-tight ${color}`}>
  {value}
</span>

                <span className="text-xs text-slate-400 block uppercase font-semibold">
                  {label}
                </span>
              </div>
            ))}
      </div>
    </section>
  );
}