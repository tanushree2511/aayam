import { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import {
  loadAgencyDots,
  computePresenceStreak,
  getTierFromJourney,
  pointOnMeander,
  dotSizePx,
  buildWeeklyMirror,
  getJourneyDayCount,
} from '@/lib/journeyStorage';
import { Mountain } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

const AgencyTrail = () => {
  const { t } = useLanguage();
  const [dots, setDots] = useState(loadAgencyDots);

  useEffect(() => {
    const refresh = () => setDots(loadAgencyDots());
    window.addEventListener('storage', refresh);
    window.addEventListener('agency-dots-changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('agency-dots-changed', refresh);
    };
  }, []);

  const total = dots.length;
  const streak = useMemo(() => computePresenceStreak(dots), [dots]);
  const tier = getTierFromJourney();
  const dayCount = getJourneyDayCount();
  const mirror = useMemo(() => buildWeeklyMirror(dots, t), [dots, t]);

  const positions = useMemo(() => {
    const n = dots.length;
    if (n === 0) return [];
    return dots.map((d, i) => {
      const tParam = n === 1 ? 0.5 : i / (n - 1);
      const [x, y] = pointOnMeander(tParam);
      const jitter = ((i * 7) % 5) - 2;
      return {
        dot: d,
        left: Math.max(2, Math.min(98, x + jitter * 0.4)),
        top: Math.max(2, Math.min(98, y + jitter * 0.35)),
        size: dotSizePx(d.choiceId),
      };
    });
  }, [dots]);

  const showArchaeology = dayCount >= 60;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 pb-12 md:pb-16">
      <PageHeader
        eyebrow={t('My journey', 'मेरी यात्रा')}
        title={t('The agency trail', 'एजेंसी ट्रेल')}
        description={t(
          'A record of presence — not progress, not targets. Each small dot is a choice you made.',
          'उपस्थिति का एक रिकॉर्ड — प्रगति नहीं, लक्ष्य नहीं। हर छोटा बिंदु आपके द्वारा किया गया एक चुनाव है।',
        )}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: t('Decisions recorded', 'रिकॉर्ड किए गए निर्णय'),
            value: String(total),
          },
          {
            label: t('Days of presence (streak)', 'उपस्थिति के दिन (लगातार)'),
            value: String(streak),
          },
          {
            label: t('Current tier', 'वर्तमान स्तर'),
            value: `${t('Tier', 'स्तर')} ${tier}`,
          },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50 bg-card/90 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden rounded-[1.75rem] border-primary/15 bg-gradient-to-br from-card to-sage-light/30 shadow-[var(--shadow-soft)]">
        <CardContent className="p-6 md:p-8">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Mountain className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t('This week', 'इस हफ़्ते')}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90 md:text-base">{mirror}</p>
        </CardContent>
      </Card>

      <div className="relative min-h-[320px] w-full overflow-hidden rounded-[2rem] border border-border/40 bg-gradient-to-br from-muted/40 via-background to-sage-light/20 shadow-inner md:min-h-[420px]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <path
            d="M 6 94 Q 20 80 30 72 T 52 38 T 88 8 L 94 5"
            fill="none"
            stroke="hsl(var(--primary) / 0.35)"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {positions.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="max-w-sm text-sm text-muted-foreground">
              {t(
                'Your trail will grow as you complete the five choices on Today. Nothing to measure — only to witness.',
                'आज पृष्ठ पर पाँच विकल्पों को पूरा करने के साथ-साथ आपका रास्ता बढ़ेगा। मापने के लिए कुछ नहीं — केवल देखने के लिए।',
              )}
            </p>
          </div>
        ) : (
          positions.map(({ dot, left, top, size }, idx) => (
            <span
              key={`${dot.ts}-${idx}`}
              title={dot.choiceId}
              className="absolute rounded-full shadow-sm ring-1 ring-white/60"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--mood-accent, hsl(var(--primary)))',
                opacity: 0.78 + (dot.tier - 1) * 0.09,
              }}
            />
          ))
        )}
      </div>

      {showArchaeology && (
        <Card className="rounded-[1.75rem] border-terracotta/25 bg-terracotta-light/30">
          <CardContent className="space-y-4 p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {t('Strength archaeology', 'शक्ति का पुरातत्व')}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                'Each week, one gentle voice prompt (before — during — now). Your words stay private in your document; only engagement patterns may inform support.',
                'प्रत्येक सप्ताह, एक सौम्य आवाज़ संकेत (पहले — दौरान — अब)। आपके शब्द आपके दस्तावेज़ में निजी रहते हैं; केवल जुड़ाव पैटर्न समर्थन को सूचित कर सकते हैं।',
              )}
            </p>
            <ul className="space-y-3 text-sm text-foreground/90">
              <li className="rounded-xl bg-background/80 p-4 border border-border/50">
                {t('Week 1 — Before: What did you believe about yourself then?', 'सप्ताह 1 — पहले: तब आप अपने बारे में क्या मानते थे?')}
              </li>
              <li className="rounded-xl bg-background/80 p-4 border border-border/50">
                {t('Week 2 — During: What did you do to endure?', 'सप्ताह 2 — दौरान: सहने के लिए आपने क्या किया?')}
              </li>
              <li className="rounded-xl bg-background/80 p-4 border border-border/50">
                {t('Week 3 — Now: What do you want the next-you to remember?', 'सप्ताह 3 — अब: आप क्या चाहते हैं कि अगला-आप याद रखे?')}
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgencyTrail;
