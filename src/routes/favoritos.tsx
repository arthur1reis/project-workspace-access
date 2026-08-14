import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/components/FavoritesPage";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — CineApp" },
      { name: "description", content: "Os filmes que você salvou como favoritos no CineApp." },
      { property: "og:title", content: "Favoritos — CineApp" },
      { property: "og:description", content: "Sua lista de filmes favoritos." },
    ],
  }),
  component: () => <FavoritesPage title="Favoritos" />,
});
