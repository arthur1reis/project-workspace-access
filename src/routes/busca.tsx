import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { searchMovies } from "@/services/api";
import { MovieList } from "@/components/MovieList";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/busca")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Resultados da pesquisa — CineApp" },
      { name: "description", content: "Resultado da pesquisa de filmes no catálogo do TMDB." },
      { property: "og:title", content: "Resultados da pesquisa — CineApp" },
      { property: "og:description", content: "Pesquise filmes por título no CineApp." },
    ],
  }),
  component: SearchPage,
});

/** Página de resultados: consome o endpoint /search/movie da API. */
function SearchPage() {
  const { q } = Route.useSearch();

  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchMovies(q),
    enabled: q.trim().length > 0,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          Resultados para “{q}”
        </h1>
        <Link
          to="/"
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
        >
          Limpar pesquisa
        </Link>
      </div>

      <MovieList
        movies={query.data ?? []}
        loading={query.isLoading && q.length > 0}
        error={query.error ? (query.error as Error).message : null}
        emptyMessage="Nenhum filme encontrado."
      />
    </main>
  );
}
