import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import avatarSrc from '@/assets/sangai-avatar.png';

const LP = {
  bg: '#FBF8F4',
  barBg: '#FDF0EB',
  border: '#E8C9B0',
  terracotta: '#C84B31',
  terracottaHover: '#A83D27',
  text: '#1a1410',
  muted: '#6B5B4E',
  mutedBadge: '#9B8B80',
  quoteAttribution: '#E8A87C',
} as const;

const LandingPage = () => {
  const { t, language } = useLanguage();

  return (
    <div
      className="landing-public min-h-screen"
      lang={language === 'hi' ? 'hi' : 'en'}
      style={{
        background: LP.bg,
        fontFamily: "'DM Sans', sans-serif",
        color: LP.text,
      }}
    >
      <style>{`
        @keyframes landing-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .landing-public .landing-avatar-float {
          animation: landing-float 4s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      {/* Section 1 — Hero */}
      <section
        className="flex min-h-[100dvh] flex-col"
        style={{ background: LP.bg }}
      >
        <div
          style={{
            background: LP.barBg,
            borderBottom: `0.5px solid ${LP.border}`,
            padding: '10px 24px',
            textAlign: 'center',
            fontSize: 13,
            color: LP.terracotta,
          }}
        >
          {t(
            'Built for Indian Women · भारतीय महिलाओं के लिए निर्मित',
            'भारतीय महिलाओं के लिए निर्मित · Built for Indian Women',
          )}
        </div>

        <div className="flex flex-1 flex-col px-6" style={{ paddingTop: 64 }}>
          <div className="mx-auto w-full max-w-[640px] text-center">
            <span
              className="inline-block"
              style={{
                background: 'white',
                border: `0.5px solid ${LP.border}`,
                borderRadius: 20,
                padding: '6px 18px',
                fontSize: 12,
                color: LP.muted,
                marginBottom: 32,
              }}
            >
              {t('Together — साथ में', 'साथ में — Together')}
            </span>

            <h1
              className="font-display mx-auto max-w-[640px] text-center font-normal"
              style={{
                fontSize: 'clamp(2.25rem, 6vw, 56px)',
                lineHeight: 1.15,
                color: LP.text,
                margin: 0,
              }}
            >
              {t("You're not", 'आप अकेली')}
              <br />
              {t('alone.', 'नहीं हैं।')}
            </h1>

            <p
              className="mx-auto max-w-[480px] text-center"
              style={{
                fontSize: 18,
                color: LP.muted,
                lineHeight: 1.7,
                margin: '16px auto 0',
              }}
            >
              {t(
                'A warm companion for Indian women — in your language, at your pace, without judgment.',
                'भारतीय महिलाओं के लिए एक स्नेही साथी — आपकी भाषा में, आपकी गति से, बिना किसी फैसले के।',
              )}
            </p>

            <p
              className="text-center"
              style={{
                fontSize: 14,
                color: LP.terracotta,
                fontStyle: 'italic',
                marginTop: 8,
              }}
            >
              {t('Not a doctor. Not a lawyer. Just — a friend.', 'न डॉक्टर। न वकील। बस — एक दोस्त।')}
            </p>

            <div className="flex flex-wrap justify-center" style={{ marginTop: 36, gap: 12 }}>
              <Link
                to="/auth"
                className="inline-block text-center transition-colors"
                style={{
                  background: LP.terracotta,
                  color: 'white',
                  borderRadius: 50,
                  padding: '15px 36px',
                  fontSize: 15,
                  border: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = LP.terracottaHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = LP.terracotta;
                }}
              >
                {t('Get Started → — शुरू करें', 'शुरू करें — Get Started →')}
              </Link>
              <a
                href="#landing-reality"
                className="inline-block text-center transition-colors"
                style={{
                  background: 'transparent',
                  border: `1.5px solid ${LP.terracotta}`,
                  color: LP.terracotta,
                  borderRadius: 50,
                  padding: '15px 28px',
                  fontSize: 15,
                  textDecoration: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FDF0EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {t('Learn More', 'और जानें')}
              </a>
            </div>

            <div
              className="flex flex-wrap justify-center"
              style={{ marginTop: 20, gap: 28 }}
            >
              {[
                ['Private by design', 'गोपनीय डिज़ाइन'],
                ['Built for India', 'भारत के लिए निर्मित'],
                ['Warm, not clinical', 'स्नेही, औपचारिक नहीं'],
              ].map(([en, hi]) => (
                <div
                  key={en}
                  className="flex items-center"
                  style={{ fontSize: 12, color: LP.muted, gap: 6 }}
                >
                  <span
                    className="shrink-0 rounded-full"
                    style={{ width: 6, height: 6, background: LP.terracotta }}
                    aria-hidden
                  />
                  {t(en, hi)}
                </div>
              ))}
            </div>
          </div>

          {/* Avatar centerpiece */}
          <div
            className="relative mx-auto flex w-full max-w-full justify-center overflow-hidden"
            style={{ marginTop: 48, minHeight: 480, alignItems: 'flex-end' }}
          >
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-0 -translate-x-1/2 rounded-full"
              style={{
                width: 500,
                height: 500,
                maxWidth: '90vw',
                maxHeight: '90vw',
                background: '#FDF0EB',
              }}
              aria-hidden
            />
            <div className="relative z-[1] flex w-full flex-col items-center">
              <img
                src={avatarSrc}
                alt=""
                className="landing-avatar-float relative z-[1] mx-auto block"
                style={{
                  height: 520,
                  maxHeight: '70vh',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  objectPosition: 'bottom',
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Stats */}
      <section
        id="landing-reality"
        className="scroll-mt-[var(--nav-offset)]"
        style={{ padding: '64px 24px', background: 'white' }}
      >
        <p
          className="text-center"
          style={{
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: LP.terracotta,
          }}
        >
          {t('THE REALITY', 'वास्तविकता')}
        </p>
        <h2
          className="font-display mx-auto text-center font-normal"
          style={{
            fontSize: 34,
            color: LP.text,
            marginTop: 12,
            maxWidth: 560,
          }}
        >
          {t('Why Mitra exists.', 'मित्र क्यों मौजूद है।')}
        </h2>

        <div
          className="mx-auto flex max-w-[860px] flex-col md:flex-row"
          style={{ marginTop: 48, gap: 16 }}
        >
          <div
            className="flex-1 text-center"
            style={{
              background: LP.bg,
              border: `0.5px solid ${LP.border}`,
              borderRadius: 20,
              padding: '32px 24px',
            }}
          >
            <p className="font-display font-normal" style={{ fontSize: 48, color: LP.terracotta, margin: 0 }}>
              30%
            </p>
            <p style={{ fontSize: 13, color: LP.muted, marginTop: 4 }}>
              {t('of Indian women', 'भारतीय महिलाओं में से')}
            </p>
            <p style={{ fontSize: 12, color: LP.muted, marginTop: 4, opacity: 0.9 }}>
              {t('experience domestic violence', 'घरेलू हिंसा का अनुभव करती हैं')}
            </p>
            <span
              className="inline-block"
              style={{
                background: '#FDF0EB',
                borderRadius: 10,
                padding: '3px 10px',
                fontSize: 10,
                color: LP.terracotta,
                marginTop: 12,
              }}
            >
              NFHS-5 India, 2021
            </span>
          </div>

          <div
            className="flex-1 text-center"
            style={{
              background: LP.bg,
              border: `0.5px solid ${LP.border}`,
              borderRadius: 20,
              padding: '32px 24px',
            }}
          >
            <p className="font-display font-normal leading-none" style={{ margin: 0, color: LP.terracotta }}>
              <span style={{ fontSize: 48 }}>3.5</span>
              <span style={{ fontSize: 20 }}> {t('yrs', 'वर्ष')}</span>
            </p>
            <p style={{ fontSize: 13, color: LP.muted, marginTop: 8 }}>
              {t('average court wait', 'औसत अदालती प्रतीक्षा')}
            </p>
            <p style={{ fontSize: 12, color: LP.muted, marginTop: 4, opacity: 0.9 }}>
              {t('with zero mental health support', 'बिना किसी मानसिक स्वास्थ्य सहायता के')}
            </p>
            <span
              className="inline-block"
              style={{
                background: '#FDF0EB',
                borderRadius: 10,
                padding: '3px 10px',
                fontSize: 10,
                color: LP.terracotta,
                marginTop: 12,
              }}
            >
              National Judicial Data
            </span>
          </div>

          <div
            className="flex-1 text-center"
            style={{
              background: LP.bg,
              border: `0.5px solid ${LP.border}`,
              borderRadius: 20,
              padding: '32px 24px',
            }}
          >
            <p className="font-display font-normal leading-none" style={{ margin: 0, color: LP.terracotta }}>
              <span style={{ fontSize: 48 }}>0.75</span>
              <span style={{ fontSize: 14 }}> {t('per 100K', 'प्रति १ लाख')}</span>
            </p>
            <p style={{ fontSize: 13, color: LP.muted, marginTop: 8 }}>
              {t('psychiatrists in India', 'भारत में मनोचिकित्सक')}
            </p>
            <p style={{ fontSize: 12, color: LP.muted, marginTop: 4, opacity: 0.9 }}>
              {t('the support gap is real and systemic', 'सहायता की कमी वास्तविक और प्रणालीगत है')}
            </p>
            <span
              className="inline-block"
              style={{
                background: '#FDF0EB',
                borderRadius: 10,
                padding: '3px 10px',
                fontSize: 10,
                color: LP.terracotta,
                marginTop: 12,
              }}
            >
              WHO, 2023
            </span>
          </div>
        </div>
      </section>

      {/* Section 3 — What Sangai does */}
      <section id="landing-inside" style={{ padding: '80px 24px', background: LP.bg }}>
        <div className="mx-auto max-w-[900px]">
          <p
            className="text-center"
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: LP.terracotta,
            }}
          >
            {t('INSIDE MITRA', 'मित्र के अंदर')}
          </p>
          <h2
            className="font-display text-center font-normal"
            style={{ fontSize: 36, color: LP.text, marginTop: 12 }}
          >
            {t("Everything she needs. Nothing she doesn't.", 'उसे जो कुछ भी चाहिए। अनावश्यक कुछ नहीं।')}
          </h2>

          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            style={{ marginTop: 48, gap: 16 }}
          >
            <article
              style={{
                background: 'white',
                border: `0.5px solid ${LP.border}`,
                borderRadius: 16,
                padding: '28px 24px',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: '#FDF0EB' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
                  {Array.from({ length: 9 }, (_, i) => (
                    <rect
                      key={i}
                      x={2 + (i % 3) * 6}
                      y={2 + Math.floor(i / 3) * 6}
                      width="4"
                      height="4"
                      rx="0.5"
                      fill={LP.terracotta}
                    />
                  ))}
                </svg>
              </div>
              <h3 className="font-medium" style={{ fontSize: 15, color: LP.text }}>
                {t('Five daily choices', '५ दैनिक विकल्प')}
              </h3>
              <p style={{ fontSize: 13, color: LP.muted, lineHeight: 1.6, marginTop: 8 }}>
                {t(
                  'Five micro-choices daily that rebuild your sense of agency — backed by clinical research.',
                  'हर दिन पांच छोटे विकल्प जो आपकी क्षमता को फिर से बनाते हैं — क्लिनिकल शोध द्वारा समर्थित।',
                )}
              </p>
            </article>

            <article
              style={{
                background: 'white',
                border: `0.5px solid ${LP.border}`,
                borderRadius: 16,
                padding: '28px 24px',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: '#E1F5EE' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.5" aria-hidden>
                  <path d="M4 10c0-3 2.5-5 8-5s8 2 8 5v6c0 3-2.5 5-8 5s-8-2-8-5v-6z" />
                  <path d="M8 14h.01M12 14h.01M16 14h.01" />
                </svg>
              </div>
              <h3 className="font-medium" style={{ fontSize: 15, color: LP.text }}>
                {t('Mitra Chat', 'मित्र चैट')}
              </h3>
              <p style={{ fontSize: 13, color: LP.muted, lineHeight: 1.6, marginTop: 8 }}>
                {t(
                  'A warm companion who speaks colloquial Hindi, listens first, and never judges.',
                  'एक स्नेही साथी जो आम हिंदी बोलती हैं, पहले सुनती हैं, और कभी फैसला नहीं सुनातीं।',
                )}
              </p>
            </article>

            <article
              style={{
                background: 'white',
                border: `0.5px solid ${LP.border}`,
                borderRadius: 16,
                padding: '28px 24px',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: '#FAEEDA' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="1.5" aria-hidden>
                  <path d="M12 3l8 4v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
                </svg>
              </div>
              <h3 className="font-medium" style={{ fontSize: 15, color: LP.text }}>
                {t('Safety Planning', 'सुरक्षा योजना')}
              </h3>
              <p style={{ fontSize: 13, color: LP.muted, lineHeight: 1.6, marginTop: 8 }}>
                {t(
                  'Practical steps for safety — not clinical, but real and immediately useful.',
                  'सुरक्षा के लिए व्यावहारिक कदम — औपचारिक नहीं, बल्कि वास्तविक और तुरंत उपयोगी।',
                )}
              </p>
            </article>

            <article
              style={{
                background: 'white',
                border: `0.5px solid ${LP.border}`,
                borderRadius: 16,
                padding: '28px 24px',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: '#E6F1FB' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" aria-hidden>
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              </div>
              <h3 className="font-medium" style={{ fontSize: 15, color: LP.text }}>
                {t('Legal Rights', 'कानूनी अधिकार')}
              </h3>
              <p style={{ fontSize: 13, color: LP.muted, lineHeight: 1.6, marginTop: 8 }}>
                {t(
                  "Your rights under India's Domestic Violence Act — in plain Hindi, not legal jargon.",
                  'घरेलू हिंसा अधिनियम के तहत आपके अधिकार — सरल हिंदी में, कानूनी शब्दों के बिना।',
                )}
              </p>
            </article>

            <article
              style={{
                background: 'white',
                border: `0.5px solid ${LP.border}`,
                borderRadius: 16,
                padding: '28px 24px',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: '#FCEBEB' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="1.5" aria-hidden>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-1a6 6 0 0112 0v1" />
                </svg>
              </div>
              <h3 className="font-medium" style={{ fontSize: 15, color: LP.text }}>
                {t('NGO & Therapist', 'एनजीओ और थेरेपिस्ट')}
              </h3>
              <p style={{ fontSize: 13, color: LP.muted, lineHeight: 1.6, marginTop: 8 }}>
                {t(
                  'Connect with verified NGOs and mental health professionals in your district.',
                  'अपने जिले में सत्यापित एनजीओ और मानसिक स्वास्थ्य पेशेवरों से जुड़ें।',
                )}
              </p>
            </article>

            <article
              style={{
                background: 'white',
                border: `0.5px solid ${LP.border}`,
                borderRadius: 16,
                padding: '28px 24px',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px]"
                style={{ background: '#EEEDFE' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.5" aria-hidden>
                  <path d="M3 12h4l2 7 4-14 2 7h5" />
                </svg>
              </div>
              <h3 className="font-medium" style={{ fontSize: 15, color: LP.text }}>
                {t('Early Detection', 'प्रारंभिक पहचान')}
              </h3>
              <p style={{ fontSize: 13, color: LP.muted, lineHeight: 1.6, marginTop: 8 }}>
                {t(
                  'Behavioral AI that notices when you need support — before you can name it yourself.',
                  'व्यवहार संबंधी एआई जो आपको सहायता की आवश्यकता होने पर पहचान लेता है — इससे पहले कि आप खुद इसे बता सकें।',
                )}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Section 4 — Dark quote */}
      <section style={{ padding: '80px 24px', background: LP.text }}>
        <div className="mx-auto max-w-[640px] text-center">
          <span className="font-display block" style={{ fontSize: 72, color: LP.terracotta, lineHeight: 0.6, marginBottom: 24 }}>
            &ldquo;
          </span>
          <blockquote
            className="font-display font-normal"
            style={{ fontSize: 26, color: 'white', lineHeight: 1.65, margin: 0 }}
          >
            {t(
              "She didn't come because she identified herself as someone who needs mental health help. She came because she just wanted someone to talk to.",
              'वह इसलिए नहीं आई क्योंकि उसने खुद को ऐसे व्यक्ति के रूप में पहचाना जिसे मानसिक स्वास्थ्य सहायता की आवश्यकता है। वह इसलिए आई क्योंकि उसे बस बात करने के लिए कोई चाहिए था।',
            )}
          </blockquote>
          <p style={{ fontSize: 13, color: LP.quoteAttribution, marginTop: 24 }}>
            {t('— The design principle behind Mitra', '— मित्र का डिज़ाइन सिद्धांत')}
          </p>
        </div>
      </section>

      {/* Section 5 — Final CTA + footer */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div className="mx-auto max-w-[520px] text-center">
          <img
            src={avatarSrc}
            alt=""
            className="landing-avatar-float mx-auto block"
            style={{
              height: 140,
              objectFit: 'contain',
              objectPosition: 'top',
              marginBottom: 28,
            }}
            draggable={false}
          />
          <h2 className="font-display font-normal" style={{ fontSize: 38, color: LP.text }}>
            {t('Ready?', 'तैयार हैं?')}
          </h2>
          <p style={{ fontSize: 16, color: LP.muted, marginTop: 8 }}>
            {t('Ready when you are. No pressure.', 'जब आप तैयार हों। कोई दबाव नहीं।')}
          </p>
          <p style={{ fontSize: 13, color: LP.terracotta, marginTop: 4, fontStyle: 'italic' }}>
            {t(
              'Anonymous entry available — no real name required.',
              'गुमनाम प्रवेश उपलब्ध — असली नाम की आवश्यकता नहीं।',
            )}
          </p>
          <div className="flex justify-center" style={{ marginTop: 32 }}>
            <Link
              to="/auth"
              className="inline-block text-center transition-colors"
              style={{
                background: LP.terracotta,
                color: 'white',
                borderRadius: 50,
                padding: '15px 36px',
                fontSize: 15,
                border: 'none',
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = LP.terracottaHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = LP.terracotta;
              }}
            >
              {t('Begin → — शुरू करें', 'शुरू करें — Begin →')}
            </Link>
          </div>
          <div
            className="flex flex-wrap justify-center"
            style={{ marginTop: 16, gap: 20, fontSize: 11, color: LP.mutedBadge }}
          >
            <span>{t('Free to use', 'मुफ़्त')}</span>
            <span aria-hidden>·</span>
            <span>{t('Works in Hindi', 'हिंदी में काम करता है')}</span>
            <span aria-hidden>·</span>
            <span>{t('Private by design', 'गोपनीय डिज़ाइन')}</span>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop: `0.5px solid ${LP.border}`,
          padding: '20px 24px',
          textAlign: 'center',
          fontSize: 11,
          color: LP.mutedBadge,
          background: 'white',
        }}
      >
        {t('Mitra· Together · Made with care for India · 2026', ' मित्र · साथ में · भारत के लिए देखभाल के साथ निर्मित · २०२६')}
      </footer>
    </div>
  );
};

export default LandingPage;
