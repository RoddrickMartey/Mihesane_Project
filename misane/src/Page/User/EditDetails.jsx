import Input from "@/components/ui/Input";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Alert from "@/components/ui/Alert";
import { Edit, Save, X } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { updateUserDetailsSchema } from "@/validation/user.schema";
import { getFirstJoiErrorMessage } from "@/utils/findFirstMessage";
import { updateUserDetails } from "@/api/userApi";
import { useDispatch } from "react-redux";
import { updateSucess } from "@/features/userSlice";

function EditDetails() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    boi: "",
    firstname: "",
    surname: "",
    othername: "",
    username: "",
    email: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [initialData, setInitialData] = useState(null); // store original

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      const filled = {
        title: user.title || "",
        boi: user.boi || "",
        firstname: user.firstname || "",
        surname: user.surname || "",
        othername: user.othername || "",
        username: user.username || "",
        email: user.email || "",
      };
      setFormData(filled);
      setInitialData(filled); // keep original
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);
    setAlertMessage(null);
    setSuccessMsg(null);

    const { value, error } = updateUserDetailsSchema.validate(formData, {
      abortEarly: true,
    });

    if (error) {
      const errorMsg = getFirstJoiErrorMessage(error);
      setAlertMessage(errorMsg);
      setLoading(false); // important: stop loading on validation failure
      return;
    }

    try {
      const res = await updateUserDetails(value);

      if (res.status === "success") {
        dispatch(updateSucess(res.data));
        setSuccessMsg("Profile updated successfully.");
        setTimeout(() => {
          setSuccessMsg(null); // clear after showing
          setEditMode(false);
        }, 3000);
      } else {
        setAlertMessage(res.data);
      }
    } catch (err) {
      console.error(err);
      setAlertMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setEditMode(false);
    setAlertMessage(null);
    setSuccessMsg(null);
  };

  return (
    <section className="p-3 space-y-4">
      <h2 className="text-xl font-semibold">Edit Profile Details</h2>

      <div className="space-y-4">
        <Input
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          disabled={!editMode}
          loading={loading}
          placeholder="e.g. Blogger, Engineer, Chef, Mr"
          helperText="Optional: shown under your name on your profile."
        />

        <Input
          name="firstname"
          label="First Name"
          value={formData.firstname}
          onChange={handleChange}
          disabled={!editMode}
          loading={loading}
          required
          placeholder="e.g. Roddrick"
          helperText="Used to personalize your experience and profile."
        />

        <Input
          name="surname"
          label="Surname"
          value={formData.surname}
          onChange={handleChange}
          disabled={!editMode}
          loading={loading}
          required
          placeholder="e.g. Mensah"
          helperText="Also shown publicly on your profile."
        />

        <Input
          name="othername"
          label="Other Name"
          value={formData.othername}
          onChange={handleChange}
          disabled={!editMode}
          loading={loading}
          placeholder="e.g. Kwame"
          helperText="Optional: Include a middle or second name if you like."
        />

        <Input
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          disabled={!editMode}
          loading={loading}
          required
          placeholder="e.g. rodblogwriter"
          helperText="Your unique username for login. Letters and numbers only."
        />

        <Input
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={!editMode}
          loading={loading}
          required
          placeholder="e.g. rod@example.com"
          helperText="Used for login and important account updates."
        />

        <Textarea
          name="boi"
          label="Bio"
          value={formData.boi}
          onChange={handleChange}
          disabled={!editMode}
          loading={loading}
          placeholder="Tell us a bit about yourself..."
          helperText="Optional: A short intro shown on your profile and posts."
        />
      </div>

      {editMode && alertMessage && (
        <Alert
          type="error"
          message="Error"
          description={alertMessage}
          dismissible
        />
      )}
      {editMode && successMsg && (
        <Alert
          type="success"
          message="Success"
          description={successMsg}
          dismissible
        />
      )}

      {editMode ? (
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            icon={<Save size={18} />}
            iconPosition="right"
            onClick={handleSubmit}
            loading={loading}
            className="w-full"
          >
            Save
          </Button>
          <Button
            variant="secondary"
            icon={<X size={18} />}
            iconPosition="right"
            onClick={handleCancel}
            disabled={loading}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          icon={<Edit size={18} />}
          iconPosition="right"
          onClick={() => setEditMode(true)}
          className="w-full"
        >
          Edit
        </Button>
      )}
    </section>
  );
}

export default EditDetails;
