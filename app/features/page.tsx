import { Feature } from "@/constants/types";
import { FEATURES } from "@/constants/constants";
import SectionHeader from "@/components/SectionHeader";

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      className="group rounded-2xl border border-white/30 bg-white/3 p-5
        hover:bg-white/6 hover:border-white/40 transition-all duration-200"
    >
      <span className="text-yellow-500 text-lg block mb-4">{feature.icon}</span>
      <p className="text-sm font-semibold text-white mb-1.5">{feature.title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to audit your AI spend."
          description="Built for engineering leads, finance teams, and founders who want clarity on AI tooling costs."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
