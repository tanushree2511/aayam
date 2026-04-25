import { useMemo, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Brain, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { getMainApiBase } from '@/lib/apiBase';

interface MoodAnalysisProps {
  answers: { id: string; answer: string }[];
  moodColor: string;
}

const MoodAnalysis = ({ answers, moodColor }: MoodAnalysisProps) => {
  const { t, language } = useLanguage();
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chartData = useMemo(() => {
    // Generate some "simulated" data points based on answer lengths/types
    // In a real app, the AI could return these scores
    const seed = answers.reduce((acc, a) => acc + a.answer.length, 0);
    return [
      { subject: t('Emotional Stability', 'भावनात्मक स्थिरता'), A: 60 + (seed % 30), fullMark: 100 },
      { subject: t('Resilience', 'लचीलापन'), A: 70 + (seed % 25), fullMark: 100 },
      { subject: t('Agency', 'स्वतंत्रता'), A: 50 + (seed % 45), fullMark: 100 },
      { subject: t('Self-Care', 'आत्म-देखभाल'), A: 65 + (seed % 35), fullMark: 100 },
      { subject: t('Social Safety', 'सामाजिक सुरक्षा'), A: 55 + (seed % 40), fullMark: 100 },
    ];
  }, [answers, t]);

  const fetchAnalysis = async () => {
    if (loading || analysis) return;
    setLoading(true);
    try {
      const prompt = `Based on these 5 daily agency decisions: ${JSON.stringify(answers)}, provide a short, compassionate AI analysis of the user's mood and resilience. [MATCH LANGUAGE: If the user is in Hindi mode, reply in Devanagari Hindi. If in English, reply in English.]`;
      
      const res = await fetch(`${getMainApiBase()}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt: "You are a compassionate AI wellness companion for women. You analyze small daily choices to highlight strengths and offer gentle support. Keep it under 3 sentences.",
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setAnalysis(data.choices?.[0]?.message?.content || 'Analysis unavailable.');
    } catch (e) {
      console.error(e);
      setAnalysis(t('I see strength in your choices today. Take it one step at a time.', 'मैं आज आपके विकल्पों में ताकत देख रहा हूँ। इसे एक-एक करके लें।'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="overflow-hidden border-primary/10 shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-2 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            {t('Your Agency Spectrum', 'आपका एजेंसी स्पेक्ट्रम')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Mood"
                  dataKey="A"
                  stroke={moodColor === 'green' ? '#1D9E75' : '#C84B31'}
                  fill={moodColor === 'green' ? '#1D9E75' : '#C84B31'}
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 flex flex-col items-center">
            {!analysis ? (
              <Button 
                onClick={fetchAnalysis} 
                disabled={loading}
                className="btn-hero rounded-full gap-2 px-8"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {t('Get AI Mood Insight', 'AI मूड अंतर्दृष्टि प्राप्त करें')}
              </Button>
            ) : (
              <div className="rounded-2xl bg-primary/5 p-5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <p className="text-sm md:text-base leading-relaxed text-foreground italic relative z-10">
                  "{analysis}"
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="bg-sage-light/30 border-none shadow-none">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ArrowRight className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {t('These 5 decisions are small acts of self-ownership. They build the foundation for larger changes.', 'ये 5 निर्णय आत्म-स्वामित्व के छोटे कार्य हैं। वे बड़े बदलावों के लिए आधार तैयार करते हैं।')}
              </p>
            </CardContent>
         </Card>
         <Card className="bg-primary/5 border-none shadow-none">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {t('Your "Agency Score" reflects your internal sense of control today. It is valid, whatever it is.', 'आपका "एजेंसी स्कोर" आज आपके नियंत्रण की आंतरिक भावना को दर्शाता है। यह मान्य है, चाहे वह कुछ भी हो।')}
              </p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
};

export default MoodAnalysis;

import { Button } from '@/components/ui/button';
