import cloudinary from "../lib/cloudinary.js";

/**
 * Deletes an image from Cloudinary using its public_id.
 * @param {string} publicId - The image's public_id (e.g. "misane_uploads/abc123")
 * @returns {Promise<boolean>} - Returns true if deletion was successful
 */
export async function deleteImageFromCloudinary(publicId) {
  if (!publicId || typeof publicId !== "string") {
    throw new Error("Invalid or missing publicId");
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return result.result === "ok";
  } catch (err) {
    console.error("Cloudinary deletion error:", err);
    throw new Error("Failed to delete image from Cloudinary");
  }
}
