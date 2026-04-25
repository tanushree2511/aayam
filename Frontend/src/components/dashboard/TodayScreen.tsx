import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { recordAgencyDecision, getJourneyDayCount, getTierFromJourney } from '@/lib/journeyStorage';
import { clientLocalDateKey } from '@/lib/restorationApi';
import AgencyTrail from '@/components/dashboard/AgencyTrail';
import MoodAnalysis from '@/components/dashboard/MoodAnalysis';
import { MOOD_HEX, moodHeroGradient } from '@/lib/moodTheme';

// ─── Choice Banks ────────────────────────────────────────────────────────────
const TIER1_CHOICES = (t: (en: string, ne: string) => string) => [
  {
    id: 'color',
    category: t('Colour', 'रंग'),
    question: t('What color did your day begin with?', 'आज आपका दिन किस रंग से शुरू हुआ?'),
    type: 'colors' as const,
    why: t('One decision at a time reduces pressure. Clear options stabilise an exhausted nervous system.', 'एक समय में एक निर्णय दबाव को कम करता है। स्पष्ट विकल्प थके हुए तंत्रिका तंत्र को स्थिर करते हैं।'),
  },
  {
    id: 'sound',
    category: t('Sound', 'ध्वनि'),
    question: t('What sound do you want to wake up to tomorrow?', 'कल आप किस आवाज़ के साथ उठना चाहेंगे?'),
    type: 'options' as const,
    options: [
      { value: 'rain',  label: t('Rain 🌧️', 'बारिश की आवाज़ 🌧️') },
      { value: 'bells', label: t('Temple Bells 🔔', 'मंदिर की घंटी 🔔') },
      { value: 'birds', label: t('Birdsong 🐦', 'पक्षियों की चहचहाहट 🐦') },
    ],
    why: t('Choosing a sound gives your senses a safe anchor.', 'एक ध्वनि चुनने से आपकी इंद्रियों को एक सुरक्षित सहारा मिलता है।'),
  },
  {
    id: 'word',
    category: t('Word', 'शब्द'),
    question: t('Describe your morning in one word.', 'अपनी सुबह का वर्णन एक शब्द में करें।'),
    type: 'text' as const,
    placeholder: t('One word only...', 'बस एक शब्द...'),
    why: t('Naming your experience means understanding it. This calms the mind.', 'अपने अनुभव को नाम देने का अर्थ है उसे समझना। यह मन को शांत करता है।'),
  },
  {
    id: 'pace',
    category: t('Pace', 'गति'),
    question: t('How do you want today to feel?', 'आज का दिन कैसा महसूस होना चाहिए?'),
    type: 'options' as const,
    options: [
      { value: 'quiet',  label: t('Quiet 🌿', 'शांत 🌿') },
      { value: 'active', label: t('Active ⚡', 'सक्रिय ⚡') },
    ],
    why: t('Choosing your own pace is the first step to self-control.', 'अपनी गति खुद चुनना आत्म-नियंत्रण की ओर पहला कदम है।'),
  },
  {
    id: 'intention',
    category: t('Intention', 'इरादा'),
    question: t('One small thing only for yourself today.', 'आज सिर्फ अपने लिए एक छोटी सी चीज़।'),
    type: 'text' as const,
    placeholder: t('Just for me...', 'सिर्फ मेरे लिए...'),
    why: t('Thinking "for myself" is powerful. This small intention builds self-worth.', '"अपने लिए" सोचना शक्तिशाली है। यह छोटा सा इरादा आत्म-सम्मान बढ़ाता है।'),
  },
];

const MOOD_PALETTE = [
  { value: 'coral',  hex: '#D85A30' },
  { value: 'amber',  hex: '#EF9F27' },
  { value: 'green',  hex: '#1D9E75' },
  { value: 'blue',   hex: '#378ADD' },
  { value: 'purple', hex: '#7F77DD' },
  { value: 'rose',   hex: '#ED93B1' },
];

type ChoiceType = 'options' | 'text' | 'colors';

interface Choice {
  id: string;
  category: string;
  question: string;
  type: ChoiceType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  why?: string;
}

interface TodayScreenProps {
  moodColor?: string;
}

