import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const uploadBucket = "uploads";

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9_.-]/g, "-")}`;
  const { data, error } = await supabase.storage
    .from(uploadBucket)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error || !data) {
    throw error ?? new Error("Upload failed");
  }

  const { data: urlData, error: urlError } = supabase.storage
    .from(uploadBucket)
    .getPublicUrl(data.path);

  if (urlError || !urlData.publicUrl) {
    throw urlError ?? new Error("Failed to get public URL");
  }

  return urlData.publicUrl;
}
