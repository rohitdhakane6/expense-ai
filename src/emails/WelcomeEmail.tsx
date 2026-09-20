import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface WelcomeEmailProps {
  firstName?: string;
  loginUrl?: string;
  supportEmail?: string;
  companyName?: string;
  companyLogo?: string;
}

export const WelcomeEmail = ({
  firstName = "there",
  loginUrl = "https://expenseai.tech/dashboard",
  companyName = "ExpenseAI",
}: WelcomeEmailProps) => {
  const previewText = `Welcome to ${companyName}! Get started with your new account.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-2xl px-4 py-8">
            {/* Header */}
            <Section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              {/* Logo Section */}
              <Section className="bg-blue-600 px-8 py-6">
                {/* <Img
                  src={companyLogo}
                  alt={companyName}
                  className="mx-auto h-12"
                /> */}
              </Section>

              {/* Main Content */}
              <Section className="px-8 py-8">
                <Heading className="mb-6 text-center font-bold text-2xl text-gray-900">
                  Welcome to {companyName}! 🎉
                </Heading>

                <Text className="mb-4 text-base text-gray-600 leading-6">
                  Hi {firstName},
                </Text>

                <Text className="mb-6 text-base text-gray-600 leading-6">
                  We&#39;re thrilled to have you join our community! Your
                  account has been successfully created and you&#39;re ready to
                  get started on your journey with us.
                </Text>

                <Text className="mb-6 text-base text-gray-600 leading-6">
                  Here&#39;s what you can do next:
                </Text>

                {/* Feature List */}
                <Section className="mb-8">
                  <div className="rounded-lg bg-gray-50 p-6">
                    <div>
                      <div className="mb-4 flex items-start">
                        <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <Text className="m-0 text-gray-700 text-sm">
                          Log in to your account to explore the dashboard
                        </Text>
                      </div>
                      <div className="mb-4 flex items-start">
                        <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <Text className="m-0 text-gray-700 text-sm">
                          Explore our features and discover what&#39;s possible
                        </Text>
                      </div>
                      <div className="flex items-start">
                        <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <Text className="m-0 text-gray-700 text-sm">
                          Connect with our community and start collaborating
                        </Text>
                      </div>
                    </div>
                  </div>
                </Section>

                {/* CTA Button */}
                <Section className="mb-8 text-center">
                  <Button
                    href={loginUrl}
                    className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-base text-white no-underline"
                  >
                    Get Started Now
                  </Button>
                </Section>

                <Hr className="my-6 border-gray-200" />

                <Text className="mb-4 text-gray-600 text-sm leading-5">
                  Thanks again for joining us. We can&#39;t wait to see what
                  you&#39;ll create!
                </Text>

                <Text className="text-gray-600 text-sm leading-5">
                  Best regards,
                  <br />
                  The {companyName} Team
                </Text>
              </Section>

              {/* Footer */}
              <Section className="border-gray-200 border-t bg-gray-100 px-8 py-6">
                <Text className="mb-2 text-center text-gray-500 text-xs leading-4">
                  You&#39;re receiving this email because you created an account
                  with {companyName}.
                </Text>

                <div className="text-center">
                  <Link
                    href="https://expenseai.tech/privacy"
                    className="mr-4 text-gray-500 text-xs no-underline"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="https://expenseai.tech/terms"
                    className="mr-4 text-gray-500 text-xs no-underline"
                  >
                    Terms of Service
                  </Link>
                </div>

                <Text className="mt-4 text-center text-gray-400 text-xs">
                  © {companyName}. All rights reserved.
                </Text>
              </Section>
            </Section>

            {/* Social Media Footer (Optional) */}
            <Section className="mt-6 text-center">
              <Text className="mb-3 text-gray-500 text-xs">
                Follow us on social media&#58;
              </Text>
              <div>
                <Link
                  href="https://x.com/RohitDhakane_"
                  className="mr-4 text-gray-500 text-xs no-underline"
                >
                  Twitter
                </Link>
                <Link
                  href="https://linkedin.com/in/rohit-dhakane"
                  className="mr-4 text-gray-500 text-xs no-underline"
                >
                  LinkedIn
                </Link>
                <Link
                  href="https://github.com/rohitdhakane6"
                  className="text-gray-500 text-xs no-underline"
                >
                  GitHub
                </Link>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
