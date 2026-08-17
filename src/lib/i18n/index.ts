export type Locale = "en" | "id";

export const DEFAULT_LOCALE: Locale = "id";

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, "");
}

export const dictionaries = {
  id: {
    // Brand & Slogan
    brandName: "PLOT",
    tagline: "Ceritamu. Pilihanmu.",
    subtagline: "Platform drama visual interaktif vertikal pertama di Indonesia.",

    // Navigation
    navHome: "Beranda",
    navDiscover: "Jelajah",
    navLibrary: "Koleksiku",
    navAchievements: "Piala & Hadiah",
    navProfile: "Profil",
    navWallet: "Brankas",
    navAdmin: "Studio CMS",
    navLogin: "Masuk",
    navLogout: "Keluar",
    languageSwitcher: "Bahasa",

    // Common labels
    coins: "Koin",
    diamonds: "Berlian",
    free: "Gratis",
    locked: "Terkunci",
    unlock: "Buka",
    unlockFor: "Buka seharga",
    episodes: "Episode",
    endings: "Ending",
    cast: "Daftar Karakter",
    relationships: "Hubungan Karakter",
    hot: "HOT",
    new: "BARU",
    trending: "POPULER",
    completed: "TAMAT",
    featured: "PILIHAN UTAMA",

    // Homepage Shelves
    heroFlagship: "Drama Pilihan Utama",
    heroInteractiveNovel: "Visual Novel Interaktif",
    startPlayingFree: "Mulai Main Gratis",
    continueEpisode: "Lanjutkan (Ep. {ep})",
    episodeGuide: "Daftar Episode",
    continuePlaying: "Lanjutkan Ceritamu",
    trendingShelves: "Sedang Populer",
    newReleases: "Baru Ditambahkan",
    romanceShelves: "Kisah Romantis",
    celebrityLife: "Dunia Selebriti & Idol",
    enemiesToLovers: "Dari Musuh Jadi Cinta",
    secretIdentity: "Identitas Rahasia",
    revengeShelves: "Pembalasan Dendam",
    fantasyShelves: "Fantasi & Perjalanan Waktu",
    mysteryShelves: "Misteri & Intrik",
    completedStories: "Cerita Tamat",

    // Discover & Search
    discoverTitle: "Jelajahi Semua Cerita",
    discoverSubtitle: "Temukan drama romantis, skandal selebriti, dan rahasia konglomerat.",
    searchPlaceholder: "Cari judul, karakter, atau genre...",
    allGenres: "Semua Genre",
    sortBy: "Urutkan",
    newest: "Terbaru",
    mostPopular: "Paling Populer",
    noResults: "Tidak ada cerita yang cocok dengan pencarianmu.",

    // Story Player
    episodeTitle: "Ep. {num}: {title}",
    tapToContinue: "Ketuk untuk lanjut",
    makeYourChoice: "Apa pilihanmu?",
    choicePercentage: "{percent}% pemain memilih ini",
    premiumChoice: "Pilihan Spesial",
    notEnoughCoins: "Koin kamu belum cukup.",
    notEnoughDiamonds: "Berlian kamu belum cukup.",
    buyCoins: "Beli Koin",
    buyDiamonds: "Beli Berlian",
    unlockEpisodeTitle: "Buka Episode Ini",
    unlockEpisodeDesc: "Buka episode dramatis ini untuk mengetahui kelanjutan ceritanya.",
    settingsTitle: "Pengaturan Player",
    bgmVolume: "Musik Latar (BGM)",
    sfxVolume: "Efek Suara (SFX)",
    muteAudio: "Matikan Suara",
    restartEpisode: "Ulangi Episode Ini",
    episodeCompletedTitle: "Episode Selesai!",
    episodeCompletedReward: "Hadiah Kamu: +{coins} Koin, +{diamonds} Berlian",
    nextEpisodeButton: "Lanjut ke Episode {num}",
    endingReached: "Kamu Telah Mencapai Ending!",
    endingSummary: "Rangkuman Akhir Cerita",
    replayStory: "Mainkan Ulang Cerita",
    shareEnding: "Bagikan Ending",
    endingCopied: "Teks ending berhasil disalin!",

    // Wallet & Shop
    vaultTitle: "Brankas Saldo",
    vaultSubtitle: "Kelola koin untuk membuka episode dan berlian untuk pilihan spesial.",
    topupTitle: "Beli Saldo Koin & Berlian",
    topupSubtitle: "Transfer manual instan via GoPay & OVO tanpa biaya admin.",
    coinShop: "Toko Koin",
    diamondShop: "Toko Berlian",
    bestStarter: "BEST STARTER",
    popularBadge: "POPULER",
    bestValue: "PALING HEMAT",
    bonus: "+{amount} Bonus",
    payWith: "Bayar dengan {method}",
    paymentModalTitle: "Pembayaran Manual {method}",
    transferInstruction: "Transfer {price} melalui {method} ke nomor berikut:",
    paymentNumberLabel: "Nomor Pembayaran / E-Wallet:",
    copyNumber: "Salin Nomor",
    numberCopied: "Nomor berhasil disalin!",
    orderIdLabel: "ID Pesanan:",
    copyOrderId: "Salin ID Pesanan",
    orderIdCopied: "ID Pesanan berhasil disalin!",
    orderRule1: "Pastikan nominal transfer tepat sesuai pesanan.",
    orderRule2: "Setelah transfer berhasil, unggah screenshot bukti transfer di bawah ini.",
    orderRule3: "Saldo akan otomatis masuk ke akunmu setelah verifikasi admin.",
    uploadProofTitle: "Unggah Bukti Transfer",
    uploadProofDesc: "Format JPG, PNG, WEBP (maks. 5MB)",
    chooseFile: "Pilih Foto Bukti",
    submitPayment: "Kirim Bukti Pembayaran",
    submitting: "Sedang Mengirim...",
    paymentCreatedSuccess: "Bukti transfer berhasil dikirim! Menunggu verifikasi admin.",
    paymentHistoryTitle: "Riwayat Pembelian & Pembayaran",
    noPaymentsYet: "Belum ada riwayat pesanan.",

    // Payment Statuses
    status_CREATED: "Pesanan Dibuat",
    status_AWAITING_PAYMENT: "Menunggu Transfer",
    status_PROOF_SUBMITTED: "Bukti Terkirim",
    status_UNDER_REVIEW: "Sedang Diverifikasi",
    status_APPROVED: "Berhasil / Disetujui",
    status_REJECTED: "Ditolak",
    status_EXPIRED: "Kedaluwarsa",
    status_CANCELLED: "Dibatalkan",

    // Daily Rewards
    dailyRewardTitle: "Hadiah Masuk Harian",
    dailyRewardSubtitle: "Masuk setiap hari untuk mengumpulkan koin & berlian gratis!",
    dayNumber: "Hari {day}",
    claimToday: "Klaim Hadiah Hari Ini",
    alreadyClaimedToday: "Hadiah hari ini sudah diklaim. Kembali lagi besok!",
    streakDays: "{days} Hari Berturut-turut",

    // Profile & Library
    myReadingHistory: "Riwayat Membaca",
    completedNovels: "Cerita Selesai",
    noHistoryYet: "Kamu belum mulai membaca cerita apapun.",
    levelLabel: "Level {lvl}",
    expLabel: "{exp} EXP",

    // Auth
    welcomeBack: "Selamat Datang Kembali di PLOT",
    createAccount: "Buat Akun PLOT Baru",
    signIn: "Masuk",
    register: "Daftar Akun Baru",
    displayName: "Nama Pengguna",
    emailAddress: "Alamat Email",
    passwordLabel: "Kata Sandi",
    readerDemo: "Demo Pembaca",
    adminDemo: "Demo Admin",
    continueAsGuest: "Lanjut sebagai Tamu (Main Gratis)",

    // Errors & Alerts
    errorTwistTitle: "Terjadi plot twist tak terduga!",
    errorTwistDesc: "Terjadi kendala teknis. Saldo dan progres ceritamu tetap aman.",
    tryAgain: "Coba Lagi",
    backToHome: "Kembali ke Beranda",
    notFoundTitle: "Halaman Tidak Ditemukan",
    notFoundDesc: "Bab cerita atau halaman yang kamu cari belum tersedia atau sudah diarsipkan.",
  },

  en: {
    // Brand & Slogan
    brandName: "PLOT",
    tagline: "Your story. Your choice.",
    subtagline: "The premier vertical interactive visual drama platform.",

    // Navigation
    navHome: "Home",
    navDiscover: "Discover",
    navLibrary: "Library",
    navAchievements: "Achievements",
    navProfile: "Profile",
    navWallet: "Vault",
    navAdmin: "Studio CMS",
    navLogin: "Sign In",
    navLogout: "Sign Out",
    languageSwitcher: "Language",

    // Common labels
    coins: "Coins",
    diamonds: "Diamonds",
    free: "Free",
    locked: "Locked",
    unlock: "Unlock",
    unlockFor: "Unlock for",
    episodes: "Episodes",
    endings: "Endings",
    cast: "Cast Roster",
    relationships: "Relationships",
    hot: "HOT",
    new: "NEW",
    trending: "TRENDING",
    completed: "COMPLETED",
    featured: "FEATURED",

    // Homepage Shelves
    heroFlagship: "Flagship Drama",
    heroInteractiveNovel: "Interactive Visual Novel",
    startPlayingFree: "Start Story Free",
    continueEpisode: "Continue (Ep. {ep})",
    episodeGuide: "Episode Guide",
    continuePlaying: "Continue Your Story",
    trendingShelves: "Trending Now",
    newReleases: "New Releases",
    romanceShelves: "Romantic Dramas",
    celebrityLife: "Celebrity & Idol Life",
    enemiesToLovers: "Enemies to Lovers",
    secretIdentity: "Secret Identity",
    revengeShelves: "Revenge & Payback",
    fantasyShelves: "Fantasy & Time Travel",
    mysteryShelves: "Mystery & Intrigue",
    completedStories: "Completed Series",

    // Discover & Search
    discoverTitle: "Explore All Stories",
    discoverSubtitle: "Discover romance, celebrity scandals, and billionaire secrets.",
    searchPlaceholder: "Search by title, character, or genre...",
    allGenres: "All Genres",
    sortBy: "Sort By",
    newest: "Newest",
    mostPopular: "Most Popular",
    noResults: "No stories match your search criteria.",

    // Story Player
    episodeTitle: "Ep. {num}: {title}",
    tapToContinue: "Tap to continue",
    makeYourChoice: "What will you choose?",
    choicePercentage: "{percent}% of players chose this",
    premiumChoice: "Premium Choice",
    notEnoughCoins: "You don't have enough coins.",
    notEnoughDiamonds: "You don't have enough diamonds.",
    buyCoins: "Buy Coins",
    buyDiamonds: "Buy Diamonds",
    unlockEpisodeTitle: "Unlock This Episode",
    unlockEpisodeDesc: "Unlock this dramatic chapter to discover what happens next.",
    settingsTitle: "Player Settings",
    bgmVolume: "Background Music (BGM)",
    sfxVolume: "Sound Effects (SFX)",
    muteAudio: "Mute Audio",
    restartEpisode: "Restart Episode",
    episodeCompletedTitle: "Episode Completed!",
    episodeCompletedReward: "Your Reward: +{coins} Coins, +{diamonds} Diamonds",
    nextEpisodeButton: "Next: Episode {num}",
    endingReached: "You Reached an Ending!",
    endingSummary: "Story Conclusion Summary",
    replayStory: "Replay Story",
    shareEnding: "Share Ending",
    endingCopied: "Ending text copied to clipboard!",

    // Wallet & Shop
    vaultTitle: "Currency Vault",
    vaultSubtitle: "Manage coins for chapter unlocks and diamonds for premium story choices.",
    topupTitle: "Get Coins & Diamonds",
    topupSubtitle: "Direct manual transfer via GoPay & OVO with zero admin fees.",
    coinShop: "Coins Store",
    diamondShop: "Diamonds Store",
    bestStarter: "BEST STARTER",
    popularBadge: "POPULAR",
    bestValue: "BEST VALUE",
    bonus: "+{amount} Bonus",
    payWith: "Pay with {method}",
    paymentModalTitle: "Manual Transfer via {method}",
    transferInstruction: "Transfer {price} using {method} to the following number:",
    paymentNumberLabel: "Payment / E-Wallet Number:",
    copyNumber: "Copy Number",
    numberCopied: "Number copied to clipboard!",
    orderIdLabel: "Order ID:",
    copyOrderId: "Copy Order ID",
    orderIdCopied: "Order ID copied to clipboard!",
    orderRule1: "Please transfer the exact order amount.",
    orderRule2: "After completing transfer, upload your payment receipt below.",
    orderRule3: "Your balance will be credited after admin verification.",
    uploadProofTitle: "Upload Payment Receipt",
    uploadProofDesc: "JPG, PNG, WEBP (max 5MB)",
    chooseFile: "Choose Receipt Image",
    submitPayment: "Submit Payment Proof",
    submitting: "Submitting...",
    paymentCreatedSuccess: "Payment proof uploaded! Awaiting admin review.",
    paymentHistoryTitle: "Purchase & Payment History",
    noPaymentsYet: "No payment history yet.",

    // Payment Statuses
    status_CREATED: "Order Created",
    status_AWAITING_PAYMENT: "Awaiting Payment",
    status_PROOF_SUBMITTED: "Proof Submitted",
    status_UNDER_REVIEW: "Under Review",
    status_APPROVED: "Approved / Completed",
    status_REJECTED: "Rejected",
    status_EXPIRED: "Expired",
    status_CANCELLED: "Cancelled",

    // Daily Rewards
    dailyRewardTitle: "Daily Sign-In Reward",
    dailyRewardSubtitle: "Sign in every day to claim free bonus coins & diamonds!",
    dayNumber: "Day {day}",
    claimToday: "Claim Today's Reward",
    alreadyClaimedToday: "Daily reward already claimed today. Come back tomorrow!",
    streakDays: "{days}-Day Streak",

    // Profile & Library
    myReadingHistory: "Reading History",
    completedNovels: "Completed Novels",
    noHistoryYet: "You haven't started reading any stories yet.",
    levelLabel: "Level {lvl}",
    expLabel: "{exp} EXP",

    // Auth
    welcomeBack: "Welcome Back to PLOT",
    createAccount: "Create Your PLOT Account",
    signIn: "Sign In",
    register: "Create Account",
    displayName: "Display Name",
    emailAddress: "Email Address",
    passwordLabel: "Password",
    readerDemo: "Reader Demo",
    adminDemo: "Admin Demo",
    continueAsGuest: "Continue as Guest (Free Episodes)",

    // Errors & Alerts
    errorTwistTitle: "That plot twist wasn't supposed to happen.",
    errorTwistDesc: "An unexpected narrative hiccup occurred. Your wallet balance is safe.",
    tryAgain: "Try Again",
    backToHome: "Return to Discover",
    notFoundTitle: "No Plot Twist Found",
    notFoundDesc: "The chapter or story you're looking for doesn't exist or has been archived.",

    // Badges & Actions
    newBadge: "NEW",
    hotBadge: "HOT",
    completedBadge: "COMPLETED",
    featuredBadge: "FEATURED",
    playNow: "Play Now",
    episodeNumber: "Episode {num}",
    appName: "PLOT",
    continueReading: "Continue",
    playEpisode1Free: "Play Episode 1 Free",
  },
} as const;

