import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { posterUrl, type Movie } from "@/services/api";

/** Formata a data vinda da API (yyyy-mm-dd) para o padrão brasileiro. */
function formatDate(date?: string) {
  if (!date) return "Sem data";
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

/** Card de filme: poster, título, nota, data e botão "Saiba Mais". */
export function MovieCard({ movie }: { movie: Movie }) {
  const poster = posterUrl(movie.poster_path);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/60">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {poster ? (
          <img
            src={poster}
            alt={`Poster do filme ${movie.title}`}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
            Poster indisponível
          </div>
        )}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/85 px-2 py-1 text-xs font-semibold text-foreground">
          <Star className="size-3 fill-primary text-primary" />
          {movie.vote_average?.toFixed(1) ?? "-"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{movie.title}</h3>
        <p className="text-xs text-muted-foreground">{formatDate(movie.release_date)}</p>
        <Link
          to="/filme/$id"
          params={{ id: String(movie.id) }}
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Saiba Mais
        </Link>
      </div>
    </article>
  );
}
