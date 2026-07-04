/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
  id?: string;
}

export default function TextArea({ label, value, onChange, hint, rows = 4, id }: TextAreaProps) {
  const inputId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="flex flex-col">
      <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans resize-y w-full"
      />
      {hint && <p className="font-sans text-[11px] text-outline mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  );
}
