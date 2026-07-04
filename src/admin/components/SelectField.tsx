/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  hint?: string;
  id?: string;
}

export default function SelectField({ label, value, onChange, options, hint, id }: SelectFieldProps) {
  const inputId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="flex flex-col">
      <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor={inputId}>
        {label}
      </label>
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23717973' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em',
        }}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="font-sans text-[11px] text-outline mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  );
}
