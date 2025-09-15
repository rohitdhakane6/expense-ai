import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <div className="container mx-auto px-8 pt-32 pb-20 text-center">
      <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
        Smart Receipt Scanning & Expense Management
      </h1>
      <p className="mx-auto mb-8 max-w-3xl text-xl text-neutral-600 dark:text-neutral-300">
        Transform your receipts into organized expense reports with AI-powered
        scanning. Get intelligent budget alerts and transaction insights to
        manage your money better.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button variant="default" className="px-8 py-3 text-lg">
          Start Free Trial
        </Button>
        <Button variant="secondary" className="px-8 py-3 text-lg">
          Watch Demo
        </Button>
      </div>
      <p className="mt-4 text-sm text-neutral-500">
        No credit card required • 14-day free trial
      </p>
    </div>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "AI Receipt Scanning",
      description:
        "Instantly digitize receipts with 99% accuracy. Our AI extracts merchant, amount, date, and category automatically.",
      icon: "📱",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Smart Budget Alerts",
      description:
        "Get personalized alerts when you're approaching budget limits. Stay on track with intelligent spending notifications.",
      icon: "💡",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Transaction Insights",
      description:
        "Discover spending patterns and get AI-powered insights to optimize your finances and save money.",
      icon: "📊",
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: 4,
      title: "Expense Categorization",
      description:
        "Automatic categorization of all transactions. Customize categories to match your business or personal needs.",
      icon: "🗂️",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 5,
      title: "Monthly Reports",
      description:
        "Generate detailed expense reports with charts and breakdowns. Perfect for tax season or business accounting.",
      icon: "📈",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 6,
      title: "Multi-Currency Support",
      description:
        "Handle receipts in any currency. Automatic conversion and tracking for international transactions.",
      icon: "💱",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <section id="features" className="bg-neutral-50 py-20 dark:bg-neutral-900">
      <div className="container mx-auto px-8">
        <h2 className="mb-4 text-center text-4xl font-bold">
          Powerful Features for Smart Expense Management
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-xl text-neutral-600 dark:text-neutral-300">
          Everything you need to track, manage, and optimize your expenses with
          the power of AI
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-neutral-800"
            >
              <div
                className={`h-16 w-16 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 flex items-center justify-center text-2xl`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
              <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Scan Your Receipt",
      description:
        "Simply take a photo of your receipt or upload an image. Our AI processes it instantly.",
      icon: "📷",
    },
    {
      step: 2,
      title: "AI Extracts Data",
      description:
        "Advanced AI technology automatically extracts merchant, amount, date, and categorizes the expense.",
      icon: "🤖",
    },
    {
      step: 3,
      title: "Get Insights & Alerts",
      description:
        "Receive budget alerts, spending insights, and organized reports to manage your finances better.",
      icon: "🎯",
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-8">
        <h2 className="mb-4 text-center text-4xl font-bold">How It Works</h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-xl text-neutral-600 dark:text-neutral-300">
          Get started in minutes with our simple 3-step process
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-3xl">
                {step.icon}
              </div>
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {step.step}
              </div>
              <h3 className="mb-4 text-2xl font-bold">{step.title}</h3>
              <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const PricingSection = () => {
  const plans = [
    {
      name: "Personal",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals managing personal expenses",
      features: [
        "50 receipt scans per month",
        "AI-powered categorization",
        "Basic budget alerts",
        "Monthly reports",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      name: "Business",
      price: "$29",
      period: "/month",
      description: "Ideal for small businesses and freelancers",
      features: [
        "500 receipt scans per month",
        "Advanced AI insights",
        "Custom categories",
        "Team collaboration",
        "Export to accounting software",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited receipt scans",
        "Advanced analytics dashboard",
        "Multi-department budgets",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="bg-neutral-50 py-20 dark:bg-neutral-900">
      <div className="container mx-auto px-8">
        <h2 className="mb-4 text-center text-4xl font-bold">
          Simple, Transparent Pricing
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-xl text-neutral-600 dark:text-neutral-300">
          Choose the plan that fits your needs. All plans include a 14-day free
          trial.
        </p>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl bg-white p-8 shadow-lg dark:bg-neutral-800 ${
                plan.popular ? "scale-105 transform ring-2 ring-blue-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <span className="rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-neutral-600 dark:text-neutral-300">
                  {plan.period}
                </span>
              </div>
              <p className="mb-6 text-neutral-600 dark:text-neutral-300">
                {plan.description}
              </p>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="mr-3 text-green-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "default" : "secondary"}
                className="w-full"
              >
                Start Free Trial
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="container mx-auto px-8 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white">
          Ready to Transform Your Expense Management?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
          Join thousands of users who have simplified their expense tracking
          with AI-powered receipt scanning.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="secondary"
            className="bg-white px-8 py-3 text-lg text-blue-600 hover:bg-gray-100"
          >
            Start Free Trial
          </Button>
          <Button
            variant="secondary"
            className="border-white px-8 py-3 text-lg text-white hover:bg-white hover:text-blue-600"
          >
            Schedule Demo
          </Button>
        </div>
        <p className="mt-4 text-sm text-blue-100">
          14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};
