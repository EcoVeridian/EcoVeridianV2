/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUp, ArrowDown, X, Plus } from 'lucide-react';

export interface LinkItem {
  label: string;
  url: string;
}

interface LinkListEditorProps {
  label: string;
  values: LinkItem[];
  onChange: (values: LinkItem[]) => void;
  addLabel?: string;
}

export default function LinkListEditor({ label, values, onChange, addLabel = 'Add Link' }: LinkListEditorProps) {
  const updateAt = (index: number, patch: Partial<LinkItem>) => {
    const next = [...values];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const swap = (i: number, j: number) => {
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const add = () => {
    onChange([...values, { label: '', url: '' }]);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs text-on-surface-variant uppercase font-bold">{label}</label>
      {values.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={item.label}
            onChange={(e) => updateAt(index, { label: e.target.value })}
            placeholder="Label"
            className="w-32 flex-shrink-0 bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
          />
          <input
            value={item.url}
            onChange={(e) => updateAt(index, { url: e.target.value })}
            placeholder="https://..."
            className="flex-grow bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-mono"
          />
          <button
            type="button"
            onClick={() => swap(index, index - 1)}
            disabled={index === 0}
            className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Move up"
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={() => swap(index, index + 1)}
            disabled={index === values.length - 1}
            className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Move down"
          >
            <ArrowDown className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={() => removeAt(index)}
            className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer"
            aria-label="Remove"
          >
            <X className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start flex items-center gap-1.5 mt-1 font-mono text-[11px] uppercase tracking-wider text-primary hover:text-secondary transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
        {addLabel}
      </button>
    </div>
  );
}
