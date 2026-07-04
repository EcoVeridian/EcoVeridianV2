/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Loader2 } from 'lucide-react';
import { PublishStatus } from '../../types';

interface PublishBarProps {
  dirty: boolean;
  publishStatus: PublishStatus;
  busy: boolean;
  onSave: (status: PublishStatus) => void;
  onUnpublish?: () => void;
}

export default function PublishBar({ dirty, publishStatus, busy, onSave, onUnpublish }: PublishBarProps) {
  return (
    <div className="sticky bottom-0 bg-surface border-t-[0.5px] border-outline-variant py-3 flex items-center justify-between gap-4 mt-8">
      <span className="font-mono text-xs uppercase tracking-wider text-secondary">
        {dirty ? 'Unsaved changes' : ' '}
      </span>
      <div className="flex items-center gap-3">
        {onUnpublish && publishStatus === 'published' && (
          <button
            type="button"
            onClick={onUnpublish}
            disabled={busy}
            className="px-5 py-2.5 border-[0.5px] border-outline text-on-surface-variant font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer disabled:opacity-50"
          >
            Unpublish
          </button>
        )}
        <button
          type="button"
          onClick={() => onSave('draft')}
          disabled={busy}
          className="px-5 py-2.5 border-[0.5px] border-outline text-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => onSave('published')}
          disabled={busy}
          className="px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
        >
          {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {publishStatus === 'published' ? 'Save & Publish' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
