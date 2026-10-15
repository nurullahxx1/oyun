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
    id: 'neon-2048',
    title: 'Neon 2048 DX',
    shortTitle: 'Neon 2048',
    tagline: 'Pratik Zeka, Akıcı Strateji & Sayı Füzyonu',
    category: 'Zeka & Bulmaca',
    image: '/images/arcade_neon_2048.jpg',
    difficulty: 'Orta',
    accentColor: '#10b981',
    accentBorder: 'border-emerald-500/40',
    accentText: 'text-emerald-400',
    description:
      'Efsanevi 2048 bulmacasının modern, pratik ve elektrik yüklü neon arcade sürümü! Aynı değere sahip parlayan neon sayı küplerini ok tuşları, dokunmatik kaydırma veya yön butonlarıyla birbirine doğru kaydırarak füzyon oluştur. 2, 4, 8, 16... 1024 ve nihai 2048 bloğuna ulaş! Geri Al, Neon Balyoz ve Tahta Karıştırıcı pratik takviyeleriyle zekanı ve reflekslerini konuştur!',
    objective:
      'Aynı sayıdaki blokları kaydırıp birleştirerek 2048 neon küpüne ulaş, ardından 4096 ve ötesine geçerek rekor puan kır.',
    rules: [
      'Ok tuşları (← ↑ → ↓), WASD, dokunmatik kaydırma veya ekran butonlarıyla tüm blokları bir yöne kaydır.',
      'Aynı değere sahip iki sayı bloğu çarpıştığında tek bir blokta birleşir ve değeri kadar puan kazandırır.',
      'Her geçerli hamleden sonra boş bir ızgara hücresinde yeni bir 2 veya 4 neon bloğu belirir.',
      'Geri Al (Undo) özelliği ile yanlış yaptığın son hamleyi tek tıkla geri alabilirsin (Oyun başı 3 hak).',
      'Neon Balyoz (Hammer) ile tahtayı tıkayan istenmeyen tek bir bloğu anında kırabilirsin (2 hak).',
      'Tahtada hamle yapacak boş yer kalmadığında ve hiçbir blok birleşemediğinde oyun sona erer.'
    ],
    controls: [
      { key: 'Ok Tuşları veya W, A, S, D', action: 'Blokları Yukarı, Aşağı, Sola, Sağa Kaydır' },
      { key: 'Dokunmatik Kaydırma (Swipe)', action: 'Mobilde Parmağını Herhangi Bir Yöne Kaydır' },
      { key: 'Z Tuşu / Geri Al Butonu', action: 'Son Hamleyi Geri Al (Undo)' },
      { key: 'Balyoz & Karıştırıcı', action: 'Tıkla ve Tahtada İstenen Bloğa Uygula' }
    ],
    powerups: [
      {
        name: 'Geri Al (Undo)',
        description: 'Hatalı bir hamle yaptığında tahtayı bir adım önceki durumuna döndürür.',
        icon: 'RotateCcw',
        color: 'from-emerald-400 to-teal-400'
      },
      {
        name: 'Neon Balyoz (Hammer)',
        description: 'Köşede sıkışıp kalan istenmeyen tek bir bloğu kırıp anında yok eder.',
        icon: 'Zap',
        color: 'from-amber-400 to-rose-500'
      },
      {
        name: 'Füzyon Karıştırıcı (Shuffle)',
        description: 'Tüm taşları rastgele yeniden dizerek tıkalı pozisyonları ferahlatır.',
        icon: 'Sparkles',
        color: 'from-sky-400 to-indigo-500'
      }
    ],
    proTips: [
      'En yüksek değerli bloğunu daima köşelerden birinde (tercihen sol-alt veya sağ-alt) sabit tut.',
      'Sayıları büyükten küçüğe doğru bir zincir şeklinde dizmek ardışık kombo füzyonları kolaylaştırır.',
      'Köşedeki ana bloğunu hareket ettirecek zıt yöne asla hamle yapma!'
    ],
    achievements: [
      {
        id: 'n2-bronze',
        name: 'Füzyon Çırağı',
        description: 'Neon 2048 oyununda 1.000 puana ulaş.',
        requiredScore: 1000,
        icon: 'Award'
      },
      {
        id: 'n2-silver',
        name: 'Kuantum Mimarı',
        description: '5.000 puan toplayarak 1024 bloğunu oluştur.',
        requiredScore: 5000,
        icon: 'Trophy'
      },
      {
        id: 'n2-gold',
        name: '2048 Efsanesi',
        description: '10.000 puanı aşarak nihai neon tahtın sahibi ol.',
        requiredScore: 10000,
        icon: 'Sparkles'
      }
    ]
  }
];
