import { Link, useNavigate } from "@tanstack/react-router";
import { Clapperboard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CategoryMenu } from "./CategoryMenu";
import { SearchBar } from "./SearchBar";

/** Cabeçalho fixo: logo, menu de categorias, pesquisa e área de usuário. */
export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Clapperboard className="size-6 text-primary" />
          CineApp
        </Link>

        <div className="order-3 w-full md:order-2 md:ml-auto md:w-auto md:flex-1 md:max-w-md">
          <SearchBar />
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 md:order-3 md:ml-0">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Olá, <strong className="text-foreground">{user.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
              >
                <LogOut className="size-4" /> Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2">
        <CategoryMenu />
      </div>
    </header>
  );
}
