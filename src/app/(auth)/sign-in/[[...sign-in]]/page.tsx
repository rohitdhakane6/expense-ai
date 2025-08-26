import { SignInViewPage } from "@/components/auth/sign-in-view";

export default function Page() {
  return <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm md:max-w-3xl">
      <SignInViewPage />
    </div>
  </div>;
}
