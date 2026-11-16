export interface RequirementItem {
  id: string;
  namaDokumen: string;
  keterangan: string;
  format: string;
  wajib: boolean;
}

export interface MutationCategoryRequirement {
  id: string;
  label: string;
  ringkasan: string;
  dasarPertimbangan: string;
  dokumen: RequirementItem[];
}

export const MUTATION_REQUIREMENTS: MutationCategoryRequirement[] = [
  {
    id: 'antar_upt',
    label: 'Antar UPT Jawa Barat',
    ringkasan:
      'Usulan perpindahan pegawai antar Lembaga Pemasyarakatan, Rutan, LPKA, Bapas, atau Rupbasan dalam satu wilayah kerja Kanwil Ditjenpas Jawa Barat.',
    dasarPertimbangan:
      'Memerlukan rekomendasi Kepala UPT asal, ketersediaan formasi pada UPT tujuan, serta evaluasi kinerja pegawai minimal 2 tahun terakhir.',
    dokumen: [
      {
        id: 'upt_1',
        namaDokumen: 'Surat Pengantar Kepala UPT Asal',
        keterangan: 'Ditujukan kepada Kepala Kantor Wilayah Ditjenpas Jawa Barat.',
        format: 'PDF pindai asli bermaterai/cap dinas',
        wajib: true,
      },
      {
        id: 'upt_2',
        namaDokumen: 'Surat Permohonan Mutasi Pegawai',
        keterangan: 'Ditulis oleh pegawai pemohon dan ditandatangani di atas materai Rp10.000.',
        format: 'PDF pindai asli',
        wajib: true,
      },
      {
        id: 'upt_3',
        namaDokumen: 'Surat Pernyataan Melepas dari Kepala UPT Asal',
        keterangan: 'Menyatakan persetujuan melepas pegawai tanpa mengganggu operasional UPT.',
        format: 'PDF bertanda tangan pejabat berwenang',
        wajib: true,
      },
      {
        id: 'upt_4',
        namaDokumen: 'Surat Keterangan Kesediaan Menerima dari UPT Tujuan',
        keterangan: 'Dilampiri peta jabatan atau kebutuhan formasi pada satuan kerja tujuan.',
        format: 'PDF bertanda tangan pejabat berwenang',
        wajib: true,
      },
      {
        id: 'upt_5',
        namaDokumen: 'SK CPNS, SK PNS, SK Pangkat & SK Jabatan Terakhir',
        keterangan: 'Seluruh SK kepegawaian terbaru yang telah dilegalisasi oleh pejabat kepegawaian.',
        format: 'PDF gabungan berurutan kronologis',
        wajib: true,
      },
      {
        id: 'upt_6',
        namaDokumen: 'Penilaian Kinerja (SKP) 2 Tahun Terakhir',
        keterangan: 'Minimal bernilai Baik pada seluruh unsur penilaian kinerja.',
        format: 'PDF hasil cetak e-Kinerja / SKP resmi',
        wajib: true,
      },
      {
        id: 'upt_7',
        namaDokumen: 'Surat Keterangan Tidak Sedang Menjalani Hukuman Disiplin',
        keterangan: 'Diterbitkan oleh atasan langsung atau pejabat pengelola kepegawaian UPT.',
        format: 'PDF surat keterangan aktif',
        wajib: true,
      },
      {
        id: 'upt_8',
        namaDokumen: 'Daftar Riwayat Hidup (DRH) Terbaru',
        keterangan: 'Memuat riwayat pendidikan, kepangkatan, jabatan, dan penugasan terakhir.',
        format: 'PDF format standar kepegawaian',
        wajib: true,
      },
    ],
  },
  {
    id: 'antar_kanwil',
    label: 'Antar Kantor Wilayah',
    ringkasan:
      'Usulan mutasi pegawai masuk ke lingkungan Kanwil Ditjenpas Jawa Barat atau keluar menuju Kantor Wilayah provinsi lain.',
    dasarPertimbangan:
      'Melibatkan koordinasi antar dua Kantor Wilayah dan penetapan persetujuan akhir oleh Direktorat Jenderal Pemasyarakatan.',
    dokumen: [
      {
        id: 'ak_1',
        namaDokumen: 'Surat Usulan Resmi Kepala Kantor Wilayah Asal',
        keterangan: 'Nota dinas/surat pengantar persetujuan lintas wilayah kerja.',
        format: 'PDF bernomor surat resmi',
        wajib: true,
      },
      {
        id: 'ak_2',
        namaDokumen: 'Surat Persetujuan Penerimaan Kanwil Tujuan',
        keterangan: 'Menyatakan ketersediaan kuota dan formasi jabatan di wilayah tujuan.',
        format: 'PDF bernomor surat resmi',
        wajib: true,
      },
      {
        id: 'ak_3',
        namaDokumen: 'Analisis Jabatan & Analisis Beban Kerja (Anjab/ABK)',
        keterangan: 'Ringkasan komposisi pegawai pada satker asal dan tujuan.',
        format: 'PDF lampiran peta jabatan',
        wajib: true,
      },
      {
        id: 'ak_4',
        namaDokumen: 'Berkas Kepegawaian Lengkap (SK CPNS, PNS, Pangkat, Jabatan)',
        keterangan: 'Dokumen identitas ASN beserta Kartu Pegawai / MyASN tervalidasi.',
        format: 'PDF terlegalsir',
        wajib: true,
      },
      {
        id: 'ak_5',
        namaDokumen: 'SKP 2 Tahun Terakhir & Surat Bebas Hukuman Disiplin',
        keterangan: 'Memastikan pegawai tidak dalam proses pemeriksaan atau hukuman disiplin.',
        format: 'PDF resmi satker asal',
        wajib: true,
      },
      {
        id: 'ak_6',
        namaDokumen: 'Surat Keterangan Bebas Tuntutan Ganti Rugi (TGR) & Temuan',
        keterangan: 'Khusus bagi pegawai yang pernah memegang jabatan pengelola keuangan/BMN.',
        format: 'PDF surat keterangan resmi',
        wajib: false,
      },
    ],
  },
  {
    id: 'atas_permintaan_sendiri',
    label: 'Atas Permintaan Sendiri (APS)',
    ringkasan:
      'Mutasi yang diajukan langsung oleh pegawai dengan alasan keluarga, pendampingan pasangan, atau kondisi kesehatan.',
    dasarPertimbangan:
      'Pegawai wajib telah memenuhi masa kerja minimal pada satuan kerja asal sesuai ketentuan serta tidak menuntut biaya perjalanan dinas mutasi.',
    dokumen: [
      {
        id: 'aps_1',
        namaDokumen: 'Surat Permohonan Pribadi Bermaterai Rp10.000',
        keterangan: 'Menjelaskan alasan mutasi secara jelas dan ditandatangani pemohon.',
        format: 'PDF pindai asli',
        wajib: true,
      },
      {
        id: 'aps_2',
        namaDokumen: 'Surat Pernyataan Tidak Menuntut Biaya Perjalanan Mutasi',
        keterangan: 'Pernyataan tertulis bermaterai bahwa kepindahan atas biaya pribadi.',
        format: 'PDF bermaterai',
        wajib: true,
      },
      {
        id: 'aps_3',
        namaDokumen: 'Dokumen Pendukung Alasan Mutasi',
        keterangan:
          'Fotokopi Buku Nikah & SK Penempatan Pasangan (jika ikut suami/istri) atau Surat Keterangan Dokter Rumah Sakit Pemerintah (jika alasan kesehatan).',
        format: 'PDF bukti pendukung sah',
        wajib: true,
      },
      {
        id: 'aps_4',
        namaDokumen: 'Persetujuan Atasan Langsung & Kepala UPT Asal',
        keterangan: 'Rekomendasi tertulis bahwa tugas pada satker asal telah diserahterimakan.',
        format: 'PDF surat rekomendasi',
        wajib: true,
      },
      {
        id: 'aps_5',
        namaDokumen: 'Berkas SK Kepegawaian, SKP 2 Tahun & Surat Bebas Disiplin',
        keterangan: 'Kelengkapan administrasi standar ASN pemasyarakatan.',
        format: 'PDF terverifikasi',
        wajib: true,
      },
    ],
  },
  {
    id: 'kebutuhan_organisasi',
    label: 'Kebutuhan Organisasi / Penyegaran',
    ringkasan:
      'Penataan pegawai berdasarkan evaluasi kinerja, pemerataan SDM antar UPT, atau pengisian formasi jabatan tertentu di lingkungan Kanwil Jabar.',
    dasarPertimbangan:
      'Diproses melalui mekanisme pertimbangan Tim Penilai Kinerja (TPK III) atas inisiatif pembinaan kepegawaian wilayah.',
    dokumen: [
      {
        id: 'org_1',
        namaDokumen: 'Nota Dinas Kebutuhan SDM dari Pimpinan / Kepala UPT',
        keterangan: 'Menjelaskan urgensi pemenuhan tenaga pengamanan atau pembinaan.',
        format: 'PDF nota dinas resmi',
        wajib: true,
      },
      {
        id: 'org_2',
        namaDokumen: 'Rekapitulasi Peta Jabatan Satker Asal & Tujuan',
        keterangan: 'Menunjukkan rasio kebutuhan pegawai eksisting.',
        format: 'PDF data kepegawaian',
        wajib: true,
      },
      {
        id: 'org_3',
        namaDokumen: 'Profil ASN & Riwayat Penugasan Pegawai',
        keterangan: 'Data kompetensi, diklat, dan masa kerja pada unit kerja saat ini.',
        format: 'PDF profil SIMPEG/MyASN',
        wajib: true,
      },
      {
        id: 'org_4',
        namaDokumen: 'Berita Acara Penilaian Tim Pertimbangan Kepegawaian',
        keterangan: 'Bahan pembahasan pada Sidang TPK III Kantor Wilayah.',
        format: 'PDF dokumen internal kepegawaian',
        wajib: true,
      },
    ],
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const MUTATION_FAQS: FaqItem[] = [
  {
    question: 'Bagaimana cara mengecek status usulan mutasi saya di IMUT Jabar?',
    answer:
      'Buka menu Cek Progres pada navigasi atas atau klik tombol Cari Progres NIP, lalu masukkan 18 digit NIP Anda tanpa spasi. Sistem akan menampilkan tahapan terkini mulai dari Pengecekan Berkas hingga SK Diterbitkan sesuai data spreadsheet kepegawaian yang terhubung.',
  },
  {
    question: 'Apa yang dimaksud dengan tahap Menunggu Sidang TPK III?',
    answer:
      'Sidang TPK III adalah rapat Tim Penilai Kinerja pada Kantor Wilayah Direktorat Jenderal Pemasyarakatan Jawa Barat yang mengevaluasi kelayakan administratif, kebutuhan formasi, dan rekam jejak disiplin sebelum usulan diteruskan ke Direktorat Jenderal Pemasyarakatan.',
  },
  {
    question: 'Berapa lama waktu pemrosesan usulan hingga SK Diterbitkan?',
    answer:
      'Durasi penyelesaian bergantung pada kelengkapan berkas awal dari UPT, jadwal pelaksanaan Sidang TPK III, serta proses verifikasi dan penandatanganan di tingkat Direktorat Jenderal Pemasyarakatan. Berkas yang lengkap dan sesuai format mempercepat tahapan validasi awal.',
  },
  {
    question: 'Bagaimana jika terdapat perbedaan data atau berkas perlu perbaikan?',
    answer:
      'Apabila pada kolom keterangan di hasil pencarian NIP tercantum catatan perbaikan berkas, segera koordinasikan dengan pengelola kepegawaian pada UPT asal untuk melengkapi dokumen yang diminta dan mengirimkannya kembali ke Subbagian Kepegawaian Kanwil Jabar.',
  },
];
