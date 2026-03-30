"use client";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: string;
}

export default function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <div className={`card animate-fade-up ${delay} group hover:border-[#6366F1]/40`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2 group-hover:text-[#6366F1] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[#64748B] leading-relaxed">{description}</p>
    </div>
  );
}
