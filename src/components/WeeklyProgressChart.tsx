import React from "react";
import { motion } from "motion/react";

interface ProgressChartProps {
  weeklyHours: number[];
}

export default function WeeklyProgressChart({ weeklyHours }: ProgressChartProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxHours = Math.max(...weeklyHours, 1);

  // Map hours to heights in %
  const heights = weeklyHours.map((h) => (h / maxHours) * 80);

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 custom-shadow">
      <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-6">Weekly Progress</h3>
      <div className="relative h-32 flex items-end justify-between gap-2 mb-2 px-1">
        {weeklyHours.map((hours, i) => {
          // Highlight Thursday (i === 3) as active primary container, others as lighter translucent backgrounds
          const isMain = i === 3;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative" style={{ height: "100%" }}>
              {/* Tooltip bubble on hover */}
              <div className="absolute -top-8 bg-inverse-surface text-inverse-on-surface text-[10px] font-semibold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow">
                {hours} hours
              </div>
              
              <div className="w-full h-full flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heights[i]}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                  className={`w-full rounded-t-lg transition-colors cursor-pointer ${
                    isMain 
                      ? "bg-primary-container hover:bg-primary" 
                      : "bg-primary-fixed/20 group-hover:bg-primary-fixed/40"
                  }`}
                  title={`${days[i]}: ${hours} hours`}
                />
              </div>
            </div>
          );
        })}

        {/* Overlay smooth "Line" Path SVG for premium visual aesthetic matching mockup */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M 5 60 Q 20 40, 35 55 T 65 10 T 95 90"
            fill="none"
            className="stroke-primary"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider mt-4">
        {days.map((day) => (
          <span key={day} className="flex-1 text-center">{day}</span>
        ))}
      </div>
    </section>
  );
}
