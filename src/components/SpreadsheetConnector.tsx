import { User } from 'firebase/auth';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Link2,
  LogOut,
  RefreshCw,
  Settings2,
  Upload,
} from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import {
  ColumnMapping,
  SpreadsheetConnectionState,
  SpreadsheetSourceMode,
} from '../types/mutation';
import { downloadSpreadsheetTemplate } from '../services/spreadsheetService';

interface SpreadsheetConnectorProps {
  connection: SpreadsheetConnectionState | null;
  sourceMode: SpreadsheetSourceMode;
  onChangeSourceMode: (mode: SpreadsheetSourceMode) => void;
  // OAuth props
  user: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  // Google Sheet input props
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
  // Mapping props
  headers: string[];
  mapping: ColumnMapping;
  onUpdateMapping: (next: ColumnMapping) => void;
}

const MAPPING_FIELDS: { key: keyof ColumnMapping; label: string; required?: boolean }[] = [
  { key: 'nip', label: 'Kolom NIP', required: true },
  { key: 'nama', label: 'Kolom Nama Pegawai', required: true },
  { key: 'status', label: 'Kolom Status / Progres', required: true },
  { key: 'pangkatGolongan', label: 'Kolom Pangkat / Golongan' },
  { key: 'jabatan', label: 'Kolom Jabatan' },
  { key: 'unitAsal', label: 'Kolom UPT Asal' },
  { key: 'unitTujuan', label: 'Kolom UPT Tujuan' },
  { key: 'jenisMutasi', label: 'Kolom Jenis Mutasi' },
  { key: 'tanggalUsulan', label: 'Kolom Tanggal Usulan' },
  { key: 'nomorSuratUsulan', label: 'Kolom Nomor Surat Usulan' },
  { key: 'nomorSk', label: 'Kolom Nomor SK' },
  { key: 'keterangan', label: 'Kolom Keterangan / Catatan' },
  { key: 'tanggalUpdate', label: 'Kolom Tanggal Update' },
];

