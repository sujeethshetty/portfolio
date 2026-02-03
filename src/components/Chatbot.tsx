import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, Loader2, RotateCcw, Download } from 'lucide-react';
import { Message, ChatSession, MAX_MESSAGES_PER_SESSION, SESSION_STORAGE_KEY, generateSessionId } from '@/types/chat';
import { cn } from '@/lib/utils';

// Helper to make URLs clickable within text
const renderTextWithLinks = (text: string, keyPrefix: string = '') => {
  const urlRegex = /(https?:\/\/[^\s)]+)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={`${keyPrefix}-${match.index}`}
        href={match[1]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// Helper to detect and render resume download links, numbered lists, and URLs
const MessageContent = ({ content }: { content: string }) => {
  // Match Google Drive links (both view and download formats)
  const resumeUrlMatch = content.match(/(https:\/\/drive\.google\.com\/[^\s]+?)([.,;!?]?\s|[.,;!?]?$)/);

  if (resumeUrlMatch) {
    const resumeUrl = resumeUrlMatch[1];
    const textBeforeLink = content.substring(0, resumeUrlMatch.index).trim();
    const textAfterLink = content.substring(resumeUrlMatch.index! + resumeUrlMatch[0].length).trim();

    const cleanedBefore = textBeforeLink.replace(/\s*(using this link|this link|here's|here is):?\s*$/i, '').trim();

    return (
      <>
        {cleanedBefore && <p className="mb-3">{cleanedBefore}</p>}
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 mb-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          View Resume
        </a>
        {textAfterLink && <p className="mt-3">{textAfterLink}</p>}
      </>
    );
  }

  // Check for numbered list pattern (1. item 2. item) and split into lines
  const numberedListMatch = content.match(/(\d+\.\s)/g);
  if (numberedListMatch && numberedListMatch.length >= 2) {
    // Split by numbered items while keeping the numbers
    const items = content.split(/(?=\d+\.\s)/);
    return (
      <div className="space-y-1">
        {items.map((item, idx) => {
          const trimmed = item.trim();
          if (!trimmed) return null;
          return (
            <div key={idx}>{renderTextWithLinks(trimmed, `item-${idx}`)}</div>
          );
        })}
      </div>
    );
  }

  // Handle newlines - split by \n and render with line breaks
  if (content.includes('\n')) {
    const lines = content.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => (
          <div key={idx}>{renderTextWithLinks(line, `line-${idx}`)}</div>
        ))}
      </div>
    );
  }

  // Default: render with clickable URLs
  return <>{renderTextWithLinks(content)}</>;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastResponseId, setLastResponseId] = useState<string | undefined>();
  const [sessionId, setSessionId] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load session from localStorage or add welcome message
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      try {
        const session: ChatSession = JSON.parse(stored);
        setMessages(session.messages);
        setMessageCount(session.messageCount);
        setLastResponseId(session.lastResponseId);
        setSessionId(session.sessionId || generateSessionId());
      } catch (error) {
        console.error('Failed to load chat session:', error);
      }
    } else {
      // Add welcome message on first visit
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);

      const welcomeMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hey! I'm Sujeeth's AI assistant. Ask me anything about his background, experience, tech stack, or availability. What would you like to know?",
        timestamp: Date.now(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Save session to localStorage
  useEffect(() => {
    if (messages.length > 0 && sessionId) {
      const session: ChatSession = {
        sessionId,
        messages,
        messageCount,
        lastMessageTime: Date.now(),
        lastResponseId,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }, [messages, messageCount, lastResponseId, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (messageCount >= MAX_MESSAGES_PER_SESSION) {
      const limitMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "You've reached the question limit for this session. If you'd like to continue the conversation, please reach out via email!",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      // Use Responses API with previous_response_id for efficient conversation chaining
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          previousResponseId: lastResponseId,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      // Create assistant message placeholder
      const assistantMessageId = crypto.randomUUID();
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }]);

      let accumulatedContent = '';
      let responseId: string | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              // Capture response ID from response.created event
              if (parsed.type === 'response.created' || parsed.type === 'response.completed') {
                if (parsed.response?.id) {
                  responseId = parsed.response.id;
                }
              }

              // Extract content delta from Responses API format
              if (parsed.type === 'response.output_text.delta' && parsed.delta) {
                accumulatedContent += parsed.delta;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Ignore parse errors for non-JSON lines
            }
          }
        }
      }

      // Store response ID for next message
      if (responseId) {
        setLastResponseId(responseId);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hold up—are you a bot? Too many questions too fast. Take a breather, then try again. Or just email Sujeeth if this is urgent.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);

    // Generate new session ID
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);

    const welcomeMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: "Hey! I'm Sujeeth's AI assistant. Ask me anything about his background, experience, tech stack, or availability. What would you like to know?",
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);
    setMessageCount(0);
    setLastResponseId(undefined);
  };

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 z-40 group ring-2 ring-primary/20 hover:ring-primary/40",
          isOpen ? "scale-0 pointer-events-none" : "scale-100"
        )}
        size="icon"
      >
        <Bot style={{ width: '32px', height: '32px' }} strokeWidth={2} />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed top-0 left-0 right-0 bottom-0 md:top-auto md:left-auto md:bottom-6 md:right-6 w-full md:w-96 md:h-[600px] md:max-h-[80vh] shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <div>
              <h3 className="font-semibold text-lg">Ask me Anything (Not Anything)</h3>
              <p className="text-xs text-muted-foreground">
                {messageCount}/{MAX_MESSAGES_PER_SESSION} questions used
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                title="Clear chat"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-4 py-2 text-sm",
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <MessageContent content={msg.content} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t shrink-0">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="resize-none min-h-[60px] max-h-[120px]"
                disabled={isLoading || messageCount >= MAX_MESSAGES_PER_SESSION}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || messageCount >= MAX_MESSAGES_PER_SESSION}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
