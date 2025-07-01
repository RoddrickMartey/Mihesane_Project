export const uploadToCloudinary = async (file) => {
  const cloudName = "dd4bv2upq"; // replace this
  const uploadPreset = "rodco_business_hub"; // replace this (must be unsigned)

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    return {
      imageUrl: data.secure_url,
      imageId: data.public_id,
    };
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return null;
  }
};
