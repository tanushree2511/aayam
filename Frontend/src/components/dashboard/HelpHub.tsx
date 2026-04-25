import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageSquare, BookOpen, Scale, Heart } from 'lucide-react';
import CaseTrackerPage from '@/components/dashboard/CaseTrackerPage';
import LegalRights from '@/components/dashboard/LegalRights';
import SafetyPlanning from '@/components/dashboard/SafetyPlanning';
import TherapistConnect from '@/components/dashboard/TherapistConnect';

const SMS_BODY_NE =
  'नमस्ते, मुझे बात करनी है। कृपया जब आप कर सकें तो मुझसे संपर्क करें।';
const SMS_BODY_EN = 'Hello, I need someone to contact me when you can.';

const HelpHub = () => {
  const { t, language } = useLanguage();
  const smsBody = language === 'hi' ? SMS_BODY_NE : SMS_BODY_EN;
  const smsHref = `sms:?body=${encodeURIComponent(smsBody)}`;

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t('Help', 'मदद')}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foreground">
          {t('Support & resources', 'समर्थन और संसाधन')}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          {t(
            'Crisis options, people who can help, and legal information — in one place. Open only what you need.',
            'संकट के विकल्प, मदद करने वाले लोग, और कानूनी जानकारी — एक ही स्थान पर। केवल वही खोलें जिसकी आपको आवश्यकता है।',
          )}
        </p>
      </div>

      {/* Tier 1 — immediate */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
          <Phone className="h-5 w-5 text-primary" />
          {t('In the next few minutes', 'अगले कुछ मिनटों में')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border-destructive/20 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("Women's helpline", 'महिला हेल्पलाइन')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-2xl font-bold tracking-wide text-primary">1145</p>
              <p className="text-sm text-muted-foreground">
                {t('Free, confidential support in Nepal.', 'भारत में निःशुल्क, गोपनीय समर्थन।')}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('Quick message to someone you trust', 'अपने किसी भरोसेमंद व्यक्ति को त्वरित संदेश')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  'Opens your SMS app with a short Nepali line. You approve before sending. Works on 2G.',
                  'एक छोटी लाइन के साथ आपका SMS ऐप खोलता है। भेजने से पहले आप अनुमोदन करते हैं। 2G पर भी काम करता है।',
                )}
              </p>
              <Button asChild className="btn-hero w-full rounded-full">
                <a href={smsHref}>{t('Prepare SMS', 'SMS तैयार करें')}</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card className="rounded-2xl border-border/50 bg-muted/30">
          <CardContent className="flex flex-wrap items-start gap-3 p-5">
            <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                {t('Shelter & local help', 'आश्रय और स्थानीय मदद')}
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t(
                  'Your district (from signup) can be used to show nearby NGO partners — directory data is supplied by your organization.',
                  'पास के NGO भागीदारों को दिखाने के लिए आपके ज़िले (साइनअप से) का उपयोग किया जा सकता है — निर्देशिका डेटा आपके संगठन द्वारा प्रदान किया जाता है।',
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tier 2 — counselors */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
          <Heart className="h-5 w-5 text-primary" />
          {t('Counselors & NGO match', 'परामर्शदाता और NGO मिलान')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(
            'Filter by language, woman counselor preference, and how you want to connect. Requests go to a coordinator.',
            'भाषा, महिला परामर्शदाता प्राथमिकता, और आप कैसे जुड़ना चाहते हैं, के आधार पर फ़िल्टर करें। अनुरोध एक समन्वयक के पास जाते हैं।',
          )}
        </p>
        <TherapistConnect />
      </section>

      {/* Tier 3 — legal audio / rights */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          {t('Know your rights (plain language)', 'अपने अधिकार जानें (सरल भाषा में)')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(
            'Short explainers and stages of the process — written to be useful, not intimidating.',
            'प्रक्रिया के छोटे स्पष्टीकरण और चरण — उपयोगी होने के लिए लिखे गए हैं, डराने के लिए नहीं।',
          )}
        </p>
        <LegalRights />
      </section>

      {/* DV / legal module — “if something specific” */}
      <section className="space-y-4 rounded-[2rem] border border-primary/15 bg-gradient-to-b from-card to-muted/20 p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
          <Scale className="h-5 w-5 text-primary" />
          {t('If something specific is happening', 'अगर कुछ विशेष हो रहा है')}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(
            'Case tracker (timeline with notes on each step) and safety planning — for when you are ready.',
            'केस ट्रैकर (प्रत्येक चरण पर नोट्स के साथ टाइमलाइन) और सुरक्षा नियोजन — जब आप तैयार हों।',
          )}
        </p>
        <div className="space-y-10 pt-4">
          <CaseTrackerPage variant="embedded" />
          <div className="border-t border-border/60 pt-10">
            <SafetyPlanning />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpHub;
