import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { isFavorite, toggleFavorite, type FavoriteMovie } from "@/utils/storage";

/**
 * Botão de favorito.
 *
 * Como os favoritos são salvos: a lista fica em localStorage na chave
 * `favorites_<email do usuário logado>`, garantindo que cada usuário tenha
 * a sua própria lista. O mesmo filme nunca é duplicado (verificação por id).
 * Sem login, o usuário é avisado e enviado para /login.
 */
export function FavoriteButton({ movie }: { movie: FavoriteMovie }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(user ? isFavorite(user.email, movie.id) : false);
  }, [user, movie.id]);

  function handleClick() {
    if (!user) {
      toast.error("Faça login para salvar favoritos.");
      navigate({ to: "/login" });
      return;
    }
    const list = toggleFavorite(user.email, movie);
    const nowFav = list.some((m) => m.id === movie.id);
    setFavorited(nowFav);
    toast.success(nowFav ? "Adicionado aos favoritos!" : "Removido dos favoritos.");
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      <Heart className={`size-4 ${favorited ? "fill-current" : ""}`} />
      {favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    </button>
  );
}
