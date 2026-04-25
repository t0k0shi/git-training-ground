import { ReactNode } from 'react';

interface StepGuideProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepGuide({ step, title, children }: StepGuideProps) {
  return (
    <section className="relative pl-12 pb-8 border-l-2 border-line last:border-l-0">
      <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-accent text-paper flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-ink mb-3">
          <span className="text-accent mr-2">Step {step}</span>
          {title}
        </h2>
        <div className="text-ink-2 leading-relaxed space-y-3">{children}</div>
      </div>
    </section>
  );
}
