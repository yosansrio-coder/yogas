import { User } from 'firebase/auth';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileSearch,
  Search,
  Send,
  SlidersHorizontal,
  UserCheck,
  X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import {
  ColumnMapping,
  MUTATION_STAGES,
  MutationRecord,
  MutationStageId,
  SpreadsheetConnectionState,
  SpreadsheetSourceMode,
} from '../types/mutation';
import { ProgressStepper } from './ProgressStepper';
import { SpreadsheetConnector } from './SpreadsheetConnector';

interface NipTrackerViewProps {
  onBackHome: () => void;
  records: MutationRecord[];
  connection: SpreadsheetConnectionState | null;
  sourceMode: SpreadsheetSourceMode;
  onChangeSourceMode: (mode: SpreadsheetSourceMode) => void;
  user: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  sheetInputUrl: string;
  onSheetInputUrlChange: (val: string) => void;
  selectedTab: string;
  onSelectedTabChange: (tab: string) => void;
  availableTabs: string[];
  isLoadingSheet: boolean;
  errorMessage: string | null;
  onFetchTabsAndSync: () => void;
  onSyncSelectedTab: (tabName: string) => void;
  onSyncPublicSheet: () => void;
  onUploadCsvFile: (file: File) => void;
  headers: string[];
  mapping: ColumnMapping;
  onUpdateMapping: (next: ColumnMapping) => void;
}

function getStageBadgeStyles(stage: MutationStageId): {
  label: string;
  className: string;
  Icon: typeof Clock;
} {
  const meta = MUTATION_STAGES.find((s) => s.id === stage) || MUTATION_STAGES[0];
  switch (stage) {
    case 'sk_diterbitkan':
      return {
        label: meta.label,
        className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        Icon: CheckCircle2,
      };
    case 'proses_penandatanganan_sk':
      return {
        label: meta.label,
        className: 'border-blue-200 bg-blue-50 text-blue-800',
        Icon: FileCheck2,
      };
    case 'proses_pengusulan_dirjenpas':
      return {
        label: meta.label,
        className: 'border-indigo-200 bg-indigo-50 text-indigo-800',
        Icon: Send,
      };
    case 'menunggu_sidang_tpk_iii':
      return {
        label: meta.label,
        className: 'border-amber-200 bg-amber-50 text-amber-800',
        Icon: Clock,
      };
    case 'menunggu_persetujuan':
      return {
        label: meta.label,
        className: 'border-sky-200 bg-sky-50 text-sky-800',
        Icon: UserCheck,
      };
    default:
      return {
        label: meta.label,
        className: 'border-slate-200 bg-slate-100 text-slate-800',
        Icon: FileSearch,
      };
  }
}

