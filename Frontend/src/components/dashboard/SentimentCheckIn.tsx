import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SentimentCheckInProps {
  open: boolean;
  onComplete: (responses: SentimentResponse) => void;
}

export interface SentimentResponse {
  mood: number;
  safety: number;
  support: number;
  sleep: number;
  overallScore: number;
  timestamp: string;
}

const questions = [
  {
    key: 'mood',
    en: 'How are you feeling today?',
    ne: 'आज आप कैसा महसूस कर रहे हैं?',
    options: [
      { value: 1, en: '😢 Very Low', ne: '😢 बहुत उदास' },
      { value: 2, en: '😟 Low', ne: '😟 उदास' },
      { value: 3, en: '😐 Okay', ne: '😐 ठीक' },
      { value: 4, en: '🙂 Good', ne: '🙂 अच्छा' },
      { value: 5, en: '😊 Great', ne: '😊 बहुत अच्छा' },
    ],
  },
  {
    key: 'safety',
    en: 'How safe do you feel right now?',
    ne: 'अभी आप कितना सुरक्षित महसूस कर रहे हैं?',
    options: [
      { value: 1, en: '🔴 Not safe', ne: '🔴 सुरक्षित नहीं' },
      { value: 2, en: '🟠 Uneasy', ne: '🟠 बेचैन' },
      { value: 3, en: '🟡 Somewhat', ne: '🟡 कुछ हद तक' },
      { value: 4, en: '🟢 Mostly safe', ne: '🟢 ज़्यादातर सुरक्षित' },
      { value: 5, en: '💚 Completely safe', ne: '💚 पूरी तरह सुरक्षित' },
    ],
  },
  {
    key: 'support',
    en: 'Do you feel supported by people around you?',
    ne: 'क्या आप अपने आस-पास के लोगों से समर्थित महसूस करते हैं?',
    options: [
      { value: 1, en: '😞 Not at all', ne: '😞 बिल्कुल नहीं' },
      { value: 2, en: '😕 Rarely', ne: '😕 शायद ही कभी' },
      { value: 3, en: '😐 Sometimes', ne: '😐 कभी-कभी' },
      { value: 4, en: '🙂 Often', ne: '🙂 अक्सर' },
      { value: 5, en: '🤗 Always', ne: '🤗 हमेशा' },
    ],
  },
  {
    key: 'sleep',
    en: 'How well did you sleep last night?',
    ne: 'कल रात आपको कैसी नींद आई?',
    options: [
      { value: 1, en: '😴 Very poorly', ne: '😴 बहुत ख़राब' },
      { value: 2, en: '😪 Poorly', ne: '😪 ख़राब' },
      { value: 3, en: '😐 Average', ne: '😐 औसत' },
      { value: 4, en: '😌 Well', ne: '😌 अच्छी' },
      { value: 5, en: '😇 Very well', ne: '😇 बहुत अच्छी' },
    ],
  },
];

const SentimentCheckIn = ({ open, onComplete }: SentimentCheckInProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentQ = questions[step];

  const handleSelect = (value: number) => {
    const newAnswers = { ...answers, [currentQ.key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const overallScore = Math.round(
        ((newAnswers.mood + newAnswers.safety + newAnswers.support + newAnswers.sleep) / 20) * 100
      );
      onComplete({
        mood: newAnswers.mood,
        safety: newAnswers.safety,
        support: newAnswers.support,
        sleep: newAnswers.sleep,
        overallScore,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {t('Daily Check-In', 'दैनिक जाँच')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'Take a moment to reflect. Your answers are private.',
              'कुछ पल सोचें। आपके जवाब निजी हैं।'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="flex gap-1.5 mb-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <p className="text-base font-medium text-foreground">{t(currentQ.en, currentQ.ne)}</p>

        <div className="grid gap-2 mt-2">
          {currentQ.options.map((opt) => (
            <Button
              key={opt.value}
              variant="outline"
              className={`justify-start text-left h-auto py-3 px-4 text-sm transition-all hover:border-primary hover:bg-primary/5 ${
                answers[currentQ.key] === opt.value ? 'border-primary bg-primary/10' : ''
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              {t(opt.en, opt.ne)}
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          {t(`Question ${step + 1} of ${questions.length}`, `प्रश्न ${step + 1} / ${questions.length}`)}
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SentimentCheckIn;
