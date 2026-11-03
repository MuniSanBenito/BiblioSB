// Ingreso del personal. Con sesión activa sigue al panel.
import { signInWithEmail } from "#/lib/firebase/sign-in-with-email";
import { waitForAuthUser } from "#/lib/firebase/wait-for-auth-user";
import { LoginForm } from "#/ui/organisms/login-form/login-form";
import { LoginPage } from "#/ui/templates/login-page/login-page";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Ingresar | Biblioteca municipal de San Benito" },
      {
        name: "description",
        content: "Ingreso del personal a la biblioteca municipal de San Benito, Entre Ríos.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  beforeLoad: async () => {
    const user = await waitForAuthUser();
    if (user) {
      throw redirect({ to: "/panel", replace: true });
    }
  },
  component: Home,
});

function Home() {
  const navigate = useNavigate();

  async function handleSignIn(email: string, password: string) {
    await signInWithEmail(email, password);
    await navigate({ to: "/panel", replace: true });
  }

  return (
    <LoginPage>
      <LoginForm onSubmit={handleSignIn} />
    </LoginPage>
  );
}
