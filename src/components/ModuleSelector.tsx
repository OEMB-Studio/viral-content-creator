import { MODULES, type ModuleId } from '@/lib/modules';
import { cn } from '@/lib/utils';

interface Props {
  selected: ModuleId;
  onSelect: (id: ModuleId) => void;
  collapsed?: boolean;
}

export default function ModuleSelector({ selected, onSelect, collapsed }: Props) {
  return (
    <div className="flex flex-col gap-1 p-2">
      {MODULES.map((mod) => (
        <button
          key={mod.id}
          onClick={() => onSelect(mod.id)}
          title={mod.name}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all text-left',
            selected === mod.id
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
          )}
        >
          <span className="text-lg flex-shrink-0">{mod.icon}</span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-medium truncate">{mod.name}</div>
              <div className="text-xs text-muted-foreground truncate">{mod.shortDescription}</div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
