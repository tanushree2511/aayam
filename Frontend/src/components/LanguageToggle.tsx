import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm" title="English / हिन्दी">
      <span className={language === 'en' ? 'text-foreground' : 'text-muted-foreground'}>EN</span>
      <Switch
        checked={language === 'hi'}
        onCheckedChange={(checked) => setLanguage(checked ? 'hi' : 'en')}
        className="scale-90 data-[state=checked]:bg-primary sm:scale-100"
      />
      <span className={language === 'hi' ? 'text-foreground' : 'text-muted-foreground'}>
        <span className="xs:hidden">हि</span>
        <span className="hidden xs:inline">हिन्दी</span>
      </span>
    </div>
  );
};

export default LanguageToggle;
