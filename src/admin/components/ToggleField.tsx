/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}

export default function ToggleField({ label, checked, onChange, hint }: ToggleFieldProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="appearance-none w-4 h-4 border-[0.5px] border-outline rounded-sm checked:bg-primary checked:border-primary transition-colors cursor-pointer flex-shrink-0"
      />
      <span className="flex flex-col">
        <span className="font-mono text-xs uppercase font-bold text-on-surface-variant">{label}</span>
        {hint && <span className="font-sans text-[11px] text-outline">{hint}</span>}
      </span>
    </label>
  );
}
