import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BookOpen, Mic, MicOff } from 'lucide-react';
import MannKoKura from '@/components/dashboard/MannKoKura';
import { PageHeader } from '@/components/layout/PageHeader';
import { getMainApiBase } from '@/lib/apiBase';

const API_BASE = getMainApiBase();

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const LegalRights = () => {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [selectedRight, setSelectedRight] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleVoice = async () => {
    if (isListening) {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsListening(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunks.current = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          stream.getTracks().forEach((track) => track.stop());
          await processVoiceInput(audioBlob);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsListening(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsProcessingVoice(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('language_code', 'hi-IN'); // Support Hindi/English mix

    try {
      const response = await fetch(`${API_BASE}/stt/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      if (data.transcript) {
        await handleSend(data.transcript);
      }
    } catch (error) {
      console.error('Error with STT API:', error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend.trim();
    const newMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const systemPrompt = `[MATCH THE USER'S LANGUAGE AND SCRIPT STRICTLY. If the user speaks English, reply in English. If they speak Hindi in Devanagari (हिंदी), reply in Devanagari. If they speak Hinglish (Hindi in English alphabet), reply in Hinglish.] You are an Indian Women's Legal Assistant. You are currently helping a user specifically understand their "${selectedRight.title}". Law: ${selectedRight.law}. Context: ${selectedRight.desc}. Only answer questions related to this right. Be concise, supportive, and extremely clear about the steps they can take.`;

    // Filter out the initial greeting from the history sent to the API
    const apiMessages = newMessages
      .filter((m) => m.text !== `You selected "${selectedRight.title}". Ask your question below, and I will guide you based on Indian Law.`)
      .map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text,
      }));

    try {
      const response = await fetch(`${API_BASE}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          messages: apiMessages,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch from LLM');

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || 'मुझे खेद है, मुझे जवाब देने में समस्या हो रही है।';

      setMessages((prev) => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'bot', text: 'मुझे खेद है, मुझे जवाब देने में समस्या हो रही है। कृपया बाद में प्रयास करें।' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (right: any) => {
    setSelectedRight(right);
    setMessages([
      { role: 'bot', text: `You selected "${right.title}". Ask your question below, and I will guide you based on Indian Law.` },
    ]);
    setOpen(true);
  };

  const rights = [
    {
      title: 'Right to Mental Healthcare',
      desc: 'Access mental health services in India.',
      law: 'The Mental Healthcare Act, 2017',
    },
    {
      title: 'Right to Equality & Dignity',
      desc: 'Equal protection and no discrimination.',
      law: 'Article 14 & 21 of Constitution of India',
    },
    {
      title: 'Right to Privacy & Confidentiality',
      desc: 'Your mental health data must remain private.',
      law: 'Article 21 (Puttaswamy) & IT Act, 2000',
    },
    {
      title: 'File Domestic Violence Complaint',
      desc: 'Report abuse and seek protection.',
      law: 'Protection of Women from Domestic Violence Act, 2005',
    },
    {
      title: 'Protection Order',
      desc: 'Court protection from abuser.',
      law: 'Section 18 of PWDVA, 2005',
    },
    {
      title: 'Free Legal Aid',
      desc: 'Free lawyer support if needed.',
      law: 'Legal Services Authorities Act, 1987',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-border/60 pb-10">
        <MannKoKura variant="embedded" />
      </div>

      <PageHeader
        eyebrow={t('Legal', 'कानुनी')}
        title={t('Know Your Rights', 'आफ्ना अधिकार जान्नुहोस्')}
        description={t(
          'In plain language, not legal jargon. Knowledge is power.',
          'सरल भाषामा, कानुनी शब्दावली होइन। ज्ञान शक्ति हो।'
        )}
      />

      <div className="space-y-4">
        {rights.map((right, i) => (
          <Card
            key={i}
            onClick={() => handleCardClick(right)}
            className="cursor-pointer rounded-2xl border-border/50 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sage-light flex items-center justify-center mt-0.5">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{right.title}</h3>
                <p className="text-sm text-muted-foreground">{right.desc}</p>
                <p className="text-xs text-primary mt-2">{right.law}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRight?.title}</DialogTitle>
          </DialogHeader>

          <div className="h-[50vh] max-h-96 overflow-y-auto space-y-4 border p-4 bg-muted/30 rounded-lg">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm break-words whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white text-foreground border rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border text-foreground px-4 py-2.5 rounded-2xl rounded-bl-md text-sm shadow-sm flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={chatRef} />
          </div>

          <div className="flex gap-2 pt-2 items-center">
            <button
              type="button"
              onClick={toggleVoice}
              disabled={isProcessingVoice || isLoading}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                isListening
                  ? 'bg-destructive/15 text-destructive'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              } disabled:opacity-50`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <Input
              placeholder={isListening ? "Listening..." : "Type your question..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading || isListening || isProcessingVoice}
              className="flex-1"
            />
            <Button onClick={() => handleSend()} disabled={isLoading || isProcessingVoice || !input.trim()}>
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalRights;