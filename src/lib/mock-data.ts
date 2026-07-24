export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Author = {
  slug: string;
  name: string;
  avatarUrl: string;
  bio: string;
  longBio: string;
};

export type StaticPage = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type Qna = {
  slug: string;
  title: string;
  question: string;
  answer: string;
  answeredBySlug: string;
  categorySlug: string;
  createdAt: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  categorySlug: string;
  authorSlug: string;
  tags: string[];
  publishedAt: string;
  views: number;
};

export const categories: Category[] = [
  { slug: "fiqih", name: "Fiqih", description: "Hukum-hukum ibadah dan muamalah sehari-hari." },
  { slug: "ushul-fiqih", name: "Ushul Fiqih", description: "Kaidah dasar pengambilan hukum Islam." },
  { slug: "kaidah-fiqih", name: "Kaidah Fiqih", description: "Prinsip umum yang menaungi banyak masalah fiqih." },
  { slug: "doa", name: "Doa", description: "Kumpulan doa dari Al-Qur'an dan Sunnah." },
  { slug: "kisah", name: "Kisah", description: "Kisah teladan dari generasi terdahulu." },
  { slug: "umum", name: "Umum", description: "Konten islami umum lainnya." },
];

export const authors: Author[] = [
  {
    slug: "ust-faqih-ubaidillah-rozan",
    name: "Ust. Faqih Ubaidillah Rozan, Lc",
    avatarUrl: "/images/ust-faqih-ubaidillah-rozan.png",
    bio: "Pengajar fiqih, alumni Al-Azhar Kairo, aktif menulis kajian fiqih muamalah, ushul fiqih, dan kaidah fiqih bermadzhab Syafi'i.",
    longBio:
      "Ust. Faqih Ubaidillah Rozan, Lc. menempuh pendidikan di Universitas Al-Azhar, Kairo, dengan konsentrasi fiqih dan ushul fiqih madzhab Syafi'i. Sekembalinya ke tanah air, beliau aktif mengajar kajian fiqih muamalah kontemporer serta kaidah-kaidah fiqih dan ushul fiqih dengan pendekatan yang mudah dipahami, dengan pendekatan solutif yang tetap terbuka pada pendapat mu'tabar dari madzhab lain saat diperlukan. Beliau juga rutin menulis artikel-artikel fiqih praktis untuk membantu masyarakat memahami hukum Islam dalam kehidupan sehari-hari.",
  },
  {
    slug: "ustzh-muthiah-fairuzi",
    name: "Ustzh. Muthiah Fairuzi, Lc",
    avatarUrl: "/images/avatar-placeholder-red.png",
    bio: "Kontributor kajian fiqih wanita dan kisah-kisah teladan salafus shalih.",
    longBio:
      "Ustzh. Muthiah Fairuzi, Lc. adalah alumni Ma'had Aly dengan fokus kajian fiqih wanita dan sirah. Beliau dikenal aktif menulis kisah-kisah teladan dari kalangan salafus shalih serta membahas doa-doa yang diajarkan dalam Al-Qur'an dan Sunnah. Tulisan-tulisannya banyak digunakan sebagai bahan kajian di berbagai majelis taklim wanita.",
  },
];

