import AvatarPicker from "@/components/ui/AvatarPicker";
import useAuth from "@/hooks/useAuth";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { updateUserAvatar } from "@/api/userApi"; // assume this function sends the file to cloud and updates the user
import { useDispatch } from "react-redux";
import { updateSucess } from "@/features/userSlice";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

function EditAvatar() {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    avatar: "",
    avatarId: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: previewUrl }));
  };

  useEffect(() => {
    if (user?.avatar) {
      setFormData((prev) => ({ ...prev, avatar: user.avatar }));
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);
    setAlertMessage(null);
    setSuccessMsg(null);

    if (!avatarFile) {
      setAlertMessage("Please choose a new avatar image.");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload image to Cloudinary
      const { imageUrl, imageId } = await uploadToCloudinary(avatarFile);

      if (!imageUrl || !imageId) {
        throw new Error("Upload failed");
      }
      const lo = {
        avatar: imageUrl,
        avatarId: imageId,
      };
      console.log(lo);

      // 2. Send to backend
      const res = await updateUserAvatar({
        avatar: imageUrl,
        avatarId: imageId,
      });

      if (res.status === "success") {
        dispatch(updateSucess(res.data));
        setSuccessMsg("Avatar updated successfully.");
        setAvatarFile(null);
      } else {
        setAlertMessage("Upload failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setAlertMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-3 space-y-4 flex flex-col items-center">
      <h2 className="text-xl font-semibold w-full text-center">
        Edit Profile Avatar
      </h2>

      {alertMessage && (
        <Alert
          type="error"
          message="Error"
          description={alertMessage}
          dismissible
        />
      )}
      {successMsg && (
        <Alert
          type="success"
          message="Success"
          description={successMsg}
          dismissible
        />
      )}

      <AvatarPicker
        imageUrl={formData.avatar}
        onChange={handleAvatarChange}
        disabled={loading}
      />

      <Button
        className="w-1/2"
        onClick={handleSubmit}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Save Avatar"}
      </Button>
    </section>
  );
}

export default EditAvatar;
