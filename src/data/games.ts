import { GameMetadata } from '../types/game';

export const GAMES_DATA: GameMetadata[] = [
  {
    id: 'tower-stack',
    title: 'Kule Ustası',
    shortTitle: 'Kule Ustası',
    tagline: 'Hassas Zamanlama & Ritimli Blok Dizme',
    category: 'Bulmaca & Beceri',
    image: '/images/arcade_tower_stack_1791454949240.jpg',
    difficulty: 'Orta',
    accentColor: '#f43f5e',
    accentBorder: 'border-rose-500/40',
    accentText: 'text-rose-400',
    description:
      'Gökdelen yüksekliğinde rengarenk neon kuleler inşa etmeye hazır mısın? Sağdan ve soldan ritmik biçimde salınan blokları tam altındaki bloğun üzerine kusursuz hizalayarak bırak. Taşan kısımlar kesilip düşer ve blok küçülür. Mükemmel zamanlama ile ardışık kombolar yap ve bloğu yeniden genişlet!',
    objective:
      'Sallanan blokları tam vaktinde durdurup üst üste yerleştirerek en yüksek kat sayısına ulaş ve gökyüzünü fethet.',
    rules: [
      'Her blok sağdan sola ve soldan sağa salınır.',
      'Tıkladığın veya Boşluk tuşuna bastığın anda blok yerleşir.',
      'Taşan kısımlar dilimlenip boşluğa düşer; yeni bloğun genişliği küçülür.',
      'Kusursuz (Perfect) hizalamada blok küçülmez, kombo puanı ve ses efekti yükselir!',
      '3 ardışık kusursuz vuruşta blok genişler ve fazladan alan kazandırır.',
      'Eğer blok altındaki bloğu tamamen ıskalarsa kule devrilir ve oyun biter.'
    ],
    controls: [
      { key: 'Boşluk (Space) Tuşu', action: 'Bloğu Anında Bırak ve Yerleştir' },
      { key: 'Sol Fare Tıklaması', action: 'Tıklayarak Bloğu Yerleştir' },
      { key: 'Ekrana Dokunma', action: 'Mobil Cihazda Herhangi Bir Noktaya Dokun' },
      { key: 'P Tuşu', action: 'Oyunu Duraklat / Devam Et' }
    ],
    proTips: [
      'Gözünü bloğun dış kenarına değil, alt bloğun tam merkez eksenine odakla.',
      'Blok salınımının tepe dönüş noktalarında değil, merkezden geçerken zamanlamayı yakala.',
      'Ses efektini açık tut; her kusursuz yerleştirmede yükselen nota doğru ritmi bulmana yardım eder.'
    ],
    achievements: [
      {
        id: 'ts-bronze',
        name: 'Temel Ustası',
        description: '10. kata ulaşarak sağlam bir temel inşa et.',
        requiredScore: 10,
        icon: 'Award'
      },
      {
        id: 'ts-silver',
        name: 'Gökdelen Mimarı',
        description: '25. kata çıkarak bulutların üzerine yüksel.',
        requiredScore: 25,
        icon: 'Trophy'
      },
      {
        id: 'ts-gold',
        name: 'Kozmik Kule Kurgusu',
        description: '50. katı aşarak imkansız yükseklikte bir başyapıt yarat.',
        requiredScore: 50,
        icon: 'Sparkles'
      }
    ]
  },
  {
    id: 'brick-breaker',
    title: 'Neon Tuğla Kırıcı DX',
    shortTitle: 'Tuğla Kırıcı',
    tagline: 'Refleks, Lazer & Plazma Patlamaları',
    category: 'Aksiyon & Arcade',
    image: '/images/arcade_brick_breaker_1791457927277.jpg',
    difficulty: 'Orta',
    accentColor: '#38bdf8',
    accentBorder: 'border-sky-500/40',
    accentText: 'text-sky-400',
    description:
      'Klasik arcade tuğla kırma efsanesinin yüksek tempolu neon versiyonu! Işıltılı lazer raketinle plazma toplarını yönlendir, kristal tuğlaları parçala ve düşen güçlendirmeleri topla! 3’lü Çoklu Top, Plazma Alev Topu, Genişletilmiş Raket ve Lazer Namluları ile ekranı ışık gösterisine çevir!',
    objective:
      'Topun alt boşluğa düşmesine izin vermeden tüm neon tuğlaları kır, düşen güçlendirmeleri yakala ve en yüksek arcade skoruna ulaş.',
    rules: [
      'Raketi fare, dokunma veya klavye yön tuşlarıyla sağa-sola hareket ettir.',
      'Top raketin neresine çarparsa o açıyla seker; kenarlardan sektirerek sert açılar yakala.',
      'Tuğlalar parçalandığında özel güçlendirici kapsüller düşer; raketle yakala!',
      'Toplam 3 canın vardır. Top alt boşluğa düşerse 1 can kaybedersin.',
      'Tüm tuğlaları temizlediğinde sonraki seviyeye geçersin ve tuğla dizilimi yenilenir.'
    ],
    controls: [
      { key: '← → veya A / D Tuşları', action: 'Raketi Sağa / Sola Kaydır' },
      { key: 'Fare Hareketi / Parmağı Kaydır', action: 'Akıcı Raket Kontrolü' },
      { key: 'Boşluk (Space) / Tık', action: 'Topu Fırlat / Lazer Ateşle' }
    ],
    powerups: [
      {
        name: '3’lü Çoklu Top (Multi-Ball)',
        description: 'Topu üçe katlayarak aynı anda sahada üç plazma topuyla ortalığı dağıtır.',
        icon: 'Sparkles',
        color: 'from-sky-400 to-indigo-500'
      },
      {
        name: 'Alev Topu (Fireball)',
        description: 'Top tuğlalardan sekmeden hepsinin içinden delip geçerek yıkar.',
        icon: 'Flame',
        color: 'from-amber-400 to-rose-500'
      },
      {
        name: 'Geniş Raket & Lazer Namlusu',
        description: 'Raketi genişletir veya raketten yukarıya lazer atışları yapmanı sağlar.',
        icon: 'Zap',
        color: 'from-emerald-400 to-teal-400'
      }
    ],
    proTips: [
      'Topu tuğlaların arkasındaki tavan boşluğuna kaçırabilirsen top yukarıda kendi kendine sekerek onlarca tuğlayı yok eder!',
      'Raketin tam köşeleriyle vuruş yaptığında top yatay açıyla uçar, en zorlu köşeleri temizler.',
      'Çoklu top aldığında tek bir topu bile oyunda tutman yeterlidir.'
    ],
    achievements: [
      {
        id: 'bb-bronze',
        name: 'Tuğla Çırağı',
        description: 'Tuğla Kırıcı oyununda 500 puana ulaş.',
        requiredScore: 500,
        icon: 'Award'
      },
      {
        id: 'bb-silver',
        name: 'Plazma Ustası',
        description: '1.500 puan toplayarak neon arenaları dize getir.',
        requiredScore: 1500,
        icon: 'Trophy'
      },
      {
        id: 'bb-gold',
        name: 'Arcade Şampiyonu',
        description: '3.000 puan ile kırılmadık rekor bırakma.',
        requiredScore: 3000,
        icon: 'Sparkles'
      }
    ]
  },
  {
    id: 'trivia-quiz',
    title: 'Makaralı Genel Kültür',
    shortTitle: 'Makaralı Kültür',
    tagline: 'Türk Sineması, Memeler & Komik Gündem',
    category: 'Mizah & Popüler Kültür',
    image: '/images/arcade_comedy_trivia_1791457940606.jpg',
    difficulty: 'Kolay',
    accentColor: '#10b981',
    accentBorder: 'border-emerald-500/40',
    accentText: 'text-emerald-400',
    description:
      'Gülme garantili, son derece komik ve makaralı genel kültür bilgi yarışması! G.O.R.A’dan Kolpaçino’ya, Aşk-ı Memnu’dan Türk internet memelerine, Yeşilçam klasiklerinden altın günü dedikodularına kadar popüler kültürün en eğlenceli soruları! Her cevabın ardından gelen kahkaha dolu açıklamalarla eğlence hiç bitmesin!',
    objective:
      'Efsane film repliklerini, unutulmaz Türk memelerini ve komik gündem detaylarını bil, kahkahalara boğul ve en yüksek mizah skorunu yakala.',
    rules: [
      'Sorular Türk sineması, popüler diziler, internet memeleri ve gündelik hayatın absürtlüklerini içerir.',
      'Sonsuz soru modunda sorular peş peşe hiç durmadan akmaya devam eder.',
      'Doğru cevap verdiğinde +100 puan kazanılır ve kombo çarpanı katlanır.',
      'Her cevabın ardından konuya dair efsane komik arka plan açıklaması gösterilir.',
      '3 Can hakkın bulunur; her 5 ardışık doğru cevap serisinde 1 bonus can kazanırsın!',
      'Zorlandığında %50 Eleme ve Pas Geç jokerlerini kullanabilirsin.'
    ],
    controls: [
      { key: '1 - 2 - 3 - 4 Tuşları', action: 'Klavye ile Şıkkı Seç' },
      { key: 'A - B - C - D Tuşları', action: 'Alternatif Klavye Şık Seçimi' },
      { key: 'Fare / Dokunmatik Tık', action: 'Şıkkın Üzerine Tıkla' },
      { key: 'Joker Butonları', action: '50/50 veya Pas Geç Kullan' }
    ],
    powerups: [
      {
        name: '%50 Kolpa Eleme',
        description: 'İki alakasız yanlış seçeneği silerek doğru cevabı ön plana çıkarır.',
        icon: 'Shield',
        color: 'from-emerald-400 to-teal-400'
      },
      {
        name: 'Pas Geç / Sıvış Jokeri',
        description: 'Kafanı karıştıran sorudan can kaybetmeden sıvışarak sonraki soruya geçer.',
        icon: 'Zap',
        color: 'from-amber-400 to-yellow-300'
      },
      {
        name: 'Kahkaha Bonusu (Ekstra Can)',
        description: 'Her 5 ardışık doğru cevapta otomatik olarak +1 bonus can kazanırsın.',
        icon: 'Sparkles',
        color: 'from-rose-400 to-pink-500'
      }
    ],
    proTips: [
      'Soruları okurken replikleri karakterin kendi sesiyle aklından canlandırırsan doğru cevap hemen sırıtacaktır!',
      'Kolpaçino ve Cem Yılmaz sorularında ilk aklına gelen efsane replik genellikle doğrudur.',
      'Cevabı verdikten sonra çıkan mizahi açıklamaları mutlaka oku, günün stresini unutturur!'
    ],
    achievements: [
      {
        id: 'tq-bronze',
        name: 'Mizah Çırağı',
        description: 'Makaralı Genel Kültür testinde 500 puana ulaş.',
        requiredScore: 500,
        icon: 'Award'
      },
      {
        id: 'tq-silver',
        name: 'Meme Eksperi',
        description: '1.500 puan toplayarak Türk popüler kültürünün ordinaryüsü ol.',
        requiredScore: 1500,
        icon: 'Trophy'
      },
      {
        id: 'tq-gold',
        name: 'Mizahşör Efsane',
        description: '3.000 puan ile Türk mizah tarihine adını altın harflerle yazdır.',
        requiredScore: 3000,
        icon: 'Sparkles'
      }
    ]
  }
];
