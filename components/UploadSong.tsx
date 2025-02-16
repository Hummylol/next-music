'use client';

import { useState } from "react";
import { uploadMusic } from "@/utils/uploadMusic";
import { UploadCloud } from "lucide-react";

export default function UploadSong() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    
    setUploading(true);
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
    const url = await uploadMusic(file, fileName);
    setUploading(false);
    
    if (url) {
      alert("Upload successful!");
      setFile(null);
      window.location.reload(); // Reload to reflect new uploads
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-[#111111] text-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-lg font-semibold">Upload MP3 File</h2>

      <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-[#333] rounded-lg cursor-pointer hover:border-white hover:bg-[#181818] transition">
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex flex-col items-center">
          <UploadCloud className="w-8 h-8 text-gray-400" />
          <span className="text-gray-400 text-sm mt-2">
            {file ? file.name.replace(/\.[^/.]+$/, "") : "Click to select an MP3 file"}
          </span>
        </div>
      </label>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-2 text-black bg-[#ffffff] hover:bg-[#e0e0e0] rounded-md disabled:bg-[#333] transition"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
