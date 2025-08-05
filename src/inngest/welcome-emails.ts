import { inngest } from '@/inngest/client'

export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const user = event.data
      if (!user) throw new Error('User data not found in event')

      const { first_name, email_addresses, primary_email_address_id } = user
      if (!email_addresses || !primary_email_address_id) {
        throw new Error('Email information is incomplete')
      }

      const primaryEmail = email_addresses.find(
        (e: any) => e.id === primary_email_address_id
      )

      if (!primaryEmail?.email_address) {
        throw new Error('Primary email address not found')
      }

      const email = primaryEmail.email_address
      return {
        message: `Welcome ${first_name || 'there'}!`,
        email,
      }
    } catch (error) {
      console.error('Error in sendWelcomeEmail:', error)
      return {
        error: true,
        message: 'Failed to process welcome email event',
        details: (error as Error).message,
      }
    }
  }
)
