import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { Heart, RotateCcw, HelpCircle, Shield, SkipForward, ArrowRight, CheckCircle2, XCircle, Laugh, Flame } from 'lucide-react';

interface TriviaQuizGameProps {
  gameState: GameState;
  onGameOver: (finalScore: number) => void;
  onRestart: () => void;
  onOpenBriefing: () => void;
  highScore: number;
}

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  fact: string;
}

// 30 Hilarious, funny, Turkish pop culture, cinema & meme questions
const COMEDY_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'G.O.R.A & Türk Sineması',
    question: 'Cem Yılmaz’ın G.O.R.A filminde Arif’in uzaylı komutan Logar’ı çıldırtan ve uzay gemisinde pişirdiği milli ziyafet nedir?',
    options: ['Sucuklu Yumurta', 'Kuru Fasulye & Pilav', 'Lahmacun & Ayran', 'Adana Kebap'],
    correctIndex: 0,
    fact: 'Arif: "Sucuk olmasa yemem zaten!" diyerek uzay gemisinin ortasında tavada cızırdayan sucuklu yumurtayla galaktik diplomasiyi başlatmıştır.',
  },
  {
    id: 2,
    category: 'Kolpaçino Replikleri',
    question: 'Kolpaçino filminde kumarhane baskınında Özgür’ün panikle Şafak Sezer’e haykırdığı efsane replik nedir?',
    options: ['"Hedef ben miyim Tayfun?!"', '"Paralar nerede Sabri Abi?"', '"Beni buradan çıkarın!"', '"Polisi arayın çabuk!"'],
    correctIndex: 0,
    fact: 'Mermiler havada uçuşurken Özgür’ün derin varoluşsal sorgulaması Türk mizah tarihine altın harflerle geçmiştir.',
  },
  {
    id: 3,
    category: 'Aşk-ı Memnu Dramı',
    question: 'Aşk-ı Memnu’nun unutulmaz final sahnesinde Bihter Ziyagil’in Behlül’e son bakışını atarken tarihe geçen repliği nedir?',
    options: ['"Beni beni, Bihter’ini..."', '"Gözlerin öyle demiyor Behlül"', '"Matmazel her şeyi biliyor"', '"Hilmi Önal haklıymış"'],
    correctIndex: 0,
    fact: 'Behlül o günden sonra sakal bırakıp mezarlık ziyaretleri hariç hiçbir yerde görülmemiştir.',
  },
  {
    id: 4,
    category: 'Türk Pop Efsaneleri',
    question: '2000’li yıllarda televizyonlara çıkıp "Nane nane" ve "Çikita Muz" şarkılarıyla Türk pop müziğinde devrim yapan hiperstar kimdir?',
    options: ['Ajdar Anık', 'Aydın', 'Kuşum Aydın', 'Banu Alkan'],
    correctIndex: 0,
    fact: 'Makine mühendisi olduğunu her fırsatta hatırlatan Ajdar, Türk müzik tarihinin en gizemli meyve şarkılarına imza atmıştır.',
  },
  {
    id: 5,
    category: 'Yeşilçam Klasikleri',
    question: 'Tosun Paşa filminde Yeşilçam’ın iki köklü ailesi Daver Beyler ve Hakiki Tosun Paşa hangi meşhur vadiyi bir türlü paylaşamamıştır?',
    options: ['Yeşil Vadi', 'Huzur Vadisi', 'Gül Vadisi', 'Bereket Vadisi'],
    correctIndex: 0,
    fact: 'Kemal Sunal’ın "Tutmayın küçük enişteyi!" repliğiyle alevlenen Yeşil Vadi krizinde Seferoğulları ve Tellioğulları birbirine girmiştir.',
  },
  {
    id: 6,
    category: 'Kurtlar Vadisi',
    question: 'Kurtlar Vadisi dizisinde Süleyman Çakır’ın "İstanbul’un sefiri benim!" derken yanından bir an olsun ayırmadığı can dostu kimdir?',
    options: ['Polat Alemdar', 'Memati Baş', 'Güllü Erhan', 'Seyfo Dayı'],
    correctIndex: 0,
    fact: 'Çakır’ın ölümünün ardından gazetelere tam sayfa taziye ilanı veren ve gıyabında cenaze namazı kılan bir milletiz!',
  },
  {
    id: 7,
    category: 'Hababam Sınıfı',
    question: 'Hababam Sınıfı’nda İnek Şaban’ın okul müdürünü trolleyerek "Müfettiş Bey ben Akil Hoca’yım" dediği unutulmaz müfettişin adı nedir?',
    options: ['Hüseyin Şevki Topuz', 'Kel Mahmut', 'Badi Ekrem', 'Kül Yutmaz Necmi'],
    correctIndex: 0,
    fact: '"Aç kapıyı Veysel Efendi!" repliği ve Şaban’ın sigara dumanını müfettişin yüzüne üflemesi Yeşilçam’ın zirvesidir.',
  },
  {
    id: 8,
    category: 'Çocukluk Nostaljisi',
    question: '2000’li yılların unutulmaz dizisinde kızlar gökyüzünden Selena’yı yeryüzüne çağırmak için el ele tutuşup kaç kere adını haykırırdı?',
    options: ['3 kere', '1 kere', '2 kere', '40 kere'],
    correctIndex: 0,
    fact: '"S-E-L-E-N-A Selena!" diye bağırıp el ele tutuşan nesil büyüdü ve şimdi KPSS’ye hazırlanıyor.',
  },
  {
    id: 9,
    category: 'Milli Anne Protokolü',
    question: 'Türk annelerinin evden dışarı adım atan çocuğunun arkasından balkondan bağırdığı 1 numaralı milli koruma kalkanı tavsiyesi nedir?',
    options: ['"Sırtına havlu koy, terin soğumasın!"', '"Paranı cüzdana sakla!"', '"Yabancılarla konuşma!"', '"Kırmızı ışıkta bekle!"'],
    correctIndex: 0,
    fact: 'Dünya tıp literatüründe sırtına konan havlunun zatürreyi engellediğine dair tek kanıt Türk anneleridir.',
  },
  {
    id: 10,
    category: 'Leyla ile Mecnun',
    question: 'Leyla ile Mecnun dizisinde Kireçburnu Çakalları’nın sahilde el sallayarak beklediği meşhur sözün tamamı nedir: "O gemi bir gün...?"',
    options: ['Gelecek!', 'Batacak!', 'Dönecek!', 'Yanaşacak!'],
    correctIndex: 0,
    fact: 'İsmail Abi’nin pullu ceketini sallayarak "O gemi bir gün gelecek Mecnun!" deyişi gözleri yaşartır.',
  },
  {
    id: 11,
    category: 'Ezel & Ramiz Dayı',
    question: 'Ezel dizisinde Ramiz Dayı’nın yeğenine çayını yudumlarken Oscar Wilde’dan alıntıladığı en jilet replik nedir?',
    options: ['"Oysa herkes öldürür sevdiğini"', '"Kaderimiz buymuş yeğen"', '"Parayı veren düdüğü çalar"', '"Sonunu düşünen kahraman olamaz"'],
    correctIndex: 0,
    fact: 'Bu replikten sonra Türkiye’deki tüm kahvehanelerde herkes birbirine "yeğen" diye hitap etmeye başlamıştır.',
  },
  {
    id: 12,
    category: 'Kardeş Payı',
    question: 'Kardeş Payı dizisinde Metin ve Ali tesisatçı kardeşlerin mahallede gizli gizli icat ettiği ve dünyayı kurtaracak büyük buluş neydi?',
    options: ['Borla çalışan motor', 'Uçan araba', 'Zaman makinesi', 'Işınlanma kabini'],
    correctIndex: 0,
    fact: 'Büyük Hilmi’nin "Sen kimsin ya?!" replikleri eşliğinde Türk bor madenine olan inanç tavan yapmıştır.',
  },
  {
    id: 13,
    category: 'Milli Çay Protokolü',
    question: 'Pazar kahvaltısında çay bardağındaki çay kaşığının bardağın üstüne yatay konması Türk protokolünde ne anlama gelir?',
    options: ['"Doydum, daha fazla çay koymayın!"', '"Çay çok sıcak"', '"Şeker atmayı unuttunuz"', '"Hesabı ben ödeyeceğim"'],
    correctIndex: 0,
    fact: 'Bu işaret koyulmazsa misafirlikte demlik bitene kadar zorla çay doldurulmaya devam edilir.',
  },
  {
    id: 14,
    category: 'Yahşi Batı',
    question: 'Cem Yılmaz’ın Yahşi Batı filminde Osmanlı heyetinin ABD Başkanına hediye olarak götürürken kovboylara çaldırdığı emanet neydi?',
    options: ['Elmas işlemeli padişah çakmağı', 'Padişahın tuğralı kılıcı', 'Saf altın nargile', 'Osmanlı lokumu sandığı'],
    correctIndex: 0,
    fact: 'Aziz Vefa: "Padişahımız efendimiz bunu Başkan Abraham Lincoln’e yolladı!" diyerek Vahşi Batı’yı birbirine katmıştır.',
  },
  {
    id: 15,
    category: 'Misafirlik Geleneği',
    question: 'Akşam misafirliğinde "Hadi bize müsaade, kalkalım artık" dendiğinde kapı önünde yaşanan milli olay nedir?',
    options: ['Kapı önünde montlarla 45 dakika daha sohbet etmek', 'Hemen ayakkabıyı giyip çıkmak', 'Sessizce vedalaşmak', 'Taksi çağırmak'],
    correctIndex: 0,
    fact: 'Türk insanı için gerçek derin sohbet salonda değil, ayakkabılık önünde montlar giyildikten sonra başlar.',
  },
  {
    id: 16,
    category: 'Cennet Mahallesi',
    question: 'Cennet Mahallesi dizisinde Pembe’nin kızı Sultan’ı evlendirmek için Ferhat yerine sürekli peşinden koştuğu zengin mahalleli kimdir?',
    options: ['Rüstem', 'Ethem', 'Beter Ali', 'Muharrem'],
    correctIndex: 0,
    fact: '"Alamanya’dan geldi parası çok!" diyerek Ferhat ile Sultan’ın aşkını 119 bölüm boyunca baltalamıştır.',
  },
  {
    id: 17,
    category: 'Survivor Klasikleri',
    question: 'Survivor yarışmasında parkurda atışları kaçırıp oyunu kaybeden yarışmacının kumları tekmeleyerek kameraya söylediği klasik söz nedir?',
    options: ['"Ben buraya kaybetmeye gelmedim!"', '"Hakem taraflı davranıyor"', '"Ben aslında yorulmadım"', '"Yarın daha iyi olacağım"'],
    correctIndex: 0,
    fact: 'Acun Ilıcalı’nın sakin ses tonuyla "Kaybettin..." demesiyle drama tavan yapar.',
  },
  {
    id: 18,
    category: 'Milli Karpuz Radarı',
    question: 'Yaz aylarında manavda karpuz seçen bir Türk vatandaşının karpuza hafifçe şaplak atıp kulağını dayamasındaki amaç nedir?',
    options: ['Karpuzun tınlama sesinden içinin kelek olup olmadığını anlamak', 'Karpuzu uyandırmak', 'Ağırlığını tahmin etmek', 'Kabuğunun sertliğini ölçmek'],
    correctIndex: 0,
    fact: 'Hiçbir fizik kuralına uymayan bu milli radar yöntemiyle her yaz milyonlarca karpuz ameliyat edilmeden onaylanır.',
  },
  {
    id: 19,
    category: 'Düğünlerin Milli Dansı',
    question: 'Türk düğünlerinde saat 22:30 civarında pistin aniden alev almasına ve herkesin oynamasına sebep olan milli dans parçamız hangisidir?',
    options: ['Erik Dalı', 'Kuğu Gölü', 'Salsa', 'Tango'],
    correctIndex: 0,
    fact: 'Gelin, damat ve kaynananın aynı anda "Erik dalı gevrektir!" diyerek pisti kırdığı an düğünün zirvesidir.',
  },
  {
    id: 20,
    category: 'Altın Günü Protokolü',
    question: 'Geleneksel altın günlerinde porselen tabağın vazgeçilmez 3’lü kutsal ittifakı hangisidir?',
    options: ['Kısır, Poğaça ve Islak Kek', 'Suşi, Tacos ve Pizza', 'Kuru Fasulye, Pilav ve Cacık', 'Kavun, Karpuz ve Peynir'],
    correctIndex: 0,
    fact: 'Yanında çayla birlikte bu üçlü tüketilmeden altın borsasındaki dalgalanmalar dedikoduya dökülemez.',
  },
  {
    id: 21,
    category: 'Yalan Dünya & Vasfiye',
    question: 'Yalan Dünya dizisinde insanların en mutlu anında ortaya çıkıp "Ne çektin be yavrum!" diyerek ortamın neşesini söndüren teyze kimdir?',
    options: ['Vasfiye Teyze', 'Gülse Teyze', 'Makbule Teyze', 'Cahide Teyze'],
    correctIndex: 0,
    fact: '"Yazık sana da yazık... Sen aslında çok neşeli bir çocuktun!" repliğiyle ortamın enerjisini anında sıfırlar.',
  },
  {
    id: 22,
    category: 'Recep İvedik',
    question: 'Recep İvedik’in ilk filminde cüzdanını bulduğu zengin iş adamına cüzdanı teslim etmek için kırmızı arabasıyla gittiği tatil cenneti neresidir?',
    options: ['Antalya', 'Bodrum', 'Çeşme', 'Marmaris'],
    correctIndex: 0,
    fact: 'Kırmızı vosvosuyla yollara düşüp otelde yoga hocalarını canından bezdirmiştir.',
  },
  {
    id: 23,
    category: 'A.R.O.G Taş Devri',
    question: 'A.R.O.G filminde Arif’in Taş Devri insanlarına futbolu öğretirken taktik tahtasına çizdiği efsane taktik nedir?',
    options: ['"Topu gören vursun, ileriye şişirin!"', '"Tiki-taka pas oyunu"', '"Ofsayt taktiği"', '"Katı savunma"'],
    correctIndex: 0,
    fact: 'Taş Devri’nde dinozor kemikleriyle kurulan futbol kalesine karşı Arif’in taktik dehası parlamıştır.',
  },
  {
    id: 24,
    category: 'Çakallarla Dans',
    question: 'Çakallarla Dans serisinde Köfte Necmi ve ekibinin her belaya bulaşırken söylediği felsefi aforizma nedir?',
    options: ['"Hastasıyız dedeeee!"', '"Parayı veren düdüğü çalar"', '"Ben bu oyunu bozarım"', '"Hedefe kitlenin"'],
    correctIndex: 0,
    fact: 'Del Piero Hikmet ve Servet’in cezaevinden kaçıp yeni maceralara koşarken haykırdığı milli repliktir.',
  },
  {
    id: 25,
    category: 'Selvi Boylum Al Yazmalım',
    question: 'Selvi Boylum Al Yazmalım filminde Kadir İnanır ve Türkan Şoray’ın göz göze geldiği o efsane finalde "Sevgi neydi?" sorusunun yanıtı nedir?',
    options: ['"Sevgi emekti"', '"Sevgi aşktı"', '"Sevgi tutkuydu"', '"Sevgi paraydı"'],
    correctIndex: 0,
    fact: 'Fakat Asya kamyoncu Cemşit’i seçince nesiller boyu aşk acısı çekenler kahrolmuştur.',
  },
  {
    id: 26,
    category: 'Aile WhatsApp Grupları',
    question: 'Pazartesi sabahı saat 07:00’de aile WhatsApp grubuna gelen simli ve parıldayan resimli mesaj genellikle ne içerir?',
    options: ['Güllü / kahveli "Hayırlı Haftalar" tebrik kartı', 'Borsa bülteni', 'Hava durumu raporu', 'Günün fıkrası'],
    correctIndex: 0,
    fact: 'Telefonun hafızasını 2 haftada dolduran o simli güller olmadan hiçbir Türk ailesinde hafta başlayamaz.',
  },
  {
    id: 27,
    category: 'Bayram Ziyaretleri',
    question: 'Kurban Bayramı’nda 4. akraba ziyaretine gidildiğinde ev sahibinin getirdiği ve "Yemezsen vallahi küserim" dediği şey nedir?',
    options: ['Kavurma ve dolma', 'Hafif bir yeşil salata', 'Sadece maden suyu', 'Meyve tabağı'],
    correctIndex: 0,
    fact: 'Karnı patlamak üzere olan misafire zorla uzatılan o son tabak Türk misafirperverliğinin zirve noktasıdır.',
  },
  {
    id: 28,
    category: 'Dönerci Sohbetleri',
    question: 'Öğle arasında dönercide sipariş verirken ustanın "Ağabeyime ne sarayım?" sorusuna verilen en yaygın milli yanıt nedir?',
    options: ['"Bol soğanlı, bol soslu olsun usta!"', '"Azıcık koy usta diyet yapıyorum"', '"Ketçapsız olsun"', '"Ekmeğini çıkar içini ver"'],
    correctIndex: 0,
    fact: 'Yanında köpüklü yayık ayranla birlikte öğleden sonraki tüm toplantıların esneme garantisidir.',
  },
  {
    id: 29,
    category: 'Cem Yılmaz Stand-up',
    question: 'Cem Yılmaz’ın gösterisinde bahsettiği "Ateş, su, toprak, tahta" 4 element teorisinde seyircinin verdiği tepki nedir?',
    options: ['"Hocam tahta ne ya, hava o hava!"', '"Tahta yanar ama"', '"Çok mantıklı element"', '"Tahta olmaz"'],
    correctIndex: 0,
    fact: 'Cem Yılmaz: "Tahta tabii ki oğlum, yakıyorsun ateş çıkıyor!" diyerek salonu kahkahaya boğmuştur.',
  },
  {
    id: 30,
    category: 'G.O.R.A & Komutan Logar',
    question: 'G.O.R.A filminde Komutan Logar’ın dünyalı Arif’e hologram ekranından sinirlenip söylediği efsane hitap nedir?',
    options: ['"Ateş etme uzaylı, ben Arif!"', '"Sen kimsin ya?!"', '"Buradan çıkış yok"', '"Teslim ol dünyalı"'],
    correctIndex: 0,
    fact: 'Arif’in halı tüccarı refleksiyle uzay gemisinden kaçış planları Türk sinemasının en büyük komedi sahneleridir.',
  },
];

