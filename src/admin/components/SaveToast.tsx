/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check } from 'lucide-react';

interface SaveToastProps {
  message: string;
  visible: boolean;
}

export default function SaveToast({ message, visible }: SaveToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-on-primary font-mono text-xs uppercase tracking-widest font-semibold px-4 py-3 rounded-[2px] shadow-sm animate-fade-in">
      <Check className="w-4 h-4 stroke-[1.5]" />
      {message}
    </div>
  );
}
