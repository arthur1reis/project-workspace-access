import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/components/FavoritesPage";

export const Route = createFileRoute("/minha-lista")({
  head: () => ({
    meta: [
      { title: "Minha Lista — CineApp" },
      { name: "description", content: "Lista pessoal de filmes do usuário logado." },
      { property: "og:title", content: "Minha Lista — CineApp" },
      { property: "og:description", content: "Seus filmes salvos, separados por usuário." },
    ],
  }),
  component: () => <FavoritesPage title="Minha Lista" />,
});
