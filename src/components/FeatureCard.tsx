interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  delay?: string;
}

export default function FeatureCard({ icon, title, description, ctaLabel, delay = "0s" }: FeatureCardProps) {
  return (
    <div
      className="glass-card p-8 rounded-3xl flex flex-col justify-between aspect-square md:aspect-auto md:h-80 float-anim"
      style={{ animationDelay: delay }}
    >
      <div>
        <span className="material-symbols-outlined text-primary mb-4 text-4xl">{icon}</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{title}</h3>
        <p className="font-body-md text-on-surface-variant/80">{description}</p>
      </div>
      <div className="mt-6 flex items-center text-primary font-label-caps text-label-caps gap-2 cursor-pointer hover:gap-4 transition-all">
        {ctaLabel} <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </div>
  );
}