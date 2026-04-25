import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  CRISIS_LINES,
  SHELTERS,
  COUNSELORS,
  LEGAL_AUDIO_TRACKS,
  EMERGENCY_SMS_BODY,
  NEPAL_DISTRICTS,
  NEPAL_DISTRICT_SELECT_OTHER,
  NEPAL_DISTRICTS_77_SET,
  type Counselor,
  type CounselorLanguage,
  type CounselorMode,
} from '@/data/helpResources';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Building2,
  Headphones,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  UserRound,
  Volume2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import AILawyerChat from './AILawyerChat';
import { Scale, HeartHandshake } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WEEK_LABELS_NE = ['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'];

function AvailabilityStrip({ week }: { week: boolean[] }) {
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        इस सप्ताह की उपलब्धता
      </p>
      <div className="flex gap-1">
        {week.map((on, i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <span className="truncate text-[9px] text-muted-foreground">{WEEK_LABELS_NE[i]}</span>
            <div
              className={`h-2.5 w-full max-w-[36px] rounded-sm ${on ? 'bg-primary' : 'bg-muted'}`}
              title={on ? 'उपलब्ध' : '—'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function filterCounselors(
  list: Counselor[],
  lang: CounselorLanguage,
  womanPref: 'woman' | 'any',
  mode: CounselorMode,
): Counselor[] {
  return list.filter((c) => {
    if (!c.modes.includes(mode)) return false;
    if (womanPref === 'woman' && !c.isWoman) return false;
    if (lang === 'hi') {
      if (!c.languages.some((l) => l === 'hi' || l === 'hi-en')) return false;
    } else if (lang === 'hi-en') {
      if (!c.languages.includes('hi-en')) return false;
    } else {
      if (!c.languages.includes('hi-en')) return false;
    }
    return true;
  });
}

function openNativeSms(body: string) {
  const href = `sms:?body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

const TherapistConnect = () => {
  const { t, language } = useLanguage();
  const { user, updateDistrict } = useAuth();
  const district = user?.district ?? 'Kathmandu';
  const districtIsOfficial = NEPAL_DISTRICTS_77_SET.has(district);
  /** True after user picks “Other” from the dropdown while still on an official district */
  const [otherPicker, setOtherPicker] = useState(false);
  const showOtherField = !districtIsOfficial || otherPicker;
  const selectDistrictValue = showOtherField ? NEPAL_DISTRICT_SELECT_OTHER : district;
  const [districtOtherDraft, setDistrictOtherDraft] = useState(
    districtIsOfficial ? '' : district,
  );

  useEffect(() => {
    if (user?.district && !NEPAL_DISTRICTS_77_SET.has(user.district)) {
      setDistrictOtherDraft(user.district);
      setOtherPicker(false);
    }
    if (user?.district && NEPAL_DISTRICTS_77_SET.has(user.district)) {
      setDistrictOtherDraft('');
      setOtherPicker(false);
    }
  }, [user?.district]);

  const [langPref, setLangPref] = useState<CounselorLanguage>('hi');
  const [womanPref, setWomanPref] = useState<'woman' | 'any'>('any');
  const [modePref, setModePref] = useState<CounselorMode>('voice');

  const sheltersForDistrict = useMemo(() => {
    if (!district || !NEPAL_DISTRICTS_77_SET.has(district)) {
      return SHELTERS.filter((s) => ['Kathmandu', 'Lalitpur'].includes(s.district));
    }
    const exact = SHELTERS.filter((s) => s.district === district);
    if (exact.length > 0) return exact;
    return SHELTERS.filter((s) => s.district === 'Kathmandu');
  }, [district]);

  const matchedCounselors = useMemo(
    () => filterCounselors(COUNSELORS, langPref, womanPref, modePref),
    [langPref, womanPref, modePref],
  );

  const handleRequestCounselor = (c: Counselor) => {
    toast.success(
      language === 'hi'
        ? 'अनुरोध समन्वयक को भेज दिया गया है। आपका फ़ोन नंबर सीधे साझा नहीं किया गया है।'
        : 'Request sent to the NGO coordinator. Your phone number was not shared directly.',
    );
    console.log('[demo] counselor request', c.id, { district });
  };

  const ne = language === 'hi';

  return (
    <div className="space-y-8 font-sans">
      <PageHeader
        eyebrow={t('Support', 'सहयोग')}
        title={t('Resources & help', 'संसाधन और मदद')}
        description={t(
          'Three levels of support — immediate, matched counseling, and legal audio.',
          'समर्थन के तीन स्तर — तत्काल, परामर्श, और कानूनी ऑडियो।',
        )}
      />

      <Tabs defaultValue="lawyer" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="lawyer" className="data-[state=active]:bg-background rounded-lg py-3 flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="font-semibold">{t('Lawyer Consultation', 'वकील परामर्श')}</span>
          </TabsTrigger>
          <TabsTrigger value="therapist" className="data-[state=active]:bg-background rounded-lg py-3 flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            <span className="font-semibold">{t('Therapist / NGOs', 'थेरेपिस्ट / एनजीओ')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lawyer">
          <AILawyerChat />
        </TabsContent>

        <TabsContent value="therapist" className="space-y-8">
          {/* Tier 1 — Immediate */}
          <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 text-sm font-bold text-destructive">
            १
          </span>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {t('Next 10 minutes', 'अगले 10 मिनट में')}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(
            'Crisis numbers, shelters in your district, and an emergency SMS you can send on 2G — no internet required.',
            'संकटकालीन नंबर, आपके ज़िले के आश्रय, और एक आपातकालीन SMS जिसे आप 2G पर भी भेज सकते हैं — बिना इंटरनेट के।',
          )}
        </p>

        <Card className="rounded-2xl border-border/80 bg-card/90 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-primary" />
                  {t('Your district', 'आपका ज़िला')}
                </CardTitle>
                <CardDescription>
                  {t('Set once at signup — change here anytime. We never store your exact location.', 'साइनअप पर एक बार सेट करें — यहाँ से कभी भी बदलें। हम आपका सटीक स्थान कभी संग्रहीत नहीं करते हैं।')}
                </CardDescription>
              </div>
              <div className="w-full sm:w-56">
                <Label className="sr-only">District</Label>
                <Select
                  value={selectDistrictValue}
                  onValueChange={(v) => {
                    if (v === NEPAL_DISTRICT_SELECT_OTHER) {
                      setOtherPicker(true);
                      return;
                    }
                    setOtherPicker(false);
                    updateDistrict(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[min(70vh,320px)]">
                    {NEPAL_DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                    <SelectItem value={NEPAL_DISTRICT_SELECT_OTHER}>
                      {t('Other (type district name)', 'अन्य (ज़िले का नाम लिखें)')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {showOtherField ? (
                  <Input
                    className="mt-2 h-10"
                    value={districtOtherDraft}
                    onChange={(e) => setDistrictOtherDraft(e.target.value)}
                    onBlur={() => {
                      const next = districtOtherDraft.trim();
                      if (next) {
                        updateDistrict(next);
                        setOtherPicker(false);
                      }
                    }}
                    placeholder={t('Your district name', 'आपके ज़िले का नाम')}
                  />
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {t('Crisis & helpline numbers', 'संकट और हेल्पलाइन नंबर')}
              </h4>
              <div className="grid gap-2 sm:grid-cols-3">
                {CRISIS_LINES.map((line) => (
                  <a
                    key={line.id}
                    href={`tel:${line.number.replace(/-/g, '')}`}
                    className="rounded-xl border border-border/80 bg-background/80 px-3 py-3 transition-colors hover:bg-muted/50"
                  >
                    <p className="text-xs font-medium text-muted-foreground">{ne ? line.nameNe : line.nameEn}</p>
                    <p className="font-mono text-lg font-semibold text-primary">{line.number}</p>
                    <p className="text-[11px] text-muted-foreground">{ne ? line.noteNe : line.noteEn}</p>
                  </a>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                {t('Shelters & safe spaces (your district)', 'आश्रय और सुरक्षित स्थान (आपका ज़िला)')}
              </h4>
              {!NEPAL_DISTRICTS_77_SET.has(district) && (
                <p className="mb-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  {t(
                    'Showing example locations in Kathmandu valley. Set a specific district when you can.',
                    'काठमांडू घाटी में उदाहरण स्थान दिखा रहा है। जब संभव हो एक विशिष्ट ज़िला निर्धारित करें।',
                  )}
                </p>
              )}
              <ul className="space-y-2">
                {sheltersForDistrict.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm leading-snug"
                  >
                    <span className="font-medium text-foreground">{ne ? s.nameNe : s.nameEn}</span>
                    <span className="block text-muted-foreground">{s.addressNe}</span>
                    {s.phone && (
                      <a href={`tel:${s.phone}`} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <Phone className="h-3 w-3" />
                        {s.phone}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    {t('Emergency SMS to someone you trust', 'किसी भरोसेमंद व्यक्ति को आपातकालीन SMS')}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'Opens your phone’s SMS app with a short Nepali message. You choose the contact — works offline.',
                      'यह आपके फोन का SMS ऐप एक छोटे संदेश के साथ खोलता है। संपर्क आप चुनते हैं — यह ऑफ़लाइन भी काम करता है।',
                    )}
                  </p>
                  <blockquote className="mt-2 border-l-2 border-primary/40 pl-3 text-sm italic text-foreground">
                    {EMERGENCY_SMS_BODY}
                  </blockquote>
                </div>
                <Button
                  type="button"
                  className="shrink-0 gap-2 bg-primary text-primary-foreground"
                  onClick={() => openNativeSms(EMERGENCY_SMS_BODY)}
                >
                  <MessageSquare className="h-4 w-4" />
                  {t('Review & send SMS', 'समीक्षा करें और SMS भेजें')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tier 2 — Match */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            २
          </span>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {t('Counselor match', 'परामर्शदाता का मिलान')}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(
            'Answer three questions. We show NGO partners who fit — you request; the coordinator connects you without sharing your number directly.',
            'तीन सवालों के जवाब दें। हम उपयुक्त NGO भागीदारों को दिखाते हैं — आप अनुरोध करते हैं; समन्वयक सीधे आपका नंबर साझा किए बिना आपको जोड़ता है।',
          )}
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('Your preferences', 'आपकी पसंद')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('Language', 'भाषा')}</Label>
              <RadioGroup
                value={langPref}
                onValueChange={(v) => setLangPref(v as CounselorLanguage)}
                className="grid gap-2 sm:grid-cols-3"
              >
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="hi" id="l-hi" />
                  <span className="text-sm">{t('Hindi', 'हिन्दी')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="hi-en" id="l-bi" />
                  <span className="text-sm">{t('Hindi + English', 'हिन्दी + अंग्रेजी')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="other" id="l-ot" />
                  <span className="text-sm">{t('Other language need', 'अन्य भाषा चाहिए')}</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <UserRound className="h-4 w-4" />
                {t('Counselor', 'परामर्शदाता')}
              </Label>
              <RadioGroup
                value={womanPref}
                onValueChange={(v) => setWomanPref(v as 'woman' | 'any')}
                className="flex flex-wrap gap-2"
              >
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="woman" id="w-y" />
                  <span className="text-sm">{t('I prefer a woman counselor', 'मैं एक महिला परामर्शदाता पसंद करूंगी')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="any" id="w-n" />
                  <span className="text-sm">{t('No preference', 'कोई प्राथमिकता नहीं')}</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('How to connect', 'जुड़ने का तरीका')}</Label>
              <RadioGroup
                value={modePref}
                onValueChange={(v) => setModePref(v as CounselorMode)}
                className="grid gap-2 sm:grid-cols-2"
              >
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="voice" id="m-v" />
                  <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm">{t('Voice call', 'वॉयस कॉल')}</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="in-person" id="m-p" />
                  <span className="text-sm">{t('In person', 'व्यक्तिगत रूप से')}</span>
                </label>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {matchedCounselors.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                {t('No counselors match right now. Try another option or contact the NGO desk.', 'इस समय कोई उपयुक्त परामर्शदाता नहीं है। दूसरा विकल्प आज़माएं या NGO डेस्क से संपर्क करें।')}
              </CardContent>
            </Card>
          ) : (
            matchedCounselors.map((c) => (
              <Card key={c.id} className="overflow-hidden border-border/70 shadow-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-lg font-semibold text-foreground">
                        {ne ? c.nameNe : c.nameEn}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.bioNe}</p>
                      <AvailabilityStrip week={c.availabilityWeek} />
                    </div>
                    <Button className="shrink-0 gap-2 self-start sm:self-end" onClick={() => handleRequestCounselor(c)}>
                      <Shield className="h-4 w-4" />
                      {t('Request connection', 'जुड़ने का अनुरोध करें')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Tier 3 — Legal audio */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-sm font-bold text-amber-800 dark:text-amber-200">
            ३
          </span>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {t('Legal rights — audio', 'कानूनी अधिकार — ऑडियो')}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(
            'Short colloquial Nepali explainers (3–5 min) from our legal-aid NGO partner — accurate, warm, not jargon.',
            'हमारे कानूनी-सहायता NGO भागीदार से छोटे स्थानीय व्याख्या (3-5 मिनट) — सटीक, सरल, कोई कठिन शब्द नहीं।',
          )}
        </p>

        <div className="grid gap-3">
          {LEGAL_AUDIO_TRACKS.map((track) => (
            <Card key={track.id} className="border-border/70">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Headphones className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{ne ? track.titleNe : track.titleEn}</p>
                    <p className="text-xs text-muted-foreground">
                      {ne ? track.stageNe : track.stageEn} · {track.durationMin} {t('min', 'मिनट')}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{track.descriptionNe}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {track.audioUrl ? (
                    <audio controls className="h-9 max-w-[220px] sm:max-w-[280px]" preload="metadata">
                      <source src={track.audioUrl} />
                    </audio>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                      <Volume2 className="h-4 w-4 shrink-0" />
                      <span>
                        {t('Partner audio — coming to the app soon', 'भागीदार ऑडियो — जल्द ही ऐप पर आ रहा है')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t(
            'This is general information, not personal legal advice. For your case, speak with a qualified lawyer or legal aid.',
            'यह सामान्य जानकारी है, व्यक्तिगत कानूनी सलाह नहीं। अपने मामले के लिए, एक योग्य वकील या कानूनी सहायता से बात करें।',
          )}
        </p>
      </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistConnect;
