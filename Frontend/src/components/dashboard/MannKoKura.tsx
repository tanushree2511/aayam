import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Moon, Heart, Cloud, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOPICS: {
  key: string;
  icon: typeof Moon;
  titleEn: string;
  titleNe: string;
  bodyEn: string;
  bodyNe: string;
  closingEn: string;
  closingNe: string;
}[] = [
  {
    key: 'sleep',
    icon: Moon,
    titleEn: "Why can't I sleep even when I'm exhausted?",
    titleNe: 'थक जाने पर भी नींद क्यों नहीं आती?',
    bodyEn:
      'When the body is tired but the mind will not rest, it is often because something inside still needs to be heard. That is not weakness — it is how stress lives in the body.',
    bodyNe:
      'जब शरीर थका हुआ हो लेकिन मन शांत न हो, तो अक्सर इसका मतलब होता है कि अंदर कुछ ऐसा है जिसे सुना जाना बाकी है। यह कमजोरी नहीं है — इसी तरह तनाव शरीर में रहता है।',
    closingEn: 'This is not your weakness. This is the human mind.',
    closingNe: 'यह आपकी कमजोरी नहीं है। यह मानव मन है।',
  },
  {
    key: 'anger',
    icon: Wind,
    titleEn: 'Why do I feel angry all the time and I do not know why?',
    titleNe: 'मुझे हमेशा गुस्सा क्यों आता है और मुझे कारण भी पता नहीं होता?',
    bodyEn:
      'Anger often sits on top of fear or grief. In families where feelings are not named, anger becomes the only feeling that is allowed out.',
    bodyNe:
      'गुस्सा अक्सर डर या दुःख के ऊपर बैठा होता है। जिन परिवारों में भावनाओं को नाम नहीं दिया जाता, वहां गुस्सा ही एकमात्र भावना बन जाती है जिसे बाहर निकलने की अनुमति होती है।',
    closingEn: 'This is not your weakness. This is the human mind.',
    closingNe: 'यह आपकी कमजोरी नहीं है। यह मानव मन है।',
  },
  {
    key: 'chest',
    icon: Heart,
    titleEn: 'Why does my chest feel tight for no reason?',
    titleNe: 'बिना किसी कारण के मेरी छाती में जकड़न क्यों महसूस होती है?',
    bodyEn:
      'Tight chest, headache, and heaviness are common ways anxiety shows up when there are no words for it yet. Many women feel this first in the body.',
    bodyNe:
      'छाती में जकड़न, सिरदर्द, और भारीपन — जब शब्दों में बयां नहीं कर सकते, तो शरीर चिंता को इस तरह दिखाता है। कई महिलाएं इसे सबसे पहले शरीर में महसूस करती हैं।',
    closingEn: 'This is not your weakness. This is the human mind.',
    closingNe: 'यह आपकी कमजोरी नहीं है। यह मानव मन है।',
  },
  {
    key: 'empty',
    icon: Cloud,
    titleEn: 'Why do I feel empty when everything looks fine on the outside?',
    titleNe: 'जब बाहर सब कुछ ठीक दिखता है तो मुझे खालीपन क्यों महसूस होता है?',
    bodyEn:
      'You can be safe on paper and still feel alone inside. The gap between how things look and how they feel is real, and naming it is the first kindness.',
    bodyNe:
      'कागज़ पर सुरक्षित दिखने के बावजूद आप अंदर से अकेलापन महसूस कर सकते हैं। चीजें कैसी दिखती हैं और कैसी महसूस होती हैं, इसके बीच का अंतर वास्तविक है — इसे नाम देना ही पहली दया है।',
    closingEn: 'This is not your weakness. This is the human mind.',
    closingNe: 'यह आपकी कमजोरी नहीं है। यह मानव मन है।',
  },
  {
    key: 'cry',
    icon: BookOpen,
    titleEn: 'Is it normal to cry without knowing why?',
    titleNe: 'क्या बिना कारण रोना सामान्य है?',
    bodyEn:
      'Tears without a clear reason often carry old tiredness, not drama. Your body is releasing what words cannot hold yet.',
    bodyNe:
      'बिना किसी स्पष्ट कारण के आँसू अक्सर पुरानी थकान को दर्शाते हैं, नाटक को नहीं। आपका शरीर उस चीज़ को बाहर निकाल रहा है जिसे शब्द अभी तक रोक नहीं पाए हैं।',
    closingEn: 'This is not your weakness. This is the human mind.',
    closingNe: 'यह आपकी कमजोरी नहीं है। यह मानव मन है।',
  },
];

interface MannKoKuraProps {
  /** Tighter spacing when nested under Legal Rights */
  variant?: 'standalone' | 'embedded';
  className?: string;
}

const MannKoKura = ({ variant = 'standalone', className }: MannKoKuraProps) => {
  const { t } = useLanguage();
  const embedded = variant === 'embedded';

  return (
    <div
      className={cn(
        'mx-auto max-w-3xl space-y-8',
        embedded ? 'pb-2' : 'pb-16',
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t('Mind Talk', 'मन की बात')}
        </p>
        <h1
          className={cn(
            'mt-1 font-display font-bold text-foreground text-balance',
            embedded ? 'text-2xl md:text-3xl' : 'text-3xl',
          )}
        >
          {t('What the heart says', 'दिल क्या कहता है')}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t(
            'Short, warm explainers — not clinical labels. Read what resonates.',
            'छोटे, स्नेही स्पष्टीकरण — कोई क्लिनिकल लेबल नहीं। पढ़ें जो आपको सही लगे।',
          )}
        </p>
      </div>

      <div className="space-y-5">
        {TOPICS.map((topic) => (
          <Card
            key={topic.key}
            className="overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-light text-primary">
                  <topic.icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground md:text-xl text-balance">
                  {t(topic.titleEn, topic.titleNe)}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 md:text-base">{t(topic.bodyEn, topic.bodyNe)}</p>
              <p className="mt-4 border-l-2 border-primary/40 pl-4 text-sm font-medium italic text-sage-dark md:text-base">
                {t(topic.closingEn, topic.closingNe)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MannKoKura;
