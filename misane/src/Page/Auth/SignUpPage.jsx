import React, { useEffect, useState } from "react";
import AvatarPicker from "@/components/ui/AvatarPicker";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { useNavigate } from "react-router";
import { createUserSchema } from "@/validation/user.schema";
import image from "@/assets/images/default.png";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { signUpUser } from "@/api/userApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/features/userSlice";

function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    boi: "",
    firstname: "",
    surname: "",
    othername: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    avatarId: "",
  });

  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: previewUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Check if user changed the avatar
    if (formData.avatar === image) {
      setAlertMessage("Please select a custom avatar.");
      setLoading(false);
      return;
    }

    const { error } = createUserSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const formattedErrors = {};
      error.details.forEach((detail) => {
        formattedErrors[detail.path[0]] = detail.message;
      });
      setErrors(formattedErrors);
      setAlertMessage(error.details[0].message);
      setLoading(false);
      return;
    }

    setErrors({});
    setAlertMessage(null);

    try {
      const cloudImage = await uploadToCloudinary(avatarFile);
      if (cloudImage === null) {
        throw new Error("Cloudinary Error");
      }

      // 👇 Build the final payload
      const userPayload = {
        ...formData,
        avatar: cloudImage.imageUrl,
        avatarId: cloudImage.imageId,
      };

      console.log("Sending:", userPayload);
      const res = await signUpUser(userPayload);
      if (res.status === "success") {
        dispatch(loginSuccess(res.data));
        setTimeout(() => {
          setLoading(false);
          setSuccessMsg("Account Created Successfully");
          navigate("/");
        }, 1200);
      } else {
        setAlertMessage(res.data);
        throw new Error(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setAvaterDefualt = () => {
      setFormData((prev) => ({ ...prev, avatar: image }));
    };
    setAvaterDefualt();
  }, []);

  return (
    <main className="w-full min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AvatarPicker
            imageUrl={formData.avatar}
            onChange={handleAvatarChange}
            disabled={loading}
          />

          <Input
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            loading={loading}
            placeholder="e.g. Blogger, Engineer, Chef, Mr"
            helperText="Optional: shown under your name on your profile."
          />

          <Input
            name="firstname"
            label="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
            loading={loading}
            placeholder="e.g. Roddrick"
            helperText="Used to personalize your experience and profile."
          />

          <Input
            name="surname"
            label="Surname"
            value={formData.surname}
            onChange={handleChange}
            required
            loading={loading}
            placeholder="e.g. Mensah"
            helperText="Also shown publicly on your profile."
          />

          <Input
            name="othername"
            label="Other Name"
            value={formData.othername}
            onChange={handleChange}
            loading={loading}
            placeholder="e.g. Kwame"
            helperText="Optional: Include a middle or second name if you like."
          />

          <Input
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            required
            loading={loading}
            placeholder="e.g. rodblogwriter"
            helperText="Your unique username for login. Letters and numbers only."
          />

          <Input
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            loading={loading}
            placeholder="e.g. rod@example.com"
            helperText="Used for login and important account updates."
          />

          <Textarea
            name="boi"
            label="Bio"
            value={formData.boi}
            onChange={handleChange}
            loading={loading}
            placeholder="Tell us a bit about yourself..."
            helperText="Optional: A short intro shown on your profile and posts."
          />

          <Input
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            loading={loading}
            placeholder="Minimum 6 characters"
            helperText="You'll need this to log into your account."
          />

          {alertMessage && (
            <Alert
              type="error"
              message="Validation Error"
              description={alertMessage}
              dismissible
            />
          )}
          {successMsg && (
            <Alert
              type="success"
              message="Validation Error"
              description={successMsg}
              dismissible
            />
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create Account
          </Button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => navigate("/auth/login")}
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}

export default SignUpPage;
