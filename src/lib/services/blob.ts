import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";

export interface UploadAssetParams {
  name: string;
  type:
    | "COVER"
    | "BANNER"
    | "BACKGROUND"
    | "CHARACTER"
    | "AVATAR"
    | "AUDIO_MUSIC"
    | "AUDIO_SFX"
    | "ENDING_ART";
  file: File | Blob;
  filename: string;
}

export async function uploadAsset({ name, type, file, filename }: UploadAssetParams) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  let url = "";

  if (token && token.startsWith("vercel_blob_")) {
    try {
      const blob = await put(`assets/${type.toLowerCase()}/${filename}`, file, {
        access: "public",
        token,
      });
      url = blob.url;
    } catch {
      url = `/assets/placeholders/${filename}`;
    }
  } else {
    // Local / Demo placeholder fallback
    url = `/assets/placeholders/${filename}`;
  }

  const asset = await db.asset.create({
    data: {
      name,
      type,
      url,
      sizeBytes: file.size || 0,
      mimeType: file.type || "application/octet-stream",
    },
  });

  return asset;
}

export async function deleteAsset(id: string) {
  const asset = await db.asset.findUnique({ where: { id } });
  if (!asset) return false;

  if (
    process.env.BLOB_READ_WRITE_TOKEN &&
    asset.url.includes("public.blob.vercel-storage.com")
  ) {
    try {
      await del(asset.url);
    } catch {}
  }

  await db.asset.delete({ where: { id } });
  return true;
}
