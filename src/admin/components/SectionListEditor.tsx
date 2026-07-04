/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUp, ArrowDown, X, Plus } from 'lucide-react';
import Field from './Field';
import TextArea from './TextArea';

export interface SectionItem {
  heading: string;
  body: string;
}

interface SectionListEditorProps {
  label: string;
  values: SectionItem[];
  onChange: (values: SectionItem[]) => void;
  addLabel?: string;
}

export default function SectionListEditor({
  label,
  values,
  onChange,
  addLabel = 'Add Section',
}: SectionListEditorProps) {
  const updateAt = (index: number, patch: Partial<SectionItem>) => {
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
    onChange([...values, { heading: '', body: '' }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="font-mono text-xs text-on-surface-variant uppercase font-bold">{label}</label>
      {values.map((item, index) => (
        <div
          key={index}
          className="border-[0.5px] border-outline-variant bg-surface-container-low p-4 rounded-[2px] flex flex-col gap-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-grow">
              <Field label="Heading" value={item.heading} onChange={(v) => updateAt(index, { heading: v })} />
            </div>
            <div className="flex items-center gap-2 mt-6 flex-shrink-0">
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
          </div>
          <TextArea label="Body" value={item.body} onChange={(v) => updateAt(index, { body: v })} rows={4} />
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