export function SpreadsheetConnector({
  connection,
  sourceMode,
  onChangeSourceMode,
  user,
  needsAuth,
  isLoggingIn,
  onGoogleLogin,
  onGoogleLogout,
  sheetInputUrl,
  onSheetInputUrlChange,
  selectedTab,
  onSelectedTabChange,
  availableTabs,
  isLoadingSheet,
  errorMessage,
  onFetchTabsAndSync,
  onSyncSelectedTab,
  onSyncPublicSheet,
  onUploadCsvFile,
  headers,
  mapping,
  onUpdateMapping,
}: SpreadsheetConnectorProps) {
  const [showMapping, setShowMapping] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadCsvFile(file);
      e.target.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#0F2744]">
            <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[#0F2744]">
              Koneksi Data Spreadsheet
            </h3>
            <p className="mt-0.5 text-xs text-slate-600">
              Hubungkan Google Sheets kepegawaian atau unggah berkas CSV register
              mutasi.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadSpreadsheetTemplate}
          className="inline-flex items-center gap-2 self-start whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#0F2744] sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Unduh Template CSV</span>
        </button>
      </div>

      {/* Mode Switcher */}
      <div
        role="tablist"
        aria-label="Metode Koneksi Spreadsheet"
        className="mt-5 flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1 sm:inline-flex"
      >
        <button
          type="button"
          role="tab"
          aria-selected={sourceMode === 'google_oauth'}
          onClick={() => onChangeSourceMode('google_oauth')}
          className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
            sourceMode === 'google_oauth'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Google Sheets (Akun Google)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sourceMode === 'public_url'}
          onClick={() => onChangeSourceMode('public_url')}
          className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
            sourceMode === 'public_url'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tautan Publik Google Sheets
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sourceMode === 'local_csv'}
          onClick={() => onChangeSourceMode('local_csv')}
          className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
            sourceMode === 'local_csv'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Unggah File CSV
        </button>
      </div>

      {/* Panel 1: Google Sheets OAuth */}
      {sourceMode === 'google_oauth' && (
        <div className="mt-5 space-y-4">
          {needsAuth ? (
            <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Masuk untuk Membaca Google Sheets Internal
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Berikan izin akses baca Google Sheets agar IMUT Jabar dapat
                  mengambil daftar tab dan baris data usulan mutasi pegawai secara
                  langsung.
                </p>
              </div>
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={onGoogleLogin}
                className="gsi-material-button shrink-0"
              >
                <div className="gsi-material-button-state" />
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      style={{ display: 'block' }}
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    {isLoggingIn ? 'Menghubungkan...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2
                    className="h-4 w-4 text-[#16A34A] shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Terhubung sebagai{' '}
                    <strong className="font-semibold text-slate-900">
                      {user?.email || user?.displayName || 'Akun Google'}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onGoogleLogout}
                  className="inline-flex items-center gap-1.5 font-medium text-slate-600 hover:text-[#DC2626]"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Putuskan Akun</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                <div className="md:col-span-7">
                  <label
                    htmlFor="gsheet-url-input"
                    className="block text-xs font-medium text-slate-700"
                  >
                    URL atau ID Google Sheets
                  </label>
                  <input
                    id="gsheet-url-input"
                    type="text"
                    value={sheetInputUrl}
                    onChange={(e) => onSheetInputUrlChange(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E3A8A] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label
                    htmlFor="gsheet-tab-select"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Tab Worksheet
                  </label>
                  <select
                    id="gsheet-tab-select"
                    value={selectedTab}
                    disabled={availableTabs.length === 0 || isLoadingSheet}
                    onChange={(e) => {
                      onSelectedTabChange(e.target.value);
                      onSyncSelectedTab(e.target.value);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:border-[#1E3A8A] focus:outline-none"
                  >
                    {availableTabs.length === 0 ? (
                      <option value="">Muat daftar tab...</option>
                    ) : (
                      availableTabs.map((tab) => (
                        <option key={tab} value={tab}>
                          {tab}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="flex items-end md:col-span-2">
                  <button
                    type="button"
                    disabled={isLoadingSheet || !sheetInputUrl.trim()}
                    onClick={onFetchTabsAndSync}
                    className="inline-flex h-[38px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#0F2744] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${isLoadingSheet ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    <span>{isLoadingSheet ? 'Memuat...' : 'Sinkronkan'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Panel 2: Public URL */}
      {sourceMode === 'public_url' && (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-7">
            <label
              htmlFor="public-sheet-url"
              className="block text-xs font-medium text-slate-700"
            >
              Tautan Google Sheets Publik / Published CSV
            </label>
            <input
              id="public-sheet-url"
              type="text"
              value={sheetInputUrl}
              onChange={(e) => onSheetInputUrlChange(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../edit"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="public-tab-name"
              className="block text-xs font-medium text-slate-700"
            >
              Nama Tab (Opsional)
            </label>
            <input
              id="public-tab-name"
              type="text"
              value={selectedTab}
              onChange={(e) => onSelectedTabChange(e.target.value)}
              placeholder="Contoh: Usulan 2026"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E3A8A] focus:outline-none"
            />
          </div>

          <div className="flex items-end md:col-span-2">
            <button
              type="button"
              disabled={isLoadingSheet || !sheetInputUrl.trim()}
              onClick={onSyncPublicSheet}
              className="inline-flex h-[38px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#0F2744] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isLoadingSheet ? 'Memuat...' : 'Muat Tautan'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 md:col-span-12">
            Pastikan izin berbagi Google Sheets diatur ke &ldquo;Siapa saja yang memiliki
            tautan dapat melihat&rdquo;, atau gunakan tab Akun Google untuk spreadsheet
            internal.
          </p>
        </div>
      )}

      {/* Panel 3: Local CSV Upload */}
      {sourceMode === 'local_csv' && (
        <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-lg border border-dashed border-slate-300 bg-[#F8FAFC] p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Impor File Spreadsheet (.CSV)
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Unggah file CSV yang diekspor dari Google Sheets atau Microsoft Excel
              untuk langsung menguji pencarian NIP.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[#0F2744] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A8A]">
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Pilih File CSV</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Connected Metadata + Column Mapping Toggle */}
      {connection && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-900">
                {connection.spreadsheetTitle}
              </span>
              <span aria-hidden="true">·</span>
              <span>Tab: {connection.sheetName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {connection.rowCount} data pegawai
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                Sinkron: {connection.lastSyncedAt}
              </span>
            </div>

            {headers.length > 0 && (
              <button
                type="button"
                onClick={() => setShowMapping((prev) => !prev)}
                className="inline-flex items-center gap-1.5 font-medium text-[#1E3A8A] hover:text-[#0F2744]"
              >
                <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {showMapping ? 'Tutup Pemetaan Kolom' : 'Sesuaikan Pemetaan Kolom'}
                </span>
              </button>
            )}
          </div>

          {showMapping && headers.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 sm:grid-cols-2 lg:grid-cols-4">
              {MAPPING_FIELDS.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`map-${field.key}`}
                    className="block text-[11px] font-medium text-slate-600"
                  >
                    {field.label}
                    {field.required ? ' *' : ''}
                  </label>
                  <select
                    id={`map-${field.key}`}
                    value={mapping[field.key]}
                    onChange={(e) =>
                      onUpdateMapping({ ...mapping, [field.key]: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-[#1E3A8A] focus:outline-none"
                  >
                    <option value="">-- Tidak Dipetakan --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
