import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { loginUser } from "../../services/auth.service";
import { setToken, setUser } from "../../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: localStorage.getItem("shield_login_email") || "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);

      if (!response?.token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      dispatch(setToken(response.token));
      dispatch(setUser(response.user || null));
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        (!err.response && "Cannot reach the backend server at the configured API URL.") ||
        err.response?.data?.message ||
        err.message ||
        "Unable to login with those credentials.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Login to SHIELD">
        <form className="space-y-4 w-80" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" size="md" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <p className="text-sm text-gray-600">
            New here?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-700"
              onClick={() => navigate("/register")}
            >
              Create an account
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;
