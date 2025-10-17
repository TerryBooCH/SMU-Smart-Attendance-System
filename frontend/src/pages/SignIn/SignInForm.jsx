import React, { useState } from "react";
import { validateSignInForm } from "../../utils/validateForm";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { CircleAlert } from "lucide-react";

const SignInForm = () => {
  const { login, error, loading } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedValues = {
      email: formValues.email.trim(),
      password: formValues.password.trim(),
    };
    const errors = validateSignInForm(trimmedValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const successLogin = await login(trimmedValues);
        if (successLogin) {
          success?.("Logged in successfully");
          navigate("/home");
        }
      } catch (err) {
        console.error("Login error:", err);
        showError?.("Login failed");
      }
    }
  };

  return (
    <div className="relative">
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="font-medium text-3xl sm:text-4xl">Welcome Back</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {(error || formErrors.submit) && (
              <div className="mb-5 border-red-400 bg-red-50 border rounded-md p-4 flex items-center justify-center gap-3">
                <CircleAlert size={20} color="red" strokeWidth={1.4} />
                <p className="text-sm text-red-600 font-medium">
                  {error || formErrors.submit}
                </p>
              </div>
            )}

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="you@example.com"
                className={`bg-gray-50 border ${
                  formErrors.email ? "border-red-500" : "border-[#cecece]"
                } text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-3 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              {formErrors.email && (
                <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your password"
                className={`bg-gray-50 border ${
                  formErrors.password ? "border-red-500" : "border-[#cecece]"
                } text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-3 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
              {formErrors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="text-white bg-primary font-medium w-full px-2.5 py-2 rounded-xl cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
