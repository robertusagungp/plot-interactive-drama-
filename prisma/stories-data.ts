export interface StoryDefinition {
  slug: string;
  title: string;
  titleId: string;
  shortDescription: string;
  shortDescriptionId: string;
  description: string;
  descriptionId: string;
  author: string;
  ageRating: string;
  featured?: boolean;
  genres: string[];
  tags: string[];
  characters: {
    name: string;
    nameId?: string;
    slug: string;
    role: string;
    biography: string;
    biographyId: string;
    relationshipEnabled: boolean;
    defaultLove: number;
    defaultTrust: number;
  }[];
  statDefinitions: {
    key: string;
    label: string;
    labelId: string;
    description: string;
    defaultValue: number;
  }[];
  endings: {
    slug: string;
    title: string;
    titleId: string;
    description: string;
    descriptionId: string;
    badgeTitle: string;
    badgeTitleId: string;
    endingType: string;
  }[];
  episodeArcs: {
    number: number;
    title: string;
    titleId: string;
    synopsis: string;
    synopsisId: string;
    bgSlug: string;
    bgMusic: string;
    dialogues: {
      speakerEn: string;
      speakerId: string;
      charSlug?: string;
      expr?: string;
      pos?: "left" | "center" | "right";
      textEn: string;
      textId: string;
      sfx?: string;
    }[];
    choicePromptEn: string;
    choicePromptId: string;
    choiceA: {
      textEn: string;
      textId: string;
      statKey?: string;
      statAmount?: number;
      relChar?: string;
      relType?: "love" | "trust";
      relAmount?: number;
      replyEn: string;
      replyId: string;
    };
    choiceB: {
      textEn: string;
      textId: string;
      diamondCost?: number;
      coinCost?: number;
      statKey?: string;
      statAmount?: number;
      relChar?: string;
      relType?: "love" | "trust";
      relAmount?: number;
      replyEn: string;
      replyId: string;
    };
    climaxDialogues: {
      speakerEn: string;
      speakerId: string;
      charSlug?: string;
      expr?: string;
      pos?: "left" | "center" | "right";
      textEn: string;
      textId: string;
      sfx?: string;
    }[];
    cliffhangerEn: string;
    cliffhangerId: string;
  }[];
}

