import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — CineApp" },
      { name: "description", content: "Crie sua conta para salvar favoritos e comentar filmes." },
      { property: "og:title", content: "Criar conta — CineApp" },
      { property: "og:description", content: "Cadastro de usuário no CineApp." },
    ],
  }),
  component: RegisterPage,
});

/** Página de cadastro com validação de campos, e-mail e senhas iguais. */
function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { name, email, password, confirm } = form;

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não são iguais.");
      return;
    }

    const result = register(name, email, password);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível cadastrar.");
      return;
    }
    toast.success("Cadastro realizado! Faça login para continuar.");
    navigate({ to: "/login" });
  }

  const field = "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary";

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm text-muted-foreground">
            Nome
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-muted-foreground">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={field}
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
            className={field}
          />
        </div>
        <div>
          <label htmlFor="confirm" className="text-sm text-muted-foreground">
            Confirmar senha
          </label>
          <input
            id="confirm"
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className={field}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Cadastrar
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Entrar
        </Link>
      </p>
    </main>
  );
}
