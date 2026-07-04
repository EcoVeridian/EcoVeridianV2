/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-sm border-[0.5px] border-outline-variant bg-surface-container-lowest rounded-[2px] p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-primary mb-2">{title}</h2>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border-[0.5px] border-outline text-on-surface-variant font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-error text-white font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:opacity-90 transition-opacity cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
