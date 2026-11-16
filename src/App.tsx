import { User } from 'firebase/auth';
import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ActiveView, Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProceduresSection } from './components/ProceduresSection';
import { RequirementsSection } from './components/RequirementsSection';
import { NipTrackerView } from './components/NipTrackerView';
import { Footer } from './components/Footer';
import {
  getAccessToken,
  googleSignIn,
  initAuth,
  logout,
} from './services/googleAuth';
import {
  detectColumnMapping,
  extractSpreadsheetId,
  fetchPublicGoogleSheetCsv,
  fetchSheetValuesOAuth,
  fetchSpreadsheetMetadata,
  mapRowsToRecords,
  parseCsvFileText,
  RawSheetData,
} from './services/spreadsheetService';
import {
  ColumnMapping,
  SpreadsheetConnectionState,
  SpreadsheetSourceMode,
} from './types/mutation';

const CONFIG_STORAGE_KEY = 'imut_jabar_sheet_config_v1';

const EMPTY_MAPPING: ColumnMapping = {
  nip: '',
  nama: '',
  pangkatGolongan: '',
  jabatan: '',
  unitAsal: '',
  unitTujuan: '',
  jenisMutasi: '',
  status: '',
  tanggalUsulan: '',
  nomorSuratUsulan: '',
  nomorSk: '',
  keterangan: '',
  tanggalUpdate: '',
};

function formatSyncTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');

  // Google Auth State (access token stays strictly in memory inside googleAuth.ts)
  const [user, setUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Spreadsheet Connection State
  const [sourceMode, setSourceMode] = useState<SpreadsheetSourceMode>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.sourceMode === 'google_oauth' ||
          parsed.sourceMode === 'public_url' ||
          parsed.sourceMode === 'local_csv'
        ) {
          return parsed.sourceMode;
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return 'google_oauth';
  });

  const [sheetInputUrl, setSheetInputUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved).sheetInputUrl || '';
      }
    } catch {
      // Ignore
    }
    return '';
  });

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved).selectedTab || '';
      }
    } catch {
      // Ignore
    }
    return '';
  });

  const [availableTabs, setAvailableTabs] = useState<string[]>([]);
  const [isLoadingSheet, setIsLoadingSheet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [rawSheet, setRawSheet] = useState<RawSheetData>({
    headers: [],
    rows: [],
  });
  const [mapping, setMapping] = useState<ColumnMapping>(EMPTY_MAPPING);
  const [connection, setConnection] =
    useState<SpreadsheetConnectionState | null>(null);

  // Persist non-secret spreadsheet connection preferences (never tokens)
  useEffect(() => {
    try {
      localStorage.setItem(
        CONFIG_STORAGE_KEY,
        JSON.stringify({
          sourceMode,
          sheetInputUrl,
          selectedTab,
        })
      );
    } catch {
      // Ignore storage write errors
    }
  }, [sourceMode, sheetInputUrl, selectedTab]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (authedUser) => {
        setUser(authedUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const records = useMemo(() => {
    if (rawSheet.headers.length === 0) return [];
    return mapRowsToRecords(rawSheet, mapping);
  }, [rawSheet, mapping]);

  const handleNavigateHome = (sectionId?: string) => {
    setActiveView('home');
    if (sectionId) {
      window.requestAnimationFrame(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenTracker = () => {
    setActiveView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyLoadedSheetData = (
    data: RawSheetData,
    meta: Omit<SpreadsheetConnectionState, 'rowCount' | 'lastSyncedAt'>
  ) => {
    if (data.headers.length === 0) {
      throw new Error(
        'Spreadsheet atau tab yang dipilih kosong dan tidak memiliki baris header.'
      );
    }

    const detected = detectColumnMapping(data.headers);
    const mapped = mapRowsToRecords(data, detected);

    setRawSheet(data);
    setMapping(detected);
    setConnection({
      ...meta,
      rowCount: mapped.length,
      lastSyncedAt: formatSyncTime(new Date()),
    });
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setNeedsAuth(false);
      if (sheetInputUrl.trim()) {
        await syncOAuthSpreadsheet(result.accessToken, selectedTab);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal masuk dengan akun Google. Silakan coba kembali.';
      setErrorMessage(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setAvailableTabs([]);
  };

  const syncOAuthSpreadsheet = async (
    tokenOverride?: string,
    preferredTab?: string
  ) => {
    const token = tokenOverride || getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setErrorMessage(
        'Sesi akses Google Sheets telah berakhir. Silakan klik Sign in with Google kembali.'
      );
      return;
    }

    const spreadsheetId = extractSpreadsheetId(sheetInputUrl);
    if (!spreadsheetId) {
      setErrorMessage('Masukkan URL atau ID Google Sheets yang valid.');
      return;
    }

    setIsLoadingSheet(true);
    setErrorMessage(null);
    try {
      const meta = await fetchSpreadsheetMetadata(spreadsheetId, token);
      if (meta.sheets.length === 0) {
        throw new Error('Spreadsheet tidak memiliki worksheet tab.');
      }

      setAvailableTabs(meta.sheets);
      const targetTab =
        preferredTab && meta.sheets.includes(preferredTab)
          ? preferredTab
          : meta.sheets[0];
      setSelectedTab(targetTab);

      const values = await fetchSheetValuesOAuth(
        spreadsheetId,
        targetTab,
        token
      );
      applyLoadedSheetData(values, {
        mode: 'google_oauth',
        spreadsheetId,
        spreadsheetTitle: meta.title,
        sheetName: targetTab,
        availableTabs: meta.sheets,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kendala saat membaca Google Sheets.';
      setErrorMessage(msg);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  const handleSyncSelectedTab = async (tabName: string) => {
    const token = getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    const spreadsheetId = extractSpreadsheetId(sheetInputUrl);
    if (!spreadsheetId || !tabName) return;

    setIsLoadingSheet(true);
    setErrorMessage(null);
    try {
      const values = await fetchSheetValuesOAuth(spreadsheetId, tabName, token);
      applyLoadedSheetData(values, {
        mode: 'google_oauth',
        spreadsheetId,
        spreadsheetTitle: connection?.spreadsheetTitle || 'Google Sheets',
        sheetName: tabName,
        availableTabs,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memuat tab worksheet.';
      setErrorMessage(msg);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  const handleSyncPublicSheet = async () => {
    setIsLoadingSheet(true);
    setErrorMessage(null);
    try {
      const { data, spreadsheetId } = await fetchPublicGoogleSheetCsv(
        sheetInputUrl,
        selectedTab || undefined
      );
      applyLoadedSheetData(data, {
        mode: 'public_url',
        spreadsheetId,
        spreadsheetTitle: 'Google Sheets Publik',
        sheetName: selectedTab || 'Tab Utama',
        availableTabs: selectedTab ? [selectedTab] : [],
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memuat tautan spreadsheet.';
      setErrorMessage(msg);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  const handleUploadCsvFile = async (file: File) => {
    setIsLoadingSheet(true);
    setErrorMessage(null);
    try {
      const text = await file.text();
      const data = parseCsvFileText(text);
      applyLoadedSheetData(data, {
        mode: 'local_csv',
        spreadsheetId: file.name,
        spreadsheetTitle: file.name,
        sheetName: 'CSV Lokal',
        availableTabs: ['CSV Lokal'],
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal membaca file CSV.';
      setErrorMessage(msg);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  const handleUpdateMapping = (nextMapping: ColumnMapping) => {
    setMapping(nextMapping);
    if (connection && rawSheet.headers.length > 0) {
      const remapped = mapRowsToRecords(rawSheet, nextMapping);
      setConnection({
        ...connection,
        rowCount: remapped.length,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header
        activeView={activeView}
        onNavigateHome={handleNavigateHome}
        onOpenTracker={handleOpenTracker}
      />

      <main className="flex-1">
        {activeView === 'home' ? (
          <>
            <HeroSection
              onOpenTracker={handleOpenTracker}
              onJumpToProcedures={() => handleNavigateHome('prosedur')}
            />
            <ProceduresSection onOpenTracker={handleOpenTracker} />
            <RequirementsSection />

            {/* Closing Action Band */}
            <section className="border-t border-slate-200 bg-[#0F2744] py-12 text-white">
              <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight [text-wrap:balance]">
                    Sudah Mengajukan Usulan Mutasi?
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm text-slate-200">
                    Pantau progres penyelesaian berkas Anda mulai dari pengecekan awal,
                    Sidang TPK III, pengusulan ke Dirjenpas, hingga SK diterbitkan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenTracker}
                  className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0F2744] transition-colors hover:bg-slate-100"
                >
                  <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Cari Progres NIP</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </section>
          </>
        ) : (
          <NipTrackerView
            onBackHome={() => handleNavigateHome()}
            records={records}
            connection={connection}
            sourceMode={sourceMode}
            onChangeSourceMode={(mode) => {
              setSourceMode(mode);
              setErrorMessage(null);
            }}
            user={user}
            needsAuth={needsAuth}
            isLoggingIn={isLoggingIn}
            onGoogleLogin={handleGoogleLogin}
            onGoogleLogout={handleGoogleLogout}
            sheetInputUrl={sheetInputUrl}
            onSheetInputUrlChange={setSheetInputUrl}
            selectedTab={selectedTab}
            onSelectedTabChange={setSelectedTab}
            availableTabs={availableTabs}
            isLoadingSheet={isLoadingSheet}
            errorMessage={errorMessage}
            onFetchTabsAndSync={() => syncOAuthSpreadsheet(undefined, selectedTab)}
            onSyncSelectedTab={handleSyncSelectedTab}
            onSyncPublicSheet={handleSyncPublicSheet}
            onUploadCsvFile={handleUploadCsvFile}
            headers={rawSheet.headers}
            mapping={mapping}
            onUpdateMapping={handleUpdateMapping}
          />
        )}
      </main>

      <Footer
        onNavigateHome={handleNavigateHome}
        onOpenTracker={handleOpenTracker}
      />
    </div>
  );
}
