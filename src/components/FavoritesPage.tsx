import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { getFavorites, type FavoriteMovie } from "@/utils/storage";
import { MovieList } from "@/components/MovieList";

/**
 * Página da lista pessoal / favoritos.
 * Lê `favorites_<email>` do localStorage, ou seja, mostra apenas os filmes
 * do usuário atualmente logado. Sem login, pede autenticação.
 */
export function FavoritesPage({ title }: { title: string }) {
  const { user, loading } = useAuth();
  const [movies, setMovies] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    setMovies(user ? getFavorites(user.email) : []);
  }, [user]);

  if (loading) {
    return <p className="py-20 text-center text-muted-foreground">Carregando...</p>;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          Você precisa estar logado para ver sua lista de filmes.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Fazer login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{title}</h1>
      <MovieList
        movies={movies.map((m) => ({ ...m, overview: "" }))}
        emptyMessage="Você ainda não salvou nenhum filme."
      />
    </main>
  );
}
