/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  StorageReference,
} from 'firebase/storage';
import {
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Upload,
  Trash2,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { requireFirebaseApp } from '../../lib/firebaseAdmin';
import ConfirmDialog from '../../components/ConfirmDialog';

interface MediaItem {
  path: string;
  name: string;
  url: string;
  kind: 'image' | 'document';
}

type LoadState =
  | { phase: 'loading' }
  | { phase: 'ready' }
  | { phase: 'unavailable'; message: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 20 * 1024 * 1024;

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [state, setState] = useState<LoadState>({ phase: 'loading' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storage = () => getStorage(requireFirebaseApp());

  const refresh = async () => {
    try {
      const [images, documents] = await Promise.all([
        listAll(ref(storage(), 'images')),
        listAll(ref(storage(), 'documents')),
      ]);
      const toItem = async (itemRef: StorageReference, kind: MediaItem['kind']): Promise<MediaItem> => ({
        path: itemRef.fullPath,
        name: itemRef.name,
        url: await getDownloadURL(itemRef),
        kind,
      });
      const resolved = await Promise.all([
        ...images.items.map((i) => toItem(i, 'image' as const)),
        ...documents.items.map((i) => toItem(i, 'document' as const)),
      ]);
      setItems(resolved.sort((a, b) => b.name.localeCompare(a.name)));
      setState({ phase: 'ready' });
    } catch (err) {
      // Most common cause: the Storage bucket hasn't been created yet
      // (Firebase console → Storage → Get Started, requires the Blaze plan).
      setState({
        phase: 'unavailable',
        message: err instanceof Error ? err.message : 'Storage is unavailable',
      });
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = (file: File) => {
    setUploadError(null);
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    if (!isImage && !isPdf) {
      setUploadError('Only images and PDF documents are supported.');
      return;
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      setUploadError('Images must be under 5 MB.');
      return;
    }
    if (isPdf && file.size > MAX_PDF_BYTES) {
      setUploadError('PDFs must be under 20 MB.');
      return;
    }

    const prefix = isImage ? 'images' : 'documents';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
    const path = `${prefix}/${Date.now()}-${safeName}`;

    setUploading(true);
    setUploadProgress(0);
    const task = uploadBytesResumable(ref(storage(), path), file, { contentType: file.type });
    task.on(
      'state_changed',
      (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => {
        setUploading(false);
        setUploadError(err.message);
      },
      async () => {
        setUploading(false);
        await refresh();
      },
    );
  };

  const handleCopy = async (item: MediaItem) => {
    await navigator.clipboard.writeText(item.url);
    setCopiedPath(item.path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteObject(ref(storage(), deleteTarget.path));
      await refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to delete file');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8 border-b-[0.5px] border-outline-variant pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary font-bold mb-2">Assets</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-secondary stroke-[1.5]" />
          Media Library
        </h1>
        <p className="font-sans text-sm text-on-surface-variant mt-2 leading-relaxed max-w-xl">
          Upload images and PDFs, then copy their URLs into article and resource fields. Deleting a
          file does not update content that still references it.
        </p>
      </header>

      {state.phase === 'loading' && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-outline animate-spin" />
        </div>
      )}

      {state.phase === 'unavailable' && (
        <div className="max-w-xl border-[0.5px] border-outline-variant bg-surface-container-low p-6 rounded-[2px]">
          <h2 className="font-serif text-lg font-bold text-primary mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-secondary" />
            Storage Not Set Up Yet
          </h2>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-3">
            Firebase Storage hasn't been enabled for this project, so uploads aren't available.
            An owner can enable it in the Firebase console (Storage → Get Started — Google requires
            the Blaze plan for new buckets, though usage at this site's scale stays within the free
            allowance). Until then, paste external image URLs directly into content fields — that's
            how the current site images work.
          </p>
          <p className="font-mono text-[10px] text-outline break-all">{state.message}</p>
        </div>
      )}

      {state.phase === 'ready' && (
        <>
          <div className="mb-8 flex items-center gap-4 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-5 py-2.5 bg-primary text-on-primary font-mono text-[11px] uppercase tracking-widest font-semibold rounded-[2px] hover:bg-primary-container transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload File
                </>
              )}
            </button>
            <span className="font-sans text-xs text-on-surface-variant">
              Images up to 5 MB · PDFs up to 20 MB
            </span>
          </div>

          {uploadError && (
            <p className="font-sans text-xs text-error mb-6 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {uploadError}
            </p>
          )}

          {items.length === 0 ? (
            <p className="font-sans text-sm text-on-surface-variant">
              No files yet — upload your first image or PDF above.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
              {items.map((item) => (
                <div
                  key={item.path}
                  className="border-[0.5px] border-outline-variant bg-surface-container-lowest rounded-[2px] overflow-hidden flex flex-col"
                >
                  {item.kind === 'image' ? (
                    <img src={item.url} alt={item.name} className="h-28 w-full object-cover" />
                  ) : (
                    <div className="h-28 w-full flex items-center justify-center bg-surface-container-low">
                      <FileText className="w-10 h-10 text-outline stroke-[1.5]" />
                    </div>
                  )}
                  <div className="p-2.5 flex flex-col gap-2">
                    <p className="font-mono text-[10px] text-on-surface-variant truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(item)}
                        className="flex-grow px-2 py-1.5 border-[0.5px] border-outline rounded-[2px] font-mono text-[9px] uppercase tracking-wider text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        {copiedPath === item.path ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3 h-3" />
                            Copy URL
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 border-[0.5px] border-outline rounded-[2px] text-on-surface-variant hover:border-error hover:text-error transition-colors cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete file?"
        message={`"${deleteTarget?.name ?? ''}" will be permanently deleted. Content still referencing its URL will show a broken link.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
