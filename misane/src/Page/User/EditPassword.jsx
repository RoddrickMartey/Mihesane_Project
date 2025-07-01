import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import axiosInstance from "@/config/axiosConfig";

function EditPassword() {
  const [loading, setLoading] = useState(false);
  const [tokenRequested, setTokenRequested] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const requestPasswordToken = async () => {
    setLoading(true);
    setAlertMessage(null);
    setSuccessMsg(null);

    try {
      const res = await axiosInstance.post("/user/reset-token", null, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setTokenRequested(true);
        setSuccessMsg(
          "You can now change your password. Token expires in 15 minutes."
        );
      } else {
        console.log(res.data);
        setAlertMessage("Failed to request token. Try again.");
      }
    } catch (err) {
      console.error(err);
      setAlertMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setLoading(true);
    setAlertMessage(null);
    setSuccessMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.patch(
        "/user/change-password",
        { password: formData.password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setSuccessMsg("Password updated successfully.");
        setFormData({ password: "", confirmPassword: "" });
        setTokenRequested(false);
      } else {
        setAlertMessage(res.data?.message || "Password update failed.");
      }
    } catch (err) {
      setAlertMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Change Password</h2>

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

      {!tokenRequested ? (
        <Button
          loading={loading}
          onClick={requestPasswordToken}
          className="w-full"
        >
          Request Password Change
        </Button>
      ) : (
        <>
          <p className="text-sm text-text-soft">
            You have 15 minutes to update your password.
          </p>
          <Input
            type="password"
            name="password"
            label="New Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
            loading={loading}
          />
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
            loading={loading}
          />
          <Button
            loading={loading}
            onClick={handlePasswordUpdate}
            className="w-full"
          >
            Update Password
          </Button>
        </>
      )}
    </section>
  );
}

export default EditPassword;
