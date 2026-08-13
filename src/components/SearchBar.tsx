import { useEffect, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

/**
 * Barra de pesquisa global (fica no Header, por isso funciona em qualquer
 * categoria). Ao enviar, navega para /busca?q=termo, que consome o endpoint
 * /search/movie da API. O botão X limpa a pesquisa e volta para o início.
 */
export function SearchBar() {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const [term, setTerm] = useState("");

  // Mantém o campo sincronizado com a URL (ex.: ao abrir /busca?q=matrix).
  useEffect(() => {
    const q = new URLSearchParams(location.searchStr).get("q") ?? "";
    setTerm(location.pathname === "/busca" ? q : "");
  }, [location.pathname, location.searchStr]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!term.trim()) return;
    navigate({ to: "/busca", search: { q: term.trim() } });
  }

  function handleClear() {
    setTerm("");
    navigate({ to: "/" });
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Pesquisar filmes..."
        aria-label="Pesquisar filmes"
        className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      {term && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpar pesquisa"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  );
}
