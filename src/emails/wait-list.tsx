import {
  Html,
  Tailwind,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

export const ThankYouWaitlistEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Thanks for joining the Expense AI waitlist!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="bg-gray-100 max-w-xl mx-auto p-8 border border-gray-300 rounded-lg">
            <Text className="text-lg font-bold mb-4">👋 Hey there,</Text>

            <Text className="text-base text-gray-800 leading-relaxed mb-2">
              Thanks for joining the <strong>Expense AI</strong> waitlist!
            </Text>

            <Text className="text-base text-gray-800 leading-relaxed mb-2">
              We’re building a smart way to track expenses — just text your
              receipts and we’ll do the math. You’ll be the first to know when
              we launch!
            </Text>

            <Text className="text-sm text-gray-600 mt-6">
              Stay tuned for more updates. 🚀
            </Text>

            <Hr className="my-6 border-gray-300" />

            <Text className="text-sm text-gray-500">— The Expense AI Team</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ThankYouWaitlistEmail;