export const articles: Article[] = [
  {
    slug: "hukum-jual-beli-online-dalam-islam",
    title: "Hukum Jual Beli Online dalam Islam",
    excerpt:
      "Penjelasan syarat sah transaksi jual beli daring serta hal-hal yang perlu dihindari agar terhindar dari riba dan gharar.",
    content: `
      <p>Jual beli daring (online) kini menjadi bagian tak terpisahkan dari kehidupan masyarakat: mulai dari belanja kebutuhan harian di <em>marketplace</em>, memesan makanan lewat aplikasi, hingga transaksi jasa lintas negara. Pertanyaan yang sering muncul: apakah model transaksi seperti ini sah menurut syariat, padahal penjual dan pembeli tidak bertemu dan barang tidak dilihat secara langsung?</p>
      <p>Pada asalnya, jual beli adalah muamalah yang dihalalkan oleh Allah subhanahu wa ta'ala. Allah berfirman:</p>
      <p class="font-arabic text-right" dir="rtl">وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا</p>
      <p><em>"Dan Allah menghalalkan jual beli dan mengharamkan riba."</em> (QS. Al-Baqarah: 275)</p>
      <p>Kaidah fiqih pun menegaskan bahwa hukum asal muamalah adalah boleh, sampai ada dalil yang mengharamkannya. Maka perubahan sarana — dari pasar fisik ke aplikasi digital — tidak dengan sendirinya mengubah hukum, selama rukun dan syarat jual beli tetap terpenuhi.</p>
      <h2>Rukun Jual Beli dalam Madzhab Syafi'i</h2>
      <p>Para fuqaha Syafi'iyyah menyebutkan tiga rukun jual beli: <em>'aqidan</em> (dua pihak yang berakad: penjual dan pembeli), <em>ma'qud 'alaih</em> (objek akad: barang dan harga), serta <em>shighah</em> (ijab dan qabul). Dalam transaksi online, ketiganya tetap ada, hanya bentuknya menyesuaikan: ijab qabul terwujud melalui klik "beli" dan konfirmasi pesanan, yang oleh para ulama kontemporer dinilai sebagai bentuk <em>mu'athah</em> (serah terima tanpa lafazh) atau tulisan yang menempati posisi ucapan.</p>
      <h2>Syarat Sah yang Harus Dipenuhi</h2>
      <ul>
        <li><strong>Barang jelas spesifikasinya.</strong> Foto, deskripsi ukuran, bahan, dan kualitas harus menggambarkan barang apa adanya, sehingga unsur ketidakjelasan (<em>jahalah</em>) hilang. Inilah yang menjadikan jual beli online serupa dengan akad <em>salam</em> — jual beli pesanan yang dibolehkan Nabi shallallahu 'alaihi wa sallam dengan syarat spesifikasi dan waktu penyerahan yang jelas.</li>
        <li><strong>Harga diketahui dan disepakati</strong> sebelum akad selesai, termasuk ongkos kirim dan biaya tambahan lainnya.</li>
        <li><strong>Penjual memiliki barang</strong> atau memiliki izin sah untuk menjualnya (misalnya sebagai agen resmi atau dengan skema dropship yang memenuhi ketentuan akad <em>salam</em>/wakalah).</li>
        <li><strong>Kedua pihak cakap bertransaksi</strong> dan saling ridha, tanpa paksaan.</li>
      </ul>
      <h2>Praktik yang Harus Dihindari</h2>
      <ul>
        <li><strong>Menjual barang yang belum dimiliki</strong> tanpa memenuhi ketentuan akad salam. Nabi shallallahu 'alaihi wa sallam bersabda, <em>"Janganlah engkau menjual sesuatu yang tidak ada padamu."</em> (HR. Abu Dawud dan Tirmidzi)</li>
        <li><strong>Deskripsi atau foto yang menyesatkan</strong> — ini termasuk <em>ghisysy</em> (penipuan) yang diharamkan.</li>
        <li><strong>Cicilan berbunga</strong> melalui kartu kredit konvensional atau paylater ribawi. Adapun tambahan harga karena tempo (harga cash berbeda dengan harga kredit) yang disepakati sejak awal akad, jumhur ulama membolehkannya selama akadnya jelas pada satu harga.</li>
        <li><strong>Gharar berlebihan</strong>, seperti membeli "paket misteri" yang isinya sama sekali tidak diketahui.</li>
      </ul>
      <h2>Bagaimana dengan Khiyar (Hak Membatalkan)?</h2>
      <p>Syariat memberikan hak <em>khiyar</em> untuk menjamin keridhaan kedua pihak. Dalam konteks online, fitur pengembalian barang ketika tidak sesuai deskripsi merupakan wujud dari <em>khiyar 'aib</em> dan <em>khiyar ru'yah</em>. Pembeli berhak mengembalikan barang yang cacat atau berbeda dari yang dideskripsikan, dan penjual wajib melayaninya.</p>
      <h2>Kesimpulan</h2>
      <p>Jual beli online hukumnya <strong>sah dan halal</strong> selama memenuhi rukun dan syarat jual beli: barang jelas, harga disepakati, penjual berhak menjual, dan bebas dari riba, gharar, serta penipuan. Perkembangan teknologi hanyalah perubahan sarana; prinsip-prinsip muamalah syar'iyyah tetap menjadi timbangannya. Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=640&h=400&fit=crop&q=80",
    categorySlug: "fiqih",
    authorSlug: "ust-faqih-ubaidillah-rozan",
    tags: ["jual beli", "muamalah", "riba", "e-commerce"],
    publishedAt: "2026-07-15",
    views: 4230,
  },
  {
    slug: "kaidah-al-yaqin-la-yuzalu-bisy-syakk",
    title: "Kaidah 'Al-Yaqin La Yuzalu bisy-Syakk' dan Penerapannya",
    excerpt:
      "Mengenal salah satu kaidah fiqih terbesar: keyakinan tidak bisa dihilangkan dengan keraguan, lengkap dengan contoh penerapan.",
    content: `
      <p>Di antara lima kaidah besar (<em>al-qawa'id al-khams al-kubra</em>) yang menjadi tiang ilmu fiqih, kaidah <em>"al-yaqin la yuzalu bisy-syakk"</em> — keyakinan tidak dihilangkan dengan keraguan — barangkali adalah kaidah yang paling sering kita amalkan sehari-hari tanpa disadari. Imam as-Suyuthi dalam <em>al-Asybah wan-Nazha'ir</em> menyebutkan bahwa kaidah ini mencakup lebih dari tiga perempat bab fiqih.</p>
      <p class="font-arabic text-right" dir="rtl">الْيَقِينُ لَا يُزَالُ بِالشَّكِّ</p>
      <h2>Landasan Kaidah</h2>
      <p>Kaidah ini bersumber langsung dari hadits shahih. Di antaranya, seorang sahabat mengadu kepada Nabi shallallahu 'alaihi wa sallam tentang orang yang merasa mendapati sesuatu dalam shalatnya (merasa berhadats). Beliau bersabda:</p>
      <p><em>"Janganlah ia berpaling (membatalkan shalat) sampai ia mendengar suara atau mendapati bau."</em> (HR. Bukhari dan Muslim)</p>
      <p>Hadits ini menunjukkan bahwa status suci yang diyakini tidak gugur oleh sekadar perasaan ragu. Dalam riwayat Muslim yang lain, Nabi shallallahu 'alaihi wa sallam memerintahkan orang yang ragu jumlah rakaatnya untuk <em>"membuang keraguan dan mengambil yang ia yakini."</em></p>
      <h2>Makna Kaidah</h2>
      <p>Yang dimaksud <em>yaqin</em> di sini adalah sesuatu yang tetap dan pasti berdasarkan pengetahuan atau dalil, sedangkan <em>syakk</em> adalah kebimbangan antara dua kemungkinan tanpa ada yang lebih kuat. Kaidah ini menetapkan: hukum yang sudah pasti tidak dapat diangkat oleh sekadar kemungkinan. Sebab keyakinan lebih kuat daripada keraguan, maka yang lemah tidak dapat menggugurkan yang kuat.</p>
      <h2>Kaidah Turunan</h2>
      <p>Dari kaidah induk ini, para ulama menurunkan sejumlah kaidah cabang, di antaranya:</p>
      <ul>
        <li><em>"Al-ashlu baqa'u ma kana 'ala ma kana"</em> — hukum asal adalah tetapnya sesuatu sebagaimana keadaan sebelumnya (istishhab).</li>
        <li><em>"Al-ashlu bara'atudz-dzimmah"</em> — hukum asal adalah bebasnya tanggungan seseorang dari kewajiban dan tuntutan.</li>
        <li><em>"Al-ashlu fil-asyya' al-ibahah"</em> — hukum asal segala sesuatu (di luar ibadah) adalah mubah, sampai ada dalil yang mengharamkan.</li>
      </ul>
      <h2>Contoh Penerapan Sehari-hari</h2>
      <ul>
        <li><strong>Ragu batalnya wudhu:</strong> Seseorang yakin telah berwudhu, lalu ragu apakah sudah batal. Ia tetap dihukumi suci, karena yang yakin adalah wudhunya.</li>
        <li><strong>Ragu jumlah rakaat:</strong> Ragu antara tiga atau empat rakaat, maka ia mengambil yang yakin (tiga), menyempurnakan satu rakaat, lalu sujud sahwi sebelum salam menurut madzhab Syafi'i.</li>
        <li><strong>Ragu najis pada pakaian:</strong> Pakaian yang asalnya suci tidak menjadi najis hanya karena kekhawatiran terkena percikan najis yang tidak pasti.</li>
        <li><strong>Was-was dalam niat:</strong> Orang yang sudah bertakbir dengan niat lalu diganggu keraguan "tadi sudah niat atau belum" tidak perlu mengulang shalatnya; keraguan semacam ini justru pintu was-was yang harus diabaikan.</li>
      </ul>
      <h2>Hikmah Kaidah</h2>
      <p>Kaidah ini adalah rahmat besar bagi umat. Tanpanya, orang yang mudah ragu akan terus mengulang wudhu, shalat, dan ibadahnya tanpa akhir, hingga jatuh pada was-was yang menyiksa. Islam menutup pintu itu dengan prinsip yang tegas: bangunan hukum berdiri di atas keyakinan, bukan di atas kebimbangan.</p>
      <h2>Kesimpulan</h2>
      <p>Kaidah <em>al-yaqin la yuzalu bisy-syakk</em> mengajarkan keteguhan dalam beragama: apa yang sudah pasti tidak goyah oleh sekadar kemungkinan. Ia menjadi obat bagi penyakit was-was sekaligus fondasi bagi ribuan permasalahan fiqih, dari bab thaharah hingga muamalah. Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1719194981461-fa0ec450999e?w=640&h=400&fit=crop&q=80",
    categorySlug: "kaidah-fiqih",
    authorSlug: "ust-faqih-ubaidillah-rozan",
    tags: ["kaidah fiqih", "ushul fiqih"],
    publishedAt: "2026-07-13",
    views: 2870,
  },
  {
    slug: "doa-doa-agar-dimudahkan-rezeki",
    title: "Doa-Doa Agar Dimudahkan Rezeki",
    excerpt:
      "Kumpulan doa yang diajarkan Rasulullah shallallahu 'alaihi wa sallam untuk memohon kelapangan dan keberkahan rezeki.",
    content: `
      <p>Rezeki adalah ketetapan Allah subhanahu wa ta'ala yang telah dituliskan bagi setiap hamba. Namun ketetapan itu tidak menggugurkan perintah ikhtiar dan doa — justru doa termasuk sebab terbesar dilapangkannya rezeki. Nabi shallallahu 'alaihi wa sallam mengajarkan sejumlah doa yang sarat makna untuk urusan ini, yang menuntun kita bukan hanya meminta banyaknya harta, tetapi kecukupan, kehalalan, dan keberkahannya.</p>
      <h2>Doa Memohon Kecukupan dengan yang Halal</h2>
      <p class="font-arabic text-right" dir="rtl">اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ</p>
      <p><em>Allahummakfini bihalalika 'an haramika, wa aghnini bifadhlika 'amman siwaka.</em></p>
      <p><em>"Ya Allah, cukupkanlah aku dengan rezeki-Mu yang halal sehingga aku tidak memerlukan yang haram, dan kayakanlah aku dengan karunia-Mu sehingga aku tidak bergantung kepada selain-Mu."</em> (HR. Tirmidzi, ia berkata: hasan)</p>
      <p>Doa ini diajarkan Nabi shallallahu 'alaihi wa sallam kepada Ali bin Abi Thalib radhiyallahu 'anhu, bahkan beliau menyebutkan bahwa dengan doa ini Allah akan melunasi utang meski sebesar gunung. Perhatikan susunannya: yang diminta pertama bukan kekayaan, melainkan <strong>kecukupan dengan yang halal</strong> — sebab harta haram, betapapun banyaknya, tidak akan pernah mencukupi.</p>
      <h2>Doa Memohon Rezeki yang Baik</h2>
      <p class="font-arabic text-right" dir="rtl">اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا</p>
      <p><em>Allahumma inni as'aluka 'ilman nafi'an, wa rizqan thayyiban, wa 'amalan mutaqabbalan.</em></p>
      <p><em>"Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amalan yang diterima."</em> (HR. Ibnu Majah)</p>
      <p>Doa ini dibaca Nabi shallallahu 'alaihi wa sallam setelah shalat Shubuh. Rezeki yang diminta adalah <em>thayyib</em>: baik zatnya, baik cara memperolehnya, dan baik pula penggunaannya.</p>
      <h2>Doa Nabi Musa 'alaihis-salam</h2>
      <p class="font-arabic text-right" dir="rtl">رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ</p>
      <p><em>"Ya Rabbku, sesungguhnya aku sangat membutuhkan kebaikan apa pun yang Engkau turunkan kepadaku."</em> (QS. Al-Qashash: 24)</p>
      <p>Doa ini diucapkan Nabi Musa dalam keadaan terusir, tanpa harta dan tempat berlindung. Tidak lama setelah itu, Allah bukakan baginya pekerjaan, keluarga, dan keamanan. Ia menjadi teladan doa di saat-saat paling sempit.</p>
      <h2>Amalan Pembuka Pintu Rezeki</h2>
      <p>Selain doa, Al-Qur'an dan Sunnah menunjukkan amalan-amalan yang menjadi sebab kelapangan rezeki:</p>
      <ul>
        <li><strong>Istighfar dan taubat.</strong> <em>"Maka aku berkata: mohonlah ampunan kepada Rabbmu, sungguh Dia Maha Pengampun. Niscaya Dia mengirimkan hujan lebat kepadamu, memperbanyak harta dan anak-anakmu..."</em> (QS. Nuh: 10–12)</li>
        <li><strong>Takwa dan tawakal.</strong> <em>"Barangsiapa bertakwa kepada Allah, niscaya Dia mengadakan jalan keluar baginya dan memberinya rezeki dari arah yang tidak disangka-sangka."</em> (QS. Ath-Thalaq: 2–3)</li>
        <li><strong>Silaturahim.</strong> Nabi shallallahu 'alaihi wa sallam bersabda bahwa siapa yang ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung silaturahim. (HR. Bukhari dan Muslim)</li>
        <li><strong>Sedekah.</strong> <em>"Dan apa saja yang kamu infakkan, maka Allah akan menggantinya."</em> (QS. Saba': 39)</li>
      </ul>
      <h2>Adab dalam Meminta Rezeki</h2>
      <p>Hendaknya doa dipanjatkan dengan keyakinan penuh akan dikabulkan, di waktu-waktu mustajab seperti sepertiga malam terakhir dan antara adzan-iqamah, serta diiringi usaha yang halal. Rasulullah shallallahu 'alaihi wa sallam mengingatkan bahwa Allah tidak mengabulkan doa dari hati yang lalai, dan bahwa makanan haram menjadi penghalang terkabulnya doa.</p>
      <h2>Kesimpulan</h2>
      <p>Doa-doa rezeki yang diajarkan Rasulullah shallallahu 'alaihi wa sallam menuntun kita pada paradigma yang benar: mengutamakan yang halal di atas yang banyak, keberkahan di atas jumlah, dan kebergantungan hanya kepada Allah. Amalkanlah bersama ikhtiar dan tawakal, insya Allah rezeki datang dari arah yang tak disangka-sangka. Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1674508304566-f67ee711750a?w=640&h=400&fit=crop&q=80",
    categorySlug: "doa",
    authorSlug: "ustzh-muthiah-fairuzi",
    tags: ["doa", "rezeki"],
    publishedAt: "2026-07-12",
    views: 6510,
  },
  {
    slug: "pengertian-ushul-fiqih-dan-ruang-lingkupnya",
    title: "Pengertian Ushul Fiqih dan Ruang Lingkupnya",
    excerpt:
      "Memahami definisi ushul fiqih sebagai kaidah dasar untuk menggali hukum syar'i dari dalil-dalilnya.",
    content: `
      <p>Jika fiqih diibaratkan bangunan megah berisi ribuan hukum, maka ushul fiqih adalah fondasi, denah, dan ilmu arsitekturnya. Tanpa memahami ushul fiqih, seseorang hanya bisa menghafal hukum tanpa mengerti dari mana hukum itu lahir dan bagaimana para ulama menyimpulkannya dari Al-Qur'an dan As-Sunnah.</p>
      <h2>Definisi Ushul Fiqih</h2>
      <p>Secara bahasa, <em>ushul</em> adalah bentuk jamak dari <em>ashl</em> yang berarti pondasi atau dasar, sedangkan <em>fiqih</em> secara bahasa berarti pemahaman. Adapun secara istilah, para ulama mendefinisikan ushul fiqih sebagai:</p>
      <p><em>"Ilmu tentang kaidah-kaidah yang digunakan untuk menggali (istinbath) hukum-hukum syar'i yang bersifat amaliah dari dalil-dalilnya yang terperinci."</em></p>
      <p>Menariknya, peletak dasar ilmu ini sebagai disiplin tersendiri adalah Imam asy-Syafi'i rahimahullah melalui kitab beliau <em>ar-Risalah</em> — karya pertama yang menyusun secara sistematis bagaimana seharusnya seorang mujtahid berinteraksi dengan dalil. Karena itulah beliau digelari <em>"bapak ushul fiqih"</em>.</p>
      <h2>Objek Kajian Ushul Fiqih</h2>
      <p>Secara garis besar, ushul fiqih membahas empat hal utama:</p>
      <ul>
        <li><strong>Dalil-dalil syar'i:</strong> Al-Qur'an, As-Sunnah, ijma', dan qiyas — empat dalil yang disepakati — serta dalil-dalil yang diperselisihkan seperti istihsan, mashlahah mursalah, 'urf, dan syar'u man qablana.</li>
        <li><strong>Hukum syar'i:</strong> pembagian hukum taklifi (wajib, sunnah, mubah, makruh, haram) dan hukum wadh'i (sebab, syarat, mani', sah, batal).</li>
        <li><strong>Kaidah kebahasaan:</strong> bagaimana memahami lafazh 'amm dan khash, muthlaq dan muqayyad, amr (perintah) dan nahyi (larangan), mantuq dan mafhum — perangkat untuk menangkap maksud dalil secara tepat.</li>
        <li><strong>Ijtihad dan mujtahid:</strong> syarat-syarat orang yang berhak berijtihad, tingkatan-tingkatannya, serta hukum taqlid bagi yang belum sampai pada derajat itu.</li>
      </ul>
      <h2>Perbedaan Ushul Fiqih dengan Fiqih</h2>
      <p>Fiqih membahas hukum perbuatan mukallaf secara praktis: "shalat wajib", "riba haram", "jual beli halal". Adapun ushul fiqih membahas <em>cara</em> sampai pada kesimpulan itu: mengapa perintah dalam ayat menunjukkan wajib? Kapan larangan bermakna haram dan kapan hanya makruh? Bagaimana jika dua dalil tampak bertentangan?</p>
      <p>Contoh sederhana: firman Allah <em>"aqimush-shalah"</em> (dirikanlah shalat). Ushul fiqih menetapkan kaidah bahwa perintah (<em>amr</em>) pada asalnya menunjukkan kewajiban. Dari kaidah itu, fiqih menyimpulkan: shalat hukumnya wajib. Satu kaidah ushul dapat melahirkan ratusan hukum fiqih.</p>
      <h2>Mengapa Penting Dipelajari?</h2>
      <ul>
        <li>Menjaga dari sikap serampangan dalam mengambil kesimpulan hukum dari ayat atau hadits.</li>
        <li>Memahami sebab terjadinya perbedaan pendapat di antara para ulama, sehingga melahirkan sikap arif dalam menyikapi khilafiyah.</li>
        <li>Menjadi bekal untuk memahami kitab-kitab fiqih madzhab beserta metode istidlal-nya.</li>
        <li>Bagi yang mendalami ilmu syar'i, ia adalah tangga menuju kemampuan tarjih dan bahkan ijtihad dalam masalah-masalah kontemporer.</li>
      </ul>
      <h2>Kesimpulan</h2>
      <p>Ushul fiqih adalah ilmu tentang "cara membaca" syariat: kaidah-kaidah baku yang menghubungkan dalil dengan hukum. Mempelajarinya membuat seorang penuntut ilmu tidak sekadar tahu <em>apa</em> hukumnya, tetapi juga mengerti <em>mengapa</em> dan <em>dari mana</em> hukum itu diambil — dan inilah pembeda antara sekadar menghafal dengan benar-benar memahami agama. Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1576764402988-7143f9cca90a?w=640&h=400&fit=crop&q=80",
    categorySlug: "ushul-fiqih",
    authorSlug: "ust-faqih-ubaidillah-rozan",
    tags: ["ushul fiqih", "ijtihad"],
    publishedAt: "2026-07-10",
    views: 1980,
  },
  {
    slug: "kisah-taubat-seorang-pembunuh-99-nyawa",
    title: "Kisah Taubat Seorang Pembunuh 99 Nyawa",
    excerpt:
      "Kisah masyhur tentang luasnya rahmat dan ampunan Allah bagi hamba yang bersungguh-sungguh bertaubat.",
    content: `
      <p>Adakah dosa yang terlalu besar untuk diampuni? Kisah shahih berikut — diriwayatkan Imam Bukhari dan Muslim dari sahabat Abu Sa'id al-Khudri radhiyallahu 'anhu — menjawab pertanyaan itu dengan cara yang menggetarkan hati. Ia adalah kisah tentang seorang laki-laki dari umat sebelum kita yang telah membunuh sembilan puluh sembilan jiwa, lalu mencari jalan pulang kepada Allah.</p>
      <h2>Fatwa yang Menutup Pintu</h2>
      <p>Laki-laki itu bertanya kepada penduduk negerinya: siapakah orang yang paling berilmu di muka bumi? Ia lalu ditunjukkan kepada seorang <em>rahib</em> — ahli ibadah yang tekun, namun bukan ahli ilmu. Kepada rahib itu ia mengaku telah membunuh 99 jiwa, lalu bertanya: masih adakah pintu taubat baginya?</p>
      <p>Sang rahib menjawab: <strong>tidak ada.</strong></p>
      <p>Jawaban yang memutus harapan itu membuatnya gelap mata. Ia membunuh sang rahib, menggenapkan korbannya menjadi seratus jiwa. Para ulama mengambil pelajaran besar dari bagian ini: betapa berbahayanya berfatwa tanpa ilmu. Rahib itu ahli ibadah, tetapi kejahilannya tentang luasnya rahmat Allah justru membinasakan dirinya dan hampir membinasakan orang yang bertanya.</p>
      <h2>Fatwa yang Membuka Harapan</h2>
      <p>Keinginan bertaubat itu ternyata tidak padam. Ia kembali mencari orang paling berilmu, dan kali ini ditunjukkan kepada seorang <em>'alim</em> sejati. Ia mengajukan pertanyaan yang sama: aku telah membunuh seratus jiwa, masih adakah taubat untukku?</p>
      <p>Sang 'alim menjawab: <em>"Ya. Siapa yang dapat menghalangi antara dirimu dan taubat?"</em></p>
      <p>Namun sang 'alim tidak berhenti pada fatwa. Ia memberikan resep perubahan: <em>"Pergilah ke negeri ini dan itu, karena di sana ada orang-orang yang menyembah Allah. Beribadahlah bersama mereka, dan jangan kembali ke negerimu, karena negerimu adalah negeri yang buruk."</em> Inilah fiqih dakwah yang dalam: taubat membutuhkan lingkungan baru, teman baru, dan meninggalkan tempat yang menjerumuskan.</p>
      <h2>Perselisihan Dua Malaikat</h2>
      <p>Laki-laki itu berangkat. Di tengah perjalanan — sebelum sampai ke negeri tujuan — maut menjemputnya. Turunlah malaikat rahmat dan malaikat adzab, masing-masing merasa berhak membawanya. Malaikat adzab berkata: ia belum pernah beramal baik sedikit pun. Malaikat rahmat berkata: ia datang dalam keadaan bertaubat, menghadapkan hatinya kepada Allah.</p>
      <p>Allah lalu mengutus malaikat sebagai penengah: ukurlah jarak antara dua negeri itu; ke negeri mana ia lebih dekat, ke sanalah ia digolongkan. Dalam sebagian riwayat disebutkan Allah memerintahkan bumi negeri yang buruk untuk menjauh dan negeri yang baik untuk mendekat. Ternyata ia lebih dekat ke negeri orang-orang shalih <strong>sejengkal saja</strong> — maka malaikat rahmat pun membawanya.</p>
      <h2>Pelajaran dari Kisah</h2>
      <ul>
        <li><strong>Rahmat Allah lebih luas dari dosa apa pun.</strong> Seratus nyawa bukan penghalang taubat, selama nyawa pelakunya masih ada. <em>"Katakanlah: wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah berputus asa dari rahmat Allah."</em> (QS. Az-Zumar: 53)</li>
        <li><strong>Bertanyalah kepada ahli ilmu, bukan sekadar ahli ibadah.</strong> Fatwa tanpa ilmu bisa membinasakan.</li>
        <li><strong>Taubat sejati menuntut perubahan lingkungan.</strong> Tinggalkan tempat, komunitas, dan kebiasaan yang mengantarkan pada dosa.</li>
        <li><strong>Allah menilai arah hati dan langkah.</strong> Laki-laki itu belum sempat beramal shalih satu pun, tetapi kesungguhan langkahnya menuju kebaikan sudah cukup menjadi bukti taubatnya.</li>
        <li><strong>Jangan meremehkan sejengkal kebaikan.</strong> Selisih sejengkal menentukan akhir hidupnya — maka jangan tunda langkah kebaikan sekecil apa pun.</li>
      </ul>
      <h2>Penutup</h2>
      <p>Kisah ini bukan izin untuk menunda taubat — sebab tidak ada yang menjamin kita sempat melangkah seperti laki-laki itu. Ia adalah kabar gembira bagi siapa pun yang merasa dosanya terlalu besar: pintu Allah tidak pernah tertutup bagi hamba yang datang. Yang dibutuhkan hanyalah berhenti, menyesal, dan melangkah sungguh-sungguh ke arah yang baru. Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=640&h=400&fit=crop&q=80",
    categorySlug: "kisah",
    authorSlug: "ustzh-muthiah-fairuzi",
    tags: ["kisah", "taubat"],
    publishedAt: "2026-07-08",
    views: 9120,
  },
  {
    slug: "tata-cara-wudhu-yang-benar-sesuai-sunnah",
    title: "Tata Cara Wudhu yang Benar Sesuai Sunnah",
    excerpt:
      "Panduan lengkap langkah-langkah wudhu beserta dalil dan hal-hal yang membatalkannya.",
    content: `
      <p>Wudhu bukan sekadar rutinitas membasuh anggota badan — ia adalah kunci sahnya shalat dan syiar khusus umat Muhammad shallallahu 'alaihi wa sallam. Nabi bersabda, <em>"Allah tidak menerima shalat salah seorang kalian apabila ia berhadats, sampai ia berwudhu."</em> (HR. Bukhari dan Muslim). Bahkan anggota wudhu akan bercahaya pada hari kiamat sebagai tanda umat beliau. Karena kedudukannya yang agung, mengetahui tata caranya secara benar — membedakan mana rukun yang menentukan sah, dan mana sunnah yang menyempurnakan — menjadi kebutuhan setiap muslim.</p>
      <h2>Dalil Kewajiban Wudhu</h2>
      <p class="font-arabic text-right" dir="rtl">يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ</p>
      <p><em>"Wahai orang-orang yang beriman, apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku, dan usaplah kepalamu, dan (basuhlah) kedua kakimu sampai kedua mata kaki."</em> (QS. Al-Ma'idah: 6)</p>
      <h2>Rukun Wudhu dalam Madzhab Syafi'i</h2>
      <p>Para fuqaha Syafi'iyyah — sebagaimana dalam <em>Safinatu an-Naja</em> — menyebutkan enam rukun (fardhu) wudhu yang tanpa salah satunya wudhu tidak sah:</p>
      <ol>
        <li><strong>Niat</strong>, dilakukan dalam hati bersamaan dengan basuhan pertama wajah.</li>
        <li><strong>Membasuh seluruh wajah</strong>, dari tempat tumbuh rambut hingga dagu, dan antara kedua telinga.</li>
        <li><strong>Membasuh kedua tangan hingga siku.</strong></li>
        <li><strong>Mengusap sebagian kepala</strong>, walaupun hanya sebagian kecil rambut yang berada di batas kepala.</li>
        <li><strong>Membasuh kedua kaki hingga kedua mata kaki.</strong></li>
        <li><strong>Tertib</strong>, yakni berurutan sesuai susunan di atas.</li>
      </ol>
      <h2>Tata Cara Wudhu Lengkap Sesuai Sunnah</h2>
      <p>Berikut urutan wudhu sebagaimana diriwayatkan dari praktik Nabi shallallahu 'alaihi wa sallam, menggabungkan rukun dan sunnah-sunnahnya:</p>
      <ul>
        <li>Membaca <em>basmalah</em> dan mencuci kedua telapak tangan tiga kali.</li>
        <li>Berkumur (<em>madhmadhah</em>) dan menghirup air ke hidung lalu mengeluarkannya (<em>istinsyaq</em> dan <em>istintsar</em>) tiga kali — disunnahkan bersungguh-sungguh kecuali saat berpuasa.</li>
        <li>Berniat, lalu membasuh wajah tiga kali sambil menyela-nyela jenggot yang tebal.</li>
        <li>Membasuh tangan kanan lalu kiri hingga siku tiga kali, dengan menyela-nyela jari-jemari.</li>
        <li>Mengusap kepala, dan disunnahkan mengusap seluruhnya: dari depan ke belakang lalu kembali ke depan.</li>
        <li>Mengusap kedua telinga, bagian luar dan dalamnya, dengan air yang baru.</li>
        <li>Membasuh kaki kanan lalu kiri hingga mata kaki tiga kali, menyela-nyela jari kaki. Rasulullah mengingatkan, <em>"Celakalah tumit-tumit (yang tidak terbasuh) dari api neraka."</em> (HR. Bukhari dan Muslim)</li>
        <li>Membaca doa setelah wudhu: syahadat, lalu <em>"Allahummaj'alni minat-tawwabina waj'alni minal-mutathahhirin."</em></li>
      </ul>
      <h2>Hal-Hal yang Membatalkan Wudhu</h2>
      <p>Dalam madzhab Syafi'i, pembatal wudhu ada empat:</p>
      <ul>
        <li>Segala yang keluar dari dua jalan (qubul dan dubur), baik air seni, kotoran, maupun angin.</li>
        <li>Hilangnya akal karena tidur, pingsan, atau mabuk — kecuali tidur dalam posisi duduk yang menetap tempat duduknya.</li>
        <li>Bersentuhan kulit laki-laki dan perempuan yang bukan mahram tanpa penghalang, menurut pendapat mu'tamad madzhab.</li>
        <li>Menyentuh kemaluan atau lingkaran dubur dengan telapak tangan bagian dalam tanpa penghalang.</li>
      </ul>
      <h2>Kesalahan yang Sering Terjadi</h2>
      <ul>
        <li>Tidak meratakan air pada seluruh anggota wajib, seperti tumit, siku, atau sela jari.</li>
        <li>Boros air secara berlebihan — Nabi berwudhu cukup dengan satu <em>mudd</em> (segenggam dua telapak tangan).</li>
        <li>Melafazhkan niat dengan keras hingga mengganggu; niat cukup di dalam hati, adapun melafazhkan secara pelan hanya untuk membantu kekhusyu'an.</li>
      </ul>
      <h2>Kesimpulan</h2>
      <p>Wudhu yang benar berdiri di atas enam rukun madzhab Syafi'i dan disempurnakan dengan sunnah-sunnahnya. Menjaganya berarti menjaga kunci shalat kita — dan siapa yang menyempurnakan wudhunya lalu shalat dua rakaat dengan khusyu', Allah janjikan ampunan atas dosa-dosanya yang telah lalu. Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1783953333111-3375b999fa1d?w=640&h=400&fit=crop&q=80",
    categorySlug: "fiqih",
    authorSlug: "ust-faqih-ubaidillah-rozan",
    tags: ["wudhu", "thaharah", "shalat"],
    publishedAt: "2026-07-05",
    views: 5340,
  },
  {
    slug: "adab-adab-menuntut-ilmu-dalam-islam",
    title: "Adab-Adab Menuntut Ilmu dalam Islam",
    excerpt:
      "Sebelum meraih ilmu yang bermanfaat, seorang penuntut ilmu perlu memperhatikan adab-adab berikut ini.",
    content: `
      <p>Para ulama terdahulu mempelajari adab sebelum mempelajari ilmu. Imam Malik rahimahullah pernah dipesan oleh ibunya ketika hendak belajar kepada gurunya: <em>"Pelajarilah adabnya sebelum ilmunya."</em> Sebab ilmu tanpa adab bagaikan api tanpa cahaya — bisa jadi menambah kesombongan, bukan ketakwaan. Ibnul Mubarak rahimahullah bahkan berkata, <em>"Kami mempelajari adab selama tiga puluh tahun, dan mempelajari ilmu selama dua puluh tahun."</em></p>
      <h2>Ikhlas: Fondasi Segala Ilmu</h2>
      <p>Menuntut ilmu adalah ibadah, dan setiap ibadah menuntut keikhlasan. Rasulullah shallallahu 'alaihi wa sallam memberi peringatan keras bagi yang belajar demi dunia:</p>
      <p><em>"Barangsiapa menuntut ilmu yang seharusnya diharapkan dengannya wajah Allah, namun ia tidak mempelajarinya kecuali untuk mendapatkan kesenangan dunia, maka ia tidak akan mencium wangi surga pada hari kiamat."</em> (HR. Abu Dawud)</p>
      <p>Ikhlas bukan berarti menolak gelar atau profesi — tetapi menjadikan ridha Allah sebagai tujuan utama, sementara dunia hanyalah buah sampingan yang mengikuti.</p>
      <h2>Memuliakan Guru dan Majelis Ilmu</h2>
      <p>Keberkahan ilmu banyak bergantung pada adab kepada pengajarnya. Di antara bentuknya: mendengarkan dengan penuh perhatian, tidak memotong pembicaraan, bertanya dengan santun, tidak memanggil guru dengan namanya semata, serta mendoakan kebaikan untuknya. Imam asy-Syafi'i rahimahullah menuturkan bahwa beliau membalik lembaran kitab di hadapan Imam Malik dengan sangat pelan karena segan, agar tidak terdengar suaranya.</p>
      <h2>Sabar dan Bertahap dalam Belajar</h2>
      <p>Ilmu tidak diraih dalam semalam. Para ulama menasihatkan agar penuntut ilmu memulai dari kitab-kitab dasar sebelum yang besar, menguasai satu bidang sebelum melompat ke bidang lain, dan menekuni bimbingan guru — bukan sekadar membaca sendiri tanpa arahan. Belajar otodidak tanpa pembimbing sering melahirkan pemahaman yang keliru. Pepatah ulama mengatakan: <em>"Barangsiapa yang gurunya adalah bukunya, maka kesalahannya lebih banyak daripada benarnya."</em></p>
      <h2>Mengamalkan dan Menjaga Ilmu</h2>
      <ul>
        <li><strong>Mencatat.</strong> <em>"Ikatlah ilmu dengan tulisan,"</em> demikian atsar dari sebagian sahabat. Ilmu yang tidak dicatat mudah hilang.</li>
        <li><strong>Mengulang (muraja'ah).</strong> Para ulama mengulang pelajarannya berpuluh kali hingga melekat.</li>
        <li><strong>Mengamalkan.</strong> Ilmu yang diamalkan akan kokoh; yang diabaikan akan dicabut keberkahannya. Sebagian salaf berkata, <em>"Ilmu memanggil amal; jika tidak dijawab, ia akan pergi."</em></li>
        <li><strong>Menjauhi maksiat.</strong> Imam asy-Syafi'i pernah mengeluhkan buruknya hafalan kepada gurunya, Waki', lalu beliau dibimbing untuk meninggalkan maksiat — <em>"karena ilmu adalah cahaya, dan cahaya Allah tidak diberikan kepada pelaku maksiat."</em></li>
      </ul>
      <h2>Adab kepada Sesama Penuntut Ilmu</h2>
      <p>Tidak merendahkan teman yang lebih lambat memahami, tidak sombong dengan pemahaman sendiri, dan gemar berbagi faedah. Diskusi ilmiah dilakukan untuk mencari kebenaran, bukan memenangkan ego. Imam asy-Syafi'i berkata, <em>"Tidaklah aku berdebat dengan seseorang melainkan aku berharap kebenaran muncul melalui lisannya."</em></p>
      <h2>Kesimpulan</h2>
      <p>Adab adalah jalan ilmu, bukan sekadar pelengkapnya: ikhlas kepada Allah, hormat kepada guru, sabar dalam bertahap, tekun mencatat dan mengamalkan, serta rendah hati kepada sesama. Dengan adab, ilmu yang sedikit menjadi berkah; tanpa adab, ilmu yang banyak bisa menjadi bencana. Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1596125160970-6f02eeba00d3?w=640&h=400&fit=crop&q=80",
    categorySlug: "umum",
    authorSlug: "ust-faqih-ubaidillah-rozan",
    tags: ["adab", "menuntut ilmu"],
    publishedAt: "2026-07-02",
    views: 3125,
  },
  {
    slug: "kaidah-al-umuru-bimaqashidiha",
    title: "Kaidah 'Al-Umuru bi Maqashidiha': Segala Perkara Tergantung Niatnya",
    excerpt:
      "Ulasan ringkas mengenai kaidah fiqih pertama yang menjadi pondasi banyak hukum ibadah dan muamalah.",
    content: `
      <p>Dari lima kaidah besar fiqih, kaidah <em>"al-umuru bi maqashidiha"</em> — segala perkara tergantung maksudnya — menempati urutan pertama. Ia lahir dari hadits yang oleh para ulama disebut sebagai sepertiga ilmu, bahkan Imam asy-Syafi'i rahimahullah berkata bahwa hadits ini masuk dalam tujuh puluh bab fiqih.</p>
      <p class="font-arabic text-right" dir="rtl">الأُمُورُ بِمَقَاصِدِهَا</p>
      <h2>Dasar Kaidah</h2>
      <p>Kaidah ini bersumber dari hadits masyhur riwayat Umar bin Khattab radhiyallahu 'anhu:</p>
      <p class="font-arabic text-right" dir="rtl">إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى</p>
      <p><em>"Sesungguhnya setiap amalan tergantung niatnya, dan setiap orang hanya mendapatkan sesuai apa yang ia niatkan."</em> (HR. Bukhari dan Muslim)</p>
      <p>Hadits ini disampaikan Nabi shallallahu 'alaihi wa sallam berkenaan dengan hijrah: siapa yang hijrahnya karena Allah dan Rasul-Nya, maka hijrahnya bernilai demikian; dan siapa yang hijrahnya demi dunia atau wanita yang ingin dinikahi, maka ia hanya mendapatkan apa yang ia tuju. Amalan lahiriah yang sama persis — berpindah dari Makkah ke Madinah — nilainya berbeda total karena niatnya berbeda.</p>
      <h2>Fungsi Niat dalam Fiqih</h2>
      <p>Para fuqaha menjelaskan bahwa niat memiliki dua fungsi utama:</p>
      <ul>
        <li><strong>Membedakan ibadah dari kebiasaan.</strong> Menahan lapar bisa jadi diet, bisa jadi puasa — pembedanya niat. Mandi bisa sekadar membersihkan badan, bisa pula mandi janabah yang menghilangkan hadats besar — pembedanya niat. Duduk di masjid bisa istirahat biasa, bisa i'tikaf — pembedanya niat.</li>
        <li><strong>Membedakan satu ibadah dari ibadah lainnya.</strong> Shalat dua rakaat sebelum Shubuh bisa berupa qabliyah atau shalat fardhu Shubuh itu sendiri; zakat, sedekah, dan hadiah sama-sama memberi harta — yang membedakan derajat dan hukumnya adalah niat.</li>
      </ul>
      <h2>Penerapan dalam Ibadah</h2>
      <p>Dalam madzhab Syafi'i, niat adalah rukun dalam wudhu, shalat, puasa, zakat, dan haji. Tempat niat adalah hati; melafazhkannya tidak wajib. Dalam shalat, niat harus menyertai takbiratul ihram; dalam puasa wajib, niat harus dipasang di malam hari (<em>tabyit</em>) sebelum fajar berdasarkan hadits, <em>"Barangsiapa tidak berniat puasa sebelum fajar, maka tidak ada puasa baginya."</em> (HR. Abu Dawud, Tirmidzi, dan Nasa'i)</p>
      <h2>Penerapan dalam Muamalah</h2>
      <p>Kaidah ini juga bekerja di luar ibadah ritual. Ucapan talak yang sharih (tegas) jatuh tanpa melihat niat, namun ucapan kinayah (sindiran) seperti "pulanglah ke rumah orang tuamu" hanya jatuh talak bila disertai niat. Barang temuan yang dipungut dengan niat mengembalikan kepada pemiliknya berstatus amanah; dipungut dengan niat memiliki berubah menjadi ghashab. Bahkan perkara mubah — makan, tidur, bekerja — dapat bernilai pahala bila diniatkan untuk menguatkan diri dalam ketaatan.</p>
      <h2>Buah Kaidah: Amal Kecil Menjadi Besar</h2>
      <p>Ibnul Mubarak rahimahullah berkata, <em>"Betapa banyak amalan kecil menjadi besar karena niat, dan betapa banyak amalan besar menjadi kecil karena niat."</em> Seteguk air yang diberikan kepada orang kehausan dengan niat ikhlas bisa lebih berat timbangannya daripada sedekah jutaan yang dibalut riya'. Karena itu para ulama menyebut memperbaiki niat sebagai jihadnya hati yang tidak pernah selesai.</p>
      <h2>Kesimpulan</h2>
      <p>Kaidah <em>al-umuru bi maqashidiha</em> menegaskan bahwa nilai setiap amalan — sah atau batalnya, besar atau kecil pahalanya — kembali kepada maksud pelakunya. Ia mengajarkan kita untuk terus memeriksa hati sebelum, saat, dan sesudah beramal: untuk siapa sebenarnya amal ini kupersembahkan? Wallahu a'lam bish-shawab.</p>
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1732831627964-f6fc7157aebd?w=640&h=400&fit=crop&q=80",
    categorySlug: "kaidah-fiqih",
    authorSlug: "ust-faqih-ubaidillah-rozan",
    tags: ["kaidah fiqih", "niat"],
    publishedAt: "2026-06-29",
    views: 4780,
  },
];

export const ebookCatalog = [
  {
    title: "Safinatu an-Naja",
    url: "https://kelasmarkazfiqih.com/ebook/safinatu-an-naja",
  },
  {
    title: "Al-Mukhtashar al-Lathif",
    url: "https://kelasmarkazfiqih.com/ebook/al-mukhtashar-al-lathif",
  },
  {
    title: "Al-Muqaddimah al-Hadhramiyyah",
    url: "https://kelasmarkazfiqih.com/ebook/al-muqaddimah-al-hadhramiyyah",
  },
  {
    title: "Al-Yaqut an-Nafis",
    url: "https://kelasmarkazfiqih.com/ebook/al-yaqut-an-nafis",
  },
];

export const qnaList: Qna[] = [
  {
    slug: "hukum-membayar-zakat-fitrah-dengan-uang",
    title: "Bolehkah Membayar Zakat Fitrah dengan Uang?",
    question:
      "Assalamu'alaikum ustadz, apakah boleh membayar zakat fitrah menggunakan uang tunai, bukan beras seperti yang biasa dilakukan?",
    answer:
      "Wa'alaikumussalam. Jumhur ulama (Syafi'iyah, Malikiyah, Hanabilah) berpendapat zakat fitrah harus dibayar dalam bentuk makanan pokok, bukan uang, mengikuti praktik Rasulullah shallallahu 'alaihi wa sallam dan para sahabat. Sebagian ulama, seperti mazhab Hanafi, membolehkan pembayaran dengan uang seharga makanan pokok tersebut demi kemaslahatan. Untuk kehati-hatian, lebih utama membayar dengan makanan pokok sesuai sunnah, namun mengikuti pendapat yang membolehkan uang juga memiliki dasar yang kuat.",
    answeredBySlug: "ust-faqih-ubaidillah-rozan",
    categorySlug: "fiqih",
    createdAt: "2026-07-14",
  },
  {
    slug: "apakah-wanita-haid-boleh-membaca-al-quran",
    title: "Apakah Wanita Haid Boleh Membaca Al-Qur'an?",
    question:
      "Ustadzah, apakah wanita yang sedang haid diperbolehkan membaca Al-Qur'an tanpa menyentuh mushaf, misalnya lewat aplikasi di ponsel?",
    answer:
      "Ulama berbeda pendapat mengenai hal ini. Sebagian melarang wanita haid membaca Al-Qur'an secara mutlak, sebagian lain membolehkan selama tidak menyentuh mushaf langsung, misalnya melalui hafalan atau aplikasi di ponsel. Pendapat yang membolehkan cukup kuat, terutama untuk keperluan menjaga hafalan atau belajar, dengan syarat tidak menyentuh mushaf fisik secara langsung.",
    answeredBySlug: "ustzh-muthiah-fairuzi",
    categorySlug: "fiqih",
    createdAt: "2026-07-11",
  },
  {
    slug: "hukum-investasi-saham-syariah",
    title: "Bagaimana Hukum Investasi Saham Syariah?",
    question:
      "Apakah investasi di saham syariah diperbolehkan dalam Islam? Bagaimana kriteria saham yang dianggap syariah?",
    answer:
      "Investasi saham syariah diperbolehkan selama perusahaan tersebut tidak bergerak di bidang usaha yang diharamkan (riba, perjudian, alkohol, dsb.) dan memenuhi kriteria rasio keuangan syariah yang ditetapkan oleh otoritas terkait (seperti Dewan Syariah Nasional). Selain itu, transaksi jual belinya juga harus terhindar dari unsur riba dan gharar yang berlebihan.",
    answeredBySlug: "ust-faqih-ubaidillah-rozan",
    categorySlug: "fiqih",
    createdAt: "2026-07-09",
  },
  {
    slug: "hukum-menunda-shalat-karena-pekerjaan",
    title: "Bolehkah Menunda Shalat karena Sibuk Bekerja?",
    question:
      "Saya sering menunda shalat karena pekerjaan yang menumpuk. Apakah ini termasuk dosa besar?",
    answer:
      "Menunda shalat hingga keluar dari waktunya tanpa udzur syar'i merupakan perkara yang sangat berbahaya, bahkan sebagian ulama menganggapnya termasuk dosa besar. Islam mengajarkan agar shalat didahulukan di atas kesibukan duniawi. Jika pekerjaan menyulitkan, carilah waktu jeda sesingkat apa pun untuk menunaikan shalat di awal waktu, karena keberkahan waktu justru datang dari ketaatan, bukan dari mengorbankan kewajiban.",
    answeredBySlug: "ust-faqih-ubaidillah-rozan",
    categorySlug: "fiqih",
    createdAt: "2026-07-06",
  },
  {
    slug: "adab-berdoa-agar-mudah-dikabulkan",
    title: "Apa Saja Adab Berdoa agar Mudah Dikabulkan?",
    question:
      "Ustadzah, apa saja adab-adab berdoa yang diajarkan dalam Islam agar doa kita lebih mudah dikabulkan Allah?",
    answer:
      "Di antara adab berdoa: memulai dengan memuji Allah dan bershalawat kepada Nabi shallallahu 'alaihi wa sallam, berdoa dengan penuh keyakinan akan dikabulkan, menghindari makanan dan penghasilan yang haram, memilih waktu-waktu mustajab seperti sepertiga malam terakhir, serta bersabar dan tidak tergesa-gesa merasa doanya tidak dikabulkan.",
    answeredBySlug: "ustzh-muthiah-fairuzi",
    categorySlug: "doa",
    createdAt: "2026-07-03",
  },
];

export function getQnaBySlug(slug: string) {
  return qnaList.find((qna) => qna.slug === slug);
}

export const kelasUrl = "https://kelasmarkazfiqih.com";

export const siteInfo = {
  address:
    "Jl. KH. Mu'min No. 4, RT 005/RW 009, Kel. Belendung, Kec. Benda, Kota Tangerang, Banten.",
  whatsappNumber: "+62 857-5260-7520",
  whatsappUrl: "https://wa.me/6285752607520",
  youtubeUrl: "https://www.youtube.com/@MarkazFiqih",
  facebookUrl: "https://web.facebook.com/profile.php?id=61579556624086",
  instagramUrl: "https://www.instagram.com/markazfiqih",
  tiktokUrl: "https://www.tiktok.com/@markazfiqih",
  email: "kontak@markazfiqih.com",
};

export const staticPages: StaticPage[] = [
  {
    slug: "tentang-kami",
    title: "Tentang Kami",
    updatedAt: "2026-07-01",
    content: `
      <p>Markaz Fiqih adalah lembaga keilmuan yang berfokus pada edukasi, kaderisasi, publikasi, dan pengembangan kajian fiqih. Dirintis oleh alumni Universitas Al-Azhar, Kairo, Markaz Fiqih hadir dengan cita-cita menjadi pusat rujukan fiqih yang berlandaskan madzhab Syafi'i, membawa visi: <em>membumikan fiqih di setiap lini kehidupan.</em></p>
      <p>Markaz Fiqih terbuka bagi seluruh lapisan masyarakat, mulai dari masyarakat umum, mahasiswa, santri, hingga para asatidz yang ingin memperdalam fiqih secara sistematis.</p>
      <p>Metode fiqih yang diusung oleh Markaz Fiqih adalah fiqih madzhab Syafi'i yang bersifat solutif, artinya tetap terbuka terhadap pendapat madzhab lain selama termasuk pendapat yang mu'tabar, diakui validitasnya berdasarkan kaidah keilmuan Islam. Dengan pendekatan ini, kami berupaya menghadirkan kajian fiqih yang ilmiah, aplikatif, dan relevan dengan kebutuhan masyarakat, sejalan dengan semangat kami bahwa <em>Fiqih Islam Itu Mudah.</em></p>
      <h2>Urutan Rujukan</h2>
      <p>Dalam menjawab persoalan fiqih, kami mengikuti urutan rujukan berikut:</p>
      <ol>
        <li>Pendapat mu'tamad dalam madzhab Syafi'i.</li>
        <li>Pendapat dha'if dalam madzhab Syafi'i.</li>
        <li>Ikhtiyar para ulama madzhab Syafi'i.</li>
        <li>Pendapat mu'tabar dari madzhab-madzhab fiqih lainnya, khususnya empat madzhab.</li>
      </ol>
      <p>Pada prinsipnya, kami membatasi diri pada pendapat mu'tamad madzhab selama telah memadai untuk menjawab permasalahan yang dihadapi. Adapun rujukan selainnya hanya digunakan apabila terdapat kebutuhan, guna menjaga keteraturan dalam amal. Fokus utama Markaz Fiqih bukan melakukan tarjih antar pendapat, melainkan memberikan arahan dan solusi fiqih yang dapat dipertanggungjawabkan secara ilmiah.</p>
      <h2>Visi Kami</h2>
      <p>Menjadi salah satu sumber referensi ilmu Fiqih utama yang mudah diakses, nyaman dibaca, dan terpercaya bagi umat Islam di Indonesia.</p>
      <h2>Misi Kami</h2>
      <ul>
        <li>Menyajikan artikel Fiqih yang ringkas, jelas, dan berdasarkan dalil yang shahih.</li>
        <li>Memfasilitasi pengunjung untuk mengirimkan pertanyaan seputar fiqih kepada tim redaksi.</li>
        <li>Mengumpulkan tanya-jawab dan fatwa yang mudah dicari dan dipahami khalayak umum.</li>
        <li>Menghadirkan kontributor-kontributor terpercaya dengan latar belakang keilmuan yang jelas.</li>
      </ul>
      <h2>Tim Redaksi</h2>
      <p>Markaz Fiqih dikelola oleh tim redaksi bersama para kontributor yang memiliki latar belakang pendidikan syariah, sebagaimana dapat dilihat pada halaman Kontributor kami.</p>
      <h2>Penutup</h2>
      <p>Markaz Fiqih berkomitmen untuk terus menghadirkan fiqih yang mudah dipahami, ilmiah, dan berlandaskan kaidah keilmuan. Kami berharap dapat menjadi wasilah lahirnya generasi mutafaqqih yang mampu menghadirkan solusi fiqih secara bijaksana di tengah masyarakat, dengan cita-cita agar fiqih tidak hanya difahami dalam bentuk teori, melainkan juga membumi, dengan diamalkan dan diterapkan dalam setiap lini kehidupan.</p>
    `,
  },
  {
    slug: "kebijakan-privasi",
    title: "Kebijakan Privasi",
    updatedAt: "2026-07-01",
    content: `
      <p>Kebijakan Privasi ini menjelaskan bagaimana Markaz Fiqih mengumpulkan, menggunakan, dan melindungi data pengunjung situs markazfiqih.com.</p>
      <h2>Data yang Kami Kumpulkan</h2>
      <p>Kami mengumpulkan data yang dikirimkan secara sukarela melalui formulir Kirim Pertanyaan, meliputi nama (atau anonim), kota tempat tinggal, dan isi pertanyaan. Kami juga dapat mengumpulkan data teknis standar seperti alamat IP dan jenis perangkat untuk keperluan analitik.</p>
      <h2>Penggunaan Data</h2>
      <p>Data yang dikirimkan melalui formulir Kirim Pertanyaan digunakan oleh tim redaksi untuk menjawab pertanyaan dan, apabila pengirim menyetujui, dapat dipublikasikan pada halaman Tanya Jawab tanpa mencantumkan data pribadi yang sensitif.</p>
      <h2>Keamanan Data</h2>
      <p>Kami berupaya menjaga keamanan data pengunjung dengan langkah-langkah teknis yang wajar. Namun, tidak ada metode transmisi data melalui internet yang sepenuhnya aman.</p>
      <h2>Perubahan Kebijakan</h2>
      <p>Kebijakan Privasi ini dapat diperbarui sewaktu-waktu. Perubahan akan diinformasikan melalui halaman ini.</p>
    `,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    updatedAt: "2026-07-01",
    content: `
      <p>Seluruh konten yang tersedia di Markaz Fiqih (markazfiqih.com) disusun untuk tujuan edukasi dan penyebaran ilmu syar'i secara umum.</p>
      <h2>Bukan Pengganti Fatwa Resmi</h2>
      <p>Jawaban pada halaman Tanya Jawab bersifat umum dan tidak dimaksudkan sebagai pengganti konsultasi langsung dengan ulama atau lembaga fatwa resmi untuk permasalahan yang bersifat khusus dan mendesak.</p>
      <h2>Tanggung Jawab Pembaca</h2>
      <p>Pembaca dianjurkan untuk melakukan tabayyun (verifikasi) lebih lanjut kepada ahli ilmu setempat sebelum mengamalkan suatu hukum, terutama untuk perkara yang memiliki khilafiyah (perbedaan pendapat) di kalangan ulama.</p>
      <h2>Tautan Eksternal</h2>
      <p>Markaz Fiqih tidak bertanggung jawab atas konten pada situs eksternal (termasuk situs Kelas dan E-Book) yang tertaut dari platform ini.</p>
    `,
  },
  {
    slug: "donasi",
    title: "Donasi",
    updatedAt: "2026-07-01",
    content: `
      <p>Markaz Fiqih dikelola secara swadaya untuk terus menyediakan konten edukasi Fiqih yang bermanfaat bagi umat. Dukungan dari para pembaca sangat berarti bagi keberlangsungan dakwah ini.</p>
      <h2>Cara Berdonasi</h2>
      <p>Donasi dapat disalurkan melalui transfer bank atau menghubungi admin melalui WhatsApp untuk informasi rekening terbaru dan konfirmasi donasi.</p>
      <h2>Penggunaan Dana</h2>
      <p>Dana yang terkumpul digunakan untuk operasional penulisan dan penyuntingan konten, pengembangan platform, serta kegiatan dakwah Markaz Fiqih lainnya.</p>
      <p>Jazakumullahu khairan atas dukungan Anda.</p>
    `,
  },
];

export function getStaticPageBySlug(slug: string) {
  return staticPages.find((page) => page.slug === slug);
}

export function getArticlesByCategory(categorySlug: string) {
  return articles.filter((article) => article.categorySlug === categorySlug);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getAuthorBySlug(authorSlug: string) {
  return authors.find((author) => author.slug === authorSlug);
}

export function getCategoryBySlug(categorySlug: string) {
  return categories.find((category) => category.slug === categorySlug);
}

export function getArticlesByAuthor(authorSlug: string) {
  return articles
    .filter((article) => article.authorSlug === authorSlug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
