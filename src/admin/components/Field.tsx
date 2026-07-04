/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InputHTMLAttributes } from 'react';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  mono?: boolean;
}

export default function Field({ label, value, onChange, hint, mono, id, className, ...rest }: FieldProps) {
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="flex flex-col">
      <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm ${
          mono ? 'font-mono' : 'font-sans'
        } ${className ?? ''}`}
        {...rest}
      />
      {hint && <p className="font-sans text-[11px] text-outline mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  );
}
