import { AuthScreen } from "@/components/shared/auth/auth-screen";
import { SignInForm } from "./_components/sign-in-form";

const SignInPage = () => (
  <AuthScreen
    eyebrow="AI pitch evaluation"
    title="Welcome back."
    subtitle="Your pitches are waiting."
    description="Sign in to review your evaluations, track improvements, and keep refining your pitch."
  >
    <SignInForm />
  </AuthScreen>
);

export default SignInPage;
