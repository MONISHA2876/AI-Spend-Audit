import { Step } from "@/constants/types";
import { STEPS } from "@/constants/constants";
import SectionHeader from "@/components/SectionHeader";

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-5 items-start relative">
      {!isLast && (
        <div className="hidden lg:block absolute top-4 left-[calc(50%+2rem)] right-[-50%] h-px bg-white/10" />
      )}

      <div className="flex items-start gap-4 lg:flex-col lg:gap-4 w-full">
        <div
          className="shrink-0 w-8 h-8 rounded-lg border border-white/10 bg-white/5
          flex items-center justify-center"
        >
          <span className="text-xs font-semibold text-yellow-500">
            {step.number}
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-white mb-1.5">
            {step.title}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-55">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="bg-black border-t border-white/5 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps to a leaner AI stack."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 relative">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
