'use client';

import { memo, type JSX } from 'react';
import { User, Baby, Heart, Footprints, Plus } from 'lucide-react';

interface JourneyStageProps {
  icon: JSX.Element;
  label: string;
  sublabel: string;
  delay: number;
}

function JourneyStage({ icon, label, sublabel, delay }: JourneyStageProps): JSX.Element {
  return (
    <div
      className="absolute bottom-[12%] flex -translate-x-1/2 flex-col items-center opacity-0 motion-safe:animate-fade-up"
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0891b2] text-lg shadow-[0_0_20px_rgba(0,212,170,0.4),0_0_40px_rgba(0,212,170,0.2)] motion-safe:animate-[nodeFloat_3s_ease-in-out_infinite] motion-safe:origin-center z-[2]">
        {icon}
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.5px] text-[#f0f9ff] drop-shadow-lg">
          {label}
        </p>
        <p className="mt-0.5 text-[0.65rem] font-normal text-[#94a3b8]">{sublabel}</p>
      </div>
    </div>
  );
}

const MemoizedStage = memo(JourneyStage);

const stages = [
  { icon: <User className="h-5 w-5 text-white" />, label: 'Registration', sublabel: 'Nurse Visit', left: '15%', delay: 0.5 },
  { icon: <Baby className="h-5 w-5 text-white" />, label: 'Pregnancy', sublabel: 'Care & Monitoring', left: '40%', delay: 1.5 },
  { icon: <Heart className="h-5 w-5 text-white" />, label: 'Delivery', sublabel: 'Safe Birth', left: '65%', delay: 2.5 },
  { icon: <Footprints className="h-5 w-5 text-white" />, label: 'First Steps', sublabel: 'Growing Strong', left: '88%', delay: 3.5 },
];

function MaternalJourney(): JSX.Element {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Landscape gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[rgba(0,212,170,0.05)] to-transparent" />

      {/* Journey path */}
      <div
        className="absolute bottom-[15%] left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-[rgba(0,212,170,0.6)] to-transparent motion-safe:animate-pulse"
        style={{ animationDuration: '3s' }}
      />

      {/* Stages */}
      {stages.map((stage) => (
        <div key={stage.label} className="absolute" style={{ left: stage.left }}>
          <MemoizedStage
            icon={stage.icon}
            label={stage.label}
            sublabel={stage.sublabel}
            delay={stage.delay}
          />
        </div>
      ))}

      {/* Particles */}
      <div
        className="absolute left-[15%] bottom-[20%] h-1 w-1 rounded-full bg-[#00d4aa] opacity-0 motion-safe:animate-[particleRise_4s_ease-in-out_infinite]"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute left-[40%] bottom-[25%] h-1 w-1 rounded-full bg-[#00d4aa] opacity-0 motion-safe:animate-[particleRise_5s_ease-in-out_infinite]"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute left-[65%] bottom-[22%] h-1 w-1 rounded-full bg-[#00d4aa] opacity-0 motion-safe:animate-[particleRise_4.5s_ease-in-out_infinite]"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute left-[88%] bottom-[28%] h-1 w-1 rounded-full bg-[#00d4aa] opacity-0 motion-safe:animate-[particleRise_5.5s_ease-in-out_infinite]"
        style={{ animationDelay: '0.5s' }}
      />

      {/* Floating symbols */}
      <div className="absolute top-[15%] left-[8%] text-2xl text-[rgba(0,212,170,0.15)] motion-safe:animate-float pointer-events-none">
        <Plus className="h-6 w-6" />
      </div>
      <div className="absolute top-[25%] right-[12%] text-lg text-[rgba(0,212,170,0.15)] motion-safe:animate-float pointer-events-none">
        <Heart className="h-5 w-5" fill="currentColor" />
      </div>
      <div className="absolute top-[60%] left-[5%] text-3xl text-[rgba(0,212,170,0.15)] motion-safe:animate-float pointer-events-none">
        <Plus className="h-8 w-8" />
      </div>
      <div className="absolute top-[70%] right-[8%] text-2xl text-[rgba(0,212,170,0.15)] motion-safe:animate-float pointer-events-none">
        <Heart className="h-7 w-7" fill="currentColor" />
      </div>
      <div className="absolute top-[40%] left-[25%] text-lg text-[rgba(0,212,170,0.15)] motion-safe:animate-float pointer-events-none">
        <Plus className="h-5 w-5" />
      </div>

      {/* Heartbeat rings */}
      <div
        className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(0,212,170,0.05)] motion-safe:animate-heartbeat"
        style={{ animationDuration: '2s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(0,212,170,0.05)] motion-safe:animate-heartbeat"
        style={{ animationDuration: '2s', animationDelay: '0.5s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(0,212,170,0.05)] motion-safe:animate-heartbeat"
        style={{ animationDuration: '2s', animationDelay: '1s' }}
      />
    </div>
  );
}

export default memo(MaternalJourney);
