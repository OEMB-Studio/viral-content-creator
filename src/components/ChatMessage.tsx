import ReactMarkdown from 'react-markdown';
import { getModule, type ModuleId } from '@/lib/modules';
import { cn } from '@/lib/utils';
import { Bookmark } from 'lucide-react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
  module?: string | null;
  onSave?: () => void;
}

export default function ChatMessage({ role, content, module, onSave }: Props) {
  const mod = module ? getModule(module as ModuleId) : null;

  return (
    <div className={cn('group flex gap-3 py-4', role === 'user' ? 'justify-end' : '')}>
      {role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-sm border border-primary/20">
          {mod?.icon || '🧠'}
        </div>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-3 text-sm',
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border'
        )}
      >
        {role === 'assistant' && mod && (
          <div className="text-xs text-primary font-medium mb-2">{mod.name}</div>
        )}

        {role === 'assistant' ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}

        {role === 'assistant' && onSave && content && (
          <button
            onClick={onSave}
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          >
            <Bookmark className="w-3 h-3" />
            Guardar
          </button>
        )}
      </div>
    </div>
  );
}
