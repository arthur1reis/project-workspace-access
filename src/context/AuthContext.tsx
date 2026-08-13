import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  clearCurrentUser,
  getCurrentUser,
  getUsers,
  saveCurrentUser,
  saveUsers,
  type SessionUser,
} from "@/utils/storage";

/**
 * Contexto de autenticação (sem backend, apenas localStorage).
 *
 * Como o login funciona:
 * 1. O cadastro grava o usuário na lista "users" do localStorage.
 * 2. O login procura um usuário com o mesmo e-mail/senha.
 * 3. Encontrando, a sessão é salva em "currentUser" e fica disponível
 *    para toda a aplicação através deste contexto.
 * 4. O logout apenas remove a chave "currentUser".
 */

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Recupera a sessão salva quando a aplicação carrega no navegador.
  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      /** Cadastra um novo usuário, impedindo e-mail duplicado. */
      register(name, email, password) {
        const users = getUsers();
        const normalized = email.trim().toLowerCase();
        if (users.some((u) => u.email === normalized)) {
          return { ok: false, error: "Este e-mail já está cadastrado." };
        }
        saveUsers([...users, { name: name.trim(), email: normalized, password }]);
        return { ok: true };
      },
      /** Valida as credenciais e cria a sessão do usuário. */
      login(email, password) {
        const normalized = email.trim().toLowerCase();
        const found = getUsers().find((u) => u.email === normalized && u.password === password);
        if (!found) return { ok: false, error: "E-mail ou senha inválidos." };
        const session = { name: found.name, email: found.email };
        saveCurrentUser(session);
        setUser(session);
        return { ok: true };
      },
      /** Encerra a sessão do usuário. */
      logout() {
        clearCurrentUser();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook para acessar o usuário logado em qualquer componente. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
