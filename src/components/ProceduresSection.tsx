import { ArrowRight, CheckCircle2, Clock, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { MUTATION_STAGES } from '../types/mutation';

interface ProceduresSectionProps {
  onOpenTracker: () => void;
}

export function ProceduresSection({ onOpenTracker }: ProceduresSectionProps) {
  const [selectedStageId, setSelectedStageId] = useState(MUTATION_STAGES[0].id);

  const selectedStage =
    MUTATION_STAGES.find((s) => s.id === selectedStageId) || MUTATION_STAGES[0];

  return (
    <section id="prosedur" className="border-b border-slate-200 bg-[#F8FAFC] py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Alur Penyelesaian Usulan
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#0F2744] sm:text-3xl [text-wrap:balance]">
              Prosedur Mutasi Pegawai (6 Tahapan)
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Setiap usulan mutasi yang masuk ke Kantor Wilayah Ditjenpas Jawa Barat
            melalui enam tahapan berjenjang berikut sebelum Surat Keputusan diterbitkan.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Interactive 6-Stage Index */}
          <div className="space-y-2 lg:col-span-5">
            {MUTATION_STAGES.map((stage) => {
              const isSelected = stage.id === selectedStage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                    isSelected
                      ? 'border-[#0F2744] bg-white text-[#0F2744]'
                      : 'border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold tabular-nums ${
                        isSelected
                          ? 'bg-[#0F2744] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      0{stage.stepNumber}
                    </span>
                    <span className="truncate text-sm font-semibold">
                      {stage.label}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums">
                    {stage.estimasiWaktu}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Stage Detail Panel */}
          <div className="lg:col-span-7">
            <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-[#1E3A8A] tabular-nums">
                    Tahap 0{selectedStage.stepNumber} dari 06
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedStage.unitPelaksana}</span>
                </div>

                <h3 className="mt-2 font-display text-2xl font-bold text-[#0F2744]">
                  {selectedStage.label}
                </h3>

                <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-slate-600 sm:text-base">
                  {selectedStage.deskripsi}
                </p>

                <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Users className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span>Unit Penanggung Jawab</span>
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                      {selectedStage.unitPelaksana}
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span>Estimasi Proses</span>
                    </dt>
                    <dd className="mt-1.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
                      {selectedStage.estimasiWaktu}
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <FileText className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span>Keluaran Dokumen</span>
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                      {selectedStage.outputDokumen}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" aria-hidden="true" />
                  <span>
                    Status tahapan ini tercatat langsung pada daftar progres pegawai.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenTracker}
                  className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 text-sm font-semibold text-[#1E3A8A] hover:text-[#0F2744]"
                >
                  <span>Cek Status NIP Sekarang</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
