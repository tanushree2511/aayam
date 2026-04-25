import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Building2, ArrowRight, ShieldCheck, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { NEPAL_DISTRICTS, NEPAL_DISTRICT_SELECT_OTHER } from '@/data/helpResources';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const AuthPage = () => {
  const { t } = useLanguage();
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'user' | 'ngo'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [districtSelect, setDistrictSelect] = useState<string>('Kathmandu');
  const [districtOther, setDistrictOther] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    try {
      if (isLogin) {
        const u = await login(email, password);
        navigate(u.role === 'ngo' ? '/ngo-dashboard' : '/dashboard');
      } else {
        const resolvedDistrict =
          role === 'user'
            ? districtSelect === NEPAL_DISTRICT_SELECT_OTHER
              ? districtOther.trim()
              : districtSelect
            : undefined;
        const u = await signup(name, email, password, role, resolvedDistrict);
        navigate(u.role === 'ngo' ? '/ngo-dashboard' : '/dashboard');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : t('Something went wrong', 'कुछ गलत हो गया'));
    } finally {
      setSubmitting(false);
    }
  };

  const trustLine = [
    { icon: ShieldCheck, text: t('Your data stays yours', 'आपका डेटा आपका ही रहता है') },
    { icon: Sparkles, text: t('Made for real journeys', 'वास्तविक यात्रा के लिए') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="gradient-hero relative min-h-[calc(100dvh-var(--nav-offset))] overflow-hidden pt-[calc(var(--nav-offset)+1rem)] md:pt-[calc(var(--nav-offset)+1.5rem)]">
        <div
          className="pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl md:right-[5%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-32 h-72 w-72 rounded-full bg-terracotta/12 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto px-4 pb-16 pt-4 md:pb-24">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_420px] lg:gap-14 xl:grid-cols-[1fr_440px]">
            {/* Left — welcome panel */}
            <div className="hidden text-center lg:block lg:text-left">
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('Back to home', 'होम पर वापस जाएं')}
              </Link>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-sage-light/90 px-4 py-2 text-sm font-medium text-sage-dark shadow-sm backdrop-blur-sm">
                <Heart className="h-4 w-4 text-primary" />
                {t('Mitra', 'मित्र')}
              </div>

              <h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl text-balance">
                {isLogin
                  ? t('Welcome back', 'वापसी पर स्वागत है')
                  : t('Begin gently', 'शांति से शुरुआत करें')}
              </h1>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
                {isLogin
                  ? t(
                      'Pick up where you left off — your journey is still here.',
                      'जहां आपने छोड़ा था वहीं से शुरू करें — आपकी यात्रा अभी भी यहीं है।',
                    )
                  : t(
                      'One account for case tracking, peer support, and Mitra chat — at your pace.',
                      'केस ट्रैकिंग, सहकर्मी सहायता और मित्र चैट के लिए एक खाता — आपकी गति से।',
                    )}
              </p>

              <ul className="mt-10 space-y-4">
                {trustLine.map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm text-foreground/85">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" aria-hidden />
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form card */}
            <Card className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border-primary/10 bg-white/85 shadow-[var(--shadow-card)] backdrop-blur-md dark:bg-card/90 lg:mx-0 lg:max-w-none">
              <CardHeader className="space-y-1 border-b border-border/50 bg-muted/20 px-6 pb-6 pt-8 text-center lg:text-left">
                <div className="mb-4 flex justify-center lg:hidden">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Heart className="h-7 w-7 text-primary fill-primary/15" />
                  </div>
                </div>
                <CardTitle className="font-display text-2xl md:text-[1.65rem]">
                  {isLogin ? t('Sign in', 'साइन इन करें') : t('Create account', 'खाता बनाएं')}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('Your safe space awaits', 'आपका सुरक्षित स्थान आपका इंतज़ार कर रहा है')}
                </CardDescription>

                {/* Login / Sign up switch */}
                <div
                  className="!mt-6 flex rounded-full bg-muted/80 p-1.5 shadow-inner"
                  role="tablist"
                  aria-label={t('Account mode', 'खाता मोड')}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isLogin}
                    onClick={() => setIsLogin(true)}
                    className={cn(
                      'flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200',
                      isLogin
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t('Login', 'लॉगिन')}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!isLogin}
                    onClick={() => setIsLogin(false)}
                    className={cn(
                      'flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200',
                      !isLogin
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t('Sign Up', 'साइन अप')}
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 px-6 pb-8 pt-6">
                <Tabs value={role} onValueChange={(v) => setRole(v as 'user' | 'ngo')} className="w-full">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('I am signing in as', 'मैं इस रूप में साइन इन कर रहा हूँ')}
                  </p>
                  <TabsList className="grid h-12 w-full grid-cols-2 gap-1 rounded-xl bg-muted/90 p-1">
                    <TabsTrigger
                      value="user"
                      className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      {t('User', 'उपयोगकर्ता')}
                    </TabsTrigger>
                    <TabsTrigger
                      value="ngo"
                      className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                    >
                      <Building2 className="h-4 w-4 shrink-0" />
                      {t('NGO', 'एनजीओ')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        {role === 'ngo' ? t('Organization Name', 'संस्था का नाम') : t('Your Name', 'आपका नाम')}
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'ngo' ? 'Helping Hands' : 'Sita'}
                        className="h-11 rounded-xl border-border/80 bg-background/80"
                        autoComplete="name"
                      />
                    </div>
                  )}
                  {!isLogin && role === 'user' && (
                    <div className="space-y-2">
                      <Label className="text-foreground">
                        {t('Your district (for local resources)', 'आपका ज़िला (स्थानीय संसाधनों के लिए)')}
                      </Label>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {t(
                          'We never ask for your exact address — district only.',
                          'हम कभी आपका पूरा पता नहीं पूछते — केवल ज़िला।',
                        )}
                      </p>
                      <Select value={districtSelect} onValueChange={setDistrictSelect}>
                        <SelectTrigger className="h-11 w-full rounded-xl border-border/80 bg-background/80">
                          <SelectValue placeholder={t('Select district', 'ज़िला चुनें')} />
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
                      {districtSelect === NEPAL_DISTRICT_SELECT_OTHER ? (
                        <div className="space-y-2">
                          <Label htmlFor="district-other" className="text-foreground">
                            {t('District name', 'ज़िले का नाम')}
                          </Label>
                          <Input
                            id="district-other"
                            value={districtOther}
                            onChange={(e) => setDistrictOther(e.target.value)}
                            placeholder={t('e.g. your municipality or spelling', 'उदा. आपकी नगर पालिका या वर्तनी')}
                            className="h-11 rounded-xl border-border/80 bg-background/80"
                            autoComplete="off"
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      {t('Email', 'ईमेल')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl border-border/80 bg-background/80"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">
                      {t('Password', 'पासवर्ड')}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-border/80 bg-background/80"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                    />
                  </div>

                  {authError ? (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                      {authError}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="btn-hero mt-2 h-12 w-full gap-2 rounded-full text-base shadow-md"
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    ) : (
                      <>
                        {isLogin ? t('Login', 'लॉगिन') : t('Create Account', 'खाता बनाएं')}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="border-t border-border/60 pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? t("Don't have an account?", 'खाता नहीं है?') : t('Already have an account?', 'पहले से ही खाता है?')}{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {isLogin ? t('Sign Up', 'साइन अप') : t('Login', 'लॉगिन')}
                    </button>
                  </p>
                  <Link
                    to="/"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary lg:hidden"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {t('Back to home', 'होम पर वापस जाएं')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
