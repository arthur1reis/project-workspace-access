import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { getMovieDetails, posterUrl } from "@/services/api";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CommentSection } from "@/components/CommentSection";

export const Route = createFileRoute("/filme/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do filme — CineApp" },
      {
        name: "description",
        content: "Sinopse, nota, gêneros, duração, favoritos e comentários do filme.",
      },
      { property: "og:title", content: "Detalhes do filme — CineApp" },
      { property: "og:description", content: "Veja os detalhes completos do filme no CineApp." },
    ],
  }),
  component: MovieDetailsPage,
});

/** Página de detalhes: busca o filme pelo ID da URL usando /movie/:id. */
function MovieDetailsPage() {
  const { id } = Route.useParams();

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
  });

  /**
   * Compartilhar: usa a Web Share API quando disponível;
   * caso contrário copia o link para a área de transferência.
   */
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: movie?.title ?? "Filme", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado para a área de transferência!");
      }
    } catch {
      /* usuário cancelou o compartilhamento */
    }
  }

  if (isLoading) {
    return <p className="py-20 text-center text-muted-foreground">Carregando filme...</p>;
  }

  if (error || !movie) {
    return (
      <div className="py-20 text-center">
        <p className="text-destructive">Não foi possível carregar o filme.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-primary">
          Voltar para o início
        </Link>
      </div>
    );
  }

  const poster = posterUrl(movie.poster_path);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Voltar
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {poster ? (
            <img src={poster} alt={`Poster do filme ${movie.title}`} className="w-full" />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center text-sm text-muted-foreground">
              Poster indisponível
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">{movie.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground">
              <Star className="size-4 fill-primary text-primary" />
              {movie.vote_average?.toFixed(1)}
            </span>
            <span>Lançamento: {movie.release_date || "—"}</span>
            {movie.runtime ? <span>Duração: {movie.runtime} min</span> : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {g.name}
              </span>
            ))}
          </div>

          <h2 className="mt-6 text-lg font-semibold text-foreground">Sinopse</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {movie.overview || "Sinopse não disponível."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <FavoriteButton
              movie={{
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
              }}
            />
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <Share2 className="size-4" /> Compartilhar
            </button>
          </div>
        </div>
      </div>

      <CommentSection movieId={movie.id} />
    </main>
  );
}
