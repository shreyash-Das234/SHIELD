import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { registerUser } from "../../services/auth.service";
import { setToken, setUser } from "../../store/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (!response?.token) {
        throw new Error("Signup succeeded but no token was returned.");
      }

      dispatch(setToken(response.token));
      dispatch(setUser(response.user || null));
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        (!err.response && "Cannot reach the backend server at the configured API URL.") ||
        err.response?.data?.message ||
        err.message ||
        "Unable to create your account right now.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Create SHIELD Account">
        <form className="space-y-4 w-80" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" size="md" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-700"
              onClick={() => navigate("/login")}
            >
              Go to login
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Register;
