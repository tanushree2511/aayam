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
          system_prompt: "You are an expert AI Legal Consultant for Indian Women's rights. You provide strategy, explain laws (DV Act, Section 498A, etc.), and help users prepare for legal steps. Keep your tone professional, supportive, and clear. Always clarify that you are an AI and not a substitute for a human lawyer. [MATCH LANGUAGE: If the user speaks English, reply in English. If they speak Hindi, reply in Devanagari Hindi.]",
          messages: newMessages,
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      const botResponse = data.choices?.[0]?.message?.content || 'Error generating response.';
      
      setMessages([...newMessages, { role: 'assistant', content: botResponse }]);
    } catch (e) {
      console.error(e);
      setMessages([...newMessages, { role: 'assistant', content: t('Error connecting to Legal AI.', 'कानूनी एआई से जुड़ने में त्रुटि।') }]);
    } finally {
      setLoading(true);
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    
    doc.setFontSize(22);
    doc.setTextColor(200, 75, 49); // Terracotta
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
    
    // Add summary of conversation (English only for PDF consistency)
    const summaryText = "This report summarizes the legal strategy consultation with Sahara AI. It is intended to help you organize your thoughts before speaking with a professional lawyer.";
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
      // Replace some non-latin chars for simple PDF if needed, 
      // but for now we split the content
      const lines = doc.splitTextToSize(msg.content, 160);
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
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/5" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'assistant' ? 'bg-primary/10' : 'bg-primary'}`}>
                {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-white" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant' 
                  ? 'bg-white border text-foreground shadow-sm rounded-tl-none' 
                  : 'bg-primary text-white rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[85%]">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
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
              "I am an AI, not a lawyer. This strategy report is for your information only and should be verified with a qualified legal professional.",
              "मैं एक एआई हूँ, वकील नहीं। यह रणनीति रिपोर्ट केवल आपकी जानकारी के लिए है और इसे एक योग्य कानूनी पेशेवर के साथ सत्यापित किया जाना चाहिए।"
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t("Describe your situation or ask a question...", "अपनी स्थिति बताएं या प्रश्न पूछें...")}
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
