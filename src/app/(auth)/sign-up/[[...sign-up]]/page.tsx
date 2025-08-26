import SignUpViewPage from '@/components/auth/sign-up-view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Sign Up',
  description: 'Sign Up page for authentication.'
};

export default async function Page() {
  
  return <SignUpViewPage />;
}