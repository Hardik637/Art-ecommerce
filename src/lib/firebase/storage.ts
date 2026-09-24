import { getAdminStorage } from './admin';

/**
 * Upload an artwork image buffer to Firebase Cloud Storage.
 * Returns the public download URL or null if storage is not configured.
 */
export async function uploadArtworkImageToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string | null> {
  const storage = getAdminStorage();
  if (!storage) return null;

  try {
    const bucket = storage.bucket();
    const destination = `artworks/${Date.now()}_${filename}`;
    const file = bucket.file(destination);

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000',
      },
      public: true,
    });

    // Generate public URL
    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
  } catch (err) {
    console.error('[Firebase Storage] Upload error:', err);
    return null;
  }
}
