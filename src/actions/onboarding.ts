// actions/onboarding.ts
"use server";

import { useAuth } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// You'll need to install and configure Twilio
// npm install twilio
// Add to your .env.local:
// TWILIO_ACCOUNT_SID=your_account_sid
// TWILIO_AUTH_TOKEN=your_auth_token
// TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

import Twilio from "twilio";

const twilio = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

interface OTPResponse {
  success: boolean;
  error?: string;
  sid?: string;
}

export async function sendWhatsAppOTP(
  phoneNumber: string,
): Promise<OTPResponse> {
  try {
    const { userId } = useAuth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const verification = await twilio.verify.v2
      .services("VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      .verifications.create({
        to: phoneNumber,
        channel: "whatsapp",
      });

    return {
      success: true,
      sid: verification.sid,
    };
  } catch (error: any) {
    console.error("WhatsApp OTP send error:", error);

    // Handle specific Twilio errors
    if (error.code === 20003) {
      return {
        success: false,
        error: "Authentication failed. Please check your Twilio credentials.",
      };
    } else if (error.code === 20404) {
      return { success: false, error: "Phone number not found or invalid." };
    } else if (error.code === 60200) {
      return { success: false, error: "Invalid phone number format." };
    } else if (error.code === 60203) {
      return {
        success: false,
        error: "WhatsApp is not available for this number.",
      };
    }

    return {
      success: false,
      error:
        "Failed to send WhatsApp OTP. Please try again or use a different number.",
    };
  }
}

export async function verifyWhatsAppOTP(
  phoneNumber: string,
  otpCode: string,
  verificationSid: string,
): Promise<OTPResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

    const verificationCheck = await twilio.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: formattedPhone,
        code: otpCode,
      });

    if (verificationCheck.status === "approved") {
      return { success: true };
    } else {
      return { success: false, error: "Invalid or expired OTP code." };
    }
  } catch (error: any) {
    console.error("WhatsApp OTP verification error:", error);

    if (error.code === 20404) {
      return {
        success: false,
        error: "Verification session not found or expired.",
      };
    } else if (error.code === 60202) {
      return {
        success: false,
        error: "Maximum verification attempts reached.",
      };
    }

    return {
      success: false,
      error: "Failed to verify OTP. Please try again.",
    };
  }
}

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No Logged In User" };
  }

  try {
    const phone = formData.get("phone") as string;
    const currency = formData.get("currency") as string;
    const phoneVerified = formData.get("phoneVerified") === "true";

    if (!phone || !currency) {
      return { error: "Phone and currency are required" };
    }

    if (!phoneVerified) {
      return { error: "Phone number must be verified" };
    }

    const client = await clerkClient();
    // Update user metadata in Clerk
    const user = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        phoneNumber: phone,
        phoneVerified: true,
        preferredCurrency: currency,
        onboardingCompletedAt: new Date().toISOString(),
      },
    });

    // You can also save to your database here if needed
    // await db.user.update({
    //   where: { clerkId: userId },
    //   data: {
    //     phoneNumber: phone,
    //     phoneVerified: true,
    //     preferredCurrency: currency,
    //     onboardingComplete: true,
    //   },
    // });

    return { message: "Onboarding completed successfully" };
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return { error: "Failed to complete onboarding" };
  }
}
