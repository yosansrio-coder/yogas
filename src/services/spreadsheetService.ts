import {
  ColumnMapping,
  MUTATION_STAGES,
  MutationRecord,
  MutationStageId,
} from '../types/mutation';

export interface SpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: string[];
}

export interface RawSheetData {
  headers: string[];
  rows: string[][];
}

export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return trimmed.replace(/[^a-zA-Z0-9-_]/g, '');
}

export async function fetchSpreadsheetMetadata(
  spreadsheetId: string,
  accessToken: string
): Promise<SpreadsheetMetadata> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}?fields=properties.title,sheets.properties(title,index)`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    const msg =
      errBody?.error?.message ||
      `Gagal mengakses spreadsheet (HTTP ${res.status}). Pastikan ID benar dan akun Google memiliki akses.`;
    throw new Error(msg);
  }

  const data = await res.json();
  const sheets = (data.sheets || []).map(
    (s: { properties?: { title?: string } }) => s.properties?.title || 'Sheet1'
  );

  return {
    spreadsheetId,
    title: data.properties?.title || 'Spreadsheet Mutasi',
    sheets,
  };
}

export async function fetchSheetValuesOAuth(
  spreadsheetId: string,
  sheetName: string,
  accessToken: string
): Promise<RawSheetData> {
  const escapedTab = `'${sheetName.replace(/'/g, "''")}'`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}/values/${encodeURIComponent(escapedTab)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    const msg =
      errBody?.error?.message ||
      `Gagal membaca data tab "${sheetName}" (HTTP ${res.status}).`;
    throw new Error(msg);
  }

  const data = await res.json();
  const values: string[][] = data.values || [];
  return normalizeRawGrid(values);
}

