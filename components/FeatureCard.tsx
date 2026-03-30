"use client";

import ScrollReveal from "./ScrollReveal";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accent?: string;
  delay?: number;
}

export default function FeatureCard({
  icon,
  title,
  description,
  accent = "#7C3AED",
  delay = 0,
}: FeatureCardProps) {
  return (
    <ScrollReveal blur delay={delay}>
      <div className="bezel-inner-subtle card-interactive h-full group cursor-default">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 relative"
          style={{ background: `${accent}18` }}
        >
          <span role="img" aria-hidden="true">{icon}</span>
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ boxShadow: `0 0 24px ${accent}30` }}
          />
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-[#FAFAFA] mb-3 tracking-tight group-hover:text-white transition-colors duration-500">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[14px] text-[#6B7280] leading-relaxed group-hover:text-[#9CA3AF] transition-colors duration-500">
          {description}
        </p>

        {/* Accent line */}
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:from-transparent group-hover:via-white/20 transition-all duration-700" />
      </div>
    </ScrollReveal>
  );
}
