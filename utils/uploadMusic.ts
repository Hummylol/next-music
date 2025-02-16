import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadMusic(file: File, fileName: string) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop()?.toLowerCase(); // Ensure lowercase extension
  const sanitizedFileName = fileName
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_") // Remove special characters and trim spaces
    .replace(/_{2,}/g, "_") // Replace multiple underscores with a single one
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
  
  const uniqueFilePath = `songs/${sanitizedFileName}_${Date.now()}.${fileExt}`; // Ensure uniqueness

  console.log("Uploading file to:", uniqueFilePath); // Debugging

  const { data, error } = await supabase.storage
    .from('music')
    .upload(uniqueFilePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload failed:', error);
    return null;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage.from('music').getPublicUrl(uniqueFilePath);
  return urlData?.publicUrl;
}

export const getUploadedSongs = async (): Promise<string[]> => {
  const { data, error } = await supabase.storage.from("music").list("songs");

  if (error) {
    console.error("Error fetching songs:", error.message);
    return [];
  }

  return data.map((file) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/music/songs/${file.name}`);
};
