import { type Metadata } from 'next'

const baseUrl = 'https://expenseai.tech'
const assetBaseUrl = 'https://assets.expenseai.tech'

export const metadata: Metadata = {
  title: 'ExpenseAI – Smart Expense & Billing Tracker',
  description:
    'ExpenseAI helps individuals and teams track expenses, manage billing, and stay on top of finances with real-time insights and AI-powered automation.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'ExpenseAI – Smart Expense & Billing Tracker',
    description:
      'Track your expenses, automate billing, and gain full control over your finances with ExpenseAI.',
    url: new URL(baseUrl),
    siteName: 'ExpenseAI',
    images: [
      {
        url: `${assetBaseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ExpenseAI Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExpenseAI – Smart Expense & Billing Tracker',
    description: 'ExpenseAI is your intelligent solution for tracking expenses and automating billing.',
    images: [`${assetBaseUrl}/og-image.png`],
    creator: '@RohitDhakane_',
  },
}