// 21 COMPLETE INTERACTIVE DRAMAS WITH 16 BESPOKE UNIQUE EPISODES EACH
const BESPOKE_STORIES_CONFIG: Array<{
  slug: string;
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
  heroEn: string;
  heroId: string;
  heroSlug: string;
  heroBioEn: string;
  heroBioId: string;
  rivalEn: string;
  rivalId: string;
  rivalSlug: string;
  rivalBioEn: string;
  rivalBioId: string;
  genres: string[];
  tags: string[];
  featured?: boolean;
  episodes: Array<{
    titleEn: string;
    titleId: string;
    synopsisEn: string;
    synopsisId: string;
  }>;
}> = [
  // Flagship 1: I Married My Enemy
  {
    slug: "i-married-my-enemy",
    titleEn: "I Married My Enemy",
    titleId: "Aku Menikahi Musuhku",
    descEn: "To save her family company from bankruptcy, Sarah Wijaya signs a one-year marriage contract with her ruthless corporate rival, Adrian Hartono.",
    descId: "Demi menyelamatkan perusahaan keluarga dari kebangkrutan, Sarah Wijaya terpaksa menandatangani kontrak pernikahan satu tahun dengan musuh bebuyutannya, Adrian Hartono.",
    heroEn: "Adrian Hartono",
    heroId: "Adrian Hartono",
    heroSlug: "adrian",
    heroBioEn: "CEO of Hartono Corp. Ruthless in business, intensely private, and fiercely protective.",
    heroBioId: "CEO Hartono Corp. Dingin dan tanpa ampun dalam bisnis, namun sangat protektif.",
    rivalEn: "Vanessa Lim",
    rivalId: "Vanessa Lim",
    rivalSlug: "vanessa",
    rivalBioEn: "An elite socialite determined to tear their marriage contract apart.",
    rivalBioId: "Sosialita kaya yang bertekad membongkar rahasia pernikahan kontrak mereka.",
    genres: ["Romance", "Drama", "Enemies to Lovers"],
    tags: ["Contract Marriage", "Billionaire Rival", "Enemies to Lovers"],
    featured: true,
    episodes: [
      { titleEn: "The Billionaire's Contract", titleId: "Kontrak Sang Miliarder", synopsisEn: "A desperate proposition to save Wijaya Holdings.", synopsisId: "Tawaran pernikahan demi menyelamatkan Wijaya Holdings." },
      { titleEn: "The Stolen Gaze", titleId: "Tatapan yang Dicuri", synopsisEn: "Moving into Adrian's luxurious penthouse suite.", synopsisId: "Pindah ke penthouse mewah Adrian di puncak kota." },
      { titleEn: "The Penthouse Prison", titleId: "Sangkar Emas Penthouse", synopsisEn: "Setting strict boundaries under the same roof.", synopsisId: "Menetapkan batasan tegas tinggal di bawah satu atap." },
      { titleEn: "Whispers in the Boardroom", titleId: "Bisikan di Ruang Direksi", synopsisEn: "Rumors spread among high-stakes shareholders.", synopsisId: "Desas-desus menyebar di kalangan dewan komisaris." },
      { titleEn: "The Gala Ambush", titleId: "Jebakan Jamuan Mewah", synopsisEn: "Facing the cameras together at the charity ball.", synopsisId: "Menghadapi sorotan wartawan di pesta amal megah." },
      { titleEn: "Rain in the Glass Tower", titleId: "Hujan di Menara Kaca", synopsisEn: "A moment of shared vulnerability in the storm.", synopsisId: "Momen kejujuran di tengah badai malam." },
      { titleEn: "A Taste of Danger", titleId: "Cita Rasa Bahaya", synopsisEn: "Vanessa uncovers a draft of the agreement.", synopsisId: "Vanessa menemukan draf perjanjian rahasia." },
      { titleEn: "Secrets of the Hartono Empire", titleId: "Rahasia Dinasti Hartono", synopsisEn: "Discovering what Adrian sacrificed for the deal.", synopsisId: "Mengetahui pengorbanan Adrian di masa lalu." },
      { titleEn: "The Staged Kiss", titleId: "Ciuman Rekayasa", synopsisEn: "A kiss in front of cameras that feels all too real.", synopsisId: "Ciuman di depan kamera yang terasa sangat nyata." },
      { titleEn: "The Rival's Counterattack", titleId: "Serangan Balik Sang Musuh", synopsisEn: "A smear campaign launched against Wijaya assets.", synopsisId: "Serangan fitnah diluncurkan ke aset Wijaya." },
      { titleEn: "Behind Closed Doors", titleId: "Di Balik Pintu Tertutup", synopsisEn: "Admitting the depth of growing feelings.", synopsisId: "Mengakui tumbuhnya rasa cinta di hati." },
      { titleEn: "Heart Over Ambition", titleId: "Hati Melampaui Ambisi", synopsisEn: "Choosing love over corporate leverage.", synopsisId: "Memilih cinta di atas ambisi bisnis." },
      { titleEn: "Hostile Takeover Defense", titleId: "Pertahanan Saham Terakhir", synopsisEn: "Outsmarting the board with a joint merger.", synopsisId: "Menggagalkan kudeta direksi dengan merger bersama." },
      { titleEn: "The Unmasking", titleId: "Membuka Kedok Pengkhianat", synopsisEn: "Vanessa's conspiracy is publicly exposed.", synopsisId: "Konspirasi jahat Vanessa terbongkar." },
      { titleEn: "The Real Vows", titleId: "Janji Suci yang Sesungguhnya", synopsisEn: "Burning the old contract to marry for love.", synopsisId: "Membakar kontrak lama dan menikah demi cinta." },
      { titleEn: "Everlasting Empire", titleId: "Kerajaan Cinta Abadi", synopsisEn: "From bitter enemies to partners for eternity.", synopsisId: "Dari musuh bebuyutan menjadi cinta abadi selamanya." },
    ],
  },
  // 2
  {
    slug: "i-woke-up-married-to-koreas-coldest-idol",
    titleEn: "I Woke Up Married to Korea's Coldest Idol",
    titleId: "Aku Bangun dan Ternyata Menikah dengan Idol Paling Dingin di Korea",
    descEn: "A rookie stylist wakes up with a registered marriage certificate to top idol leader Kang Tae-jun.",
    descId: "Stylist pemula terbangun memegang surat nikah resmi dengan Kang Tae-jun, leader idol paling dingin di Korea.",
    heroEn: "Kang Tae-jun",
    heroId: "Kang Tae-jun",
    heroSlug: "taejun",
    heroBioEn: "The untouchable leader of LUNAR who conceals deep vulnerability behind icy perfection.",
    heroBioId: "Leader boygroup LUNAR yang dingin namun menyembunyikan sisi hangat.",
    rivalEn: "Seo Min-ah",
    rivalId: "Seo Min-ah",
    rivalSlug: "minah",
    rivalBioEn: "A ruthless actress determined to break the marriage for PR.",
    rivalBioId: "Aktris ambisius yang berusaha membongkar pernikahan demi popularitas.",
    genres: ["Romance", "Celebrity", "Drama"],
    tags: ["Accidental Marriage", "Cold Idol", "Enemies to Lovers"],
    featured: true,
    episodes: [
      { titleEn: "The Golden Ring", titleId: "Cincin Emas", synopsisEn: "A chaotic night ends with a marriage certificate.", synopsisId: "Malam pesta berakhir dengan surat nikah resmi." },
      { titleEn: "Flashbulbs at Dawn", titleId: "Kamera di Waktu Fajar", synopsisEn: "Dispatch photographers surround the penthouse.", synopsisId: "Paparazi mengepung penthouse di pagi buta." },
      { titleEn: "Contract Rules", titleId: "Aturan Kontrak", synopsisEn: "Setting strict boundaries under one roof.", synopsisId: "Menetapkan batasan tegas tinggal satu atap." },
      { titleEn: "The First Live Show", titleId: "Penampilan Langsung Pertama", synopsisEn: "Styling Tae-jun behind the main stage.", synopsisId: "Menjadi penata gaya Tae-jun di panggung utama." },
      { titleEn: "Whispers in the Dressing Room", titleId: "Bisikan di Ruang Ganti", synopsisEn: "Close proximity sparks dangerous rumors.", synopsisId: "Kedekatan memicu desas-desus berbahaya." },
      { titleEn: "A Rival Appears", titleId: "Munculnya Saingan", synopsisEn: "Top actress Min-ah corners the stylist.", synopsisId: "Aktris Min-ah memojokkan sang stylist." },
      { titleEn: "Midnight Run", titleId: "Pelarian Tengah Malam", synopsisEn: "Escaping sasaeng fans through Seoul alleys.", synopsisId: "Menghindari kejaran fans di gang sempit Seoul." },
      { titleEn: "The Stolen Tape", titleId: "Rekaman yang Dicuri", synopsisEn: "A hidden camera captures their private moment.", synopsisId: "Kamera tersembunyi merekam momen pribadi mereka." },
      { titleEn: "Rain in Gangnam", titleId: "Hujan di Gangnam", synopsisEn: "Tae-jun shields her under a broken umbrella.", synopsisId: "Tae-jun melindunginya di bawah payung rusak." },
      { titleEn: "False Headlines", titleId: "Berita Palsu", synopsisEn: "A fabricated scandal trends worldwide.", synopsisId: "Skandal palsu menjadi trending topik dunia." },
      { titleEn: "Behind Locked Doors", titleId: "Di Balik Pintu Terkunci", synopsisEn: "Honest feelings revealed during lockdown.", synopsisId: "Perasaan jujur terungkap saat terkunci bersama." },
      { titleEn: "The Agency Ultimatum", titleId: "Ultimatum Agensi", synopsisEn: "The CEO demands an immediate annulment.", synopsisId: "CEO agensi menuntut pembatalan pernikahan." },
      { titleEn: "Dangerous Confession", titleId: "Pengakuan Berbahaya", synopsisEn: "Tae-jun admits his feelings on a hot mic.", synopsisId: "Tae-jun tak sengaja mengaku saat mic masih menyala." },
      { titleEn: "Live Broadcast Trap", titleId: "Jebakan Siaran Langsung", synopsisEn: "Ambushed with marriage rumors on television.", synopsisId: "Dijebak pertanyaan pernikahan di televisi." },
      { titleEn: "The Final Rehearsal", titleId: "Gladi Bersih Terakhir", synopsisEn: "Preparing for the biggest concert of his life.", synopsisId: "Mempersiapkan konser terbesar dalam hidupnya." },
      { titleEn: "World Dome Spotlight", titleId: "Sorotan World Dome", synopsisEn: "Announcing their true love before 80,000 fans.", synopsisId: "Mengumumkan cinta sejati di hadapan 80.000 penggemar." },
    ],
  },

  // 2
  {
    slug: "my-fake-boyfriend-is-actually-a-chaebol-heir",
    titleEn: "My Fake Boyfriend Is Actually a Chaebol Heir",
    titleId: "Pacar Palsuku Ternyata Pewaris Konglomerat",
    descEn: "She hired a humble mechanic for $200. He secretly owns the hotel empire.",
    descId: "Ia menyewa pria biasa seharga $200. Pria itu ternyata pewaris tahta kerajaan bisnis hotel.",
    heroEn: "Lee Min-hyuk",
    heroId: "Lee Min-hyuk",
    heroSlug: "minhyuk",
    heroBioEn: "The undercover heir to LK Group seeking genuine love.",
    heroBioId: "Pewaris LK Group yang menyamar demi menemukan cinta tulus.",
    rivalEn: "Choi Ara",
    rivalId: "Choi Ara",
    rivalSlug: "ara",
    rivalBioEn: "An elite heiress determined to secure the chaebol marriage.",
    rivalBioId: "Wanita bangsawan yang berambisi menikahi Min-hyuk.",
    genres: ["Romance", "Comedy", "Drama"],
    tags: ["Fake Dating", "Secret Billionaire", "Chaebol"],
    episodes: [
      { titleEn: "Two Hundred Dollar Date", titleId: "Kencan Dua Ratus Dolar", synopsisEn: "Hiring a date to survive a toxic wedding.", synopsisId: "Menyewa pasangan demi menghadapi sindiran keluarga." },
      { titleEn: "The Grand Reception", titleId: "Resepsi Megah", synopsisEn: "Min-hyuk arrives looking like royalty.", synopsisId: "Min-hyuk hadir dengan karisma luar biasa." },
      { titleEn: "The Limousine Secret", titleId: "Rahasia Mobil Mewah", synopsisEn: "A mysterious fleet of guards follows them home.", synopsisId: "Rombongan pengawal misterius membuntuti mereka." },
      { titleEn: "Dinner with the Chairman", titleId: "Makan Malam dengan Chairman", synopsisEn: "Accidental encounter with the LK patriarch.", synopsisId: "Pertemuan tak terduga dengan pimpinan LK Group." },
      { titleEn: "A Second Contract", titleId: "Kontrak Kedua", synopsisEn: "Extending the fake relationship for one month.", synopsisId: "Memperpanjang status pacaran palsu selama sebulan." },
      { titleEn: "Penthouse Cooking", titleId: "Masak di Penthouse", synopsisEn: "Domestic bliss in a $10 million apartment.", synopsisId: "Momen manis memasak di apartemen mewah." },
      { titleEn: "The Boardroom Crisis", titleId: "Krisis Ruang Rapat", synopsisEn: "Min-hyuk must take the executive reins.", synopsisId: "Min-hyuk terpaksa mengambil alih rapat direksi." },
      { titleEn: "The Stolen Sketch", titleId: "Sketsa yang Dicuri", synopsisEn: "Ji-woo's design is stolen by a rival agency.", synopsisId: "Desain Ji-woo dicuri oleh agensi pesaing." },
      { titleEn: "Fireworks at the River", titleId: "Kembang Api di Tepi Sungai", synopsisEn: "A romantic confession under bursting lights.", synopsisId: "Pengakuan manis di bawah gemerlap kembang api." },
      { titleEn: "Masks Off", titleId: "Topeng Terbuka", synopsisEn: "Ji-woo discovers his real identity in the paper.", synopsisId: "Ji-woo mengetahui identitas aslinya dari berita." },
      { titleEn: "The Engagement Banquet", titleId: "Pesta Pertunangan", synopsisEn: "Crashing the elite high society gathering.", synopsisId: "Menghadiri jamuan pertunangan kaum bangsawan." },
      { titleEn: "Family Confrontation", titleId: "Konfrontasi Keluarga", synopsisEn: "Min-hyuk stands up to his tyrannical family.", synopsisId: "Min-hyuk membela Ji-woo di depan keluarganya." },
      { titleEn: "The Shareholder Vote", titleId: "Pemungutan Suara Saham", synopsisEn: "High-stakes vote for corporate succession.", synopsisId: "Pemungutan suara krusial penentuan pewaris tahta." },
      { titleEn: "Rain in Cheongdam", titleId: "Hujan di Cheongdam", synopsisEn: "A tearful reunion on a drenched avenue.", synopsisId: "Pertemuan kembali yang penuh haru di tengah hujan." },
      { titleEn: "Midnight Ultimatum", titleId: "Ultimatum Tengah Malam", synopsisEn: "Choosing love over the billionaire empire.", synopsisId: "Memilih cinta di atas takhta konglomerat." },
      { titleEn: "The Real Proposal", titleId: "Lamaran yang Nyata", synopsisEn: "A genuine proposal with no contracts attached.", synopsisId: "Lamaran tulus tanpa syarat kontrak apa pun." },
    ],
  },

  // 3
  {
    slug: "the-ceo-who-fired-me-became-my-fiance",
    titleEn: "The CEO Who Fired Me Became My Fiancé",
    titleId: "CEO yang Memecatku Malah Menjadi Tunanganku",
    descEn: "Fired by 5 P.M., only to discover he is her grandfather's arranged fiancé by dinner.",
    descId: "Dipecat jam 5 sore, lalu mendapati sang CEO adalah tunangan pilihan kakeknya saat makan malam.",
    heroEn: "Jang Hyun-woo",
    heroId: "Jang Hyun-woo",
    heroSlug: "hyunwoo",
    heroBioEn: "The icy tech CEO whose razor-sharp logic crumbles before her.",
    heroBioId: "CEO teknologi dingin yang logikanya luluh oleh kecerdasan Seo-yeon.",
    rivalEn: "Kwon Mira",
    rivalId: "Kwon Mira",
    rivalSlug: "mira",
    rivalBioEn: "A ruthless investor scheming corporate takeover.",
    rivalBioId: "Investor kejam yang berambisi merebut kendali perusahaan.",
    genres: ["Romance", "Drama"],
    tags: ["Enemies to Lovers", "Arranged Marriage", "CEO"],
    episodes: [
      { titleEn: "Fired at 5 P.M.", titleId: "Dipecat Jam 5 Sore", synopsisEn: "Termination without severance.", synopsisId: "Pemecatan sepihak tanpa pesangon." },
      { titleEn: "Dinner with the Chairman", titleId: "Makan Malam Bersama Chairman", synopsisEn: "An impossible family announcement.", synopsisId: "Pengumuman perjodohan tak terduga." },
      { titleEn: "The Thirty-Day Clause", titleId: "Klausul Tiga Puluh Hari", synopsisEn: "Marriage terms written like a tech contract.", synopsisId: "Syarat pernikahan disusun seperti kontrak teknologi." },
      { titleEn: "Office in Disguise", titleId: "Penyamaran di Kantor", synopsisEn: "Returning to the firm as a special consultant.", synopsisId: "Kembali ke kantor sebagai konsultan khusus." },
      { titleEn: "Late Night Debugging", titleId: "Lembur Larut Malam", synopsisEn: "Sparks fly over lines of code.", synopsisId: "Percikan asmara saat memperbaiki kode sistem." },
      { titleEn: "The Patent Heist", titleId: "Pencurian Paten", synopsisEn: "Defending core intellectual property.", synopsisId: "Melindungi hak paten dari ancaman pencurian." },
      { titleEn: "Rain on the Rooftop", titleId: "Hujan di Atap Gedung", synopsisEn: "Vulnerability beneath the city storm.", synopsisId: "Momen kejujuran di tengah badai malam." },
      { titleEn: "The Secret Bet", titleId: "Taruhan Rahasia", synopsisEn: "A competitive wager between rivals.", synopsisId: "Taruhan sengit di antara dua orang yang gengsi." },
      { titleEn: "Investor Summit", titleId: "KTT Investor", synopsisEn: "Presenting the new AI prototype together.", synopsisId: "Mempresentasikan prototipe AI bersama-sama." },
      { titleEn: "A Stolen Proposal", titleId: "Lamaran yang Dicuri", synopsisEn: "A competitor attempts a hostile buyout.", synopsisId: "Pesaing bisnis mencoba mencuri ide perusahaan." },
      { titleEn: "Boardroom Mutiny", titleId: "Pemberontakan Direksi", synopsisEn: "The directors attempt to oust Hyun-woo.", synopsisId: "Dewan direksi mencoba menggulingkan Hyun-woo." },
      { titleEn: "Heartbeat Algorithm", titleId: "Algoritma Detak Jantung", synopsisEn: "Testing biometric feelings in real time.", synopsisId: "Menguji detak jantung yang tak bisa berbohong." },
      { titleEn: "The Hostile Takeover", titleId: "Akuisisi Bermusuhan", synopsisEn: "Seo-yeon uses her shares to turn the tide.", synopsisId: "Seo-yeon memakai sahamnya membalikkan keadaan." },
      { titleEn: "Broken Alliance", titleId: "Aliansi yang Hancur", synopsisEn: "Exposing Mira's backroom embezzlement.", synopsisId: "Membongkar konspirasi penggelapan dana Mira." },
      { titleEn: "The Final Pitch", titleId: "Presentasi Terakhir", synopsisEn: "Victory before international partners.", synopsisId: "Kemenangan gemilang di hadapan mitra dunia." },
      { titleEn: "Partners for Life", titleId: "Mitra Seumur Hidup", synopsisEn: "Sealing their shared future forever.", synopsisId: "Mengikat janji suci seumur hidup." },
    ],
  },

  // 4
  {
    slug: "i-accidentally-texted-a-superstar-at-2am",
    titleEn: "I Accidentally Texted a Superstar at 2 A.M.",
    titleId: "Aku Tidak Sengaja Mengirim Chat ke Superstar Jam 2 Pagi",
    descEn: "A late night text intended for an ex lands on the private phone of top actor Seo Jae-hyun.",
    descId: "Pesan salah kirim larut malam mendarat di nomor pribadi aktor nomor satu Seo Jae-hyun.",
    heroEn: "Seo Jae-hyun",
    heroId: "Seo Jae-hyun",
    heroSlug: "jaehyun",
    heroBioEn: "The nation's top actor whose reclusive life changes after a midnight message.",
    heroBioId: "Aktor papan atas penyendiri yang terpikat pesan tengah malam.",
    rivalEn: "Moon Yuna",
    rivalId: "Moon Yuna",
    rivalSlug: "yuna",
    rivalBioEn: "An ambitious co-star chasing a PR scandal.",
    rivalBioId: "Aktris ambisius yang menginginkan skandal romansa.",
    genres: ["Romance", "Celebrity", "Comedy"],
    tags: ["Accidental Text", "Superstar", "Secret Romance"],
    episodes: [
      { titleEn: "Wrong Number at 2 A.M.", titleId: "Salah Kirim Jam 2 Pagi", synopsisEn: "A drunken text sent to the wrong contact.", synopsisId: "Pesan curhat terkirim ke nomor yang salah." },
      { titleEn: "He Replied", titleId: "Dia Membalasnya", synopsisEn: "A witty midnight response from an unknown number.", synopsisId: "Balasan cerdas dari pemilik nomor misterius." },
      { titleEn: "Midnight Voice Call", titleId: "Panggilan Suara Tengah Malam", synopsisEn: "Recognizing that famous baritone voice.", synopsisId: "Mengenali suara berat yang sangat familiar." },
      { titleEn: "The Secret Coffee Shop", titleId: "Kafe Rahasia", synopsisEn: "First blind meeting wearing dark caps.", synopsisId: "Pertemuan pertama memakai topi penyamaran." },
      { titleEn: "Disguise in Hongdae", titleId: "Penyamaran di Hongdae", synopsisEn: "Eating street food away from cameras.", synopsisId: "Makan jajanan pasar tanpa sorotan kamera." },
      { titleEn: "Paparazzi on the Corner", titleId: "Paparazi di Sudut Jalan", synopsisEn: "A photographer snaps them near the curb.", synopsisId: "Fotografer membidik momen kebersamaan mereka." },
      { titleEn: "The Leaked Screenshot", titleId: "Tangkapan Layar Bocor", synopsisEn: "A cropped text conversation hits online forums.", synopsisId: "Tangkapan layar obrolan bocor di forum internet." },
      { titleEn: "Rehearsal Studio Access", titleId: "Akses Studio Latihan", synopsisEn: "Sneaking into the movie script reading.", synopsisId: "Menyelinap masuk ke ruang latihan naskah film." },
      { titleEn: "Rain on the Balcony", titleId: "Hujan di Balkon", synopsisEn: "Sharing dreams while listening to raindrops.", synopsisId: "Berbagi impian di bawah rintik hujan." },
      { titleEn: "Rumors on the Internet", titleId: "Rumor di Internet", synopsisEn: "Fans attempt to identify the mystery texter.", synopsisId: "Penggemar berusaha melacak sosok di balik pesan." },
      { titleEn: "Stolen Moments", titleId: "Momen yang Dicuri", synopsisEn: "Holding hands in the dark screening room.", synopsisId: "Bergandengan tangan di ruang bioskop pribadi." },
      { titleEn: "The Press Conference", titleId: "Konferensi Pers", synopsisEn: "Jae-hyun defends his private life on live TV.", synopsisId: "Jae-hyun membela privasinya di siaran langsung." },
      { titleEn: "A Midnight Escape", titleId: "Pelarian Dini Hari", synopsisEn: "Driving through the quiet highways of Incheon.", synopsisId: "Menyusuri jalan tol sepi menuju Incheon." },
      { titleEn: "Under the Spotlight", titleId: "Di Bawah Lampu Panggung", synopsisEn: "Attending the film festival in secret.", synopsisId: "Menghadiri festival film secara diam-diam." },
      { titleEn: "Unmasked in Public", titleId: "Buka Topeng di Depan Publik", synopsisEn: "Walking together without sunglasses or hats.", synopsisId: "Berjalan bersama tanpa penyamaran lagi." },
      { titleEn: "The Midnight Encore", titleId: "Encore Tengah Malam", synopsisEn: "A love story that began with a single text.", synopsisId: "Kisah cinta abadi yang bermula dari satu pesan." },
    ],
  },

  // 5
  {
    slug: "my-enemy-bought-the-company-i-work-for",
    titleEn: "My Enemy Bought the Company I Work For",
    titleId: "Musuhku Membeli Perusahaan Tempatku Bekerja",
    descEn: "Her university arch-rival acquires her company and appoints her his executive assistant.",
    descId: "Musuh bebuyutan semasa kuliah membeli kantornya dan menjadikannya asisten pribadi.",
    heroEn: "Kang Ji-ho",
    heroId: "Kang Ji-ho",
    heroSlug: "jiho",
    heroBioEn: "A brilliant venture capitalist who never forgot the girl who outranked him.",
    heroBioId: "Investor muda yang tak pernah lupa wanita yang selalu mengalahkannya.",
    rivalEn: "Yoo Ra-bin",
    rivalId: "Yoo Ra-bin",
    rivalSlug: "rabin",
    rivalBioEn: "A senior executive plotting corporate sabotage.",
    rivalBioId: "Eksekutif senior yang merencanakan sabotase perusahaan.",
    genres: ["Romance", "Drama"],
    tags: ["Enemies to Lovers", "Office Romance", "Revenge"],
    episodes: [
      { titleEn: "Hostile Acquisition", titleId: "Akuisisi Dingin", synopsisEn: "The new owner arrives in the lobby.", synopsisId: "Pemilik baru tiba di lobi kantor." },
      { titleEn: "The New Boss in Room 101", titleId: "Bos Baru di Ruang 101", synopsisEn: "Discovering Ji-ho behind the CEO desk.", synopsisId: "Mendapati Ji-ho duduk di kursi pimpinan." },
      { titleEn: "The Personal Assistant Clause", titleId: "Klausul Asisten Pribadi", synopsisEn: "Forced into close daily collaboration.", synopsisId: "Dipaksa bekerja berdampingan setiap hari." },
      { titleEn: "Coffee at Midnight", titleId: "Kopi Larut Malam", synopsisEn: "Remembering university debate championships.", synopsisId: "Mengingat kenangan debat semasa kuliah." },
      { titleEn: "Boardroom Clash", titleId: "Bentrokan di Ruang Rapat", synopsisEn: "Standing her ground against corporate bias.", synopsisId: "Mempertahankan prinsip di depan dewan direksi." },
      { titleEn: "University Secrets", titleId: "Rahasia Masa Kuliah", synopsisEn: "Why he really transferred seven years ago.", synopsisId: "Alasan sebenarnya ia pindah kampus tujuh tahun lalu." },
      { titleEn: "The Stolen Client", titleId: "Klien yang Direbut", synopsisEn: "Winning back the multimillion dollar contract.", synopsisId: "Merebut kembali klien bernilai jutaan dolar." },
      { titleEn: "Overtime in the Rain", titleId: "Lembur Diterpa Hujan", synopsisEn: "Working late when the power cuts out.", synopsisId: "Lembur berdua saat listrik kantor padam." },
      { titleEn: "Elevator Lockdown", titleId: "Terjebak di Lift", synopsisEn: "Confined space brings raw emotions to the surface.", synopsisId: "Ruang sempit membuka perasaan yang terpendam." },
      { titleEn: "The Gala Trap", titleId: "Jebakan Pesta Perusahaan", synopsisEn: "Ra-bin tries to frame her for data leak.", synopsisId: "Ra-bin memfitnahnya membocorkan data rahasia." },
      { titleEn: "Corporate Sabotage", titleId: "Sabotase Perusahaan", synopsisEn: "Ji-ho stands in front of the board to defend her.", synopsisId: "Ji-ho pasang badan membela integritasnya." },
      { titleEn: "An Unexpected Shield", titleId: "Perlindungan Tak Terduga", synopsisEn: "Discovering how much he sacrificed for her career.", synopsisId: "Mengetahui pengorbanan Ji-ho demi karirnya." },
      { titleEn: "The Resignation Letter", titleId: "Surat Pengunduran Diri", synopsisEn: "Tearing up the letter before his eyes.", synopsisId: "Merobek surat resign di depan matanya." },
      { titleEn: "Hostile Takeover Defense", titleId: "Pertahanan Saham Terakhir", synopsisEn: "Defeating the rival syndicate together.", synopsisId: "Mengalahkan sindikat pesaing bersama-sama." },
      { titleEn: "Truth on the Record", titleId: "Kebenaran yang Terbuka", synopsisEn: "Exposing the real villains at the shareholder meet.", synopsisId: "Membongkar dalang asli di rapat pemegang saham." },
      { titleEn: "Equal Partners", titleId: "Mitra Sejajar", synopsisEn: "From enemies to lifelong romantic partners.", synopsisId: "Dari musuh bebuyutan menjadi pasangan sejati." },
    ],
  },

  // 6
  {
    slug: "the-idol-next-door-knows-my-secret",
    titleEn: "The Idol Next Door Knows My Secret",
    titleId: "Idol di Sebelah Apartemenku Mengetahui Rahasiaku",
    descEn: "An ordinary accountant is secretly the anonymous producer behind his global hits.",
    descId: "Karyawati biasa diam-diam adalah produser jenius di balik lagu-lagu hitsnya.",
    heroEn: "Park Tae-min",
    heroId: "Park Tae-min",
    heroSlug: "taemin",
    heroBioEn: "A charismatic idol seeking the mysterious composer behind his voice.",
    heroBioId: "Idol karismatik yang mencari komposer rahasia lagu-lagunya.",
    rivalEn: "Seo Hana",
    rivalId: "Seo Hana",
    rivalSlug: "hana",
    rivalBioEn: "A rival producer taking credit for her music.",
    rivalBioId: "Produser musik yang mengklaim lagu-lagunya.",
    genres: ["Romance", "Celebrity", "Music"],
    tags: ["Hidden Identity", "Idol", "Neighbors"],
    episodes: [
      { titleEn: "Thin Walls at Apartment 502", titleId: "Dinding Tipis Apartemen 502", synopsisEn: "Hearing him practice vocal scales through the wall.", synopsisId: "Mendengar latihan vokal di balik dinding apartemen." },
      { titleEn: "The Anonymous Composer", titleId: "Komponis Anonim", synopsisEn: "Uploading music under the pseudonym 'Eclipse'.", synopsisId: "Mengunggah melodi dengan nama samaran 'Eclipse'." },
      { titleEn: "Stolen Melody", titleId: "Melodi yang Dicuri", synopsisEn: "Hana claims credit for Eclipse's newest track.", synopsisId: "Hana mengaku sebagai pencipta lagu baru Eclipse." },
      { titleEn: "Rooftop Piano", titleId: "Piano di Atap Gedung", synopsisEn: "Playing keys under the midnight moon.", synopsisId: "Memainkan piano di bawah sinar rembulan." },
      { titleEn: "Hoodies and Sunglasses", titleId: "Hoodie dan Kacamata Hitam", synopsisEn: "Accidental grocery run in full disguise.", synopsisId: "Belanja bersama dengan penyamaran ketat." },
      { titleEn: "The Chart-Topping Hit", titleId: "Lagu Nomor Satu", synopsisEn: "Their track reaches number one across Asia.", synopsisId: "Lagu mereka menduduki puncak tangga lagu Asia." },
      { titleEn: "Agency Spies", titleId: "Mata-Mata Agensi", synopsisEn: "Guards patrol the apartment hallway.", synopsisId: "Petugas agensi mengawasi lorong apartemen." },
      { titleEn: "Rain on the Terrace", titleId: "Hujan di Teras Apartemen", synopsisEn: "Humming harmonies as rain pours down.", synopsisId: "Bersenandung harmoni di tengah guyuran hujan." },
      { titleEn: "Secret Recording Session", titleId: "Rekaman Rahasia", synopsisEn: "Guiding Tae-min's vocals in a home studio.", synopsisId: "Membimbing vokal Tae-min di studio pribadi." },
      { titleEn: "A Rival Producer", titleId: "Produser Saingan", synopsisEn: "Hana demands the raw project files.", synopsisId: "Hana meminta file asli proyek musik." },
      { titleEn: "The Broken Microphone", titleId: "Mikrofon yang Rusak", synopsisEn: "Singing acoustic without filters or effects.", synopsisId: "Bernyanyi akustik tanpa efek buatan." },
      { titleEn: "Midnight Harmony", titleId: "Harmoni Tengah Malam", synopsisEn: "Tae-min realizes she is the composer Eclipse.", synopsisId: "Tae-min menyadari tetangganya adalah Eclipse." },
      { titleEn: "The Contract Threat", titleId: "Ancaman Kontrak", synopsisEn: "The agency threatens to sue over royalties.", synopsisId: "Agensi mengancam menuntut hak cipta royalti." },
      { titleEn: "Live Acoustic Stage", titleId: "Panggung Akustik Langsung", synopsisEn: "Tae-min invites Eclipse to play the piano live.", synopsisId: "Tae-min mengundang Eclipse tampil langsung." },
      { titleEn: "Unmasking the Melody", titleId: "Membongkar Sang Pencipta", synopsisEn: "Walking onto the stage under golden spotlights.", synopsisId: "Melangkah ke panggung di bawah sorotan lampu." },
      { titleEn: "Duet for Eternity", titleId: "Duet Selamanya", synopsisEn: "A masterpiece melody sung from the heart.", synopsisId: "Mahakarya cinta yang dinyanyikan dari lubuk hati." },
    ],
  },

  // 7
  {
    slug: "i-signed-a-contract-to-date-koreas-most-hated-actor",
    titleEn: "I Signed a Contract to Date Korea's Most Hated Actor",
    titleId: "Aku Dibayar untuk Berkencan dengan Aktor Paling Dibenci di Korea",
    descEn: "A PR junior agrees to fake-date disgraced star Cha Min-joon. His scandal was an orchestrated lie.",
    descId: "Staf PR dibayar untuk memacari aktor yang dibenci publik. Skandalnya ternyata fitnah keji.",
    heroEn: "Cha Min-joon",
    heroId: "Cha Min-joon",
    heroSlug: "minjoon",
    heroBioEn: "A brilliant method actor falsely framed by industry moguls.",
    heroBioId: "Aktor berbakat yang difitnah oleh konglomerat industri hiburan.",
    rivalEn: "Yoon Seul-gi",
    rivalId: "Yoon Seul-gi",
    rivalSlug: "seulgi",
    rivalBioEn: "The actress who orchestrated his downfall.",
    rivalBioId: "Aktris yang merancang kehancuran karir Min-joon.",
    genres: ["Romance", "Mystery", "Celebrity"],
    tags: ["Fake Dating", "Redemption", "Showbiz"],
    episodes: [
      { titleEn: "The PR Salvage Contract", titleId: "Kontrak Penyelamatan Reputasi", synopsisEn: "Six months of staged dates for a high fee.", synopsisId: "Enam bulan kencan sandiwara dengan bayaran tinggi." },
      { titleEn: "First Date in Front of Cameras", titleId: "Kencan Pertama di Depan Kamera", synopsisEn: "Acting natural while reporters watch.", synopsisId: "Bersikap wajar di bawah pantauan wartawan." },
      { titleEn: "The Scripted Handhold", titleId: "Genggaman Tangan Berbayar", synopsisEn: "A touch that feels surprisingly sincere.", synopsisId: "Sentuhan tangan yang terasa sangat tulus." },
      { titleEn: "Rumor Mill in Flames", titleId: "Api Gosip Media", synopsisEn: "Netizens scrutinize their every move.", synopsisId: "Warganet menguliti setiap gerak-gerik mereka." },
      { titleEn: "Behind the Cold Persona", titleId: "Di Balik Sikap Dinginnya", synopsisEn: "Discovering Min-joon's volunteer shelter work.", synopsisId: "Menemukan sisi baik Min-joon yang dirahasiakan." },
      { titleEn: "The Staged Scandal Evidence", titleId: "Bukti Skandal Rekayasa", synopsisEn: "Unearthing deleted voice memos from that night.", synopsisId: "Menemukan rekaman suara asli malam skandal." },
      { titleEn: "Late Night Drive", titleId: "Perjalanan Malam Sepi", synopsisEn: "Driving past neon signs with open windows.", synopsisId: "Menikmati angin malam di jalanan kota sepi." },
      { titleEn: "Ex-Agency Threats", titleId: "Ancaman Mantan Agensi", synopsisEn: "Warnings sent to her PR firm.", synopsisId: "Peringatan ancaman dikirim ke kantor PR." },
      { titleEn: "Red Carpet Trap", titleId: "Jebakan Karpet Merah", synopsisEn: "Seul-gi confronts them at the film awards.", synopsisId: "Seul-gi menyudutkan mereka di festival film." },
      { titleEn: "The Real Enemy Revealed", titleId: "Musuh Sebenarnya Muncul", synopsisEn: "The CEO who blacklisted Min-joon uncovered.", synopsisId: "CEO yang mem-blacklist Min-joon terbongkar." },
      { titleEn: "A Stolen Kiss", titleId: "Ciuman yang Tak Terduga", synopsisEn: "When the script ends and real passion takes over.", synopsisId: "Saat sandiwara berakhir dan perasaan nyata dimulai." },
      { titleEn: "The Press Room Ambush", titleId: "Serangan di Ruang Wartawan", synopsisEn: "Journalists demand answers regarding the contract.", synopsisId: "Wartawan menuntut klarifikasi soal kontrak." },
      { titleEn: "Breaking the Contract", titleId: "Membakar Kontrak", synopsisEn: "Choosing to stay beside him without payment.", synopsisId: "Memilih tetap mendampinginya tanpa bayaran." },
      { titleEn: "Live TV Truth", titleId: "Kebenaran di Siaran Langsung", synopsisEn: "Airing the raw evidence to thirty million viewers.", synopsisId: "Menayangkan bukti fitnah ke 30 juta penonton." },
      { titleEn: "Standing Beside You", titleId: "Berdiri di Sampingmu", synopsisEn: "Public vindication and standing ovation.", synopsisId: "Pemulihan nama baik dan tepuk tangan meriah." },
      { titleEn: "The Standing Ovation", titleId: "Tepuk Tangan Terakhir", synopsisEn: "A triumphant return to the world of cinema.", synopsisId: "Kembalinya sang aktor hebat ke puncak kejayaan." },
    ],
  },

  // 8
  {
    slug: "my-ex-came-back-as-my-new-boss",
    titleEn: "My Ex Came Back as My New Boss",
    titleId: "Mantan Pacarku Kembali Sebagai Bos Baruku",
    descEn: "Five years after vanishing without a trace, her first love returns as CEO of her firm.",
    descId: "Lima tahun setelah menghilang tanpa jejak, cinta pertamanya kembali sebagai CEO kantornya.",
    heroEn: "Kang Seung-ho",
    heroId: "Kang Seung-ho",
    heroSlug: "seungho",
    heroBioEn: "A self-made titan who returned to protect the woman he never stopped loving.",
    heroBioId: "Pria sukses yang kembali demi melindungi wanita yang tak pernah ia lupakan.",
    rivalEn: "Lee Mi-rae",
    rivalId: "Lee Mi-rae",
    rivalSlug: "mirae",
    rivalBioEn: "An elite heiress determined to secure Seung-ho.",
    rivalBioId: "Wanita kaya yang berambisi memenangkan hati Seung-ho.",
    genres: ["Romance", "Drama"],
    tags: ["Second Chance", "First Love", "CEO"],
    episodes: [
      { titleEn: "Five Years Later", titleId: "Lima Tahun Kemudian", synopsisEn: "A familiar silhouette steps out of the black sedan.", synopsisId: "Sosok yang sangat dikenal keluar dari mobil dinas." },
      { titleEn: "The Cold Glance", titleId: "Tatapan yang Dingin", synopsisEn: "Acting like strangers in the morning meeting.", synopsisId: "Bersikap seperti orang asing di rapat pagi." },
      { titleEn: "Office Politics", titleId: "Politik Kantor", synopsisEn: "Navigating corporate rivals aiming for his chair.", synopsisId: "Menghadapi intrik politik kantor yang memanas." },
      { titleEn: "The Unsent Letter", titleId: "Surat yang Tak Terkirim", synopsisEn: "Finding a five-year-old draft in his desk.", synopsisId: "Menemukan draf surat lama di laci mejanya." },
      { titleEn: "Project Collaboration", titleId: "Kolaborasi Proyek", synopsisEn: "Paired together for the global launch.", synopsisId: "Ditugaskan bersama untuk proyek peluncuran global." },
      { titleEn: "Dinner with Old Memories", titleId: "Makan Malam dengan Kenangan", synopsisEn: "Eating at their favorite college noodle shop.", synopsisId: "Makan di kedai mi favorit masa kuliah." },
      { titleEn: "The Truth About His Departure", titleId: "Alasan Kepergiannya", synopsisEn: "Learning why he sacrificed his youth to shield her.", synopsisId: "Mengetahui alasan ia berkorban demi keselamatannya." },
      { titleEn: "Rain in Gangnam Station", titleId: "Hujan di Stasiun Gangnam", synopsisEn: "Waiting under the station awning together.", synopsisId: "Berteduh bersama di stasiun Gangnam." },
      { titleEn: "Rival Suitor", titleId: "Saingan Baru", synopsisEn: "Mi-rae uses family wealth to assert dominance.", synopsisId: "Mi-rae memanfaatkan kekayaan keluarga." },
      { titleEn: "Late Night Confession", titleId: "Pengakuan Larut Malam", synopsisEn: "Admitting that he never stopped loving her.", synopsisId: "Mengakui bahwa cintanya tak pernah padam." },
      { titleEn: "The Corporate Merger", titleId: "Merger Perusahaan", synopsisEn: "A high-stakes boardroom negotiation.", synopsisId: "Negosiasi merger bernilai miliaran rupiah." },
      { titleEn: "Stolen Glance in the Lobby", titleId: "Curian Pandang di Lobi", synopsisEn: "Silent communication across crowded rooms.", synopsisId: "Saling bertukar pandang di tengah keramaian." },
      { titleEn: "Resignation Retracted", titleId: "Penarikan Surat Resign", synopsisEn: "Refusing to let the past break them apart again.", synopsisId: "Menolak membiarkan masa lalu memisahkan mereka." },
      { titleEn: "Confronting the Past", titleId: "Menghadapi Masa Lalu", synopsisEn: "Standing united against old debts and foes.", synopsisId: "Menghadapi musuh lama secara bersama-sama." },
      { titleEn: "The Ring He Kept", titleId: "Cincin yang Tetap Disimpannya", synopsisEn: "He carried her promise ring for five years.", synopsisId: "Cincin janji yang disimpannya selama lima tahun." },
      { titleEn: "Second Chance Forever", titleId: "Kesempatan Kedua Selamanya", synopsisEn: "A rekindled love stronger than ever before.", synopsisId: "Cinta lama yang bersemi kembali lebih indah." },
    ],
  },

  // 9
  {
    slug: "the-heir-who-pretended-to-be-my-bodyguard",
    titleEn: "The Heir Who Pretended to Be My Bodyguard",
    titleId: "Pewaris yang Menyamar Menjadi Bodyguard-ku",
    descEn: "A rising actress gets a dangerous protector who is secretly the billionaire financing her film.",
    descId: "Aktris pendatang baru mendapatkan pengawal tangguh yang ternyata miliarder investor filmnya.",
    heroEn: "Han Ji-seok",
    heroId: "Han Ji-seok",
    heroSlug: "jiseok",
    heroBioEn: "A martial arts trained chaebol heir who guards the woman he loves with his life.",
    heroBioId: "Pewaris konglomerat ahli bela diri yang menjaga wanita pujaannya.",
    rivalEn: "Park Si-ah",
    rivalId: "Park Si-ah",
    rivalSlug: "siah",
    rivalBioEn: "A jealous co-star behind the anonymous threats.",
    rivalBioId: "Aktris iri di balik ancaman teror misterius.",
    genres: ["Romance", "Thriller", "Celebrity"],
    tags: ["Bodyguard", "Undercover Heir", "Suspense"],
    episodes: [
      { titleEn: "The New Security Detail", titleId: "Pengawal Pribadi Baru", synopsisEn: "A silent, formidable guard assigned to her side.", synopsisId: "Pengawal berwajah dingin ditugaskan mendampinginya." },
      { titleEn: "Midnight Threat", titleId: "Ancaman Tengah Malam", synopsisEn: "Ji-seok intercepts an intruder on the film set.", synopsisId: "Ji-seok melumpuhkan penyusup di lokasi syuting." },
      { titleEn: "His Hidden Strength", titleId: "Kekuatan Tersembunyinya", synopsisEn: "Remarkable combat skills that defy normal guards.", synopsisId: "Kemampuan bertarung luar biasa yang mencurigakan." },
      { titleEn: "The Black Sedan Chase", titleId: "Kejar-kejaran Sedan Hitam", synopsisEn: "Evasive driving through midnight city expressways.", synopsisId: "Aksi kejar-kejaran mobil di jalan tol malam hari." },
      { titleEn: "Dressing Room Shield", titleId: "Perlindungan di Ruang Ganti", synopsisEn: "Shielding her body from falling light rigs.", synopsisId: "Melindungi tubuhnya dari lampu panggung yang jatuh." },
      { titleEn: "The Billionaire Watch", titleId: "Jam Tangan Sang Miliarder", synopsisEn: "Noticing a custom $300,000 timepiece on his wrist.", synopsisId: "Melihat jam tangan mewah ratusan juta di pergelangan tangannya." },
      { titleEn: "Film Premiere Danger", titleId: "Bahaya di Gala Premiere", synopsisEn: "A suspicious package delivered to the VIP lounge.", synopsisId: "Paket mencurigakan tiba di ruang tunggu VIP." },
      { titleEn: "Rain on the Pier", titleId: "Hujan di Dermaga", synopsisEn: "A tense standoff near the shipping containers.", synopsisId: "Bentrokan sengit di dermaga pelabuhan." },
      { titleEn: "The Traitor in the Crew", titleId: "Pengkhianat di Tim Kru", synopsisEn: "Unmasking the assistant leaking her schedule.", synopsisId: "Membongkar asisten yang membocorkan jadwal." },
      { titleEn: "Secret Hospital Visit", titleId: "Kunjungan Rumah Sakit Rahasia", synopsisEn: "Tending to his combat wounds in private.", synopsisId: "Mengobati luka lebamnya secara diam-diam." },
      { titleEn: "The Heir Revealed", titleId: "Topeng Sang Pewaris", synopsisEn: "Discovering he is the Han Group sole heir.", synopsisId: "Mengetahui bahwa sang pengawal adalah pewaris Han Group." },
      { titleEn: "Boardroom Protection", titleId: "Perlindungan di Ruang Direksi", synopsisEn: "Ji-seok takes the executive chair to save the film.", synopsisId: "Ji-seok duduk di kursi pimpinan menyelamatkan film." },
      { titleEn: "Kidnapping Attempt", titleId: "Upaya Penculikan", synopsisEn: "Surrounded by syndicated extortionists.", synopsisId: "Dikepung oleh sindikat pemeras berbahaya." },
      { titleEn: "Tactical Rescue", titleId: "Penyelamatan Dramatis", synopsisEn: "Ji-seok breaches the warehouse alone.", synopsisId: "Ji-seok menerobos masuk gudang menyelamatkannya." },
      { titleEn: "Shield of Love", titleId: "Perisai Cinta", synopsisEn: "Vowing to protect her both as bodyguard and husband.", synopsisId: "Berjanji melindunginya seumur hidup." },
      { titleEn: "Forever by Your Side", titleId: "Selamanya Menjagamu", synopsisEn: "Walking the red carpet hand in hand.", synopsisId: "Melangkah bersama di karpet merah keabadian." },
    ],
  },

  // 10
  {
    slug: "i-married-him-for-revenge-then-fell-first",
    titleEn: "I Married Him for Revenge, Then Fell First",
    titleId: "Aku Menikahinya untuk Balas Dendam, Tapi Aku yang Jatuh Cinta Duluan",
    descEn: "She married the enemy heir to destroy his empire, only to discover he was secretly protecting her all along.",
    descId: "Ia menikahi putra musuh demi membalas dendam, namun tersadar pria itu selalu melindunginya.",
    heroEn: "Lee Tae-kyung",
    heroId: "Lee Tae-kyung",
    heroSlug: "taekyung",
    heroBioEn: "An enigmatic heir carrying dark burdens to keep her safe.",
    heroBioId: "Pewaris penuh rahasia yang memikul beban demi keselamatannya.",
    rivalEn: "Jung Seon-ah",
    rivalId: "Jung Seon-ah",
    rivalSlug: "seonah",
    rivalBioEn: "The real mastermind behind the corporate downfall.",
    rivalBioId: "Dalang sebenarnya di balik kejatuhan keluarga sang protagonis.",
    genres: ["Romance", "Revenge", "Drama"],
    tags: ["Revenge", "Contract Marriage", "Fell First"],
    episodes: [
      { titleEn: "The Vow of Retribution", titleId: "Sumpah Balas Dendam", synopsisEn: "Signing the marriage contract with vengeance in mind.", synopsisId: "Menandatangani surat nikah demi menuntut balas." },
      { titleEn: "Cold Penthouse Nights", titleId: "Malam Dingin di Penthouse", synopsisEn: "Searching his study while he sleeps.", synopsisId: "Mencari dokumen rahasia di ruang kerjanya." },
      { titleEn: "The Target's Secret", titleId: "Rahasia Sang Target", synopsisEn: "Finding evidence that clears his name.", synopsisId: "Menemukan bukti bahwa ia bukan dalang kejahatan." },
      { titleEn: "Champagne and Daggers", titleId: "Sampanye dan Belati", synopsisEn: "Playing the devoted couple at society balls.", synopsisId: "Berpura-pura mesra di jamuan kaum elit." },
      { titleEn: "A Gentle Touch", titleId: "Sentuhan yang Hangat", synopsisEn: "Tae-kyung tends to her when fever strikes.", synopsisId: "Tae-kyung merawatnya dengan tulus saat ia demam." },
      { titleEn: "Uncovering Father's Files", titleId: "Membongkar Berkas Ayah", synopsisEn: "The real embezzler was within her own family.", synopsisId: "Penggelap dana sebenarnya ada di keluarganya sendiri." },
      { titleEn: "The Real Culprit", titleId: "Pelaku Sebenarnya", synopsisEn: "Jung Seon-ah's hidden offshore accounts found.", synopsisId: "Rekening rahasia Jung Seon-ah berhasil dilacak." },
      { titleEn: "Rain on the Terrace", titleId: "Hujan di Teras", synopsisEn: "Confessing the original revenge plan in tears.", synopsisId: "Mengakui niat balas dendam dengan berderai air mata." },
      { titleEn: "Betrayal of the Heart", titleId: "Pengkhianatan Hati", synopsisEn: "Tae-kyung reveals he knew her plan all along.", synopsisId: "Tae-kyung mengaku ia sudah tahu sejak awal." },
      { titleEn: "The Blackmail Threat", titleId: "Ancaman Pemerasan", synopsisEn: "Seon-ah threatens to publish false files.", synopsisId: "Seon-ah mengancam menyebarkan berkas palsu." },
      { titleEn: "Confession in the Dark", titleId: "Pengakuan di Kegelapan", synopsisEn: "I loved you before the revenge ever started.", synopsisId: "Aku mencintaimu bahkan sebelum dendam dimulai." },
      { titleEn: "Poisoned Chalice", titleId: "Racun Kebencian", synopsisEn: "Confronting the syndicate at the family villa.", synopsisId: "Menghadapi sindikat di villa keluarga." },
      { titleEn: "Standing in Front of the Gun", titleId: "Menghalangi Peluru", synopsisEn: "Tae-kyung shields her from a direct attack.", synopsisId: "Tae-kyung menghadang bahaya demi melindunginya." },
      { titleEn: "The Truth Cleared", titleId: "Nama Baik yang Pulih", synopsisEn: "Her father's company fully restored.", synopsisId: "Perusahaan ayahnya berhasil dipulihkan." },
      { titleEn: "Forgiving the Past", titleId: "Memaafkan Masa Lalu", synopsisEn: "Burying the hatred to embrace the future.", synopsisId: "Menghapus dendam demi merajut masa depan." },
      { titleEn: "Love Born from Fire", titleId: "Cinta dari Abu Dendam", synopsisEn: "A true marriage built on sacrifice and devotion.", synopsisId: "Pernikahan sejati berlandaskan cinta tulus." },
    ],
  },

  // 11
  {
    slug: "my-sister-stole-my-fiance-so-i-married-his-rival",
    titleEn: "My Sister Stole My Fiancé, So I Married His Rival",
    titleId: "Adikku Merebut Tunanganku, Jadi Aku Menikahi Rivalnya",
    descEn: "Betrayed days before her wedding, she proposes to her ex's most powerful rival tycoon.",
    descId: "Dikhianati menjelang pernikahan, ia spontan menikahi raja bisnis musuh bebuyutan mantan tunangannya.",
    heroEn: "Kwon Tae-hyun",
    heroId: "Kwon Tae-hyun",
    heroSlug: "taehyun",
    heroBioEn: "A commanding tycoon who waited years for the chance to marry her.",
    heroBioId: "Konglomerat berkuasa yang telah bertahun-tahun mencintainya.",
    rivalEn: "Baek Na-eun",
    rivalId: "Baek Na-eun",
    rivalSlug: "naeun",
    rivalBioEn: "The deceitful sister who stole the ex-fiancé.",
    rivalBioId: "Adik licik yang merebut mantan tunangannya.",
    genres: ["Romance", "Drama", "Revenge"],
    tags: ["Revenge Marriage", "Rivalry", "Sweet Payback"],
    episodes: [
      { titleEn: "Broken Engagement", titleId: "Pertunangan yang Hancur", synopsisEn: "Catching her sister and fiancé together.", synopsisId: "Memergoki adik dan tunangannya berkhianat." },
      { titleEn: "The Rival's Proposal", titleId: "Tawaran Sang Musuh", synopsisEn: "Tae-hyun offers marriage on the spot.", synopsisId: "Tae-hyun langsung menawarkan pernikahan resmi." },
      { titleEn: "The Wedding of the Century", titleId: "Pernikahan Abad Ini", synopsisEn: "Stealing the spotlight with a grand ceremony.", synopsisId: "Mencuri perhatian dunia dengan pesta pernikahan termegah." },
      { titleEn: "Dinner with the Traitors", titleId: "Makan Malam dengan Pengkhianat", synopsisEn: "Sitting opposite the ex at the family table.", synopsisId: "Duduk berhadapan dengan mantan di jamuan keluarga." },
      { titleEn: "His Undivided Attention", titleId: "Perhatian Tanpa Batas", synopsisEn: "Tae-hyun treats her like an absolute queen.", synopsisId: "Tae-hyun memperlakukannya bak ratu istana." },
      { titleEn: "Family Banquet Humiliation", titleId: "Balasan di Jamuan Keluarga", synopsisEn: "Exposing the sister's fraudulent background.", synopsisId: "Membongkar kebohongan sang adik di depan keluarga." },
      { titleEn: "The Stolen Inheritance", titleId: "Warisan yang Direbut Kembali", synopsisEn: "Reclaiming the mother's heirloom estate.", synopsisId: "Merebut kembali warisan peninggalan ibu." },
      { titleEn: "Rain in the Villa", titleId: "Hujan di Villa", synopsisEn: "Warm fireplace conversation about long-held feelings.", synopsisId: "Obrolan hangat di dekat perapian villa." },
      { titleEn: "The Ex's Regret", titleId: "Penyesalan Sang Mantan", synopsisEn: "Her ex begs for a second chance in vain.", synopsisId: "Mantan tunangan memohon rujuk namun ditolak tegas." },
      { titleEn: "Corporate Power Play", titleId: "Perebutan Saham Perusahaan", synopsisEn: "Tae-hyun buys out the ex's family company.", synopsisId: "Tae-hyun mengakuisisi perusahaan keluarga sang mantan." },
      { titleEn: "The Sister's Downfall", titleId: "Kejatuhan Sang Adik", synopsisEn: "Na-eun faces bankruptcy and public scandal.", synopsisId: "Na-eun menghadapi kebangkrutan dan skandal publik." },
      { titleEn: "Midnight Ballroom Waltz", titleId: "Dansa Tengah Malam", synopsisEn: "Dancing alone in the grand empty ballroom.", synopsisId: "Berdansa berdua di aula dansa megah." },
      { titleEn: "The Real Reason He Married Me", titleId: "Alasan Ia Menikahiku", synopsisEn: "Learning he loved her for over seven years.", synopsisId: "Mengetahui ia telah mencintainya selama tujuh tahun." },
      { titleEn: "Bankrupting the Enemies", titleId: "Kebangkrutan Sang Musuh", synopsisEn: "Complete financial defeat of the traitors.", synopsisId: "Kekalahan telak para pengkhianat cinta." },
      { titleEn: "Crown of the Empress", titleId: "Mahkota Sang Pemenang", synopsisEn: "Standing triumphant at the apex of society.", synopsisId: "Berdiri bangga di puncak kejayaan." },
      { titleEn: "The Sweetest Revenge", titleId: "Balas Dendam Paling Manis", synopsisEn: "Living happily and passionately ever after.", synopsisId: "Hidup bahagia penuh cinta sejati selamanya." },
    ],
  },

  // 12
  {
    slug: "the-superstar-who-forgot-everyone-except-me",
    titleEn: "The Superstar Who Forgot Everyone Except Me",
    titleId: "Superstar yang Melupakan Semua Orang Kecuali Aku",
    descEn: "After an accident, a global idol loses his memory—except for a woman who claims they never met.",
    descId: "Setelah kecelakaan, sang superstar kehilangan ingatan kecuali wajah wanita yang mengaku tak mengenalnya.",
    heroEn: "Kang Si-woo",
    heroId: "Kang Si-woo",
    heroSlug: "siwoo",
    heroBioEn: "A top idol desperate to recover the forgotten love of his past.",
    heroBioId: "Idol papan atas yang berjuang mengingat kembali cinta masa lalunya.",
    rivalEn: "Min Seo-jin",
    rivalId: "Min Seo-jin",
    rivalSlug: "seojin",
    rivalBioEn: "His manager trying to control his public narrative.",
    rivalBioId: "Manajer manipulatif yang berusaha mengendalikan kehidupannya.",
    genres: ["Romance", "Mystery", "Celebrity"],
    tags: ["Amnesia", "Destiny", "Superstar"],
    episodes: [
      { titleEn: "The Crash at Midnight", titleId: "Kecelakaan Tengah Malam", synopsisEn: "A tragic highway accident shakes the entertainment world.", synopsisId: "Kecelakaan mobil mengguncang dunia hiburan." },
      { titleEn: "The Hospital Ward", titleId: "Ruang Rumah Sakit", synopsisEn: "Si-woo opens his eyes and recognizes nobody.", synopsisId: "Si-woo membuka mata dan tak mengenali siapa pun." },
      { titleEn: "Only Your Name", titleId: "Hanya Namamu", synopsisEn: "He reaches for a visiting nurse, whispering her name.", synopsisId: "Ia menggenggam tangan perawat dan menyebut namanya." },
      { titleEn: "Rebuilding Forgotten Days", titleId: "Menyusun Ingatan Hilang", synopsisEn: "Helping him piece together his musical identity.", synopsisId: "Membantunya mengingat kembali jati diri musiknya." },
      { titleEn: "The Fake Girlfriend Trap", titleId: "Jebakan Pacar Rekayasa", synopsisEn: "The agency introduces a staged model partner.", synopsisId: "Agensi menghadirkan model pacar rekayasa." },
      { titleEn: "Stolen Memories", titleId: "Kenangan yang Dirampas", synopsisEn: "Discovering that his previous journal was confiscated.", synopsisId: "Mengetahui bahwa buku hariannya disita agensi." },
      { titleEn: "The Sound of His Guitar", titleId: "Petikan Gitarnya", synopsisEn: "Playing acoustic chords that trigger childhood flash.", synopsisId: "Alunan gitar memicu ingatan masa kecil." },
      { titleEn: "Rain on the Hospital Window", titleId: "Hujan di Jendela Rumah Sakit", synopsisEn: "Quiet moments away from the press barrage.", synopsisId: "Momen tenang berdua di balik tirai rumah sakit." },
      { titleEn: "Agency Interference", titleId: "Gangguan Pihak Agensi", synopsisEn: "Seo-jin threatens to fire her from the hospital.", synopsisId: "Seo-jin mengancam memecatnya dari rumah sakit." },
      { titleEn: "A Flash of Memory", titleId: "Kilasan Ingatan Masa Lalu", synopsisEn: "Remembering their promise under the cherry blossoms.", synopsisId: "Mengingat janji suci di bawah pohon sakura." },
      { titleEn: "The Notebook He Wrote", titleId: "Buku Catatan Rahasianya", synopsisEn: "Finding songs dedicated entirely to her.", synopsisId: "Menemukan lagu-lagu yang ia ciptakan khusus untuknya." },
      { titleEn: "Paparazzi Ambush", titleId: "Kepungan Paparazi", synopsisEn: "Escaping the hospital basement together.", synopsisId: "Melarikan diri dari kepungan wartawan di basement." },
      { titleEn: "The Concert Comeback", titleId: "Konser Comeback", synopsisEn: "Standing in front of fifty thousand waiting fans.", synopsisId: "Berdiri di depan 50.000 penggemar yang setia menanti." },
      { titleEn: "The Moment of Remembrance", titleId: "Detik Ingatan Kembali", synopsisEn: "All memories flood back during the chorus.", synopsisId: "Seluruh ingatan kembali saat menyanyikan lagu utama." },
      { titleEn: "Love Never Forgotten", titleId: "Cinta yang Tak Pernah Lupa", synopsisEn: "Confessing his eternal devotion on stage.", synopsisId: "Menyatakan cinta abadinya di hadapan penonton." },
      { titleEn: "The Final Song", titleId: "Lagu Terakhir untukmu", synopsisEn: "A destiny unbroken by time or amnesia.", synopsisId: "Takdir cinta yang tak terkikis oleh lupa." },
    ],
  },

  // 13
  {
    slug: "i-became-the-villainess-in-his-scandal",
    titleEn: "I Became the Villainess in His Scandal",
    titleId: "Aku Mendadak Menjadi Villain dalam Skandalnya",
    descEn: "A viral photo falsely brands her as the home-wrecker of Korea's golden celebrity couple.",
    descId: "Foto viral menjadikannya sasaran kebencian publik sebagai perusak hubungan artis terkenal.",
    heroEn: "Kim Jae-min",
    heroId: "Kim Jae-min",
    heroSlug: "jaemin",
    heroBioEn: "A celebrated actor who offers public alliance to uncover the conspiracy.",
    heroBioId: "Aktor ternama yang menawarkan perlindungan demi membongkar fitnah.",
    rivalEn: "Han Yumi",
    rivalId: "Han Yumi",
    rivalSlug: "yumi",
    rivalBioEn: "The manipulative ex who staged the scandal.",
    rivalBioId: "Mantan kekasih manipulatif yang merekayasa foto skandal.",
    genres: ["Romance", "Showbiz", "Drama"],
    tags: ["Celebrity Scandal", "Public Alliance", "Enemies to Lovers"],
    episodes: [
      { titleEn: "The Photo That Broke the Internet", titleId: "Foto yang Menggemparkan Internet", synopsisEn: "Waking up to millions of angry notifications.", synopsisId: "Terbangun dengan jutaan notifikasi hujatan di internet." },
      { titleEn: "Public Enemy Number One", titleId: "Musuh Nomor Satu Publik", synopsisEn: "Reporters waiting outside her apartment door.", synopsisId: "Wartawan mengepung pintu apartemennya." },
      { titleEn: "The Actor's Sanctuary", titleId: "Perlindungan Sang Aktor", synopsisEn: "Jae-min pulls her into his private car.", synopsisId: "Jae-min menariknya masuk ke dalam mobil pribadinya." },
      { titleEn: "The Secret Alliance", titleId: "Aliansi Rahasia", synopsisEn: "Teaming up to expose the staged photograph.", synopsisId: "Bekerja sama membongkar rekayasa foto tersebut." },
      { titleEn: "Disguised in Plain Sight", titleId: "Penyamaran di Tengah Kota", synopsisEn: "Investigating the club where the photo was taken.", synopsisId: "Menyelidiki kelab malam tempat foto diambil." },
      { titleEn: "The Ex-Girlfriend's Lie", titleId: "Kebohongan Sang Mantan", synopsisEn: "Yumi's private agent hired the paparazzi.", synopsisId: "Agen Yumi terbukti menyewa paparazi pemeras." },
      { titleEn: "Digital Witch Hunt", titleId: "Perburuan di Media Sosial", synopsisEn: "Cyberbullies dox her workplace.", synopsisId: "Serangan siber mencoba menjatuhkan karirnya." },
      { titleEn: "Rain on the Set", titleId: "Hujan di Lokasi Syuting", synopsisEn: "Jae-min comforts her during a difficult night.", synopsisId: "Jae-min menenangkannya di tengah tekanan berat." },
      { titleEn: "The Raw Camera Footage", titleId: "Rekaman Asli Kamera", synopsisEn: "Recovering the unedited video timestamps.", synopsisId: "Memulihkan rekaman video asli yang belum dipotong." },
      { titleEn: "Counter-Strike Strategy", titleId: "Strategi Serangan Balik", synopsisEn: "Preparing the ultimate legal rebuttal.", synopsisId: "Mempersiapkan bukti hukum serangan balik." },
      { titleEn: "Whispers on Live TV", titleId: "Bisikan di Siaran Langsung", synopsisEn: "Appearing alongside Jae-min on a prime talk show.", synopsisId: "Tampil berdua di acara bincang-bincang utama." },
      { titleEn: "The Threat from the Agency", titleId: "Ancaman dari Pemilik Agensi", synopsisEn: "The agency tries to buy their silence.", synopsisId: "Pihak agensi mencoba menyogok untuk bungkam." },
      { titleEn: "The Dramatic Press Conference", titleId: "Konferensi Pers Dramatis", synopsisEn: "Revealing the contract and raw timestamps.", synopsisId: "Membongkar kontrak rekayasa dan video asli." },
      { titleEn: "Unmasking the Real Villain", titleId: "Membongkar Dalang Asli", synopsisEn: "Yumi's public apology and career ruin.", synopsisId: "Yumi mengakui kesalahannya di hadapan publik." },
      { titleEn: "Public Apology", titleId: "Permintaan Maaf Publik", synopsisEn: "The public begs for her forgiveness.", synopsisId: "Publik berbalik meminta maaf dan bersimpati." },
      { titleEn: "Heroes in the Light", titleId: "Pemenang di Bawah Cahaya", synopsisEn: "From fake villainess to his true leading lady.", synopsisId: "Dari tertuduh menjadi ratu di hatinya selamanya." },
    ],
  },

  // 14
  {
    slug: "my-blind-date-was-the-ceo-i-insulted-online",
    titleEn: "My Blind Date Was the CEO I Insulted Online",
    titleId: "Blind Date-ku Ternyata CEO yang Kuhina di Internet",
    descEn: "Her anonymous viral critique destroyed his product launch. Then she met him on a blind date.",
    descId: "Ulasan pedas anonimnya viral dan mengkritik sang CEO. Lalu mereka bertemu di kencan buta.",
    heroEn: "Yoon Tae-jin",
    heroId: "Yoon Tae-jin",
    heroSlug: "taejin",
    heroBioEn: "A perfectionist CEO obsessed with finding his sharpest critic.",
    heroBioId: "CEO perfeksionis yang terobsesi menemukan pengkritik produknya.",
    rivalEn: "Kim Ara",
    rivalId: "Kim Ara",
    rivalSlug: "kimara",
    rivalBioEn: "A competitor trying to buy the critic's identity.",
    rivalBioId: "Kompetitor bisnis yang berusaha membocorkan identitasnya.",
    genres: ["Romance", "Comedy"],
    tags: ["Enemies to Lovers", "Blind Date", "Office Romance"],
    episodes: [
      { titleEn: "The Anonymous 1-Star Review", titleId: "Ulasan Bintang Satu Anonim", synopsisEn: "A sharp critique that goes viral overnight.", synopsisId: "Ulasan pedas yang menjadi viral dalam semalam." },
      { titleEn: "The Worst Blind Date", titleId: "Kencan Buta Terburuk", synopsisEn: "Sitting across from the man she roasted online.", synopsisId: "Duduk berhadapan dengan CEO yang baru ia kritik." },
      { titleEn: "Coffee Shop Ambush", titleId: "Jebakan di Kedai Kopi", synopsisEn: "Trying not to choke on her iced americano.", synopsisId: "Panik tersedak kopi saat mendengar analisisnya." },
      { titleEn: "The Identification Clause", titleId: "Klausul Identitas Pengulas", synopsisEn: "He hires her agency to redesign the app.", synopsisId: "Sang CEO menyewa kantornya untuk mendesain ulang app." },
      { titleEn: "Working in His Office", titleId: "Bekerja di Kantornya", synopsisEn: "Enduring his demanding perfectionism daily.", synopsisId: "Menghadapi standar perfeksionisnya setiap hari." },
      { titleEn: "The Product Redesign", titleId: "Mendesain Ulang Produk", synopsisEn: "Challenging his assumptions with bold ideas.", synopsisId: "Mendebat konsepnya dengan ide-ide brilian." },
      { titleEn: "Late Night Brainstorming", titleId: "Diskusi Larut Malam", synopsisEn: "Whiteboard debates that turn surprisingly playful.", synopsisId: "Perdebatan di papan tulis yang berubah manis." },
      { titleEn: "Rain on the Commute", titleId: "Hujan di Perjalanan Pulang", synopsisEn: "He offers a ride in his electric coupe.", synopsisId: "Ia menawarkan tumpangan pulang di tengah hujan." },
      { titleEn: "A Rival's Malicious Post", titleId: "Serangan Fitnah Kompetitor", synopsisEn: "A rival company leaks false bug reports.", synopsisId: "Pesaing bisnis menyebarkan laporan palsu." },
      { titleEn: "Defending His Vision", titleId: "Membela Visi Sang CEO", synopsisEn: "She writes a passionate defense of the tech.", synopsisId: "Ia menulis artikel pembelaan untuk membantunya." },
      { titleEn: "The Identity Exposed", titleId: "Terbongkarnya Sang Pengulas", synopsisEn: "Tae-jin discovers she is the anonymous reviewer.", synopsisId: "Tae-jin mengetahui bahwa ia adalah sang pengulas." },
      { titleEn: "His Surprising Reaction", titleId: "Reaksi Tak Terduga Sang Bos", synopsisEn: "Instead of anger, he is deeply impressed.", synopsisId: "Bukannya marah, sang CEO malah semakin kagum." },
      { titleEn: "The Grand Product Launch", titleId: "Peluncuran Produk Akbar", synopsisEn: "Presenting the new platform to ovation.", synopsisId: "Meluncurkan produk baru dengan sukses besar." },
      { titleEn: "Corporate Saboteur Caught", titleId: "Sabotase yang Tertangkap", synopsisEn: "Kim Ara is caught red-handed with stolen code.", synopsisId: "Kim Ara tertangkap mencuri kode rahasia." },
      { titleEn: "Five-Star Confession", titleId: "Ulasan Bintang Lima", synopsisEn: "Giving his heart a five-star rating.", synopsisId: "Memberikan rating bintang lima untuk hatinya." },
      { titleEn: "Lifetime Partnership", titleId: "Kontrak Hati Seumur Hidup", synopsisEn: "A romantic partnership sealed with a kiss.", synopsisId: "Kemitraan cinta sejati selamanya." },
    ],
  },

  // 15
  {
    slug: "the-idol-who-hates-cameras-only-smiles-for-me",
    titleEn: "The Idol Who Hates Cameras Only Smiles for Me",
    titleId: "Idol yang Membenci Kamera Hanya Tersenyum untukku",
    descEn: "A rookie photographer is assigned to an untouchable idol who only lets down his guard for her lens.",
    descId: "Fotografer magang ditugaskan memotret idol dingin yang hanya mau tersenyum di depan kameranya.",
    heroEn: "Lee Ha-jun",
    heroId: "Lee Ha-jun",
    heroSlug: "hajun",
    heroBioEn: "A wounded idol who finds peace only through her lens.",
    heroBioId: "Idol berbakat yang menemukan ketenangan di depan lensanya.",
    rivalEn: "Kang Min-chae",
    rivalId: "Kang Min-chae",
    rivalSlug: "minchae",
    rivalBioEn: "A ruthless paparazzi chasing their private photos.",
    rivalBioId: "Paparazi kejam yang mengincar momen pribadi mereka.",
    genres: ["Romance", "Celebrity"],
    tags: ["Photographer", "Cold Idol", "Sweet Romance"],
    episodes: [
      { titleEn: "The Rookie Photographer", titleId: "Fotografer Magang", synopsisEn: "Assigned to shoot the notoriously unsmiling star.", synopsisId: "Ditugaskan memotret sang idol yang tak pernah tersenyum." },
      { titleEn: "The Cold Glare Through the Lens", titleId: "Tatapan Dingin Melalui Lensa", synopsisEn: "Ha-jun refuses standard commercial poses.", synopsisId: "Ha-jun menolak pose komersial yang kaku." },
      { titleEn: "The Stolen Smile", titleId: "Senyuman yang Tertangkap Kamera", synopsisEn: "Capturing his genuine laugh between takes.", synopsisId: "Mengabadikan tawa tulusnya di sela-sela syuting." },
      { titleEn: "Behind the Studio Lights", titleId: "Di Balik Lampu Studio", synopsisEn: "Talking about the pressure of public expectations.", synopsisId: "Berbincang tentang beban ekspektasi publik." },
      { titleEn: "A Secret Photoshoot", titleId: "Sesi Foto Rahasia", synopsisEn: "Shooting in natural sunlight at the botanical park.", synopsisId: "Sesi foto alami di taman botani yang asri." },
      { titleEn: "The Agency's Pressure", titleId: "Tekanan Berat Agensi", synopsisEn: "Management demands heavy artificial editing.", synopsisId: "Manajemen menuntut editan foto yang berlebihan." },
      { titleEn: "Midnight on the Han River", titleId: "Tengah Malam di Sungai Han", synopsisEn: "Walking by the water with camera in hand.", synopsisId: "Menyusuri tepi sungai Han dengan kamera di tangan." },
      { titleEn: "Rain on the Camera Case", titleId: "Hujan di Kotak Kamera", synopsisEn: "Running into a phone booth to stay dry.", synopsisId: "Berteduh di bilik telepon saat hujan deras." },
      { titleEn: "The Leaked Photoshoot", titleId: "Foto Rahasia yang Bocor", synopsisEn: "Min-chae steals unreleased photo drafts.", synopsisId: "Min-chae mencuri draf foto yang belum dirilis." },
      { titleEn: "His Defensive Shield", titleId: "Perlindungan Sang Idol", synopsisEn: "Ha-jun publicly protects her credibility.", synopsisId: "Ha-jun membela nama baik sang fotografer." },
      { titleEn: "Darkroom Confession", titleId: "Pengakuan di Kamar Gelap", synopsisEn: "Developing film prints in red ambient light.", synopsisId: "Mencetak foto di bawah cahaya merah kamar gelap." },
      { titleEn: "The Paparazzi Blackmail", titleId: "Pemerasan Paparazi", synopsisEn: "Refusing to yield to predatory photographers.", synopsisId: "Menolak tunduk pada ancaman pemerasan." },
      { titleEn: "The Solo Exhibition", titleId: "Pameran Foto Tunggal", synopsisEn: "Displaying his true self to the world.", synopsisId: "Menampilkan jati diri Ha-jun yang sesungguhnya." },
      { titleEn: "Smiling for the World", titleId: "Tersenyum untuk Dunia", synopsisEn: "Fans embrace his authentic smile.", synopsisId: "Penggemar menyambut hangat senyuman tulusnya." },
      { titleEn: "Focus on You", titleId: "Fokus Hanya Padamu", synopsisEn: "He steps behind the lens to photograph her.", synopsisId: "Ia ganti memotret wanita yang dicintainya." },
      { titleEn: "The Perfect Frame", titleId: "Potret Sempurna Selamanya", synopsisEn: "A lifetime captured in vivid color.", synopsisId: "Potret kebahagiaan abadi bersama." },
    ],
  },

  // 16
  {
    slug: "i-was-hired-to-break-his-heart",
    titleEn: "I Was Hired to Break His Heart",
    titleId: "Aku Dibayar untuk Menghancurkan Hatinya",
    descEn: "Paid to seduce a wealthy heir and crush him, she discovers the deadly truth behind the contract.",
    descId: "Dibayar untuk membuat pewaris kaya jatuh cinta lalu menghancurkannya, ia tersadar motif keji kliennya.",
    heroEn: "Cha Woo-hyun",
    heroId: "Cha Woo-hyun",
    heroSlug: "woohyun",
    heroBioEn: "A lonely heir who offers his whole heart despite the danger.",
    heroBioId: "Pewaris kesepian yang memberikan seluruh hatinya secara tulus.",
    rivalEn: "Lee Kyung-min",
    rivalId: "Lee Kyung-min",
    rivalSlug: "kyungmin",
    rivalBioEn: "The ruthless employer pulling the strings.",
    rivalBioId: "Klien kejam yang merancang jebakan cinta.",
    genres: ["Romance", "Thriller", "Revenge"],
    tags: ["Dangerous Game", "Contract", "Redemption"],
    episodes: [
      { titleEn: "The Dark Bounty", titleId: "Kontrak Terlarang", synopsisEn: "Accepting a lucrative mission out of desperation.", synopsisId: "Menerima misi berbayar mahal demi melunasi hutang." },
      { titleEn: "Meeting the Lonely Heir", titleId: "Menemui Sang Pewaris Kesepian", synopsisEn: "An engineered encounter in the gallery.", synopsisId: "Pertemuan yang dirancang di galeri seni." },
      { titleEn: "Calculated Charm", titleId: "Pesona yang Dirancang", synopsisEn: "Playing every romantic move by the book.", synopsisId: "Menjalankan rencana rayuan sesuai naskah." },
      { titleEn: "His Genuine Smile", titleId: "Senyumannya yang Tulus", synopsisEn: "Woo-hyun's sincerity pierces her defenses.", synopsisId: "Ketulusan Woo-hyun meluluhkan hatinya." },
      { titleEn: "The Sting of Guilt", titleId: "Sengatan Rasa Bersalah", synopsisEn: "Struggling with the deceit as feelings grow.", synopsisId: "Pergulatan batin saat cinta mulai bersemi." },
      { titleEn: "The Client's Pressure", titleId: "Tekanan dari Sang Klien", synopsisEn: "Kyung-min demands faster execution of the trap.", synopsisId: "Kyung-min menuntut agar jebakan segera dituntaskan." },
      { titleEn: "A Stolen Weekend in Jeju", titleId: "Akhir Pekan Rahasia di Jeju", synopsisEn: "Walking along coastal cliffs hand in hand.", synopsisId: "Menyusuri tebing pantai Jeju berdua." },
      { titleEn: "Rain on the Seaside", titleId: "Hujan di Tepi Pantai", synopsisEn: "He confesses that she is his first true happiness.", synopsisId: "Ia mengaku bahwa wanita itu adalah kebahagiaan pertamanya." },
      { titleEn: "The Envelope of Evidence", titleId: "Amplop Bukti Pembayaran", synopsisEn: "Finding out Kyung-min plans to bankrupt his family.", synopsisId: "Mengetahui rencana keji klien untuk memiskinkan Woo-hyun." },
      { titleEn: "The Trap is Sprung", titleId: "Jebakan yang Terbuka", synopsisEn: "Kyung-min leaks photos of the contract payment.", synopsisId: "Kyung-min membocorkan bukti transfer uang kontrak." },
      { titleEn: "Heartbreak in the Rain", titleId: "Hancurnya Hati di Bawah Hujan", synopsisEn: "Woo-hyun looks at her with shattered eyes.", synopsisId: "Woo-hyun menatapnya dengan hati yang hancur." },
      { titleEn: "The Client's True Identity", titleId: "Siapa Klien Sebenarnya", synopsisEn: "Unmasking Kyung-min's illegal stock syndicate.", synopsisId: "Membongkar sindikat saham gelap Kyung-min." },
      { titleEn: "Saving Him from the Fall", titleId: "Menyelamatkannya dari Jurang", synopsisEn: "Risking everything to turn over the master ledger.", synopsisId: "Mempertaruhkan segalanya menyerahkan bukti ke polisi." },
      { titleEn: "The Truth Confessed", titleId: "Pengakuan Penuh Air Mata", synopsisEn: "Begging for forgiveness with absolute honesty.", synopsisId: "Memohon maaf dengan kejujuran tanpa batas." },
      { titleEn: "Healing the Wounds", titleId: "Menyembuhkan Luka", synopsisEn: "Woo-hyun realizes her love became real.", synopsisId: "Woo-hyun menyadari cintanya telah menjadi nyata." },
      { titleEn: "A Heart Made Whole", titleId: "Hati yang Utuh Kembali", synopsisEn: "Starting anew with trust and genuine devotion.", synopsisId: "Memulai lembaran baru dengan cinta sejati." },
    ],
  },

  // 17
  {
    slug: "the-man-in-apartment-1707-is-a-runaway-star",
    titleEn: "The Man in Apartment 1707 Is a Runaway Star",
    titleId: "Pria di Apartemen 1707 Ternyata Superstar yang Menghilang",
    descEn: "Her quiet neighbor is a world-famous actor who vanished six months ago to escape industry corruption.",
    descId: "Tetangga apartemennya yang pendiam ternyata superstar dunia yang menghilang 6 bulan lalu.",
    heroEn: "Jung Min-jae",
    heroId: "Jung Min-jae",
    heroSlug: "minjae",
    heroBioEn: "A runaway superstar seeking sanctuary from a toxic agency.",
    heroBioId: "Superstar pelarian yang mencari perlindungan dari agensi korup.",
    rivalEn: "Choi Yoo-jin",
    rivalId: "Choi Yoo-jin",
    rivalSlug: "yoojin",
    rivalBioEn: "The corrupt producer hunting his whereabouts.",
    rivalBioId: "Produser korup yang memburu keberadaannya.",
    genres: ["Romance", "Mystery", "Celebrity"],
    tags: ["Secret Neighbor", "Runaway Celebrity", "Intrigue"],
    episodes: [
      { titleEn: "The Quiet Neighbor", titleId: "Tetangga yang Misterius", synopsisEn: "A reclusive figure living next door at 1707.", synopsisId: "Sosok pendiam yang tinggal di kamar 1707." },
      { titleEn: "The Dropped Groceries", titleId: "Belanjaan yang Terjatuh", synopsisEn: "Helping him pick up oranges in the hallway.", synopsisId: "Membantunya memungut belanjaan di lorong." },
      { titleEn: "The Voice on the Radio", titleId: "Suara di Radio", synopsisEn: "Hearing his legendary voice in old reruns.", synopsisId: "Mendengar suaranya yang khas di siaran radio." },
      { titleEn: "Hiding from the World", titleId: "Bersembunyi dari Dunia", synopsisEn: "Discovering his true identity under the cap.", synopsisId: "Mengenali wajah aslinya di balik topi." },
      { titleEn: "A Shared Bowl of Ramen", titleId: "Semangkuk Ramen Bersama", synopsisEn: "Late night meal in her humble kitchen.", synopsisId: "Makan ramen bersama di dapur sederhana." },
      { titleEn: "The Agency's Search Team", titleId: "Tim Pemburu Agensi", synopsisEn: "Black SUVs spotted in the underground garage.", synopsisId: "Mobil SUV hitam terlihat di garasi bawah tanah." },
      { titleEn: "Late Night Balcony Talks", titleId: "Obrolan Balkon Larut Malam", synopsisEn: "Leaning on railings under the city stars.", synopsisId: "Berbincang di balkon di bawah gemerlap bintang." },
      { titleEn: "Rain on the Windowsill", titleId: "Hujan di Ambang Jendela", synopsisEn: "Listening to his dreams of acting freely.", synopsisId: "Mendengarkan impiannya berakting tanpa paksaan." },
      { titleEn: "His Stolen Identity", titleId: "Identitas yang Dirampas", synopsisEn: "Learning about the fraudulent contract trap.", synopsisId: "Mengetahui klausul kontrak palsu agensinya." },
      { titleEn: "The Conspiracy Behind His Absence", titleId: "Konspirasi di Balik Kehilangannya", synopsisEn: "Unearthing the financial embezzlement files.", synopsisId: "Menemukan bukti penggelapan dana sang produser." },
      { titleEn: "Secret Escape from the Garage", titleId: "Pelarian dari Garasi Bawah Tanah", synopsisEn: "Smuggling him out in her compact hatchback.", synopsisId: "Menyelundupkannya keluar melewati tim pemburu." },
      { titleEn: "The Safehouse", titleId: "Rumah Perlindungan Rahasia", synopsisEn: "Hiding at her grandmother's seaside cottage.", synopsisId: "Bersembunyi di rumah pantai neneknya." },
      { titleEn: "Confronting the Producer", titleId: "Menghadapi Sang Produser", synopsisEn: "Delivering the ultimatum to Choi Yoo-jin.", synopsisId: "Memberikan bukti kejahatan pada Choi Yoo-jin." },
      { titleEn: "The Live Broadcast Reveal", titleId: "Pengakuan di Siaran Langsung", synopsisEn: "Min-jae speaks directly to the nation.", synopsisId: "Min-jae berbicara langsung ke seluruh negeri." },
      { titleEn: "Reclaiming His Stage", titleId: "Merebut Kembali Panggungnya", synopsisEn: "Signing with an independent creative studio.", synopsisId: "Mendirikan studio kreatif independen." },
      { titleEn: "Home in Apartment 1707", titleId: "Rumah di Apartemen 1707", synopsisEn: "Finding where his heart truly belongs.", synopsisId: "Menemukan tempat pulang sejati di sisinya." },
    ],
  },

  // 18
  {
    slug: "i-rejected-a-billionaire-without-knowing-who-he-was",
    titleEn: "I Rejected a Billionaire Without Knowing Who He Was",
    titleId: "Aku Menolak Seorang Miliarder Tanpa Tahu Siapa Dia",
    descEn: "She turned down an arrogant stranger at a cafe. The next morning he arrived as the new chairman.",
    descId: "Ia menolak pria sombong di kafe. Keesokan paginya pria itu muncul sebagai komisaris baru di kantornya.",
    heroEn: "Seo Tae-won",
    heroId: "Seo Tae-won",
    heroSlug: "taewon",
    heroBioEn: "A billionaire chairman unused to ever hearing the word 'no'.",
    heroBioId: "Komisaris muda kaya raya yang tak pernah ditolak siapa pun.",
    rivalEn: "Park Ji-eun",
    rivalId: "Park Ji-eun",
    rivalSlug: "jieun",
    rivalBioEn: "A corporate rival trying to sabotage the merger.",
    rivalBioId: "Eksekutif ambisius yang berusaha menggagalkan merger.",
    genres: ["Romance", "Comedy"],
    tags: ["Billionaire", "Office Comedy", "Enemies to Lovers"],
    episodes: [
      { titleEn: "The Cafe Encounter", titleId: "Penolakan di Kedai Kopi", synopsisEn: "Rejecting a smooth pickup line without hesitation.", synopsisId: "Menolak mentah-mentah rayuan pria di kafe." },
      { titleEn: "The New Chairman Arrives", titleId: "Komisaris Baru Tiba", synopsisEn: "The man from the cafe steps into the auditorium.", synopsisId: "Pria kafe kemarin muncul sebagai pemilik baru." },
      { titleEn: "The Office Reconnaissance", titleId: "Penyelidikan di Kantor", synopsisEn: "He summons her to the executive suite.", synopsisId: "Ia memanggilnya ke ruang pimpinan eksekutif." },
      { titleEn: "His Egotistical Revenge", titleId: "Aksi Balas Dendam Sang Bos", synopsisEn: "Assigning her impossible corporate challenges.", synopsisId: "Memberikannya tugas-tugas kantor yang mustahil." },
      { titleEn: "The Impossible Assignment", titleId: "Tugas Mustahil", synopsisEn: "Solving the supply chain bottleneck in 24 hours.", synopsisId: "Menyelesaikan masalah logistik dalam 24 jam." },
      { titleEn: "Outsmarting the Chairman", titleId: "Mengakali Sang Komisaris", synopsisEn: "Proving her sharp intellect in front of the board.", synopsisId: "Membuktikan kecerdasannya di depan dewan direksi." },
      { titleEn: "Late Night in the Executive Suite", titleId: "Lembur di Lantai Eksekutif", synopsisEn: "Sharing takeout pizza across financial spreadsheets.", synopsisId: "Makan pizza berdua di antara berkas laporan keuangan." },
      { titleEn: "Rain on the Glass Tower", titleId: "Hujan di Menara Kaca", synopsisEn: "Tae-won shows his humble childhood roots.", synopsisId: "Tae-won menceritakan masa kecilnya yang sederhana." },
      { titleEn: "The Boardroom Alliance", titleId: "Aliansi di Dewan Direksi", synopsisEn: "Working together against hostile shareholders.", synopsisId: "Bahu-membahu melawan pemegang saham nakal." },
      { titleEn: "When Arrogance Melts", titleId: "Saat Kesombongan Luluh", synopsisEn: "Seeing the warm, caring man beneath the billions.", synopsisId: "Melihat ketulusan di balik status miliardernya." },
      { titleEn: "The Rival's Slander", titleId: "Fitnah dari Pesaing Bisnis", synopsisEn: "Ji-eun tries to frame her for insider trading.", synopsisId: "Ji-eun memfitnahnya membocorkan rahasia dagang." },
      { titleEn: "Defending His Honor", titleId: "Membela Kehormatannya", synopsisEn: "She gathers the digital logs to prove innocence.", synopsisId: "Ia membongkar bukti digital membersihkan namanya." },
      { titleEn: "The Chairman's Real Proposal", titleId: "Lamaran Sebenarnya", synopsisEn: "Asking her out for real with genuine humility.", synopsisId: "Mengajaknya berkencan secara tulus tanpa arogansi." },
      { titleEn: "The Shareholder Victory", titleId: "Kemenangan Rapat Pemegang Saham", synopsisEn: "Securing full company control together.", synopsisId: "Memenangkan suara mutlak kendali perusahaan." },
      { titleEn: "Saying Yes at Last", titleId: "Akhirnya Mengucap 'Ya'", synopsisEn: "Accepting his love on equal footing.", synopsisId: "Menerima cintanya sebagai pasangan sejajar." },
      { titleEn: "The Billionaire's Heart", titleId: "Hati Sang Miliarder", synopsisEn: "A fortune worthless compared to her love.", synopsisId: "Harta melimpah tak sebanding dengan cintanya." },
    ],
  },

  // 19
  {
    slug: "my-contract-husband-has-another-identity",
    titleEn: "My Contract Husband Has Another Identity",
    titleId: "Suami Kontrakku Memiliki Identitas Lain",
    descEn: "She married a quiet accountant. At night, she repeatedly encounters a masked celebrity icon.",
    descId: "Ia menikahi akuntan pendiam. Di malam hari, ia kerap bertemu bintang panggung bertopeng.",
    heroEn: "Kang Ji-won",
    heroId: "Kang Ji-won",
    heroSlug: "jiwon",
    heroBioEn: "A quiet husband by day, international masked music icon by night.",
    heroBioId: "Suami pendiam di siang hari, musisi bertopeng legendaris di malam hari.",
    rivalEn: "Moon Tae-ri",
    rivalId: "Moon Tae-ri",
    rivalSlug: "taeri",
    rivalBioEn: "A reporter determined to unmask the secret singer.",
    rivalBioId: "Jurnalis gigih yang terobsesi membongkar identitasnya.",
    genres: ["Romance", "Mystery", "Celebrity"],
    tags: ["Dual Identity", "Secret Husband", "Night Life"],
    episodes: [
      { titleEn: "The Quiet Accountant", titleId: "Suami Akuntan Pendiam", synopsisEn: "A peaceful contract marriage of convenience.", synopsisId: "Pernikahan kontrak tenang dengan pria pendiam." },
      { titleEn: "The Midnight Mask", titleId: "Topeng Tengah Malam", synopsisEn: "A masked performer stuns Seoul nightlife.", synopsisId: "Penyanyi bertopeng memukau panggung malam Seoul." },
      { titleEn: "The Celebrity at the Club", titleId: "Bintang Panggung di Kelab", synopsisEn: "Encountering the masked icon in VIP lounge.", synopsisId: "Bertemu sang ikon bertopeng di ruang VIP." },
      { titleEn: "Clues in His Wardrobe", titleId: "Petunjuk di Lemari Pakaian", synopsisEn: "Finding a designer leather jacket in his closet.", synopsisId: "Menemukan jaket kulit mewah di lemarinya." },
      { titleEn: "A Familiar Voice", titleId: "Suara yang Begitu Dikenal", synopsisEn: "Hearing his voice singing a love ballad.", synopsisId: "Mendengar suara suaminya menyanyikan lagu cinta." },
      { titleEn: "The Stage Encounter", titleId: "Pertemuan di Belakang Panggung", synopsisEn: "Close proximity behind the velvet curtains.", synopsisId: "Momen mendebarkan di balik tirai panggung." },
      { titleEn: "Paparazzi Following the Husband", titleId: "Paparazi Mengikuti Sang Suami", synopsisEn: "Protecting his daytime identity from reporters.", synopsisId: "Melindungi identitas siang harinya dari wartawan." },
      { titleEn: "Rain on the Rooftop Garden", titleId: "Hujan di Taman Atap", synopsisEn: "Sharing an umbrella on the apartment roof.", synopsisId: "Berbagi payung di taman atap apartemen." },
      { titleEn: "The Secret Contract Clause", titleId: "Klausul Kontrak Tersembunyi", synopsisEn: "Reading the clause that forbids asking about nights.", synopsisId: "Membaca klausul larangan menanyakan aktivitas malam." },
      { titleEn: "Unmasking in the Dark", titleId: "Membuka Topeng di Kegelapan", synopsisEn: "Catching him adjusting his mask in the hallway.", synopsisId: "Memergokinya merapikan topeng di lorong gelap." },
      { titleEn: "The Reason for His Disguise", titleId: "Alasan di Balik Penyamarannya", synopsisEn: "Singing without the burden of corporate pressure.", synopsisId: "Bernyanyi bebas tanpa tekanan kontrak industri." },
      { titleEn: "Protecting Both Lives", titleId: "Menjaga Dua Kehidupan", synopsisEn: "Helping him maintain his secret dual existence.", synopsisId: "Membantunya menjaga rahasia dua kehidupannya." },
      { titleEn: "The Rival's Extortion", titleId: "Pemerasan dari Saingan", synopsisEn: "Tae-ri threatens to leak his real name.", synopsisId: "Tae-ri mengancam menyebarkan nama aslinya." },
      { titleEn: "The Final Masked Concert", titleId: "Konser Topeng Terakhir", synopsisEn: "A historic show dedicated to his wife.", synopsisId: "Konser bersejarah yang dipersembahkan untuk istrinya." },
      { titleEn: "Two Worlds Collide", titleId: "Dua Dunia Menyatu", synopsisEn: "Taking off the mask before sixty thousand fans.", synopsisId: "Membuka topeng di hadapan 60.000 penggemar." },
      { titleEn: "One True Husband", titleId: "Suami Sejati Selamanya", synopsisEn: "Loving both the accountant and the superstar.", synopsisId: "Mencintai kedua jati dirinya seutuhnya." },
    ],
  },

  // 20
  {
    slug: "i-time-traveled-to-the-night-before-his-debut",
    titleEn: "I Time-Traveled to the Night Before His Debut",
    titleId: "Aku Kembali ke Malam Sebelum Dia Menjadi Idol",
    descEn: "Waking ten years in the past, she has one chance to prevent her favorite star's tragedy.",
    descId: "Terbangun 10 tahun di masa lalu, ia bertekad mengubah takdir tragis sang idol favoritnya.",
    heroEn: "Han Tae-yun",
    heroId: "Han Tae-yun",
    heroSlug: "taeyun",
    heroBioEn: "A rookie idol full of hope on the eve of his historic debut.",
    heroBioId: "Idol muda penuh mimpi di malam sebelum debut bersejarahnya.",
    rivalEn: "Kim Min-seok",
    rivalId: "Kim Min-seok",
    rivalSlug: "minseok",
    rivalBioEn: "The corrupt manager who exploited Tae-yun's group.",
    rivalBioId: "Manajer rakus yang mengeksploitasi kontrak grup Tae-yun.",
    genres: ["Romance", "Fantasy", "Time Travel"],
    tags: ["Time Slip", "Save the Idol", "Second Chance"],
    episodes: [
      { titleEn: "Ten Years in the Past", titleId: "Sepuluh Tahun di Masa Lalu", synopsisEn: "Waking up in 2016 holding a vintage concert ticket.", synopsisId: "Terbangun di tahun 2016 memegang tiket konser lawas." },
      { titleEn: "The Eve of Destiny", titleId: "Malam Sebelum Debut", synopsisEn: "Finding the training center where Tae-yun practiced.", synopsisId: "Menemukan ruang latihan tempat Tae-yun berlatih." },
      { titleEn: "Meeting the Young Idol", titleId: "Menemui Sang Idol Muda", synopsisEn: "Seeing his youthful, hopeful smile in person.", synopsisId: "Melihat langsung senyuman tulusnya di masa muda." },
      { titleEn: "Warning of the Trap", titleId: "Peringatan Bahaya", synopsisEn: "Warning him about the dangerous stage rig.", synopsisId: "Memperingatkannya tentang bahaya panggung debut." },
      { titleEn: "The Corrupt Contract File", titleId: "Berkas Kontrak Palsu", synopsisEn: "Stealing the exploitative agency agreement.", synopsisId: "Mengamankan surat perjanjian kontrak yang menjerat." },
      { titleEn: "Changing the Rehearsal", titleId: "Mengubah Jadwal Latihan", synopsisEn: "Altering the choreography to prevent injury.", synopsisId: "Mengubah koreografi demi mencegah cedera fatal." },
      { titleEn: "A Stolen Walk in the Moonlight", titleId: "Jalan-jalan di Bawah Rembulan", synopsisEn: "Tae-yun thanks her for believing in his voice.", synopsisId: "Tae-yun berterima kasih atas kepercayaannya." },
      { titleEn: "Rain on Debut Morning", titleId: "Hujan di Pagi Hari Debut", synopsisEn: "Rushing to the broadcast station in the storm.", synopsisId: "Bergegas menuju stasiun televisi di tengah hujan." },
      { titleEn: "The Shady Manager Confronted", titleId: "Menghadapi Manajer Licik", synopsisEn: "Exposing Min-seok's sabotage before live broadcast.", synopsisId: "Membongkar sabotase Min-seok sebelum siaran." },
      { titleEn: "A New Melody Written", titleId: "Menulis Melodi Baru", synopsisEn: "Singing an unreleased song from the future.", synopsisId: "Menyanyikan melodi indah dari masa depan." },
      { titleEn: "The Historic Debut Stage", titleId: "Panggung Debut Bersejarah", synopsisEn: "A flawless performance without tragedy.", synopsisId: "Penampilan debut yang sempurna tanpa tragedi." },
      { titleEn: "Fate Diverges", titleId: "Takdir yang Berubah", synopsisEn: "Realizing the timeline has rewritten itself.", synopsisId: "Menyadari bahwa takdir masa depan telah berubah." },
      { titleEn: "The Threat of the Timeline", titleId: "Ancaman Garis Waktu", synopsisEn: "Will she be pulled back to the future alone?", synopsisId: "Akankah ia ditarik kembali ke masa depan sendirian?" },
      { titleEn: "Protecting His Smile", titleId: "Melindungi Senyumannya", synopsisEn: "Tae-yun vows to find her no matter what era.", synopsisId: "Tae-yun berjanji mencarinya di masa apa pun." },
      { titleEn: "Future Rewritten", titleId: "Masa Depan yang Ditulis Ulang", synopsisEn: "Standing together in a brighter tomorrow.", synopsisId: "Berdiri bersama di masa depan yang bercahaya." },
      { titleEn: "Destiny Together", titleId: "Takdir Abadi Bersama", synopsisEn: "A love that conquered time itself.", synopsisId: "Cinta sejati yang melintasi ruang dan waktu." },
    ],
  },
];

