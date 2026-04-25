import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Phone, MapPin, Backpack, FileText, AlertTriangle, Siren } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

const SafetyPlanning = () => {
  const { t } = useLanguage();

  const [sosTriggered, setSosTriggered] = useState(false);

  const emergencyItems = [
    { icon: FileText, text: t('Important documents (Aadhaar, marriage cert, FIR copy)', 'महत्वपूर्ण दस्तावेज (आधार, विवाह प्रमाणपत्र, FIR कॉपी)') },
    { icon: Phone, text: t('Phone with emergency contacts saved', 'आपातकालीन संपर्क सहेजे हुए फ़ोन') },
    { icon: Backpack, text: t('Small bag with essentials (clothes, medicine)', 'ज़रूरी सामान की छोटी बैग (कपड़े, दवाई)') },
    { icon: MapPin, text: t('Know the nearest safe house / shelter location', 'निकटतम सेफ हाउस / शेल्टर की जानकारी रखें') },
  ];

  const contacts = [
    { name: t('Women Helpline (NCW)', 'महिला हेल्पलाइन (NCW)'), number: '181' },
    { name: t('Police Emergency', 'पुलिस आपातकालीन'), number: '112' },
    { name: t('Domestic Violence Helpline', 'घरेलू हिंसा हेल्पलाइन'), number: '1091' },
    { name: t('National Commission for Women', 'राष्ट्रीय महिला आयोग'), number: '7827-170-170' },
  ];

  const handleSOS = () => {
    setSosTriggered(true);
    // Open the phone dialer with emergency number
    window.location.href = 'tel:112';
    // Reset after 3 seconds
    setTimeout(() => setSosTriggered(false), 3000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('Protection', 'सुरक्षा')}
        title={t('Safety Planning', 'सुरक्षा योजना')}
        description={t('Practical, not clinical. Your safety comes first.', 'व्यावहारिक, चिकित्सीय नहीं। आपकी सुरक्षा पहले।')}
      />

      {/* SOS Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={handleSOS}
          className={`relative group flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 transition-all duration-300 shadow-lg ${
            sosTriggered
              ? 'bg-destructive border-destructive/80 scale-95'
              : 'bg-destructive/90 border-destructive/60 hover:bg-destructive hover:scale-105 hover:shadow-xl'
          }`}
          aria-label="SOS Emergency Button"
        >
          <Siren className={`h-10 w-10 text-white mb-1 ${sosTriggered ? '' : 'group-hover:animate-bounce'}`} />
          <span className="text-white text-2xl font-black tracking-widest">SOS</span>
          <span className="text-white/80 text-[10px] mt-1 font-medium">
            {t('TAP TO CALL 112', '112 कॉल करें')}
          </span>
          {/* Pulse ring animation */}
          {!sosTriggered && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-destructive/40 animate-ping" />
              <span className="absolute -inset-2 rounded-full border border-destructive/20 animate-pulse" />
            </>
          )}
        </button>
      </div>

      <Card className="rounded-2xl border-destructive/25 bg-destructive/5 shadow-sm">
        <CardContent className="flex items-center gap-3 p-4 md:p-5">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm font-medium text-foreground">
            {t('If you are in immediate danger, call 100 (Nepal Police) or 1145 (Women Cell)', 'यदि तपाईं तत्काल खतरामा हुनुहुन्छ भने, 100 (नेपाल प्रहरी) वा 1145 (महिला सेल) मा कल गर्नुहोस्')}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            {t('If You Need to Leave Quickly', 'यदि तपाईंलाई छिटो जानु पर्छ')}
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

      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
            <Phone className="h-5 w-5 text-primary" />
            {t('Emergency Contacts', 'आपतकालीन सम्पर्कहरू')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-muted/50 p-3.5">
              <span className="text-sm font-medium text-foreground">{c.name}</span>
              <a href={`tel:${c.number}`} className="text-sm text-primary font-semibold hover:underline">{c.number}</a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyPlanning;
