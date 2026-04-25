import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/layout/PageHeader';
import CaseTimeline from '@/components/dashboard/CaseTimeline';
import { cn } from '@/lib/utils';

export interface CaseTrackerPageProps {
  /** When embedded (e.g. Help hub), skip the main page header and use tighter section titles. */
  variant?: 'default' | 'embedded';
}

const CaseTrackerPage = ({ variant = 'default' }: CaseTrackerPageProps) => {
  const { t } = useLanguage();
  const embedded = variant === 'embedded';

  return (
    <div className={cn('space-y-10 pb-8', embedded && 'space-y-8 pb-0')}>
      {!embedded && (
        <PageHeader
          eyebrow={t('Your case', 'आपका मामला')}
          title={t('Case Tracker', 'केस ट्रैकर')}
          description={t(
            'Your timeline — add steps and keep private notes under each one. Saved on this device.',
            'आपकी टाइमलाइन — कदम जोड़ें और प्रत्येक के नीचे निजी नोट्स रखें। इस डिवाइस पर सहेजा गया।',
          )}
        />
      )}

      <section className={cn('space-y-4', !embedded && 'scroll-mt-4')}>
        {embedded ? (
          <h3 className="font-display text-base font-semibold text-foreground">
            {t('Case timeline', 'केस टाइमलाइन')}
          </h3>
        ) : (
          <h2 className="font-display text-xl font-semibold text-foreground">
            {t('Case timeline', 'केस टाइमलाइन')}
          </h2>
        )}
        <CaseTimeline hideHeader />
      </section>
    </div>
  );
};

export default CaseTrackerPage;
