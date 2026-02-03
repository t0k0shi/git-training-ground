import { ReactNode } from 'react';

interface StepGuideProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepGuide({ step, title, children }: StepGuideProps) {
  return (
    <section className="step-guide">
      <div className="step-header">
        <span className="step-number">Step {step}</span>
        <h2>{title}</h2>
      </div>
      <div className="step-content">{children}</div>
    </section>
  );
}
