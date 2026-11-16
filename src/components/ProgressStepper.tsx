import { Check, CircleDot, Clock } from 'lucide-react';
import { MUTATION_STAGES, MutationStageId } from '../types/mutation';

interface ProgressStepperProps {
  currentStage: MutationStageId;
}

export function ProgressStepper({ currentStage }: ProgressStepperProps) {
  const currentIdx = MUTATION_STAGES.findIndex((s) => s.id === currentStage);
  const activeIndex = currentIdx === -1 ? 0 : currentIdx;
  const isCompletedAll = currentStage === 'sk_diterbitkan';

  return (
    <div className="w-full">
      {/* Desktop Horizontal Stepper */}
      <ol
        aria-label="Tahapan Progres Mutasi"
        className="hidden grid-cols-6 gap-3 lg:grid"
      >
        {MUTATION_STAGES.map((stage, idx) => {
          const isDone = idx < activeIndex || (isCompletedAll && idx === activeIndex);
          const isCurrent = idx === activeIndex && !isCompletedAll;

          return (
            <li key={stage.id} className="relative flex flex-col">
              {/* Connector bar */}
              <div className="flex items-center">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition-colors ${
                    isDone
                      ? 'border-[#16A34A] bg-[#16A34A] text-white'
                      : isCurrent
                      ? 'border-[#0F2744] bg-[#0F2744] text-white ring-4 ring-[#0F2744]/10'
                      : 'border-slate-300 bg-white text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : isCurrent ? (
                    <CircleDot className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span className="font-mono">0{stage.stepNumber}</span>
                  )}
                </div>
                {idx < MUTATION_STAGES.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={`ml-2 h-[2px] flex-1 ${
                      idx < activeIndex ? 'bg-[#16A34A]' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>

              <div className="mt-3 pr-2">
                <p
                  className={`text-xs font-semibold leading-snug ${
                    isCurrent
                      ? 'text-[#0F2744]'
                      : isDone
                      ? 'text-slate-900'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {isDone
                    ? 'Selesai'
                    : isCurrent
                    ? 'Sedang diproses'
                    : 'Menunggu tahap sebelumnya'}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Mobile & Tablet Vertical Stepper */}
      <ol
        aria-label="Tahapan Progres Mutasi"
        className="space-y-3 lg:hidden"
      >
        {MUTATION_STAGES.map((stage, idx) => {
          const isDone = idx < activeIndex || (isCompletedAll && idx === activeIndex);
          const isCurrent = idx === activeIndex && !isCompletedAll;

          return (
            <li
              key={stage.id}
              className={`flex items-start gap-3.5 rounded-lg border p-3.5 ${
                isCurrent
                  ? 'border-[#0F2744] bg-[#0F2744]/[0.03]'
                  : isDone
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-200 bg-slate-50/70'
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold tabular-nums ${
                  isDone
                    ? 'border-[#16A34A] bg-[#16A34A] text-white'
                    : isCurrent
                    ? 'border-[#0F2744] bg-[#0F2744] text-white'
                    : 'border-slate-300 bg-white text-slate-500'
                }`}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : isCurrent ? (
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <span className="font-mono">0{stage.stepNumber}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-[#0F2744]'
                        : isDone
                        ? 'text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      isDone
                        ? 'text-[#16A34A]'
                        : isCurrent
                        ? 'text-[#1E3A8A]'
                        : 'text-slate-400'
                    }`}
                  >
                    {isDone
                      ? 'Selesai'
                      : isCurrent
                      ? 'Tahap Aktif'
                      : 'Belum Berjalan'}
                  </span>
                </div>
                {isCurrent && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {stage.deskripsi}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
