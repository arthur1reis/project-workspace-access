import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMoviesByCategory } from "@/services/api";
import { MovieList } from "@/components/MovieList";
import { ApiKeyNotice } from "@/components/ApiKeyNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineApp — Filmes populares e melhores avaliados" },
      {
        name: "description",
        content:
          "Descubra filmes populares, melhores avaliados, em cartaz e próximos lançamentos com dados do TMDB.",
      },
      { property: "og:title", content: "CineApp — Catálogo de filmes" },
      {
        property: "og:description",
        content: "Pesquise filmes, salve favoritos e comente. Dados em tempo real do TMDB.",
      },
    ],
  }),
  component: Home,
});

/** Página inicial: destaque, seção "Melhores Avaliados" e "Populares". */
function Home() {
  // Cada seção faz sua própria requisição ao endpoint correspondente do TMDB.
  const topRated = useQuery({
    queryKey: ["movies", "melhores-avaliados"],
    queryFn: () => getMoviesByCategory("melhores-avaliados"),
  });
  const populares = useQuery({
    queryKey: ["movies", "populares"],
    queryFn: () => getMoviesByCategory("populares"),
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <ApiKeyNotice />

      <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Encontre seu próximo filme
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Navegue pelas categorias, pesquise por título, salve favoritos na sua lista pessoal e
          deixe comentários.
        </p>
        <Link
          to="/categoria/$slug"
          params={{ slug: "em-cartaz" }}
          className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Ver filmes em cartaz
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Melhores Avaliados</h2>
        <MovieList
          movies={topRated.data?.slice(0, 10) ?? []}
          loading={topRated.isLoading}
          error={topRated.error ? (topRated.error as Error).message : null}
        />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Populares</h2>
        <MovieList
          movies={populares.data?.slice(0, 10) ?? []}
          loading={populares.isLoading}
          error={populares.error ? (populares.error as Error).message : null}
        />
      </section>
    </main>
  );
}
