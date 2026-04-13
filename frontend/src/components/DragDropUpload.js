import { useState, useRef, useCallback } from "react";
import { Upload, X, Image, Loader2 } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function DragDropUpload({ value, onChange, token, testId = "image-upload" }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Только изображения (JPG)");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const headers = { "Content-Type": "multipart/form-data" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(`${BACKEND_URL}/api/upload`, formData, { headers });
      const url = `${BACKEND_URL}${res.data.url}`;
      onChange(url);
    } catch (e) {
      console.error("Upload failed:", e);
      setError("Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  }, [onChange, token]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragging(false); };
  const handleClick = () => inputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
  };

  if (value) {
    return (
      <div data-testid={testId} className="relative group">
        <div className="relative overflow-hidden border border-white/10 bg-brand-surface">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-40 object-cover"
            data-testid={`${testId}-preview`}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              data-testid={`${testId}-remove`}
              className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid={testId}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        data-testid={`${testId}-dropzone`}
        className={`
          border-2 border-dashed cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center p-8 gap-3
          ${dragging
            ? "border-brand-gold bg-brand-gold/5"
            : "border-white/15 hover:border-white/30 bg-transparent"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="text-brand-gold animate-spin" />
            <p className="text-xs text-zinc-400">Загрузка...</p>
          </>
        ) : (
          <>
            {dragging ? (
              <Image size={28} className="text-brand-gold" />
            ) : (
              <Upload size={28} className="text-zinc-500" />
            )}
            <p className="text-xs text-zinc-400 text-center">
              {dragging ? "Отпустите файл" : "Перетащите JPG сюда или нажмите для выбора"}
            </p>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mt-1" data-testid={`${testId}-error`}>{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        data-testid={`${testId}-input`}
      />
    </div>
  );
}