export function NipTrackerView(props: NipTrackerViewProps) {
  const { records, connection, onBackHome } = props;
  const [nipQuery, setNipQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | MutationStageId>('all');
  const [selectedRecord, setSelectedRecord] = useState<MutationRecord | null>(null);
  const [showConnector, setShowConnector] = useState(!connection);

  const stageCounts = useMemo(() => {
    const counts: Record<MutationStageId, number> = {
      pengecekan_berkas: 0,
      menunggu_persetujuan: 0,
      menunggu_sidang_tpk_iii: 0,
      proses_pengusulan_dirjenpas: 0,
      proses_penandatanganan_sk: 0,
      sk_diterbitkan: 0,
    };
    for (const r of records) {
      counts[r.stage] = (counts[r.stage] || 0) + 1;
    }
    return counts;
  }, [records]);

  const searchMatches = useMemo(() => {
    const clean = submittedQuery.replace(/\s+/g, '').toLowerCase();
    if (!clean) return [];
    return records.filter((r) => {
      const nipClean = r.nip.replace(/\s+/g, '').toLowerCase();
      const namaClean = r.nama.toLowerCase();
      return nipClean.includes(clean) || namaClean.includes(submittedQuery.trim().toLowerCase());
    });
  }, [records, submittedQuery]);

  const filteredTableRecords = useMemo(() => {
    const clean = nipQuery.replace(/\s+/g, '').toLowerCase();
    return records.filter((r) => {
      const stageMatch = stageFilter === 'all' || r.stage === stageFilter;
      if (!stageMatch) return false;
      if (!clean) return true;
      return (
        r.nip.replace(/\s+/g, '').toLowerCase().includes(clean) ||
        r.nama.toLowerCase().includes(nipQuery.trim().toLowerCase()) ||
        r.unitAsal.toLowerCase().includes(nipQuery.trim().toLowerCase()) ||
        r.unitTujuan.toLowerCase().includes(nipQuery.trim().toLowerCase())
      );
    });
  }, [records, stageFilter, nipQuery]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nipQuery.trim();
    setSubmittedQuery(trimmed);
    if (!trimmed) {
      setSelectedRecord(null);
      return;
    }
    const clean = trimmed.replace(/\s+/g, '').toLowerCase();
    const exact = records.find(
      (r) => r.nip.replace(/\s+/g, '').toLowerCase() === clean
    );
    if (exact) {
      setSelectedRecord(exact);
      return;
    }
    const matches = records.filter(
      (r) =>
        r.nip.replace(/\s+/g, '').toLowerCase().includes(clean) ||
        r.nama.toLowerCase().includes(trimmed.toLowerCase())
    );
    setSelectedRecord(matches.length === 1 ? matches[0] : null);
  };

  const clearSearch = () => {
    setNipQuery('');
    setSubmittedQuery('');
    setSelectedRecord(null);
  };

  const activeStageMeta = selectedRecord
    ? MUTATION_STAGES.find((s) => s.id === selectedRecord.stage)
    : null;

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#F8FAFC] py-10 lg:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Top Utility Breadcrumb & Spreadsheet Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0F2744]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Halaman Utama</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConnector((prev) => !prev)}
            className="inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0F2744]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {showConnector
                ? 'Sembunyikan Pengaturan Spreadsheet'
                : connection
                ? 'Pengaturan & Sinkronisasi Spreadsheet'
                : 'Hubungkan Spreadsheet'}
            </span>
          </button>
        </div>

        {/* Dominant Focal Anchor: NIP Search Header */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-medium text-slate-500">
            Pencarian Progres Usulan Mutasi · Kanwil Ditjenpas Jawa Barat
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#0F2744] sm:text-3xl [text-wrap:balance]">
            Lacak Progres Mutasi Berdasarkan NIP
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Masukkan 18 digit NIP pegawai untuk melihat tahapan penyelesaian usulan
            secara rinci mulai dari Pengecekan Berkas hingga SK Diterbitkan.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="numeric"
                value={nipQuery}
                onChange={(e) => setNipQuery(e.target.value)}
                placeholder="Masukkan NIP (contoh: 199001012017121001) atau Nama Pegawai"
                aria-label="Cari berdasarkan NIP atau Nama Pegawai"
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-10 font-mono text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-[#1E3A8A] focus:outline-none tabular-nums"
              />
              {nipQuery && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[#0F2744] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A8A]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Cek Progres NIP</span>
            </button>
          </form>

          {/* Status Prompt if No Spreadsheet Connected */}
          {!connection && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-relaxed text-amber-900">
              Belum ada spreadsheet yang terhubung. Silakan hubungkan Google Sheets
              atau unggah file CSV melalui panel koneksi spreadsheet di bawah ini untuk
              mengaktifkan pencarian NIP.
            </div>
          )}
        </div>

        {/* Collapsible Spreadsheet Connection Console */}
        {(showConnector || !connection) && (
          <div className="mt-6">
            <SpreadsheetConnector
              connection={connection}
              sourceMode={props.sourceMode}
              onChangeSourceMode={props.onChangeSourceMode}
              user={props.user}
              needsAuth={props.needsAuth}
              isLoggingIn={props.isLoggingIn}
              onGoogleLogin={props.onGoogleLogin}
              onGoogleLogout={props.onGoogleLogout}
              sheetInputUrl={props.sheetInputUrl}
              onSheetInputUrlChange={props.onSheetInputUrlChange}
              selectedTab={props.selectedTab}
              onSelectedTabChange={props.onSelectedTabChange}
              availableTabs={props.availableTabs}
              isLoadingSheet={props.isLoadingSheet}
              errorMessage={props.errorMessage}
              onFetchTabsAndSync={props.onFetchTabsAndSync}
              onSyncSelectedTab={props.onSyncSelectedTab}
              onSyncPublicSheet={props.onSyncPublicSheet}
              onUploadCsvFile={props.onUploadCsvFile}
              headers={props.headers}
              mapping={props.mapping}
              onUpdateMapping={props.onUpdateMapping}
            />
          </div>
        )}

        {/* Active Search Result: Multiple Matches Selector */}
        {connection && submittedQuery && !selectedRecord && searchMatches.length > 1 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-base font-bold text-[#0F2744]">
              Ditemukan {searchMatches.length} Data Pegawai yang Cocok
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Pilih salah satu baris pegawai berikut untuk melihat detail progres 6
              tahapan.
            </p>
            <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
              {searchMatches.map((item) => {
                const badge = getStageBadgeStyles(item.stage);
                const BadgeIcon = badge.Icon;
                return (
                  <button
                    key={`${item.rowNumber}-${item.nip}`}
                    type="button"
                    onClick={() => setSelectedRecord(item)}
                    className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.nama}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-slate-500 tabular-nums">
                        NIP {item.nip} · {item.unitAsal} → {item.unitTujuan}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${badge.className}`}
                    >
                      <BadgeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{badge.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Search Result: Not Found */}
        {connection && submittedQuery && !selectedRecord && searchMatches.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-display text-base font-bold text-[#0F2744]">
              Data Usulan Mutasi Tidak Ditemukan
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-600">
              Pencarian untuk <span className="font-mono font-semibold">{submittedQuery}</span>{' '}
              tidak ditemukan pada tab <span className="font-semibold">{connection.sheetName}</span>.
              Periksa kembali 18 digit NIP tanpa spasi atau pastikan spreadsheet sudah
              disinkronkan dengan data terbaru.
            </p>
          </div>
        )}

        {/* Selected Employee Progress Result + 6-Stage Stepper */}
        {selectedRecord && activeStageMeta && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-medium text-slate-700 tabular-nums">
                    NIP {selectedRecord.nip}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedRecord.jenisMutasi}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    Baris #{selectedRecord.rowNumber}
                  </span>
                </div>

                <h2 className="mt-2 font-display text-2xl font-bold text-[#0F2744]">
                  {selectedRecord.nama}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedRecord.jabatan} · {selectedRecord.pangkatGolongan}
                </p>
              </div>

              {(() => {
                const badge = getStageBadgeStyles(selectedRecord.stage);
                const BadgeIcon = badge.Icon;
                return (
                  <div
                    className={`inline-flex items-center gap-2 self-start rounded-lg border px-3.5 py-2 text-xs font-semibold ${badge.className}`}
                  >
                    <BadgeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{badge.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* 6-Stage Visual Progress Stepper */}
            <div className="py-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  Progres Tahapan Mutasi (6 Tahap)
                </h3>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Tahap {activeStageMeta.stepNumber} dari 6
                </span>
              </div>

              <ProgressStepper currentStage={selectedRecord.stage} />
            </div>

            {/* Employee & Proposal Metadata Grid */}
            <dl className="grid grid-cols-1 gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs font-medium text-slate-500">UPT / Satker Asal</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedRecord.unitAsal}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500">UPT / Satker Tujuan</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedRecord.unitTujuan}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500">Tanggal Usulan</dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-slate-900 tabular-nums">
                  {selectedRecord.tanggalUsulan}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500">Update Terakhir</dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-slate-900 tabular-nums">
                  {selectedRecord.tanggalUpdate}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500">Nomor Surat Usulan</dt>
                <dd className="mt-1 font-mono text-sm text-slate-800 tabular-nums">
                  {selectedRecord.nomorSuratUsulan}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium text-slate-500">Nomor SK Mutasi</dt>
                <dd className="mt-1 font-mono text-sm text-slate-800 tabular-nums">
                  {selectedRecord.nomorSk}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-slate-500">
                  Keterangan / Catatan Verifikator
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-700">
                  {selectedRecord.keterangan !== '-'
                    ? selectedRecord.keterangan
                    : activeStageMeta.deskripsi}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Connected Spreadsheet Overview & Filterable Table */}
        {connection && records.length > 0 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0F2744]">
                  Rekapitulasi Register Usulan Mutasi
                </h2>
                <p className="mt-0.5 text-xs text-slate-600">
                  Pilih salah satu tahapan di bawah untuk menyaring daftar usulan atau
                  klik baris pegawai untuk menampilkan rincian progresnya.
                </p>
              </div>
              <span className="font-mono text-xs font-medium text-slate-600 tabular-nums">
                Total: {records.length} Usulan
              </span>
            </div>

            {/* 6-Stage Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setStageFilter('all')}
                className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors tabular-nums ${
                  stageFilter === 'all'
                    ? 'bg-[#0F2744] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                Semua ({records.length})
              </button>
              {MUTATION_STAGES.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setStageFilter(stage.id)}
                  className={`whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors tabular-nums ${
                    stageFilter === stage.id
                      ? 'bg-[#0F2744] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  {stage.label} ({stageCounts[stage.id]})
                </button>
              ))}
            </div>

            {/* Data Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 pr-4 font-semibold">NIP</th>
                    <th className="py-3 pr-4 font-semibold">Nama Pegawai</th>
                    <th className="py-3 pr-4 font-semibold">UPT Asal</th>
                    <th className="py-3 pr-4 font-semibold">UPT Tujuan</th>
                    <th className="py-3 pr-4 font-semibold">Tahapan Progres</th>
                    <th className="py-3 font-semibold text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTableRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-xs text-slate-500"
                      >
                        Tidak ada data pegawai yang cocok dengan filter atau kata kunci
                        saat ini.
                      </td>
                    </tr>
                  ) : (
                    filteredTableRecords.map((item) => {
                      const badge = getStageBadgeStyles(item.stage);
                      const BadgeIcon = badge.Icon;
                      const isRowSelected =
                        selectedRecord?.rowNumber === item.rowNumber &&
                        selectedRecord?.nip === item.nip;

                      return (
                        <tr
                          key={`${item.rowNumber}-${item.nip}`}
                          onClick={() => {
                            setSelectedRecord(item);
                            setNipQuery(item.nip !== '-' ? item.nip : item.nama);
                            setSubmittedQuery(item.nip !== '-' ? item.nip : item.nama);
                          }}
                          className={`cursor-pointer transition-colors ${
                            isRowSelected
                              ? 'bg-[#0F2744]/[0.04]'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 pr-4 font-mono font-medium text-slate-900 tabular-nums">
                            {item.nip}
                          </td>
                          <td className="py-3 pr-4 font-semibold text-slate-900">
                            {item.nama}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">{item.unitAsal}</td>
                          <td className="py-3 pr-4 text-slate-600">{item.unitTujuan}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
                            >
                              <BadgeIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                              <span>{badge.label}</span>
                            </span>
                          </td>
                          <td className="py-3 text-right font-mono text-slate-500 tabular-nums">
                            {item.tanggalUpdate}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
