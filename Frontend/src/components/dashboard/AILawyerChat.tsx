import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scale, FileDown, Send, Loader2, User, Bot, AlertCircle } from 'lucide-react';
import { getMainApiBase } from '@/lib/apiBase';
import { jsPDF } from 'jspdf';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Lightweight markdown → JSX renderer ────────────────────────────────────
// Handles: ## headings, **bold**, bullet lists (- / *), numbered lists, --- dividers
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let key = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    if (listType === 'ul') {
      elements.push(
        <ul key={key++} className="my-2 space-y-1 pl-4">
          {listBuffer.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>,
      );
    } else {
      elements.push(
        <ol key={key++} className="my-2 space-y-1 pl-4 list-decimal list-inside">
          {listBuffer.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ol>,
      );
    }
    listBuffer = [];
    listType = null;
  };

  lines.forEach((line) => {
    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushList();
      elements.push(<hr key={key++} className="my-3 border-border/40" />);
      return;
    }
    // ## Heading
    if (/^#{1,3}\s/.test(line)) {
      flushList();
      const level = (line.match(/^(#+)/) ?? [''])[0].length;
      const content = line.replace(/^#+\s*/, '');
      const className =
        level === 1
          ? 'text-base font-bold mt-3 mb-1'
          : level === 2
          ? 'text-sm font-bold mt-2 mb-1 text-primary'
          : 'text-sm font-semibold mt-1';
      elements.push(
        <p key={key++} className={className} dangerouslySetInnerHTML={{ __html: inlineFormat(content) }} />,
      );
      return;
    }
    // Unordered list item
    if (/^[-*•]\s/.test(line.trim())) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listBuffer.push(line.replace(/^[-*•]\s*/, '').trim());
      return;
    }
    // Ordered list item
    if (/^\d+\.\s/.test(line.trim())) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listBuffer.push(line.replace(/^\d+\.\s*/, '').trim());
      return;
    }
    // Normal paragraph
    flushList();
    if (line.trim() === '') {
      elements.push(<div key={key++} className="h-1" />);
    } else {
      elements.push(
        <p key={key++} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />,
      );
    }
  });

  flushList();
  return <div className="space-y-0.5">{elements}</div>;
}

// Inline: **bold**, *italic*, `code`
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">$1</code>');
}

const AILawyerChat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t(
        "Hello. I am Sahara's Legal AI Assistant. I can help you draft a strategy, understand specific sections of Indian law, or prepare questions for your lawyer. How can I assist you today?",
        "नमस्ते। मैं सहारा की कानूनी एआई सहायक हूँ। मैं आपको रणनीति बनाने, भारतीय कानून की विशिष्ट धाराओं को समझने या अपने वकील के लिए प्रश्न तैयार करने में मदद कर सकती हूँ। मैं आज आपकी कैसे सहायता कर सकती हूँ?"
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${getMainApiBase()}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt:
            "You are an expert AI Legal Consultant for Indian Women's rights. " +
            "You provide clear, structured legal strategy, explain laws (DV Act, Section 498A, POCSO, etc.), " +
            "and help users prepare for legal steps. " +
            "\n\nFORMATTING RULES — always follow these:\n" +
            "- Use ## for section headings (e.g. ## Your Legal Options)\n" +
            "- Use **bold** for key legal terms and important points\n" +
            "- Use numbered lists (1. 2. 3.) for steps or ordered actions\n" +
            "- Use bullet lists (- item) for options, rights, or tips\n" +
            "- Use --- to separate major sections\n" +
            "- Keep paragraphs short (2-3 sentences max)\n" +
            "- Never write a wall of unbroken text\n" +
            "\nLANGUAGE RULES:\n" +
            "- If user writes in English → reply in English only\n" +
            "- If user writes in Hindi (Devanagari) → reply in Devanagari Hindi only\n" +
            "- If user writes in Hinglish → reply in Hinglish only\n" +
            "\nAlways clarify you are an AI and not a substitute for a qualified lawyer.",
          messages: newMessages,
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 'Error generating response.';

      setMessages([...newMessages, { role: 'assistant', content: botResponse }]);
    } catch (e) {
      console.error(e);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: t('Error connecting to Legal AI.', 'कानूनी एआई से जुड़ने में त्रुटि।'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    doc.setFontSize(22);
    doc.setTextColor(200, 75, 49);
    doc.text('Sahara India: Legal Strategy Report', 20, 30);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${timestamp}`, 20, 40);
    doc.text('CONFIDENTIAL - FOR PERSONAL USE', 20, 45);

    doc.setDrawColor(200, 75, 49);
    doc.line(20, 50, 190, 50);

    let y = 65;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const summaryText =
      'This report summarizes the legal strategy consultation with Sahara AI. It is intended to help you organize your thoughts before speaking with a professional lawyer.';
    const splitSummary = doc.splitTextToSize(summaryText, 170);
    doc.text(splitSummary, 20, y);
    y += splitSummary.length * 7 + 10;

    doc.setFontSize(14);
    doc.text('Conversation Logs:', 20, y);
    y += 10;

    doc.setFontSize(11);
    messages.forEach((msg) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const role = msg.role === 'user' ? 'YOU' : 'SAHARA AI';
      doc.setFont('helvetica', 'bold');
      doc.text(`${role}:`, 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      // Strip markdown for PDF
      const plainText = msg.content
        .replace(/#{1,3}\s/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/^[-*]\s/gm, '• ');
      const lines = doc.splitTextToSize(plainText, 160);
      doc.text(lines, 25, y);
      y += lines.length * 6 + 8;
    });

    doc.save('Sahara_Legal_Strategy.pdf');
  };

  return (
    <Card className="flex flex-col h-[600px] border-primary/20 shadow-xl overflow-hidden bg-background">
      <CardHeader className="bg-primary/5 border-b py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="h-5 w-5 text-primary" />
            {t('Legal Strategy Consultant', 'कानूनी रणनीति सलाहकार')}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-primary/30"
            onClick={generatePDF}
            disabled={messages.length < 2}
          >
            <FileDown className="h-4 w-4" />
            {t('Download Report', 'रिपोर्ट डाउनलोड करें')}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}
          >
            <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1 ${
                  msg.role === 'assistant' ? 'bg-primary/10' : 'bg-primary'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.role === 'assistant'
                    ? 'bg-white border text-foreground shadow-sm rounded-tl-none'
                    : 'bg-primary text-white rounded-tr-none text-sm leading-relaxed'
                }`}
              >
                {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">{t('Thinking...', 'सोच रही हूँ...')}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <div className="p-4 border-t bg-white">
        <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 p-3 mb-4 flex gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 leading-normal">
            {t(
              'I am an AI, not a lawyer. This strategy report is for your information only and should be verified with a qualified legal professional.',
              'मैं एक एआई हूँ, वकील नहीं। यह रणनीति रिपोर्ट केवल आपकी जानकारी के लिए है और इसे एक योग्य कानूनी पेशेवर के साथ सत्यापित किया जाना चाहिए।',
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('Describe your situation or ask a question...', 'अपनी स्थिति बताएं या प्रश्न पूछें...')}
            className="rounded-full px-5 h-11"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-11 w-11 rounded-full p-0 shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AILawyerChat;
