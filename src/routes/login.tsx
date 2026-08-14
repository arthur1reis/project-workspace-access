import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — CineApp" },
      { name: "description", content: "Acesse sua conta para salvar favoritos e comentar." },
      { property: "og:title", content: "Entrar — CineApp" },
      { property: "og:description", content: "Login da sua conta CineApp." },
    ],
  }),
  component: LoginPage,
});

/** Página de login: valida e-mail/senha cadastrados e cria a sessão. */
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Preencha todos os campos.");
      return;
    }
    const result = login(form.email, form.password);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível entrar.");
      return;
    }
    toast.success("Login realizado com sucesso!");
    navigate({ to: "/" });
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm text-muted-foreground">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm text-muted-foreground">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link to="/cadastro" className="font-semibold text-primary">
          Cadastre-se
        </Link>
      </p>
    </main>
  );
}
