export type MutationStageId =
  | 'pengecekan_berkas'
  | 'menunggu_persetujuan'
  | 'menunggu_sidang_tpk_iii'
  | 'proses_pengusulan_dirjenpas'
  | 'proses_penandatanganan_sk'
  | 'sk_diterbitkan';

export interface MutationStageMeta {
  id: MutationStageId;
  stepNumber: number;
  label: string;
  shortLabel: string;
  unitPelaksana: string;
  estimasiWaktu: string;
  deskripsi: string;
  outputDokumen: string;
}

export const MUTATION_STAGES: MutationStageMeta[] = [
  {
    id: 'pengecekan_berkas',
    stepNumber: 1,
    label: 'Pengecekan Berkas',
    shortLabel: 'Pengecekan Berkas',
    unitPelaksana: 'Subbagian Kepegawaian Kanwil Jabar',
    estimasiWaktu: '1–3 Hari Kerja',
    deskripsi:
      'Verifikasi kelengkapan dan keabsahan dokumen administrasi usulan mutasi dari Unit Pelaksana Teknis (UPT) asal sesuai daftar persyaratan.',
    outputDokumen: 'Lembar Ceklis Verifikasi Berkas Lengkap',
  },
  {
    id: 'menunggu_persetujuan',
    stepNumber: 2,
    label: 'Menunggu Persetujuan',
    shortLabel: 'Persetujuan Pimpinan',
    unitPelaksana: 'Kepala Bagian Tata Usaha & Kepala Kanwil',
    estimasiWaktu: '2–5 Hari Kerja',
    deskripsi:
      'Telaah formasi jabatan, analisis beban kerja pada UPT asal dan tujuan, serta persetujuan prinsip pimpinan Kantor Wilayah.',
    outputDokumen: 'Nota Dinas Pertimbangan & Disposisi Kakanwil',
  },
  {
    id: 'menunggu_sidang_tpk_iii',
    stepNumber: 3,
    label: 'Menunggu Sidang TPK III',
    shortLabel: 'Sidang TPK III',
    unitPelaksana: 'Tim Penilai Kinerja (TPK III) Kanwil Jabar',
    estimasiWaktu: 'Sesuai Jadwal Sidang',
    deskripsi:
      'Penjadwalan dan pembahasan usulan mutasi dalam forum Sidang Tim Penilai Kinerja (TPK III) tingkat Kantor Wilayah untuk menilai kelayakan dan rekam jejak pegawai.',
    outputDokumen: 'Berita Acara Hasil Sidang TPK III',
  },
  {
    id: 'proses_pengusulan_dirjenpas',
    stepNumber: 4,
    label: 'Proses Pengusulan ke Dirjenpas',
    shortLabel: 'Usulan ke Dirjenpas',
    unitPelaksana: 'Bagian Kepegawaian Ditjenpas Pusat',
    estimasiWaktu: '5–10 Hari Kerja',
    deskripsi:
      'Pengiriman surat usulan resmi beserta berkas pendukung dan Berita Acara TPK III kepada Direktorat Jenderal Pemasyarakatan untuk diproses lebih lanjut.',
    outputDokumen: 'Surat Pengantar Usulan Resmi Kanwil ke Ditjenpas',
  },
  {
    id: 'proses_penandatanganan_sk',
    stepNumber: 5,
    label: 'Proses Penandatanganan SK',
    shortLabel: 'Penandatanganan SK',
    unitPelaksana: 'Pejabat Pembina Kepegawaian / Dirjenpas',
    estimasiWaktu: '3–7 Hari Kerja',
    deskripsi:
      'Penyusunan konsep Keputusan (SK) Mutasi, paraf berjenjang, dan pengajuan penandatanganan Surat Keputusan oleh pejabat yang berwenang.',
    outputDokumen: 'Draf Final SK Mutasi Pegawai',
  },
  {
    id: 'sk_diterbitkan',
    stepNumber: 6,
    label: 'SK Diterbitkan',
    shortLabel: 'SK Diterbitkan',
    unitPelaksana: 'Subbagian Kepegawaian Kanwil & UPT Tujuan',
    estimasiWaktu: 'Selesai',
    deskripsi:
      'Surat Keputusan (SK) Mutasi telah ditandatangani, diberi nomor registrasi, dan siap diserahkan kepada pegawai serta UPT terkait untuk penerbitan SPMT.',
    outputDokumen: 'SK Mutasi Resmi & Pengantar Pelaksanaan Tugas',
  },
];

export interface MutationRecord {
  rowNumber: number;
  nip: string;
  nama: string;
  pangkatGolongan: string;
  jabatan: string;
  unitAsal: string;
  unitTujuan: string;
  jenisMutasi: string;
  stage: MutationStageId;
  rawStatus: string;
  tanggalUsulan: string;
  nomorSuratUsulan: string;
  nomorSk: string;
  keterangan: string;
  tanggalUpdate: string;
}

export interface ColumnMapping {
  nip: string;
  nama: string;
  pangkatGolongan: string;
  jabatan: string;
  unitAsal: string;
  unitTujuan: string;
  jenisMutasi: string;
  status: string;
  tanggalUsulan: string;
  nomorSuratUsulan: string;
  nomorSk: string;
  keterangan: string;
  tanggalUpdate: string;
}

export type SpreadsheetSourceMode = 'google_oauth' | 'public_url' | 'local_csv';

export interface SpreadsheetConnectionState {
  mode: SpreadsheetSourceMode;
  spreadsheetId: string;
  spreadsheetTitle: string;
  sheetName: string;
  availableTabs: string[];
  lastSyncedAt: string;
  rowCount: number;
}
