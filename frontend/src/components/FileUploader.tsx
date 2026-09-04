"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useTheme } from "@/lib/ThemeContext";

interface FileUploaderProps {
  accept: string;
  label: string;
  hint: string;
  icon?: React.ReactNode;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function FileUploader({
  accept,
  label,
  hint,
  icon,
  onFileSelect,
  disabled,
}: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const MAX_SIZE = 10 * 1024 * 1024;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const processFile = useCallback(
    (file: File) => {
      setFileError(null);
      if (file.size > MAX_SIZE) {
        setFileError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`);
        return;
      }
      setFileName(file.name);
      setFileSize(
        file.size > 1024 * 1024
          ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(0)} KB`
      );
      if (file.type.startsWith("image/")) {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
      } else {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
      }
      onFileSelect(file);
    },
    [onFileSelect, preview]
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function clearFile() {
    if (preview) URL.revokeObjectURL(preview);
    setFileName(null);
    setFileSize(null);
    setPreview(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  /* Container classes based on state */
  let containerClass =
    "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-150 ";

  if (disabled) {
    containerClass += isDark
      ? "opacity-50 cursor-not-allowed bg-[var(--surface)] border-[var(--border)]"
      : "opacity-50 cursor-not-allowed bg-[#F1F5F9] border-[#E2E8F0]";
  } else if (fileError) {
    containerClass += isDark
      ? "cursor-pointer bg-[var(--error-bg)] border-[var(--error-border)]"
      : "cursor-pointer bg-[#FEF2F2] border-[#FECACA]";
  } else if (dragOver) {
    containerClass += isDark
      ? "cursor-pointer bg-[var(--primary-light)] border-[var(--primary)]"
      : "cursor-pointer bg-[#DBEAFE] border-[#2563EB]";
  } else if (fileName) {
    containerClass += isDark
      ? "cursor-pointer bg-[var(--surface)] border-[var(--primary)] border-solid"
      : "cursor-pointer bg-[#F8FAFC] border-[#93C5FD] border-solid";
  } else {
    containerClass += isDark
      ? "cursor-pointer bg-[var(--surface)] border-[var(--border-strong)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]"
      : "cursor-pointer bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#EFF6FF]";
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[var(--foreground)]">{label}</label>

      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        className={containerClass}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          /* Image Preview */
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Upload preview"
              className={`max-h-40 rounded-lg mb-3 border ${isDark ? "border-[var(--border)]" : "border-[#E2E8F0]"}`}
            />
            <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-xs">{fileName}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{fileSize}</p>
          </div>
        ) : fileName ? (
          /* File Selected (non-image) */
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              isDark ? "bg-[var(--primary-light)]" : "bg-[#EFF6FF]"
            }`}>
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)] truncate max-w-xs">{fileName}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">{fileSize}</p>
            <p className="text-xs text-[var(--primary)] font-medium mt-1.5">Ready to analyze</p>
          </div>
        ) : (
          /* Empty / Drop State */
          <div className="flex flex-col items-center py-2">
            {icon ? (
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                dragOver
                  ? isDark ? "bg-[var(--primary-selected)] text-[var(--primary)]" : "bg-[#DBEAFE] text-[#1D4ED8]"
                  : isDark ? "bg-[var(--surface)] text-[var(--muted)]" : "bg-[#F1F5F9] text-[#64748B]"
              }`}>
                {icon}
              </div>
            ) : (
              <svg className={`w-10 h-10 mb-4 transition-colors ${
                dragOver
                  ? isDark ? "text-[var(--primary)]" : "text-[#1D4ED8]"
                  : isDark ? "text-[var(--placeholder)]" : "text-[#94A3B8]"
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
            <p className="text-sm font-medium text-[var(--foreground)] mb-1">
              {dragOver ? (
                <span className="text-[var(--primary)] font-semibold">Drop to upload</span>
              ) : (
                <>
                  Drag &amp; drop or <span className="text-[var(--primary)] font-semibold">browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-[var(--muted)]">{hint}</p>
          </div>
        )}
      </div>

      {/* Error */}
      {fileError && (
        <div className={`flex items-start gap-1.5 text-xs rounded-lg px-3 py-2 ${
          isDark
            ? "text-[var(--error-text)] bg-[var(--error-bg)] border border-[var(--error-border)]"
            : "text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]"
        }`}>
          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{fileError}</span>
        </div>
      )}

      {/* Clear button */}
      {fileName && !disabled && (
        <button
          onClick={(e) => { e.stopPropagation(); clearFile(); }}
          className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--error-text)] transition-colors mt-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove file
        </button>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" disabled={disabled} />
    </div>
  );
}
