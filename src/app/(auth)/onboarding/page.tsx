"use client";
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import {
  completeOnboarding,
  sendWhatsAppOTP,
  verifyWhatsAppOTP,
} from "@/actions/onboarding";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, MessageCircle } from "lucide-react";

enum OnboardingStep {
  PHONE_INPUT = "phone_input",
  OTP_VERIFICATION = "otp_verification",
}

export default function OnboardingComponent() {
  const [step, setStep] = React.useState<OnboardingStep>(
    OnboardingStep.PHONE_INPUT,
  );
  const [phone, setPhone] = React.useState("");
  const [formattedPhone, setFormattedPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);
  const [verificationSid, setVerificationSid] = React.useState("");

  const { user } = useUser();
  const router = useRouter();

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formattedPhone) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await sendWhatsAppOTP(formattedPhone);

      if (response.success) {
        setVerificationSid(response.sid ?? "");
        setOtpSent(true);
        setStep(OnboardingStep.OTP_VERIFICATION);
        setCountdown(60); // 60 seconds countdown
      } else {
        setError(response.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyWhatsAppOTP(
        formattedPhone,
        otp,
        verificationSid,
      );

      if (response.success) {
        redirect("/dashboard");
      } else {
        setError(response.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("phone", formattedPhone);
    formData.append("phoneVerified", "true");

    try {
      const res = await completeOnboarding(formData);

      if (res?.message) {
        await user?.reload();
        router.push("/dashboard");
      } else if (res?.error) {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await sendWhatsAppOTP(formattedPhone);

      if (response.success) {
        setVerificationSid(response.sid ?? "");
        setCountdown(60);
        setOtp(""); // Clear previous OTP
      } else {
        setError(response.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPhoneInput = () => (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div className="mb-6 text-center">
        <MessageCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
        <h2 className="mb-2 text-xl font-semibold">
          Verify Your WhatsApp Number
        </h2>
        <p className="text-muted-foreground text-sm">
          We'll send you a verification code via WhatsApp
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          WhatsApp Number
        </label>
        <PhoneInput
          value={phone}
          onChange={(value, formatted) => {
            setPhone(value);
            setFormattedPhone(formatted);
          }}
          disabled={loading}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !formattedPhone}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending OTP...
          </>
        ) : (
          "Send WhatsApp OTP"
        )}
      </Button>
    </form>
  );

  const renderOTPVerification = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="mb-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
        <h2 className="mb-2 text-xl font-semibold">Enter Verification Code</h2>
        <p className="text-muted-foreground text-sm">
          We sent a 6-digit code to {formattedPhone} via WhatsApp
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Verification Code
        </label>
        <Input
          type="text"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtp(value);
          }}
          placeholder="Enter 6-digit code"
          className="text-center text-lg tracking-widest"
          maxLength={6}
          disabled={loading}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || otp.length !== 6}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Code"
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={countdown > 0 || loading}
          className="text-muted-foreground hover:text-primary text-sm disabled:opacity-50"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
        </button>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setStep(OnboardingStep.PHONE_INPUT);
          setOtp("");
          setError("");
        }}
        className="w-full"
      >
        Change Phone Number
      </Button>
    </form>
  );

  return (
    <div className="bg-muted/50 mx-auto h-screen max-w-md rounded-lg p-6">
      {step === OnboardingStep.PHONE_INPUT && renderPhoneInput()}
      {step === OnboardingStep.OTP_VERIFICATION && renderOTPVerification()}
    </div>
  );
}
