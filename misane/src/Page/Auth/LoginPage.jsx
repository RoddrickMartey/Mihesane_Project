import Input from "@/components/ui/Input";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router";
import Alert from "@/components/ui/Alert";
import { loginUser } from "@/api/userApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/features/userSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("info"); // success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    try {
      const res = await loginUser(formData);

      if (res.status === "success") {
        setAlertType("success");
        setAlertMessage("Login successful! Redirecting...");

        setTimeout(() => {
          dispatch(loginSuccess(res.data));
          navigate("/");
        }, 1500);
      } else {
        throw new Error(res.data || "Login failed.");
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="text-text-soft text-sm">
            Welcome back. Please sign in.
          </p>
        </div>

        {alertMessage && (
          <Alert
            type={alertType}
            message={alertType === "success" ? "Success" : "Error"}
            description={alertMessage}
            dismissible
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="username"
            label="Username"
            value={formData.username}
            placeholder="Enter your username"
            loading={loading}
            disabled={loading}
            required
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            placeholder="Enter your password"
            loading={loading}
            disabled={loading}
            required
            onChange={handleChange}
          />

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm text-text-soft">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/auth/signup")}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Sign up
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
