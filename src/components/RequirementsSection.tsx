import { Check, ChevronDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { MUTATION_FAQS, MUTATION_REQUIREMENTS } from '../data/mutationGuide';

export function RequirementsSection() {
  const [activeCategoryId, setActiveCategoryId] = useState(
    MUTATION_REQUIREMENTS[0].id
  );
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const activeCategory =
    MUTATION_REQUIREMENTS.find((c) => c.id === activeCategoryId) ||
    MUTATION_REQUIREMENTS[0];

  const completedCount = activeCategory.dokumen.filter(
    (doc) => checkedDocs[doc.id]
  ).length;
  const totalCount = activeCategory.dokumen.length;

  const toggleDoc = (docId: string) => {
    setCheckedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  const resetCategoryChecklist = () => {
    setCheckedDocs((prev) => {
      const next = { ...prev };
      for (const doc of activeCategory.dokumen) {
        delete next[doc.id];
      }
      return next;
    });
  };

  return (
    <section id="persyaratan" className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Kelengkapan Administrasi Kepegawaian
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#0F2744] sm:text-3xl [text-wrap:balance]">
              Persyaratan Berkas Mutasi
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Pilih kategori usulan mutasi dan tandai dokumen yang telah Anda siapkan
            sebelum berkas diajukan melalui pengelola kepegawaian UPT.
          </p>
        </div>

        {/* Category Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Kategori Persyaratan Mutasi"
          className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4"
        >
          {MUTATION_REQUIREMENTS.map((cat) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`whitespace-nowrap shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0F2744] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Category Overview + Interactive Document Checklist */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6">
              <h3 className="font-display text-lg font-bold text-[#0F2744]">
                {activeCategory.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {activeCategory.ringkasan}
              </p>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold text-slate-700">
                  Dasar Pertimbangan
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {activeCategory.dasarPertimbangan}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">
                    Kesiapan Berkas Anda
                  </span>
                  <span className="font-mono font-semibold text-[#0F2744] tabular-nums">
                    {completedCount}/{totalCount} Dokumen
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-[#1E3A8A] transition-all duration-200"
                    style={{
                      width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                    }}
                  />
                </div>

                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={resetCategoryChecklist}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0F2744]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reset ceklis kategori ini</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {activeCategory.dokumen.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc.id];
                return (
                  <label
                    key={doc.id}
                    className="flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-slate-50/70 sm:p-5"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDoc(doc.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                        isChecked
                          ? 'border-[#0F2744] bg-[#0F2744] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="h-3.5 w-3.5" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isChecked
                              ? 'text-slate-500 line-through'
                              : 'text-slate-900'
                          }`}
                        >
                          {idx + 1}. {doc.namaDokumen}
                        </span>
                        <span className="text-xs text-slate-500">
                          {doc.wajib ? 'Dokumen Wajib' : 'Dokumen Pendukung'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {doc.keterangan}
                      </p>
                      <p className="mt-1.5 font-mono text-[11px] text-slate-500">
                        Format: {doc.format}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-16 border-t border-slate-200 pt-12">
          <div className="max-w-2xl">
            <h3 className="font-display text-xl font-bold text-[#0F2744]">
              Pertanyaan Umum Layanan Mutasi
            </h3>
            <p className="mt-1.5 text-sm text-slate-600">
              Informasi ringkas mengenai mekanisme verifikasi dan pemantauan NIP.
            </p>
          </div>

          <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {MUTATION_FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-semibold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