export const TriviaQuizGame: React.FC<TriviaQuizGameProps> = ({
  gameState,
  onGameOver,
  onRestart,
  onOpenBriefing,
  highScore,
}) => {
  // HUD state
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(1);

  // Question & Timer State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Question options shuffler
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; originalIndex: number }[]>([]);

  // Current question data
  const rawQuestion = useMemo(() => {
    return COMEDY_QUESTIONS[currentIdx % COMEDY_QUESTIONS.length];
  }, [currentIdx]);

  // Shuffle options whenever rawQuestion changes
  useEffect(() => {
    const opts = rawQuestion.options.map((text, idx) => ({ text, originalIndex: idx }));
    // Shuffle options
    const shuffled = [...opts].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
  }, [rawQuestion]);

  // Start fresh game when PLAYING starts
  useEffect(() => {
    if (gameState === 'PLAYING') {
      setScore(0);
      setLives(3);
      setCombo(1);
      setQuestionNumber(1);
      const start = Math.floor(Math.random() * COMEDY_QUESTIONS.length);
      setCurrentIdx(start);
      setFiftyFiftyUsed(false);
      setDisabledOptions([]);
      setSelectedOption(null);
      setFeedback(null);
    }
  }, [gameState]);

  // Advance to next question seamlessly (Endless!)
  const advanceNextQuestion = useCallback(() => {
    setSelectedOption(null);
    setFeedback(null);
    setDisabledOptions([]);
    setFiftyFiftyUsed(false);
    setCurrentIdx((prev) => prev + 1);
    setQuestionNumber((prev) => prev + 1);
  }, []);

  // Answer handler
  const handleSelectOption = useCallback(
    (shuffledIdx: number) => {
      if (gameState !== 'PLAYING' || selectedOption !== null || disabledOptions.includes(shuffledIdx)) return;

      setSelectedOption(shuffledIdx);
      const chosenItem = shuffledOptions[shuffledIdx];
      const isCorrect = chosenItem?.originalIndex === rawQuestion.correctIndex;

      if (isCorrect) {
        soundManager.playPowerup();
        const earned = 100 * combo;
        const nextScore = score + earned;
        const nextCombo = Math.min(combo + 1, 5);

        // Bonus life every 5 streak
        let nextLives = lives;
        let bonusText = '';
        if (nextCombo === 5 && lives < 3) {
          nextLives = Math.min(3, lives + 1);
          bonusText = ' 💖 +1 Bonus Can Kazandın!';
        }

        setScore(nextScore);
        setCombo(nextCombo);
        setLives(nextLives);
        setFeedback({
          isCorrect: true,
          text: `🎯 Kahkaha Dolu Doğru! +${earned} Puan.${bonusText} ${rawQuestion.fact}`,
        });
      } else {
        soundManager.playExplosion(false);
        const nextLives = lives - 1;
        setLives(nextLives);
        setCombo(1);

        const correctText = rawQuestion.options[rawQuestion.correctIndex];
        setFeedback({
          isCorrect: false,
          text: `😅 Patladın! Doğru cevap: "${correctText}" idi. ${rawQuestion.fact}`,
        });

        if (nextLives <= 0) {
          setTimeout(() => {
            soundManager.playGameOver();
            onGameOver(score);
          }, 2000);
          return;
        }
      }

      // Automatically advance to NEXT QUESTION after 3.2 seconds
      setTimeout(() => {
        advanceNextQuestion();
      }, 3200);
    },
    [gameState, selectedOption, disabledOptions, shuffledOptions, rawQuestion, combo, score, lives, onGameOver, advanceNextQuestion]
  );

  // 50/50 Joker: disables 2 wrong options
  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || selectedOption !== null) return;
    setFiftyFiftyUsed(true);
    soundManager.playTick();

    const wrongIndexes: number[] = [];
    shuffledOptions.forEach((opt, idx) => {
      if (opt.originalIndex !== rawQuestion.correctIndex) {
        wrongIndexes.push(idx);
      }
    });

    const toDisable = wrongIndexes.slice(0, 2);
    setDisabledOptions(toDisable);
  };

  // Pass Joker: skips the question with no penalty
  const handleSkipQuestion = () => {
    if (selectedOption !== null) return;
    soundManager.playEat();
    advanceNextQuestion();
  };

  // Keyboard shortcut listener: 1, 2, 3, 4 or A, B, C, D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedOption !== null) return;

      const key = e.key.toUpperCase();
      let index = -1;
      if (['1', 'A'].includes(key)) index = 0;
      if (['2', 'B'].includes(key)) index = 1;
      if (['3', 'C'].includes(key)) index = 2;
      if (['4', 'D'].includes(key)) index = 3;

      if (index !== -1 && !disabledOptions.includes(index) && index < shuffledOptions.length) {
        handleSelectOption(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, disabledOptions, shuffledOptions, handleSelectOption]);

  const letterLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Top HUD Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 rounded-t-2xl text-xs sm:text-sm text-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[11px] font-bold">Skor</span>
            <span className="font-mono-num font-black text-emerald-400 text-base">{score}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 uppercase text-[11px] font-bold">Mizah Sorusu</span>
            <span className="font-mono-num font-bold text-slate-200">#{questionNumber}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 uppercase text-[11px] font-bold mr-1">Can</span>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-4 h-4 transition-colors ${
                  idx < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {combo > 1 && (
            <span className="text-amber-400 font-bold text-xs bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> {combo}x Kahkaha
            </span>
          )}

          <button
            onClick={onOpenBriefing}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Nasıl Oynanır?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="relative w-full bg-slate-950 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center">
        {/* Category Pill */}
        <div className="w-full max-w-xl flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
            <Laugh className="w-3.5 h-3.5" />
            {rawQuestion.category}
          </span>
          <span className="font-mono-num text-[11px] text-amber-400 font-semibold">
            Sonsuz Makara Modu
          </span>
        </div>

        {/* Question Card */}
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 mb-5 text-center shadow-xl">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {rawQuestion.question}
          </h3>
        </div>

        {/* Educational/Funny Feedback Box */}
        {feedback && (
          <div
            className={`w-full max-w-xl mb-4 p-4 rounded-xl border text-xs sm:text-sm font-medium animate-in zoom-in-95 duration-200 flex flex-col gap-1.5 ${
              feedback.isCorrect
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Harika Cevap!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">Kolpa Seçim!</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">{feedback.text}</p>
          </div>
        )}

        {/* 4 Options Grid */}
        <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mb-6">
          {shuffledOptions.map((opt, idx) => {
            const isDisabled = disabledOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = opt.originalIndex === rawQuestion.correctIndex;
            const showOutcome = selectedOption !== null;

            let btnStyle = 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-white';

            if (isDisabled) {
              btnStyle = 'opacity-25 bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed';
            } else if (showOutcome) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50 shadow-lg';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500/50 shadow-lg';
              } else {
                btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isDisabled || selectedOption !== null}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border flex items-center gap-3.5 text-left transition-all cursor-pointer font-bold shadow-md active:scale-98 ${btnStyle}`}
              >
                <span className="w-8 h-8 rounded-lg bg-slate-800/90 text-slate-200 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-slate-700">
                  {letterLabels[idx]}
                </span>
                <span className="text-sm sm:text-base font-semibold leading-snug flex-1">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls & Jokers Bar */}
        <div className="w-full max-w-xl flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseFiftyFifty}
              disabled={fiftyFiftyUsed || selectedOption !== null}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                fiftyFiftyUsed
                  ? 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-emerald-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              %50 Eleme {fiftyFiftyUsed ? '(Kullanıldı)' : ''}
            </button>

            <button
              onClick={handleSkipQuestion}
              disabled={selectedOption !== null}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Pas Geç
            </button>
          </div>

          {/* Quick Next Button if feedback is active */}
          {feedback && (
            <button
              onClick={advanceNextQuestion}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <span>Sonraki Soru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Game Over Modal Overlay */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm p-6 text-center animate-in fade-in duration-200">
            <span className="text-4xl sm:text-5xl font-black text-rose-500 mb-2 font-display">
              MARATON TAMAMLANDI!
            </span>
            <p className="text-sm text-slate-300 mb-6">
              Makaralı genel kültür maratonunda kahkaha dolu rekorlar kırdın!
            </p>

            <div className="flex items-center gap-6 mb-6 p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Toplam Skor</span>
                <span className="text-2xl font-black text-emerald-400 font-mono-num">{score}</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Cevaplanan Soru</span>
                <span className="text-2xl font-black text-amber-400 font-mono-num">{questionNumber}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onRestart}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                Yeniden Başla
              </button>
              <button
                onClick={onOpenBriefing}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
              >
                <HelpCircle className="w-4 h-4" />
                Nasıl Oynanır?
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
