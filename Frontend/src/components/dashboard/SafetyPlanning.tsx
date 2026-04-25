import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  Phone,
  MapPin,
  Backpack,
  FileText,
  AlertTriangle,
  Siren,
  Heart,
  BookOpen,
  Home,
  Users,
  Scale,
  Baby,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

// ─── Twilio SOS hook placeholder ────────────────────────────────────────────
// TODO: Replace this stub with a real Twilio Programmable Voice / SMS call.
// Steps when you're ready:
//   1. Install: npm install twilio (backend) or use Twilio REST API from your FastAPI backend.
//   2. Create a POST /api/sos endpoint in main.py that triggers a Twilio call/SMS.
//   3. Replace the fetch below with your real endpoint URL.
const triggerTwilioSOS = async () => {
  try {
    await fetch('/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: '112', message: 'SOS triggered from Sahara app' }),
    });
  } catch {
    // Silent fail — direct call fallback is used regardless
  }
};

const SafetyPlanning = () => {
  const { t } = useLanguage();
  const [sosTriggered, setSosTriggered] = useState(false);

  // ── Emergency bag checklist ─────────────────────────────────────────────
  const emergencyItems = [
    {
      icon: FileText,
      text: t(
        'Important documents: Aadhaar card, PAN card, passport, marriage certificate, FIR copy',
        'महत्वपूर्ण दस्तावेज़: आधार कार्ड, पैन कार्ड, पासपोर्ट, विवाह प्रमाणपत्र, FIR कॉपी',
      ),
    },
    {
      icon: Phone,
      text: t(
        'Charged phone with emergency contacts saved offline',
        'आपातकालीन संपर्क ऑफलाइन सहेजे हुए चार्ज फ़ोन',
      ),
    },
    {
      icon: Backpack,
      text: t(
        'Small bag with essentials: clothes for 3 days, medicines, sanitary items',
        'ज़रूरी सामान की छोटी बैग: 3 दिन के कपड़े, दवाइयाँ, स्वच्छता सामग्री',
      ),
    },
    {
      icon: MapPin,
      text: t(
        'Know the nearest One Stop Centre (OSC) / shelter home address',
        'निकटतम वन स्टॉप सेंटर (OSC) / आश्रय गृह का पता जानें',
      ),
    },
    {
      icon: Home,
      text: t(
        'Identify a trusted neighbour or friend you can go to at any hour',
        'एक विश्वसनीय पड़ोसी या मित्र चुनें जिनके पास कभी भी जा सकें',
      ),
    },
    {
      icon: Scale,
      text: t(
        'Keep a copy of any court order (protection order, maintenance order)',
        'किसी भी न्यायालय आदेश की प्रति रखें (संरक्षण आदेश, भरण-पोषण आदेश)',
      ),
    },
    {
      icon: Baby,
      text: t(
        "Children's school records, vaccination cards, and birth certificates",
        'बच्चों के स्कूल रिकॉर्ड, टीकाकरण कार्ड और जन्म प्रमाणपत्र',
      ),
    },
  ];

  // ── India women-safety helplines ────────────────────────────────────────
  const contacts = [
    {
      name: t('Police Emergency', 'पुलिस आपातकालीन'),
      number: '112',
      note: t('All-India emergency number', 'अखिल भारत आपातकालीन नंबर'),
      color: 'text-destructive',
    },
    {
      name: t('Women Helpline (National)', 'महिला हेल्पलाइन (राष्ट्रीय)'),
      number: '181',
      note: t('24×7 free helpline for women in distress', 'संकट में महिलाओं के लिए 24×7 निःशुल्क'),
      color: 'text-primary',
    },
    {
      name: t('Domestic Violence / Women Helpline', 'घरेलू हिंसा / महिला हेल्पलाइन'),
      number: '1091',
      note: t('Dedicated line for women safety', 'महिला सुरक्षा के लिए समर्पित लाइन'),
      color: 'text-primary',
    },
    {
      name: t('National Commission for Women (NCW)', 'राष्ट्रीय महिला आयोग'),
      number: '7827-170-170',
      note: t('Complaints & legal support', 'शिकायत और कानूनी सहायता'),
      color: 'text-primary',
    },
    {
      name: t('Childline India', 'चाइल्डलाइन इंडिया'),
      number: '1098',
      note: t('For children in danger or distress', 'खतरे में बच्चों के लिए'),
      color: 'text-amber-600',
    },
    {
      name: t('National Human Rights Commission', 'राष्ट्रीय मानवाधिकार आयोग'),
      number: '14433',
      note: t('Human rights violations helpline', 'मानवाधिकार उल्लंघन हेल्पलाइन'),
      color: 'text-primary',
    },
    {
      name: t('iCall (Psychological Support)', 'iCall (मनोवैज्ञानिक सहायता)'),
      number: '9152987821',
      note: t('Free mental health counselling', 'निःशुल्क मानसिक स्वास्थ्य परामर्श'),
      color: 'text-emerald-600',
    },
    {
      name: t('Vandrevala Foundation (Mental Health)', 'वांड्रेवाला फाउंडेशन'),
      number: '1860-2662-345',
      note: t('24×7 free mental health support', '24×7 निःशुल्क मानसिक स्वास्थ्य सहायता'),
      color: 'text-emerald-600',
    },
    {
      name: t('AASRA (Crisis Intervention)', 'आसरा (संकट हस्तक्षेप)'),
      number: '9820466627',
      note: t('24×7 suicide & crisis prevention', '24×7 आत्महत्या और संकट निवारण'),
      color: 'text-emerald-600',
    },
    {
      name: t('Anti-Stalking / Cyber Crime Helpline', 'एंटी-स्टॉकिंग / साइबर अपराध हेल्पलाइन'),
      number: '1930',
      note: t('National Cyber Crime Reporting Portal helpline', 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल'),
      color: 'text-violet-600',
    },
  ];

  // ── Key legal rights ────────────────────────────────────────────────────
  const legalRights = [
    {
      law: 'IPC Section 498A',
      right: t(
        'Protection against cruelty by husband or his relatives',
        'पति या उसके रिश्तेदारों द्वारा क्रूरता के खिलाफ सुरक्षा',
      ),
    },
    {
      law: t('Protection of Women from Domestic Violence Act, 2005', 'घरेलू हिंसा अधिनियम, 2005'),
      right: t(
        'Right to residence, protection orders, and monetary relief',
        'निवास का अधिकार, संरक्षण आदेश और मौद्रिक राहत',
      ),
    },
    {
      law: t('Dowry Prohibition Act, 1961', 'दहेज निषेध अधिनियम, 1961'),
      right: t('Dowry demand is a criminal offence', 'दहेज मांगना एक आपराधिक अपराध है'),
    },
    {
      law: 'POCSO Act, 2012',
      right: t(
        'Strong protection for children against sexual offences',
        'बच्चों को यौन अपराधों से मजबूत सुरक्षा',
      ),
    },
    {
      law: t('Free Legal Aid (NALSA)', 'निःशुल्क कानूनी सहायता (NALSA)'),
      right: t(
        'Every woman is entitled to free legal aid — call 15100',
        'हर महिला को निःशुल्क कानूनी सहायता का अधिकार है — 15100 कॉल करें',
      ),
    },
    {
      law: t('One Stop Centres (Sakhi)', 'वन स्टॉप सेंटर (सखी)'),
      right: t(
        'Integrated support: shelter, police, medical, legal & counselling under one roof',
        'एकीकृत सहायता: आश्रय, पुलिस, चिकित्सा, कानूनी और परामर्श एक छत के नीचे',
      ),
    },
  ];

  // ── SOS handler ─────────────────────────────────────────────────────────
  const handleSOS = async () => {
    setSosTriggered(true);
    await triggerTwilioSOS(); // Twilio placeholder — will activate when backend is ready
    window.location.href = 'tel:112';
    setTimeout(() => setSosTriggered(false), 3000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('Protection', 'सुरक्षा')}
        title={t('Safety Planning', 'सुरक्षा योजना')}
        description={t(
          'Practical steps, not clinical advice. Your safety comes first.',
          'व्यावहारिक कदम, चिकित्सीय सलाह नहीं। आपकी सुरक्षा पहले।',
        )}
      />

      {/* ── SOS Button ──────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 py-4">
        <button
          id="sos-emergency-button"
          onClick={handleSOS}
          className={`relative group flex flex-col items-center justify-center w-44 h-44 rounded-full border-4 transition-all duration-300 shadow-lg ${
            sosTriggered
              ? 'bg-destructive border-destructive/80 scale-95'
              : 'bg-destructive/90 border-destructive/60 hover:bg-destructive hover:scale-105 hover:shadow-xl'
          }`}
          aria-label="SOS Emergency Button — calls 112"
        >
          <Siren className={`h-10 w-10 text-white mb-1 ${sosTriggered ? '' : 'group-hover:animate-bounce'}`} />
          <span className="text-white text-3xl font-black tracking-widest">SOS</span>
          <span className="text-white/80 text-[10px] mt-1 font-medium tracking-wide">
            {sosTriggered ? t('CALLING 112…', '112 कॉल हो रहा है…') : t('TAP TO CALL 112', '112 कॉल करने के लिए दबाएं')}
          </span>

          {/* Pulse rings */}
          {!sosTriggered && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-destructive/40 animate-ping" />
              <span className="absolute -inset-2 rounded-full border border-destructive/20 animate-pulse" />
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {t(
            'Twilio-powered SOS alert will notify your emergency contacts automatically (coming soon)',
            'Twilio-संचालित SOS अलर्ट आपके आपातकालीन संपर्कों को स्वचालित रूप से सूचित करेगा (जल्द आ रहा है)',
          )}
        </p>
      </div>

      {/* ── India Emergency Alert ────────────────────────────────────────── */}
      <Card className="rounded-2xl border-destructive/25 bg-destructive/5 shadow-sm">
        <CardContent className="flex items-start gap-3 p-4 md:p-5">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {t('If you are in immediate danger in India:', 'यदि आप भारत में तत्काल खतरे में हैं:')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                'Call 112 (Police) · 181 (Women Helpline) · 1091 (Domestic Violence)',
                '112 (पुलिस) · 181 (महिला हेल्पलाइन) · 1091 (घरेलू हिंसा) कॉल करें',
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Emergency Bag Checklist ──────────────────────────────────────── */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            {t('If You Need to Leave Quickly — Checklist', 'यदि आपको जल्दी जाना हो — चेकलिस्ट')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyItems.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-sage-light/80 p-3.5">
              <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{item.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── India Helpline Numbers ───────────────────────────────────────── */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
            <Phone className="h-5 w-5 text-primary" />
            {t('India Women Safety Helplines', 'भारत महिला सुरक्षा हेल्पलाइन')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-muted/50 p-3.5 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.note}</p>
              </div>
              <a
                href={`tel:${c.number}`}
                className={`text-sm font-bold shrink-0 hover:underline ${c.color}`}
                aria-label={`Call ${c.name} at ${c.number}`}
              >
                {c.number}
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Know Your Legal Rights ───────────────────────────────────────── */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('Know Your Legal Rights (India)', 'अपने कानूनी अधिकार जानें (भारत)')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {legalRights.map((r, i) => (
            <div key={i} className="rounded-xl bg-muted/50 p-3.5 space-y-1">
              <p className="text-xs font-bold text-primary">{r.law}</p>
              <p className="text-sm text-foreground">{r.right}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Online Safety Tips ───────────────────────────────────────────── */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
            <Users className="h-5 w-5 text-primary" />
            {t('Online Safety & Cyber Crime', 'ऑनलाइन सुरक्षा और साइबर अपराध')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              tip: t(
                'Report cyber stalking, morphed images, or online harassment at cybercrime.gov.in or call 1930',
                'साइबर स्टॉकिंग, मॉर्फ्ड तस्वीरें या ऑनलाइन उत्पीड़न cybercrime.gov.in पर रिपोर्ट करें या 1930 पर कॉल करें',
              ),
            },
            {
              tip: t(
                'Block & screenshot before deleting any threatening messages — it serves as legal evidence',
                'किसी भी धमकी भरे संदेश को हटाने से पहले ब्लॉक करें और स्क्रीनशॉट लें — यह कानूनी सबूत है',
              ),
            },
            {
              tip: t(
                'Enable location sharing only with trusted contacts during emergencies',
                'आपातकाल के दौरान केवल विश्वसनीय संपर्कों के साथ ही लोकेशन साझा करें',
              ),
            },
            {
              tip: t(
                'Use a safe browser and clear history if you share a device with your abuser',
                'यदि आप अपने हमलावर के साथ डिवाइस साझा करते हैं तो सुरक्षित ब्राउज़र का उपयोग करें और इतिहास साफ करें',
              ),
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-sage-light/80 p-3.5">
              <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{item.tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyPlanning;
