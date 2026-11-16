import { ArrowRight, Building2, Search } from 'lucide-react';
import { useState } from 'react';

interface HeroSectionProps {
  onOpenTracker: () => void;
  onJumpToProcedures: () => void;
}

const HERO_IMAGE_PATH = '/src/assets/images/kanwil_jabar_building_1794802980936.jpg';

export function HeroSection({
  onOpenTracker,
  onJumpToProcedures,
}: HeroSectionProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Narrative Column */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="text-xs font-medium tracking-wide text-slate-500">
              Kantor Wilayah Direktorat Jenderal Pemasyarakatan Jawa Barat
            </p>

            <h1 className="mt-3 max-w-2xl font-display text-[clamp(2rem,3.6vw,3.15rem)] font-bold leading-[1.12] tracking-tight text-[#0F2744] [text-wrap:balance]">
              Monitoring Progres Usulan Mutasi Pegawai
            </h1>

            <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-slate-600">
              Layanan informasi kepegawaian terpadu untuk memantau alur prosedur,
              kelengkapan berkas persyaratan, serta status penyelesaian usulan mutasi
              pegawai berbasis Nomor Induk Pegawai (NIP) yang terhubung langsung dengan
              spreadsheet kepegawaian.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenTracker}
                className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 rounded-lg bg-[#0F2744] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Cari Progres Berdasarkan NIP</span>
              </button>

              <button
                type="button"
                onClick={onJumpToProcedures}
                className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0F2744]"
              >
                <span>Lihat Prosedur & Syarat</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-5">
            <div className="relative h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-80 lg:h-full lg:min-h-[340px]">
              {!imgFailed ? (
                <img
                  src={HERO_IMAGE_PATH}
                  alt="Gedung Kantor Wilayah Direktorat Jenderal Pemasyarakatan Jawa Barat"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-center">
                  <Building2
                    className="h-12 w-12 text-[#0F2744]/60"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-[#0F2744]">
                    Kanwil Ditjenpas Jawa Barat
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Portal Layanan Kepegawaian & Mutasi
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5">
                <p className="text-xs font-medium text-white/95">
                  Layanan Administrasi Kepegawaian Wilayah Jawa Barat
                </p>
                <p className="mt-0.5 text-xs text-slate-200">
                  Transparansi 6 tahapan penyelesaian usulan mutasi pegawai
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Institutional Summary Strip */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-[#F8FAFC] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          <div className="p-5">
            <p className="font-mono text-xs font-medium text-slate-500 tabular-nums">
              01
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#0F2744]">
              6 Tahapan Resmi Terpantau
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Mulai dari pengecekan berkas hingga penerbitan SK mutasi.
            </p>
          </div>
          <div className="p-5 sm:border-l sm:border-slate-200 lg:border-l-0">
            <p className="font-mono text-xs font-medium text-slate-500 tabular-nums">
              02
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#0F2744]">
              Pencarian NIP 18 Digit
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Lacak status usulan individu secara cepat dan akurat.
            </p>
          </div>
          <div className="p-5 sm:border-t sm:border-slate-200 lg:border-t-0">
            <p className="font-mono text-xs font-medium text-slate-500 tabular-nums">
              03
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#0F2744]">
              Terhubung Google Sheets
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Sinkronisasi langsung dengan data register spreadsheet kepegawaian.
            </p>
          </div>
          <div className="p-5 sm:border-t sm:border-l sm:border-slate-200 lg:border-t-0 lg:border-l-0">
            <p className="font-mono text-xs font-medium text-slate-500 tabular-nums">
              04
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#0F2744]">
              Ceklis Kesiapan Berkas
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Panduan kelengkapan dokumen per jenis usulan mutasi UPT.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
