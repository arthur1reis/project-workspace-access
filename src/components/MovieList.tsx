import type { Movie } from "@/services/api";
import { MovieCard } from "./MovieCard";

type Props = {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
};

/**
 * Lista de filmes com tratamento de estados:
 * carregando, erro e nenhum filme encontrado.
 */
export function MovieList({
  movies,
  loading,
  error,
  emptyMessage = "Nenhum filme encontrado.",
}: Props) {
  if (loading) {
    return <p className="py-10 text-center text-muted-foreground">Carregando filmes...</p>;
  }

  if (error) {
    return (
      <p className="py-10 text-center text-destructive">
        {error || "Não foi possível carregar os filmes."}
      </p>
    );
  }

  if (!movies.length) {
    return <p className="py-10 text-center text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