const TodayScreen = ({ moodColor = 'green' }: TodayScreenProps) => {
  const { t } = useLanguage();
  const { restoration, restorationReady, saveRestoration } = useAuth();
  const today = clientLocalDateKey();
  // We use CSS transition with the parent context, but keeping accent fallback
  const accent = MOOD_HEX[moodColor] ?? MOOD_HEX.green;
  const heroBg = useMemo(() => moodHeroGradient(accent), [accent]);
  const tier = getTierFromJourney();
  const dayCount = getJourneyDayCount();
  const choices: Choice[] = TIER1_CHOICES(t);

  const [step, setStep]       = useState(0);
  const [textVal, setTextVal] = useState('');
  const [sliding, setSliding] = useState(false);
  const [pulse, setPulse]     = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ id: string; answer: string }[]>([]);

  useEffect(() => {
    if (!restorationReady || !restoration) return;
    if (restoration.daily_restoration_date === today) {
      setStep(restoration.daily_restoration_step);
    } else {
      setStep(0);
      setUserAnswers([]);
      if (
        restoration.daily_restoration_date != null &&
        restoration.daily_restoration_date !== today
      ) {
        void saveRestoration({
          daily_restoration_date: today,
          daily_restoration_step: 0,
        });
      }
    }
  }, [restorationReady, restoration, today, saveRestoration]);

  const done = step >= choices.length;
  const current = choices[step] || choices[choices.length - 1];

  const submit = (val: string) => {
    recordAgencyDecision(current.id);
    setUserAnswers(prev => [...prev, { id: current.id, answer: val }]);
    setTextVal('');
    const todayStr = clientLocalDateKey();
    const nextStep = step === choices.length - 1 ? choices.length : step + 1;
    void saveRestoration({
      daily_restoration_date: todayStr,
      daily_restoration_step: nextStep,
    });

    if (step === choices.length - 1) {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
      setStep(step + 1);
      return;
    }

    setSliding(true);
    setTimeout(() => {
      setStep(step + 1);
      setSliding(false);
    }, 400); // Wait for exit animation
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (!restorationReady) {
    return (
      <div
        className="min-h-[320px] rounded-[20px] bg-muted/25 animate-pulse"
        aria-busy="true"
        aria-label={t('Loading your progress', 'आपकी प्रगति लोड हो रही है')}
      />
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-30px); } }
          .slide-enter { animation: slideInRight 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .slide-exit { animation: slideOutLeft 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0px var(--mood-accent, #e08080); }
            50% { transform: scale(1.4); box-shadow: 0 0 0 10px rgba(0,0,0,0); }
          }
          .dots-pulse .progress-dot { animation: pulseScale 1s ease-out; background: var(--mood-accent, #e08080) !important; }
        `}
      </style>

      {/* Tier 1 Completion - AI Analysis */}
      {step >= choices.length && (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <MoodAnalysis answers={userAnswers} moodColor={moodColor} />
        </div>
      )}

      {/* Hero Banner */}
      <div className="pb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <div
          className="flex flex-col gap-5 rounded-[20px] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8"
          style={{ background: heroBg }}
        >
          {/* Left: title */}
          <div className="min-w-0 w-full flex-1 sm:min-w-[220px]">
            <p style={{ fontSize: 11, color: '#9a8e84', letterSpacing: '0.08em', marginBottom: 6 }}>{t('Daily Restoration', 'दैनिक पुनर्स्थापना')}</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#2d2520', margin: 0, lineHeight: 1.2 }}>
              {t("Today's 5 Choices", 'आज के ५ चुनाव')}
            </h1>
            <p style={{ fontSize: 13, color: '#7a6e66', marginTop: 10, maxWidth: 320, lineHeight: 1.6 }}>
              {t('Short, clear, safe decisions ground the mind today.', 'छोटे, स्पष्ट, और सुरक्षित निर्णय मन को स्थिरता देते हैं।')}
            </p>
          </div>

          {/* Right: info cards */}
          <div className="flex w-full min-w-0 flex-col gap-2.5 sm:w-auto sm:min-w-[200px]">
            {[
              { icon: '✦', label: t('Today', 'आज का दिन'), value: `${t('Day', 'दिन')} ${dayCount}` },
              { icon: '○', label: t('Done', 'पूरा हुआ'),   value: `${done ? 5 : step}/5` },
              { icon: '◎', label: t('Tier', 'स्तर'),      value: `${t('Tier', 'स्तर')} ${tier}` },
            ].map(card => (
              <div
                key={card.label}
                className="flex min-w-0 items-center gap-3 rounded-xl bg-white py-2.5 pl-3 pr-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:min-w-[190px]"
              >
                <span style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#fff0f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: 'var(--mood-accent, #e08080)', flexShrink: 0,
                }}>{card.icon}</span>
                <div>
                  <p style={{ fontSize: 10, color: '#9a8e84', margin: 0, letterSpacing: '0.06em' }}>{card.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#2d2520', margin: 0 }}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main interaction row */}
      <div
        className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-stretch"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {/* Left: quiz card — same outer size, denser, larger inner content */}
        <div
          className="relative flex min-h-[280px] flex-col items-stretch rounded-[20px] bg-card p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] sm:min-h-[300px] sm:p-5 sm:pb-7 md:px-7"
          style={{ background: 'var(--card, #fff)' }}
        >
          {/* Step dots — compact strip */}
          <div
            className={pulse ? 'dots-pulse' : ''}
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="progress-dot"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: i < step ? 'var(--mood-accent, #e08080)' : '#ebe4dc',
                  transition: 'background 400ms, transform 200ms',
                }}
              />
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
            {!done ? (
              <div key={current.id} className={sliding ? 'slide-exit' : 'slide-enter'}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#8a7d72',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    margin: '0 0 10px',
                  }}
                >
                  {current.category}
                </p>
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                    fontWeight: 500,
                    color: '#2d2520',
                    margin: '0 0 1.1rem',
                    lineHeight: 1.45,
                    maxWidth: '42ch',
                  }}
                >
                  {current.question}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: current.type === 'colors' ? 14 : 12,
                    alignItems: 'center',
                  }}
                >
                  {current.type === 'colors' &&
                    MOOD_PALETTE.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        title={c.value}
                        onClick={() => submit(c.value)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.06)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                        }}
                        style={{
                          width: 68,
                          height: 68,
                          borderRadius: 16,
                          border: '2px solid rgba(255,255,255,0.85)',
                          background: c.hex,
                          cursor: 'pointer',
                          transition: 'transform 160ms ease, box-shadow 160ms ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          flexShrink: 0,
                        }}
                      />
                    ))}

                  {current.type === 'options' &&
                    current.options?.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => submit(opt.value)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--mood-accent, #c9a08a)';
                          e.currentTarget.style.background = '#fffdfb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e8e2dc';
                          e.currentTarget.style.background = '#fff';
                        }}
                        style={{
                          padding: '0.95rem 1.5rem',
                          borderRadius: 999,
                          border: '1.5px solid #e8e2dc',
                          background: '#fff',
                          color: '#3d3530',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 16,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'border-color 200ms, background 200ms',
                          lineHeight: 1.35,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}

                  {current.type === 'text' && (
                    <div style={{ width: '100%' }}>
                      <input
                        type="text"
                        value={textVal}
                        onChange={(e) => setTextVal(e.target.value)}
                        placeholder={current.placeholder}
                        onKeyDown={(e) => e.key === 'Enter' && textVal.trim() && submit(textVal.trim())}
                        style={{
                          width: '100%',
                          padding: '1rem 1.25rem',
                          borderRadius: 14,
                          border: '1.5px solid #e0d8d0',
                          background: '#fdfbf9',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 17,
                          outline: 'none',
                          color: '#2d2520',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => textVal.trim() && submit(textVal.trim())}
                        disabled={!textVal.trim()}
                        style={{
                          marginTop: 12,
                          padding: '0.7rem 1.6rem',
                          borderRadius: 999,
                          border: 'none',
                          background: textVal.trim() ? 'var(--mood-accent, #e08080)' : '#e8e2dc',
                          color: textVal.trim() ? '#fff' : '#9a8e84',
                          cursor: textVal.trim() ? 'pointer' : 'not-allowed',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 15,
                          fontWeight: 600,
                          transition: 'background 200ms',
                        }}
                      >
                        {t('Next →', 'आगे →')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="slide-enter" style={{ textAlign: 'center', padding: '0.5rem 0 0' }}>
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                    color: 'var(--mood-accent, #e08080)',
                    lineHeight: 1.5,
                    margin: '0 0 14px',
                  }}
                >
                  {t('5 Decisions. Yours. Today.', '५ निर्णय। आपके। आज।')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 99,
                        background: 'var(--mood-accent, #e08080)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Why panel — aligned height, slightly larger type */}
        <div
          className="flex min-h-[240px] flex-col justify-start rounded-[20px] bg-card p-4 shadow-[0_2px_16px_rgba(0,0,0,0.07)] sm:min-h-[300px] sm:p-5 md:px-6"
          style={{ background: 'var(--card, #fff)' }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: '#8a7d72', letterSpacing: '0.1em', marginBottom: 10 }}>
            {t('Why this?', 'ऐसा क्यों?')}
          </p>
          <p style={{ fontSize: 15, color: '#4a4039', lineHeight: 1.7, margin: 0 }}>
            {done
              ? t(
                  'You made 5 decisions today. This small sequence gives your mind stability.',
                  'आपने आज ५ निर्णय लिए। यह छोटा सा क्रम आपके मन को स्थिरता देता है।',
                )
              : current.why ?? t('One decision at a time reduces pressure.', 'एक समय में एक निर्णय दबाव को कम करता है।')}
          </p>
          {!done && (
            <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'linear-gradient(180deg, #fdf9f6 0%, #faf6f2 100%)', borderRadius: 12, border: '1px solid #f0e8e0' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#a8988c', letterSpacing: '0.08em', marginBottom: 8 }}>{t("Today's path", 'आज का रास्ता')}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 6,
                        flex: 1,
                        borderRadius: 99,
                        background: i < step ? 'var(--mood-accent, #e08080)' : '#ebe4dc',
                        transition: 'background 400ms',
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#6b5f56', marginTop: 10 }}>
                  {step} / 5 {t('done', 'पूरा हुआ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <AgencyTrail />
      </div>
    </>
  );
};

export default TodayScreen;
