/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitProjectSubmission } from '../content/publicDb';
import { useSiteSettings } from '../content/ContentContext';
import { Send, Info, Loader2, AlertTriangle, UploadCloud, FileText, X, ChevronLeft } from 'lucide-react';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // FormSubmit's attachment limit

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmitProjectView() {
  const settings = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({ name: '', email: '', organization: '', title: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  // Spam honeypot: hidden field real users never fill.
  const [website, setWebsite] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ title: string; name: string } | null>(null);

  // FormSubmit navigates away to post the attachment, then redirects back
  // here via _next — read that back on load to show the confirmation.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') === '1') {
      setReceipt({
        title: sessionStorage.getItem('ev-submission-title') ?? 'your submission',
        name: sessionStorage.getItem('ev-submission-name') ?? 'there',
      });
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    // Field `name` attributes are capitalized for the FormSubmit email table;
    // lowercase the first letter to get the matching state key.
    const key = name.charAt(0).toLowerCase() + name.slice(1);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (selected: File | null) => {
    setFileError(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFileError('File must be under 10 MB.');
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bots that filled the honeypot get a fake success and no processing.
    if (website.trim() !== '') {
      setReceipt({ title: form.title, name: form.name });
      return;
    }

    if (!file) {
      setFileError('Attach your journal or project file to continue.');
      return;
    }

    if (!settings.cloudinaryCloudName || !settings.cloudinaryUploadPreset) {
      setSubmitError(
        `File uploads aren't configured yet. Please email your submission directly to ${settings.contactEmail}.`,
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    // 1. Upload the file to Cloudinary so admins get a downloadable link —
    // FormSubmit only emails the attachment, it doesn't expose a fetchable URL.
    setSubmitStep('Uploading your file...');
    let fileUrl = '';
    try {
      const cloudForm = new FormData();
      cloudForm.append('file', file);
      cloudForm.append('upload_preset', settings.cloudinaryUploadPreset);
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${settings.cloudinaryCloudName}/auto/upload`,
        { method: 'POST', body: cloudForm },
      );
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.secure_url) {
        throw new Error(uploadJson?.error?.message || 'Upload failed');
      }
      fileUrl = uploadJson.secure_url;
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? `We could not upload your file (${err.message}). Please try again, or email us directly at ${settings.contactEmail}.`
          : `We could not upload your file. Please try again, or email us directly at ${settings.contactEmail}.`,
      );
      setSubmitting(false);
      return;
    }

    // 2. Store in the team's review queue (Firestore) — the primary record.
    setSubmitStep('Recording your submission...');
    const submissionId = await submitProjectSubmission({
      name: form.name,
      email: form.email,
      organization: form.organization,
      title: form.title,
      description: form.description,
      fileUrl,
      fileName: file.name,
    });

    if (!submissionId) {
      setSubmitError(
        `We could not save your submission right now. Please try again, or email us directly at ${settings.contactEmail}.`,
      );
      setSubmitting(false);
      return;
    }

    // 3. Hand off to FormSubmit for the email notification with the file
    // attached — this is a real (non-AJAX) multipart POST, so the browser
    // navigates away and FormSubmit redirects back to '_next' once it's done.
    setSubmitStep('Notifying the team...');
    sessionStorage.setItem('ev-submission-title', form.title);
    sessionStorage.setItem('ev-submission-name', form.name);
    formRef.current?.submit();
  };

  const handleResetForm = () => {
    setForm({ name: '', email: '', organization: '', title: '', description: '' });
    setFile(null);
    setFileError(null);
    setWebsite('');
    setSubmitError(null);
    setReceipt(null);
  };

  const nextUrl = `${window.location.origin}/resources/submit?sent=1`;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-20 animate-fade-in">
      <Link
        to="/resources"
        className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Resource Hub
      </Link>

      <div className="max-w-[720px] mb-16 text-left border-b-[0.5px] border-outline-variant pb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">Submit Your Journal or Project</h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
          Share your research journal, dataset, or project with the EcoVeridian team for review. Attach whatever
          format you have it in — PDF, Word doc, spreadsheet, slides, or a zipped folder.
        </p>
      </div>

      {receipt ? (
        <div className="max-w-3xl border-[0.5px] border-outline bg-surface-container-lowest p-6 md:p-8 rounded-[2px] animate-fade-in shadow-sm">
          <div className="mb-6 border-b-[0.5px] border-outline-variant pb-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary font-bold">Submission Received</h2>
          </div>
          <p className="font-sans text-sm text-on-surface mb-6 leading-relaxed">
            Thank you, <strong className="text-primary">{receipt.name}</strong>. "{receipt.title}" is now in our
            review queue and a team member will follow up by email if needed.
          </p>
          <button
            onClick={handleResetForm}
            className="py-2.5 px-6 border-[0.5px] border-outline text-primary font-mono text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors rounded-[2px] font-bold cursor-pointer"
          >
            Submit Another
          </button>
        </div>
      ) : (
        <div className="max-w-3xl">
          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            action={`https://formsubmit.co/${settings.formSubmitEmail}`}
            method="POST"
            encType="multipart/form-data"
            className="space-y-8"
          >
            {/* FormSubmit configuration fields */}
            <input type="hidden" name="_subject" value={`New Resource Hub Submission: ${form.title || '(untitled)'}`} />
            <input type="hidden" name="_replyto" value={form.email} />
            <input type="hidden" name="_next" value={nextUrl} />
            <input type="hidden" name="_template" value="table" />

            {/* Real fields stay mounted throughout submit — an await runs
                before formRef.submit() fires, and it only sends inputs
                present in the DOM at that moment, so swapping these out
                early would silently drop them from the FormSubmit POST. */}
            <div className={submitting ? 'relative opacity-40 pointer-events-none' : 'relative'}>
              {submitting && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface-container-lowest/90">
                  <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                  <p className="font-mono text-xs text-secondary italic">{submitStep}</p>
                </div>
              )}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="name">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="Name"
                      id="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      required
                      className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="organization">
                      Organization / School (optional)
                    </label>
                    <input
                      type="text"
                      name="Organization"
                      id="organization"
                      value={form.organization}
                      onChange={handleInputChange}
                      placeholder="Where you're studying or working from"
                      className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    id="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-on-surface-variant mb-2 uppercase font-bold" htmlFor="title">
                    Project / Journal Title
                  </label>
                  <input
                    type="text"
                    name="Title"
                    id="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Seasonal Visitation Forecast for Redwood NP"
                    required
                    className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    name="Description"
                    id="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe what this is and how it fits EcoVeridian's work."
                    rows={5}
                    className="bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary focus:bg-surface-container-low transition-all py-2 text-sm font-sans resize-y min-h-[100px] w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-on-surface-variant uppercase font-bold mb-2">
                    Attach File
                  </label>
                  {file ? (
                    <div className="flex items-center justify-between gap-3 border-[0.5px] border-outline bg-surface-container-low p-3 rounded-[2px]">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-secondary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-sans text-sm truncate">{file.name}</p>
                          <p className="font-mono text-[11px] text-outline">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleFileChange(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer flex-shrink-0"
                        aria-label="Remove file"
                      >
                        <X className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 border-[0.5px] border-dashed border-outline hover:border-primary p-8 rounded-[2px] transition-colors cursor-pointer text-on-surface-variant hover:text-primary"
                    >
                      <UploadCloud className="w-6 h-6" />
                      <span className="font-mono text-xs uppercase tracking-wider">Click to choose a file</span>
                      <span className="font-sans text-xs text-outline">Any format — PDF, Word, Excel, ZIP, etc. Up to 10 MB.</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="Attachment"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                  {fileError && (
                    <p className="font-sans text-xs text-error mt-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {fileError}
                    </p>
                  )}
                </div>

                {/* Honeypot field — hidden from humans, catnip for bots */}
                <div className="absolute w-px h-px overflow-hidden -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    name="_honeypot"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {submitError && (
                  <div className="flex items-start gap-3 bg-error-container/20 border-[0.5px] border-error/40 text-error p-4 rounded-[2px] text-sm font-sans">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="pt-6 border-t-[0.5px] border-outline-variant flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-sans text-outline">
                    <Info className="w-4 h-4" />
                    <span>Submissions are emailed straight to the EcoVeridian team for review.</span>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-container hover:text-on-primary text-on-primary font-mono text-xs uppercase tracking-widest font-semibold py-3 px-8 rounded-[2px] transition-colors flex items-center gap-3 cursor-pointer flex-shrink-0"
                  >
                    Submit
                    <Send className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
