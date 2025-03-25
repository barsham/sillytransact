
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ConfigOption } from '@/utils/mockData';

interface ConfigurationPanelProps {
  config: ConfigOption;
  className?: string;
  onUpdate?: (id: string, value: string) => void;
}

const ConfigurationPanel = ({ config, className, onUpdate }: ConfigurationPanelProps) => {
  const [value, setValue] = useState(config.value);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  const handleToggleChange = () => {
    const newValue = value === 'true' ? 'false' : 'true';
    setValue(newValue);
    onUpdate?.(config.id, newValue);
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate?.(config.id, value);
  };

  const getCategoryBadgeClass = () => {
    switch (config.category) {
      case 'network':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'security':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'processing':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'monitoring':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'notification':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className={cn(
      "glass-card p-4 transition-all-300 hover:shadow-glass-hover",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium">
            {config.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn(
              "text-xs px-2 py-0.5 rounded-full border",
              getCategoryBadgeClass()
            )}>
              {config.category}
            </div>
          </div>
        </div>
        {config.type === 'boolean' ? (
          <button
            onClick={handleToggleChange}
            className={cn(
              "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
              value === 'true' ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span className="sr-only">Toggle {config.name}</span>
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                value === 'true' ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-muted-foreground hover:text-foreground transition-all-200 rounded-full h-6 w-6 flex items-center justify-center"
          >
            {isEditing ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            )}
          </button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">
        {config.description}
      </p>
      
      {isEditing ? (
        <div className="space-y-2">
          {config.type === 'select' && config.options ? (
            <select
              value={value}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {config.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={config.type === 'number' ? 'number' : 'text'}
              value={value}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs px-2 py-1 rounded border border-border hover:bg-secondary transition-all-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-all-200"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/50 rounded px-3 py-2 font-mono text-sm">
          {value}
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;
