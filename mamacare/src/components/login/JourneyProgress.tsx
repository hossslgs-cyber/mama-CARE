'use client';

import { memo, type JSX } from 'react';

const steps = ['Register', 'Monitor', 'Deliver', 'Grow'] as const;

interface JourneyProgressProps {
  activeStep?: number;
}

function JourneyProgress({ activeStep = 0 }: JourneyProgressProps): JSX.Element {
  return (
    <div className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-[#00d4aa]/20 bg-[rgba(15,23,42,0.6)] px-6 py-3 backdrop-blur-md motion-safe:animate-fade-in">
      {steps.map((step, i) => (
        <div key={step}>
          {i > 0 && (
            <div className="mx-2 inline-block h-px w-8 bg-gradient-to-r from-slate-600 to-transparent" />
          )}
          <div
            className={`flex items-center gap-2 text-xs font-medium ${
              i <= activeStep ? 'text-[#00d4aa]' : 'text-slate-400'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i <= activeStep
                  ? 'bg-[#00d4aa] shadow-[0_0_10px_rgba(0,212,170,0.4)]'
                  : 'bg-slate-600'
              }`}
            />
            <span className="hidden sm:inline">{step}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(JourneyProgress);