export async function fetchPublicGoogleSheetCsv(
  urlOrId: string,
  sheetName?: string
): Promise<{ data: RawSheetData; spreadsheetId: string }> {
  const trimmed = urlOrId.trim();
  if (!trimmed) {
    throw new Error('Masukkan URL Google Sheets atau URL CSV publik terlebih dahulu.');
  }

  let fetchUrl = trimmed;
  const spreadsheetId = extractSpreadsheetId(trimmed);

  // If user pasted a direct published CSV URL (output=csv or tqx=out:csv), use directly
  const isDirectCsv =
    trimmed.includes('output=csv') || trimmed.includes('tqx=out:csv');

  if (!isDirectCsv) {
    if (!spreadsheetId) {
      throw new Error('Format tautan Google Sheets tidak valid.');
    }
    const tabParam = sheetName
      ? `&sheet=${encodeURIComponent(sheetName)}`
      : '';
    fetchUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(
      spreadsheetId
    )}/gviz/tq?tqx=out:csv${tabParam}`;
  }

  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(
      `Tidak dapat memuat spreadsheet publik (HTTP ${res.status}). Jika file bersifat internal/privat, gunakan tombol Masuk dengan Google.`
    );
  }

  const text = await res.text();
  if (
    text.trim().startsWith('<!DOCTYPE html') ||
    text.trim().startsWith('<html')
  ) {
    throw new Error(
      'Spreadsheet bersifat privat atau memerlukan autentikasi. Gunakan koneksi Akun Google untuk membaca data spreadsheet internal.'
    );
  }

  const grid = parseCsv(text);
  return {
    data: normalizeRawGrid(grid),
    spreadsheetId: spreadsheetId || 'public-csv',
  };
}

export function parseCsvFileText(text: string): RawSheetData {
  const grid = parseCsv(text);
  return normalizeRawGrid(grid);
}

function normalizeRawGrid(grid: string[][]): RawSheetData {
  const nonEmpty = grid.filter((row) =>
    row.some((cell) => (cell ?? '').toString().trim() !== '')
  );
  if (nonEmpty.length === 0) {
    return { headers: [], rows: [] };
  }

  const rawHeaders = nonEmpty[0].map((h, idx) => {
    const clean = (h ?? '').toString().trim();
    return clean || `Kolom ${idx + 1}`;
  });

  const rows = nonEmpty.slice(1).map((row) =>
    rawHeaders.map((_, idx) => (row[idx] ?? '').toString().trim())
  );

  return { headers: rawHeaders, rows };
}

// RFC-4180 compliant CSV parser with delimiter auto-detection (comma vs semicolon)
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/)[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ';' : ',';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

export function detectColumnMapping(headers: string[]): ColumnMapping {
  const findMatch = (keywords: string[]): string => {
    const lowerHeaders = headers.map((h) => h.toLowerCase().trim());
    for (const kw of keywords) {
      const exactIdx = lowerHeaders.findIndex((h) => h === kw);
      if (exactIdx !== -1) return headers[exactIdx];
    }
    for (const kw of keywords) {
      const partialIdx = lowerHeaders.findIndex((h) => h.includes(kw));
      if (partialIdx !== -1) return headers[partialIdx];
    }
    return '';
  };

  return {
    nip: findMatch(['nip', 'nomor induk pegawai', 'no induk']),
    nama: findMatch(['nama pegawai', 'nama lengkap', 'nama']),
    pangkatGolongan: findMatch(['pangkat/golongan', 'pangkat', 'golongan', 'gol']),
    jabatan: findMatch(['jabatan', 'posisi']),
    unitAsal: findMatch(['upt asal', 'unit asal', 'satker asal', 'asal']),
    unitTujuan: findMatch(['upt tujuan', 'unit tujuan', 'satker tujuan', 'tujuan']),
    jenisMutasi: findMatch(['jenis mutasi', 'jenis usulan', 'kategori']),
    status: findMatch(['progres', 'status mutasi', 'status', 'tahap', 'tahapan']),
    tanggalUsulan: findMatch(['tanggal usulan', 'tgl usulan', 'tanggal pengajuan', 'tgl surat']),
    nomorSuratUsulan: findMatch(['nomor surat', 'no surat', 'no. surat', 'surat usulan']),
    nomorSk: findMatch(['nomor sk', 'no sk', 'no. sk', 'sk mutasi']),
    keterangan: findMatch(['keterangan', 'catatan', 'info', 'tindak lanjut']),
    tanggalUpdate: findMatch(['tanggal update', 'tgl update', 'diperbarui', 'update terakhir']),
  };
}

export function normalizeMutationStage(rawValue: string): MutationStageId {
  const v = rawValue.toLowerCase().trim();
  if (!v) return 'pengecekan_berkas';

  if (
    v.includes('diterbitkan') ||
    v.includes('terbit') ||
    v.includes('selesai') ||
    v === '6'
  ) {
    return 'sk_diterbitkan';
  }
  if (
    v.includes('penandatanganan') ||
    v.includes('ttd') ||
    v.includes('tanda tangan') ||
    v === '5'
  ) {
    return 'proses_penandatanganan_sk';
  }
  if (
    v.includes('dirjenpas') ||
    v.includes('pengusulan') ||
    v.includes('pusat') ||
    v === '4'
  ) {
    return 'proses_pengusulan_dirjenpas';
  }
  if (
    v.includes('tpk') ||
    v.includes('sidang') ||
    v === '3'
  ) {
    return 'menunggu_sidang_tpk_iii';
  }
  if (
    v.includes('persetujuan') ||
    v.includes('setuju') ||
    v.includes('kakanwil') ||
    v.includes('pimpinan') ||
    v === '2'
  ) {
    return 'menunggu_persetujuan';
  }

  return 'pengecekan_berkas';
}

export function mapRowsToRecords(
  raw: RawSheetData,
  mapping: ColumnMapping
): MutationRecord[] {
  const idxOf = (colName: string) =>
    colName ? raw.headers.indexOf(colName) : -1;

  const iNip = idxOf(mapping.nip);
  const iNama = idxOf(mapping.nama);
  const iPangkat = idxOf(mapping.pangkatGolongan);
  const iJabatan = idxOf(mapping.jabatan);
  const iAsal = idxOf(mapping.unitAsal);
  const iTujuan = idxOf(mapping.unitTujuan);
  const iJenis = idxOf(mapping.jenisMutasi);
  const iStatus = idxOf(mapping.status);
  const iTglUsulan = idxOf(mapping.tanggalUsulan);
  const iNoSurat = idxOf(mapping.nomorSuratUsulan);
  const iNoSk = idxOf(mapping.nomorSk);
  const iKet = idxOf(mapping.keterangan);
  const iUpdate = idxOf(mapping.tanggalUpdate);

  const getVal = (row: string[], index: number) =>
    index >= 0 && index < row.length ? (row[index] || '').trim() : '';

  return raw.rows
    .map((row, idx): MutationRecord | null => {
      const nipRaw = getVal(row, iNip).replace(/\s+/g, '');
      const nama = getVal(row, iNama);
      if (!nipRaw && !nama) return null;

      const rawStatus = getVal(row, iStatus);
      const stage = normalizeMutationStage(rawStatus);

      return {
        rowNumber: idx + 2,
        nip: nipRaw || '-',
        nama: nama || 'Nama Tidak Tercantum',
        pangkatGolongan: getVal(row, iPangkat) || '-',
        jabatan: getVal(row, iJabatan) || '-',
        unitAsal: getVal(row, iAsal) || '-',
        unitTujuan: getVal(row, iTujuan) || '-',
        jenisMutasi: getVal(row, iJenis) || 'Usulan Mutasi Pegawai',
        stage,
        rawStatus:
          rawStatus ||
          MUTATION_STAGES.find((s) => s.id === stage)?.label ||
          'Pengecekan Berkas',
        tanggalUsulan: getVal(row, iTglUsulan) || '-',
        nomorSuratUsulan: getVal(row, iNoSurat) || '-',
        nomorSk: getVal(row, iNoSk) || '-',
        keterangan: getVal(row, iKet) || '-',
        tanggalUpdate: getVal(row, iUpdate) || '-',
      };
    })
    .filter((item): item is MutationRecord => item !== null);
}

export function downloadSpreadsheetTemplate() {
  const headers = [
    'NIP',
    'Nama Pegawai',
    'Pangkat/Golongan',
    'Jabatan',
    'UPT Asal',
    'UPT Tujuan',
    'Jenis Mutasi',
    'Status Progres',
    'Tanggal Usulan',
    'Nomor Surat Usulan',
    'Nomor SK',
    'Keterangan',
    'Tanggal Update',
  ];

  // Clean header-only + structural stage reference comment rows so admin knows exact 6 status options
  const exampleStructureRows = [
    [
      '199001012017121001',
      'Contoh Pegawai (Ganti dengan data asli)',
      'Penata Muda (III/a)',
      'Penjaga Tahanan',
      'Lapas Kelas I Sukamiskin',
      'Lapas Kelas IIA Banceuy',
      'Antar UPT Jawa Barat',
      'Pengecekan Berkas',
      '2026-11-01',
      'W.11.KP.04.01-1024',
      '-',
      'Pilihan status valid: Pengecekan Berkas | Menunggu Persetujuan | Menunggu Sidang TPK III | Proses Pengusulan ke Dirjenpas | Proses Penandatanganan SK | SK Diterbitkan',
      '2026-11-15',
    ],
  ];

  const csvLines = [headers, ...exampleStructureRows].map((row) =>
    row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
  );

  const blob = new Blob(['\uFEFF' + csvLines.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'template_imut_jabar.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