export type TranslationKey = keyof typeof dictionaries["id"] | keyof typeof dictionaries["en"];

export function getTranslation(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] || dictionaries.id;
  let text = (dict as any)[key] || (dictionaries.en as any)[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramVal));
    });
  }

  return text;
}

export function getLocalizedStoryTitle(
  story: { title: string; titleId?: string | null },
  locale: Locale
): string {
  if (locale === "id" && story.titleId) {
    return story.titleId;
  }
  return story.title;
}

export function getLocalizedStoryDesc(
  story: { shortDescription: string; shortDescriptionId?: string | null; description?: string; descriptionId?: string | null },
  locale: Locale
): string {
  if (locale === "id" && story.shortDescriptionId) return story.shortDescriptionId;
  if (locale === "id" && story.descriptionId) return story.descriptionId;
  return story.shortDescription || story.description || "";
}

export const getLocalizedStoryDescription = getLocalizedStoryDesc;
export const getLocalizedStoryShortDesc = getLocalizedStoryDesc;

export function getLocalizedEpisodeTitle(ep: { title: string; titleId?: string | null }, locale: Locale): string {
  if (locale === "id" && ep.titleId) return ep.titleId;
  return ep.title;
}

export function getLocalizedEpisodeSynopsis(ep: { synopsis?: string | null; synopsisId?: string | null }, locale: Locale): string {
  if (locale === "id" && ep.synopsisId) return ep.synopsisId;
  return ep.synopsis || "";
}

export function getLocalizedEndingTitle(ending: { title: string; titleId?: string | null }, locale: Locale): string {
  if (locale === "id" && ending.titleId) return ending.titleId;
  return ending.title;
}

export function getLocalizedEndingDesc(ending: { description: string; descriptionId?: string | null }, locale: Locale): string {
  if (locale === "id" && ending.descriptionId) return ending.descriptionId;
  return ending.description;
}

export function getLocalizedBadgeTitle(ending: { badgeTitle: string; badgeTitleId?: string | null }, locale: Locale): string {
  if (locale === "id" && ending.badgeTitleId) return ending.badgeTitleId;
  return ending.badgeTitle;
}
