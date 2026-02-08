import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { streamChat } from '@/lib/streamChat';
import { type ModuleId, getModule } from '@/lib/modules';
import ModuleSelector from '@/components/ModuleSelector';
import ChatMessage from '@/components/ChatMessage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, PanelLeftClose, PanelLeft, ArrowLeft, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Msg = { id?: string; role: 'user' | 'assistant'; content: string; module?: string | null };

export default function Studio() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [module, setModule] = useState<ModuleId>('orchestrator');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectName, setProjectName] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load project info and messages
  useEffect(() => {
    if (!projectId || !user) return;
    
    supabase.from('projects').select('name').eq('id', projectId).single()
      .then(({ data }) => { if (data) setProjectName(data.name); });

    supabase.from('chat_messages').select('*').eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setMessages(data.map(m => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            module: m.module,
          })));
        }
      });
  }, [projectId, user]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !user || !projectId) return;

    const userMsg: Msg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Save user message to DB
    const { data: savedMsg } = await supabase.from('chat_messages').insert({
      project_id: projectId,
      user_id: user.id,
      role: 'user',
      content: userMsg.content,
      module: module === 'orchestrator' ? null : module,
    }).select().single();

    let assistantSoFar = '';
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.id) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar, module }];
      });
    };

    try {
      const chatHistory = messages.filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-20)
        .map(m => ({ role: m.role, content: m.content }));

      await streamChat({
        messages: [...chatHistory, { role: 'user', content: userMsg.content }],
        module,
        projectId,
        onDelta: upsertAssistant,
        onDone: async () => {
          setIsLoading(false);
          // Save assistant message
          if (assistantSoFar) {
            await supabase.from('chat_messages').insert({
              project_id: projectId,
              user_id: user.id,
              role: 'assistant',
              content: assistantSoFar,
              module: module === 'orchestrator' ? null : module,
            });
          }
          // Update project timestamp
          await supabase.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', projectId);
        },
      });
    } catch (e: any) {
      setIsLoading(false);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  }, [input, isLoading, user, projectId, module, messages, toast]);

  const handleSaveOutput = async (msg: Msg) => {
    if (!user || !projectId) return;
    const mod = getModule((msg.module as ModuleId) || 'orchestrator');
    await supabase.from('saved_outputs').insert({
      project_id: projectId,
      user_id: user.id,
      module: msg.module || 'orchestrator',
      title: `Output de ${mod.name}`,
      content: msg.content,
      message_id: msg.id || null,
    });
    toast({ title: 'Guardado', description: 'Output guardado en el proyecto.' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentModule = getModule(module);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full border-r border-border bg-card overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-sm text-primary">Módulos</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ModuleSelector selected={module} onSelect={setModule} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
              <PanelLeft className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold truncate">{projectName || 'Proyecto'}</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{currentModule.icon}</span>
              <span>{currentModule.name}</span>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="text-5xl mb-4">{currentModule.icon}</div>
                <h2 className="text-xl font-semibold mb-2">{currentModule.name}</h2>
                <p className="text-muted-foreground text-sm">{currentModule.description}</p>
                <p className="text-muted-foreground text-xs mt-4">Escribe tu mensaje para comenzar...</p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              module={msg.module}
              onSave={msg.role === 'assistant' ? () => handleSaveOutput(msg) : undefined}
            />
          ))}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-3 py-4">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-sm border border-primary/20 animate-pulse">
                {currentModule.icon}
              </div>
              <div className="bg-card border border-border rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Escribe un mensaje para ${currentModule.name}...`}
              className="min-h-[44px] max-h-32 resize-none bg-secondary border-border"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="flex-shrink-0 h-11 w-11"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
