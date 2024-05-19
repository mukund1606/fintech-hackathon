import LoginForm from "@/components/login/loginForm";

export default function SignInPage({
  searchParams,
}: {
  searchParams: {
    error?: string;
  };
}) {
  return (
    <div>
      <LoginForm error={searchParams.error} />
    </div>
  );
}
