import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Folder,
  Trash2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { PhotoItem } from "../../server/defaultData";
import { uploadToCloudinarySigned } from "../../services/cmsService";

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  subtitle: string;
  category: string;
  sizeMb: string;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  errorMessage?: string;
  uploadedUrl?: string;
  publicId?: string;
}

interface CloudinaryPhotoUploaderProps {
  categories: string[];
  defaultCategory?: string;
  onPhotosUploaded: (newPhotos: PhotoItem[]) => void;
  onCancel?: () => void;
}

export const CloudinaryPhotoUploader: React.FC<CloudinaryPhotoUploaderProps> = ({
  categories,
  defaultCategory,
  onPhotosUploaded,
  onCancel,
}) => {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [selectedBatchCategory, setSelectedBatchCategory] = useState<string>(
    defaultCategory || categories[0] || "Computer Lab"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate single file
  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (file.type && !validTypes.includes(file.type)) {
      return "Only JPG, PNG, WEBP, GIF, and SVG formats are supported.";
    }
    if (file.size > 10 * 1024 * 1024) {
      return `File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max limit is 10MB.`;
    }
    return null;
  };

  // Process incoming files into queue
  const handleAddFiles = (files: FileList | File[]) => {
    setGeneralError(null);
    const newItems: QueuedFile[] = [];

    Array.from(files).forEach((file, index) => {
      const error = validateFile(file);
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      newItems.push({
        id: `queue-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title: cleanTitle,
        subtitle: "Institute activity photograph",
        category: selectedBatchCategory,
        sizeMb: (file.size / (1024 * 1024)).toFixed(2),
        status: error ? "error" : "idle",
        progress: 0,
        errorMessage: error || undefined,
      });
    });

    setQueue((prev) => [...prev, ...newItems]);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Remove individual file from queue
  const handleRemove = (id: string) => {
    setQueue((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // Update field of queued item
  const handleUpdateItem = (id: string, updates: Partial<QueuedFile>) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Start Upload
  const handleStartUpload = async () => {
    const pendingItems = queue.filter(
      (item) => item.status === "idle" || item.status === "error"
    );

    if (pendingItems.length === 0) {
      setGeneralError("Please select valid photos to upload.");
      return;
    }

    setIsUploading(true);
    setGeneralError(null);
    let completedCount = 0;
    const successfullyUploadedPhotos: PhotoItem[] = [];

    for (const item of pendingItems) {
      // Mark as uploading
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: "uploading", progress: 5, errorMessage: undefined } : q
        )
      );

      const result = await uploadToCloudinarySigned(item.file, {
        uploadPreset: "amol-institute-photos",
        folder: "amol-institute",
        onProgress: (percent) => {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: Math.max(5, percent) } : q))
          );
        },
      });

      if (result.success && result.url) {
        completedCount++;
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: "success",
                  progress: 100,
                  uploadedUrl: result.url,
                  publicId: result.publicId,
                }
              : q
          )
        );

        // Build PhotoItem for CMS state
        successfullyUploadedPhotos.push({
          id: `photo-${Date.now()}-${completedCount}`,
          title: item.title,
          subtitle: item.subtitle,
          image: result.url,
          category: item.category,
          visible: true,
          order: 999, // order will be normalised by parent
          publicId: result.publicId,
          bytes: result.bytes,
          format: result.format,
        });
      } else {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: "error",
                  progress: 0,
                  errorMessage: result.error || "Upload failed",
                }
              : q
          )
        );
      }

      setOverallProgress(Math.round(((completedCount) / pendingItems.length) * 100));
    }

    setIsUploading(false);
    setSuccessCount((prev) => prev + completedCount);

    if (successfullyUploadedPhotos.length > 0) {
      onPhotosUploaded(successfullyUploadedPhotos);
    }

    if (completedCount < pendingItems.length) {
      setGeneralError(
        `${completedCount} of ${pendingItems.length} photos uploaded. Check items with errors below.`
      );
    }
  };

  const handleClearCompleted = () => {
    setQueue((prev) => {
      const remaining = prev.filter((item) => item.status !== "success");
      prev
        .filter((item) => item.status === "success")
        .forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return remaining;
    });
    setSuccessCount(0);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-semibold text-slate-900">
              Upload Institute Photographs
            </h3>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Cloudinary Signed Preset</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Files are signed with server-verified Centre Director credentials and saved to folder{" "}
            <code className="text-slate-700 font-mono bg-slate-100 px-1 py-0.5 rounded">
              amol-institute
            </code>
            .
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
          >
            Close Uploader
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
            : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-2xs">
          <Upload className="w-5 h-5" />
        </div>

        <p className="text-sm font-semibold text-slate-800">
          Click to browse or drag and drop photographs here
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports JPG, PNG, WEBP, GIF, SVG • Multiple file selection • Max 10MB per image
        </p>

        {/* Quick Batch Category Picker */}
        <div
          className="inline-flex items-center space-x-2 mt-4 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs"
          onClick={(e) => e.stopPropagation()}
        >
          <Folder className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium">Default Category:</span>
          <select
            value={selectedBatchCategory}
            onChange={(e) => setSelectedBatchCategory(e.target.value)}
            className="text-xs font-semibold text-blue-600 bg-transparent focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* General Error or Success Notification */}
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold">Upload notice:</span> {generalError}
          </div>
          <button
            onClick={() => setGeneralError(null)}
            className="text-red-400 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successCount > 0 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>{successCount} photo{successCount > 1 ? "s" : ""}</strong> successfully uploaded
              to Cloudinary and added to your CMS draft.
            </span>
          </div>
          <button
            onClick={handleClearCompleted}
            className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer transition-colors"
          >
            Clear Completed
          </button>
        </div>
      )}

      {/* Queue Preview List */}
      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Selected Photos ({queue.length})
            </h4>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  queue.forEach((q) => URL.revokeObjectURL(q.previewUrl));
                  setQueue([]);
                }}
                disabled={isUploading}
                className="text-xs text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border flex space-x-3 transition-colors ${
                  item.status === "error"
                    ? "bg-red-50/40 border-red-200"
                    : item.status === "success"
                    ? "bg-emerald-50/40 border-emerald-200"
                    : "bg-white border-slate-200"
                }`}
              >
                {/* Thumbnail Preview */}
                <div className="w-20 h-20 rounded-md bg-slate-100 shrink-0 overflow-hidden relative border border-slate-200">
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                  {item.status === "success" && (
                    <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                  )}
                </div>

                {/* Details & Controls */}
                <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-1">
                    <input
                      type="text"
                      value={item.title}
                      disabled={isUploading || item.status === "success"}
                      onChange={(e) =>
                        handleUpdateItem(item.id, { title: e.target.value })
                      }
                      placeholder="Photo title"
                      className="font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none w-full text-xs"
                    />

                    {item.status !== "uploading" && (
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={item.category}
                      disabled={isUploading || item.status === "success"}
                      onChange={(e) =>
                        handleUpdateItem(item.id, { category: e.target.value })
                      }
                      className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <span className="text-[10px] text-slate-400">
                      {item.sizeMb} MB
                    </span>
                  </div>

                  {/* Progress bar or Status message */}
                  {item.status === "uploading" && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-blue-600 font-medium">
                        Uploading to Cloudinary: {item.progress}%
                      </span>
                    </div>
                  )}

                  {item.status === "error" && (
                    <p className="text-[11px] text-red-600 font-medium leading-tight">
                      {item.errorMessage || "Failed to upload"}
                    </p>
                  )}

                  {item.status === "success" && (
                    <div className="flex items-center space-x-1 text-[11px] text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Saved: {item.publicId || "Uploaded"}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Preset: <span className="font-semibold text-slate-700">amol-institute-photos</span> • Folder:{" "}
              <span className="font-semibold text-slate-700">amol-institute</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {queue.some((i) => i.status === "error") && (
                <button
                  type="button"
                  onClick={handleStartUpload}
                  disabled={isUploading}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Failed</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleStartUpload}
                disabled={
                  isUploading ||
                  queue.every((i) => i.status === "success")
                }
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0062d2] hover:bg-[#0052b3] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs hover:shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading ({overallProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload {queue.filter((i) => i.status !== "success").length} Photos</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
