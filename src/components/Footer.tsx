interface FooterProps {
  onNavigateHome: (sectionId?: string) => void;
  onOpenTracker: () => void;
}

export function Footer({ onNavigateHome, onOpenTracker }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-display text-base font-bold text-[#0F2744]">
              IMUT Jabar
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Kantor Wilayah Direktorat Jenderal Pemasyarakatan Jawa Barat · Bandung
            </p>
          </div>

          <nav
            aria-label="Navigasi Footer"
            className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => onNavigateHome()}
              className="hover:text-[#0F2744]"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('prosedur')}
              className="hover:text-[#0F2744]"
            >
              Prosedur Mutasi
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('persyaratan')}
              className="hover:text-[#0F2744]"
            >
              Persyaratan Berkas
            </button>
            <button
              type="button"
              onClick={onOpenTracker}
              className="hover:text-[#0F2744]"
            >
              Cari Progres NIP
            </button>
          </nav>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5 text-xs text-slate-500">
          © {new Date().getFullYear()} IMUT Jabar — Layanan Informasi Monitoring
          Usulan Mutasi Pegawai Kanwil Ditjenpas Jawa Barat.
        </div>
      </div>
    </footer>
  );
}