export function getAll20NewStories(): StoryDefinition[] {
  return BESPOKE_STORIES_CONFIG.map((config, sIdx) => {
    const isMusicDrama = config.genres.includes("Music") || config.tags.some(t => t.toLowerCase().includes("idol"));
    const isRevengeDrama = config.genres.includes("Revenge") || config.genres.includes("Thriller");
    const isChaebolDrama = config.tags.some(t => t.toLowerCase().includes("ceo") || t.toLowerCase().includes("chaebol") || t.toLowerCase().includes("contract"));

    const episodeArcs = config.episodes.map((ep, i) => {
      const epNum = i + 1;
      const coinPrice = epNum <= 3 ? 0 : epNum <= 7 ? 10 : epNum <= 12 ? 15 : epNum <= 15 ? 20 : 25;
      const unlockType = epNum <= 3 ? "FREE" : "COIN_LOCKED";

      // Select atmospheric location based on episode stage & drama type
      const bgSlug =
        epNum === 1 || epNum === 5 || epNum === 9 ? "penthouse" :
        epNum === 2 || epNum === 6 || epNum === 13 ? (isMusicDrama ? "office" : "boardroom") :
        epNum === 3 || epNum === 8 || epNum === 14 ? "rain_street" :
        epNum === 4 || epNum === 10 || epNum === 15 ? "ballroom" :
        epNum === 7 || epNum === 11 ? "bedroom" : "office";

      const bgMusic =
        epNum % 4 === 1 ? "romantic" :
        epNum % 4 === 2 ? "tense" :
        epNum % 4 === 3 ? "dramatic" : "mystery";

function buildBespokeDialogueArcs(config: any, ep: any, epNum: number) {
  const hero = config.heroId;
  const heroEn = config.heroEn;
  const rival = config.rivalId;
  const rivalEn = config.rivalEn;
  const title = ep.titleId;
  const titleEn = ep.titleEn;
  const synopsis = ep.synopsisId;
  const synopsisEn = ep.synopsisEn;
  const drama = config.titleId;
  const dramaEn = config.titleEn;

  // 1. Contextual Location & Audio
  const bgSlug =
    epNum === 1 || epNum === 5 || epNum === 9 ? "penthouse" :
    epNum === 2 || epNum === 6 || epNum === 13 ? "boardroom" :
    epNum === 3 || epNum === 8 || epNum === 14 ? "rain_street" :
    epNum === 4 || epNum === 10 || epNum === 15 ? "ballroom" :
    epNum === 7 || epNum === 11 ? "bedroom" : "office";

  const bgMusic =
    epNum % 4 === 1 ? "romantic" :
    epNum % 4 === 2 ? "tense" :
    epNum % 4 === 3 ? "dramatic" : "mystery";

  // 2. Rich Multi-Turn Dialogues Tailored to Exact Episode
  const dialogues = [
    {
      speakerEn: heroEn,
      speakerId: hero,
      charSlug: config.heroSlug,
      expr: epNum % 2 === 0 ? "normal" : "smirk",
      pos: "right" as const,
      textEn: `We're at the turning point of "${titleEn}". Look at what happened with ${synopsisEn.toLowerCase()} Everything we planned is being tested right now.`,
      textId: `Kita berada di titik penentuan dalam "${title}". Lihat apa yang terjadi mengenai ${synopsis.toLowerCase()} Semua yang kita rencanakan sedang diuji saat ini.`,
      sfx: epNum % 3 === 0 ? "camera_flash" : "heartbeat",
    },
    {
      speakerEn: "Protagonist",
      speakerId: "Protagonis",
      expr: "determined",
      pos: "left" as const,
      textEn: `I'm not backing down, ${heroEn}. We came into this together, and I intend to see it through to the end.`,
      textId: `Aku tidak akan mundur, ${hero}. Kita melangkah ke dalam situasi ini bersama, dan aku akan menghadapinya sampai tuntas.`,
    },
    {
      speakerEn: heroEn,
      speakerId: hero,
      charSlug: config.heroSlug,
      expr: epNum % 3 === 0 ? "happy" : "smirk",
      pos: "right" as const,
      textEn: `That fierce look in your eyes... it's the reason I can't look away from you. But listen closely: our enemies are watching our every move.`,
      textId: `Tatapan tajam di matamu itu... itulah alasan aku tidak pernah bisa berpaling darimu. Tapi dengarkan baik-baik: musuh kita sedang mengawasi setiap langkah kita.`,
    },
    {
      speakerEn: "Protagonist",
      speakerId: "Protagonis",
      expr: "happy",
      pos: "left" as const,
      textEn: `Then let them watch. If they want a war over "${titleEn}", we will give them a masterclass in how to win.`,
      textId: `Biarkan saja mereka menonton. Jika mereka menginginkan persaingan di "${title}", kita akan tunjukkan bagaimana caranya menang.`,
    },
    {
      speakerEn: heroEn,
      speakerId: hero,
      charSlug: config.heroSlug,
      expr: "happy",
      pos: "right" as const,
      textEn: `Step closer. Before they arrive, I need to know where your heart truly stands. Are you with me purely out of necessity, or is there something more?`,
      textId: `Mendekatlah ke sini. Sebelum mereka tiba, aku harus tahu di mana hatimu sebenarnya berpihak. Apakah kamu bersamaku hanya karena terpaksa, atau ada hal lain?`,
      sfx: "heartbeat",
    },
  ];

  // 3. High Stakes Choice Prompt
  const choicePromptEn = `In the decisive moment of "${titleEn}", how will you answer ${heroEn}?`;
  const choicePromptId = `Di momen genting "${title}", bagaimana kamu menjawab ${hero}?`;

  const choiceA = {
    textEn: `Stay composed, maintain strategic discipline, and reaffirm the plan (+Trust)`,
    textId: `Tetap tenang, jaga ketegasan strategi, dan pertegas komitmen kita (+Kepercayaan)`,
    statKey: "REPUTATION",
    statAmount: 15,
    relChar: config.heroSlug,
    relType: "trust" as const,
    relAmount: 15,
    replyEn: `${heroEn} smiles with deep respect, his fingers brushing yours. "Your sharp intellect is our greatest weapon. Let's execute the next phase."`,
    replyId: `${hero} tersenyum dengan rasa hormat mendalam, jemarinya menyentuh tanganmu pelan. "Kecerdasanmu adalah kekuatan terbesar kita. Mari kita jalankan rencana selanjutnya."`,
    reply2En: `You both stand shoulder to shoulder, radiating undeniable authority and unbroken confidence.`,
    reply2Id: `Kalian berdua berdiri berdampingan, memancarkan aura wibawa yang tak tertandingi dan keyakinan tak tergoyahkan.`,
  };

  const choiceB = {
    textEn: `Step close, hold his gaze, and whisper your true feelings (💎 10 Diamonds)`,
    textId: `Melangkah mendekat, tatap matanya lekat, dan bisikkan isi hatimu (💎 10 Diamond)`,
    diamondCost: 10,
    statKey: "LOVE",
    statAmount: 25,
    relChar: config.heroSlug,
    relType: "love" as const,
    relAmount: 30,
    replyEn: `${heroEn}'s eyes darken with intense passion as he pulls you into his arms, his warm breath sending shivers down your spine. "I was hoping you'd say that..."`,
    replyId: `Tatapan ${hero} melembut penuh gairah saat ia merengkuhmu erat ke dalam dekapannya yang hangat, membuat jantungmu berdegup kencang. "Aku sudah lama menunggu kamu mengatakan itu..."`,
    reply2En: `For a breathless moment, the entire world fades away, leaving only the fierce beat of two hearts beating as one.`,
    reply2Id: `Untuk beberapa detik yang mendebarkan, seisi dunia seolah lenyap, hanya menyisakan debaran dua hati yang berpadu menjadi satu.`,
  };

  // 4. Climax Confrontation
  const climaxDialogues = [
    {
      speakerEn: rivalEn,
      speakerId: rival,
      charSlug: config.rivalSlug,
      expr: "angry",
      pos: "center" as const,
      textEn: `Did you honestly believe you could hide the secret of "${titleEn}" from me?! This game is far from over!`,
      textId: `Kalian pikir bisa menyembunyikan rahasia di balik "${title}" dariku?! Permainan ini belum selesai!`,
      sfx: "door_slam",
    },
    {
      speakerEn: heroEn,
      speakerId: hero,
      charSlug: config.heroSlug,
      expr: "determined",
      pos: "right" as const,
      textEn: `Step back, ${rivalEn}. You have no power here anymore. Touch them, and you'll answer to me.`,
      textId: `Mundurlah, ${rival}. Kamu tidak punya kekuasaan lagi di sini. Sentuh dia, dan kamu harus berhadapan denganku.`,
      sfx: "stat_up",
    },
  ];

  // 5. Cliffhanger Hook
  const cliffhangerEn = epNum === 16
    ? `The curtains close on ${dramaEn} with an unforgettable, breathtaking grand finale!`
    : `A sudden revelation at the end of ${titleEn} threatens everything. What will unfold in Episode ${epNum + 1}?`;

  const cliffhangerId = epNum === 16
    ? `Tirai ${drama} ditutup dengan akhir kisah yang spektakuler dan tak terlupakan!`
    : `Sebuah pengungkapan mengejutkan di akhir ${title} mengancam segalanya. Apa yang akan terjadi di Episode ${epNum + 1}?`;

  return {
    number: epNum,
    title: titleEn,
    titleId: title,
    synopsis: synopsisEn,
    synopsisId: synopsis,
    bgSlug,
    bgMusic,
    dialogues,
    choicePromptEn,
    choicePromptId,
    choiceA,
    choiceB,
    climaxDialogues,
    cliffhangerEn,
    cliffhangerId,
  };
}

export function getAll20NewStories(): StoryDefinition[] {
  return BESPOKE_STORIES_CONFIG.map((config) => {
    const episodeArcs = config.episodes.map((ep, i) => {
      return buildBespokeDialogueArcs(config, ep, i + 1);
    });

    return {
      slug: config.slug,
      title: config.titleEn,
      titleId: config.titleId,
      shortDescription: config.descEn,
      shortDescriptionId: config.descId,
      description: `${config.descEn} An immersive vertical visual novel with high drama, deep relationship branches, and multiple endings on PLOT.`,
      descriptionId: `${config.descId} Visual novel interaktif vertikal penuh drama, pilihan mendalam, dan berbagai ending yang memukau di PLOT.`,
      author: "PLOT Studio",
      ageRating: "16+",
      featured: config.featured || false,
      genres: config.genres,
      tags: config.tags,
      characters: [
        {
          name: config.heroEn,
          nameId: config.heroId,
          slug: config.heroSlug,
          role: "MAIN_LOVE_INTEREST",
          biography: config.heroBioEn,
          biographyId: config.heroBioId,
          relationshipEnabled: true,
          defaultLove: 20,
          defaultTrust: 25,
        },
        {
          name: config.rivalEn,
          nameId: config.rivalId,
          slug: config.rivalSlug,
          role: "ANTAGONIST",
          biography: config.rivalBioEn,
          biographyId: config.rivalBioId,
          relationshipEnabled: false,
          defaultLove: 0,
          defaultTrust: 0,
        },
      ],
      statDefinitions: [
        { key: "REPUTATION", label: "Reputation", labelId: "Reputasi", description: "Standing in high society.", defaultValue: 50 },
        { key: "LOVE", label: "Love Bond", labelId: "Ikatan Cinta", description: "Emotional depth with partner.", defaultValue: 50 },
      ],
      endings: [
        {
          slug: "true-love",
          title: "Everlasting Promise",
          titleId: "Janji Abadi",
          description: "You chose love against all odds and built an unbreakable future together.",
          descriptionId: "Kamu memilih cinta di atas segalanya dan membangun masa depan indah bersama.",
          badgeTitle: "TRUE LOVE ENDING",
          badgeTitleId: "TRUE LOVE ENDING",
          endingType: "TRUE_LOVE",
        },
        {
          slug: "independent",
          title: "Queen of Destiny",
          titleId: "Ratu Takdir",
          description: "You triumphed through the storm and took control of your own empire.",
          descriptionId: "Kamu berhasil melewati badai dan menjadi penguasa atas takdirmu sendiri.",
          badgeTitle: "INDEPENDENT ENDING",
          badgeTitleId: "INDEPENDENT ENDING",
          endingType: "INDEPENDENT",
        },
      ],
      episodeArcs,
    };
  });
}
