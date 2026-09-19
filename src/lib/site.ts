import { type Metadata } from 'next'

const baseUrl = 'https://expenseai-app.vercel.app'

const title = 'ExpenseAI – Know where your money goes'
const description =
  'Scan receipts with AI, set a monthly budget with email alerts, and see your spending at a glance.'

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(baseUrl),
  openGraph: {
    title,
    description,
    url: baseUrl,
    siteName: 'ExpenseAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
    creator: '@RohitDhakane_',
  },
}
