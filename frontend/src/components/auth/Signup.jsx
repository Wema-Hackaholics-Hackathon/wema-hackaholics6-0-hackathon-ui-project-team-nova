import React, { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DEMO_OTP = "123456"; // single mock OTP

const mockSignup = (data) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email.includes("fail")) reject("Email already exists");
      else resolve({ success: true, user: data });
    }, 1000);
  });

export default function Signup({ onSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    otp: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !form.email && !form.phone) {
      newErrors.email = "Enter your email or phone number";
      newErrors.phone = "Enter your email or phone number";
    }
    if (step === 2 && form.otp !== DEMO_OTP) {
      newErrors.otp = "Invalid OTP";
    }
    if (step === 3) {
      if (!form.firstName.trim()) newErrors.firstName = "First name required";
      if (!form.lastName.trim()) newErrors.lastName = "Last name required";
      if (!form.password || form.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = useMemo(() => {
    if (step === 1) return form.email.trim() || form.phone.trim();
    if (step === 2) return form.otp.trim().length === 6;
    if (step === 3)
      return (
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.password.length >= 8
      );
    return false;
  }, [step, form]);

  const nextStep = async () => {
    if (!validateStep()) return;

    if (step === 1) {
      toast.info(`OTP has been sent to ${form.email || form.phone}` );
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setLoading(true);
      try {
        const res = await mockSignup(form);
        toast.success("Signup successful! Redirecting to onboarding...");

        // Call the onSuccess callback with user data and navigate
        if (onSuccess) onSuccess(res.user, navigate);
        else navigate("/onboarding"); // fallback redirect
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (step === 1) return "Send OTP";
    if (step === 2) return "Verify OTP";
    return "Create Account";
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center">Create Your Account</h2>

      <div className="flex justify-between text-sm text-slate-500">
        <span className={step >= 1 ? "font-semibold" : ""}>1. Contact</span>
        <span className={step >= 2 ? "font-semibold" : ""}>2. Verify</span>
        <span className={step >= 3 ? "font-semibold" : ""}>3. Profile</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}

          <div className="text-center text-sm text-slate-400">or</div>

          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+2348012345678"
            value={form.phone}
            onChange={onChange}
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 text-center">
            Enter the 6-digit OTP sent to {form.email || form.phone}
          </p>
          <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
            OTP
          </label>
          <Input
            id="otp"
            name="otp"
            value={form.otp}
            onChange={onChange}
            maxLength={6}
            placeholder="123456"
          />
          {errors.otp && <p className="text-red-600 text-xs mt-1">{errors.otp}</p>}
          <p className="text-xs text-slate-400 text-center">
            For demo, OTP is {DEMO_OTP} via toast
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="John"
          />
          {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}

          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}

          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Minimum 8 characters"
          />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        {step > 1 && (
          <Button variant="ghost" onClick={prevStep} disabled={loading}>
            Back
          </Button>
        )}
        <Button
          onClick={nextStep}
          disabled={loading || !isStepValid}
          className="ml-auto"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
