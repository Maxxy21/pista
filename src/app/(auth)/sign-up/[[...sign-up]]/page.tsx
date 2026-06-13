import { AuthScreen } from "@/components/shared/auth/auth-screen";
import { SignUpForm } from "./_components/sign-up-form";

const SignUpPage = () => (
  <AuthScreen
    eyebrow="Get started free"
    title="Start pitching"
    subtitle="with confidence."
    description="Get expert-level AI feedback on your startup pitch in under 60 seconds. No gatekeeping, no scheduling."
  >
    <SignUpForm />
  </AuthScreen>
);

export default SignUpPage;
