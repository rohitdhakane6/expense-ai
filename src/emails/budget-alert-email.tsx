import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

type Props = {
  userName: string;
  userEmail: string;
  budgetName?: string;
  budgetAmount: number | string;
  totalSpent: number | string;
  spentPercentage: number;
  ctaUrl: string;
  currency?: string;
};

export default function BudgetAlertEmail({
  // userName = "Alex",
  userEmail = "alex@example.com",
  budgetName = "Monthly Budget",
  budgetAmount = 2500,
  totalSpent = 2100,
  spentPercentage = 84,
  ctaUrl = "#",
  currency = "₹",
}: Props) {
  const spent = Number(totalSpent);
  const amount = Number(budgetAmount);
  const remaining = amount - spent;
  const percent = Number(spentPercentage);

  const isOverBudget = percent >= 100;

  return (
    <Html>
      <Head />
      <Preview>
        {isOverBudget
          ? `⚠️ You’ve exceeded your ${budgetName}`
          : `💰 Budget Alert: ${spentPercentage}% used`}
      </Preview>
      <Tailwind>
        {" "}
        <Body className="bg-gray-100 font-sans text-gray-800">
          <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow">
            <Section className="mb-6 text-center">
              <Text className="font-bold text-gray-900 text-xl">
                {isOverBudget ? "🚨 Budget Exceeded" : "⚡ Almost There"}
              </Text>
              <Text className="text-gray-600 text-sm">{budgetName}</Text>
            </Section>

            <Section className="mb-6 rounded-md bg-gray-50 p-4">
              <Text className="font-semibold text-lg text-orange-600">
                {currency}
                {spent.toLocaleString()} spent
              </Text>
              <Text className="font-medium text-gray-700 text-md">
                {isOverBudget
                  ? `Over by ${currency}${Math.abs(remaining).toLocaleString()}`
                  : `${currency}${remaining.toLocaleString()} left`}
              </Text>
              <Text className="mt-2 text-gray-500 text-sm">
                {percent}% of your budget used
              </Text>
            </Section>

            <Section className="mb-6 text-center">
              <Button
                href={ctaUrl}
                className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-sm text-white"
              >
                {isOverBudget ? "Adjust Budget" : "View Details"}
              </Button>
            </Section>

            <Section className="border-t pt-4 text-center text-gray-500 text-xs">
              <Text>Sent to {userEmail}</Text>
              <Text>© {new Date().getFullYear()} BudgetTracker Pro</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
