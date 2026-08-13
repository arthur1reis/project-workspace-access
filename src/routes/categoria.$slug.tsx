import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES, getMoviesByCategory, isCategorySlug } from "@/services/api";
import { MovieList } from "@/components/MovieList";
import { ApiKeyNotice } from "@/components/ApiKeyNotice";

export const Route = createFileRoute("/categoria/$slug")({
  head: () => ({
    meta: [
      { title: "Categorias de filmes — CineApp" },
      {
        name: "description",
        content: "Filmes populares, melhores avaliados, em cartaz e próximos lançamentos.",
      },
      { property: "og:title", content: "Categorias de filmes — CineApp" },
      {
        property: "og:description",
        content: "Explore o catálogo do TMDB por categoria.",
      },
    ],
  }),
  component: CategoryPage,
});

/** Página de categoria: usa o slug da URL para escolher o endpoint da API. */
function CategoryPage() {
  const { slug } = Route.useParams();
  const valid = isCategorySlug(slug);

  const query = useQuery({
    queryKey: ["movies", slug],
    queryFn: () => getMoviesByCategory(slug as never),
    enabled: valid,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <ApiKeyNotice />
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        {valid ? CATEGORIES[slug as keyof typeof CATEGORIES].label : "Categoria inválida"}
      </h1>
      {valid ? (
        <MovieList
          movies={query.data ?? []}
          loading={query.isLoading}
          error={query.error ? (query.error as Error).message : null}
        />
      ) : (
        <p className="text-muted-foreground">Esta categoria não existe.</p>
      )}
    </main>
  );
}
