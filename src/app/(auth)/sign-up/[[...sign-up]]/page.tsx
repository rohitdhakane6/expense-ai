import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center">
      <SignUp />
    </div>
  );
}
