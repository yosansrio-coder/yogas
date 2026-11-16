import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

export type ActiveView = 'home' | 'tracker';

interface HeaderProps {
  activeView: ActiveView;
  onNavigateHome: (sectionId?: string) => void;
  onOpenTracker: () => void;
}

export function Header({
  activeView,
  onNavigateHome,
  onOpenTracker,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (target: 'beranda' | 'prosedur' | 'persyaratan' | 'tracker') => {
    setMobileMenuOpen(false);
    if (target === 'tracker') {
      onOpenTracker();
      return;
    }
    if (target === 'beranda') {
      onNavigateHome();
      return;
    }
    onNavigateHome(target);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('beranda')}
          className="whitespace-nowrap shrink-0 text-left font-display text-lg font-bold tracking-tight text-[#0F2744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
        >
          IMUT Jabar
        </button>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"
        >
          <button
            type="button"
            onClick={() => handleLinkClick('beranda')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#0F2744] hover:underline hover:underline-offset-4 ${
              activeView === 'home' ? 'text-[#0F2744] font-semibold' : ''
            }`}
          >
            Beranda
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('prosedur')}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#0F2744] hover:underline hover:underline-offset-4"
          >
            Prosedur
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('persyaratan')}
            className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#0F2744] hover:underline hover:underline-offset-4"
          >
            Persyaratan
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('tracker')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#0F2744] hover:underline hover:underline-offset-4 ${
              activeView === 'tracker' ? 'text-[#0F2744] font-semibold' : ''
            }`}
          >
            Cek Progres
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('tracker')}
            className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[#0F2744] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1E3A8A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Cari Progres NIP</span>
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <button
              type="button"
              onClick={() => handleLinkClick('beranda')}
              className="rounded-lg px-3 py-2.5 text-left hover:bg-slate-50"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('prosedur')}
              className="rounded-lg px-3 py-2.5 text-left hover:bg-slate-50"
            >
              Prosedur
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('persyaratan')}
              className="rounded-lg px-3 py-2.5 text-left hover:bg-slate-50"
            >
              Persyaratan
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('tracker')}
              className="rounded-lg px-3 py-2.5 text-left hover:bg-slate-50"
            >
              Cek Progres
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('tracker')}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F2744] px-4 py-2.5 text-sm font-medium text-white"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Cari Progres NIP</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
