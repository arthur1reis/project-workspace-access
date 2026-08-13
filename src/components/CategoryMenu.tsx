import { Link } from "@tanstack/react-router";
import { CATEGORIES, type CategorySlug } from "@/services/api";

/** Menu de categorias: cada item aponta para uma requisição diferente do TMDB. */
export function CategoryMenu({ className = "" }: { className?: string }) {
  const slugs = Object.keys(CATEGORIES) as CategorySlug[];

  return (
    <nav className={`flex flex-wrap items-center gap-1 ${className}`}>
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{ className: "bg-primary text-primary-foreground" }}
        className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Início
      </Link>
      {slugs.map((slug) => (
        <Link
          key={slug}
          to="/categoria/$slug"
          params={{ slug }}
          activeProps={{ className: "bg-primary text-primary-foreground" }}
          className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {CATEGORIES[slug].label}
        </Link>
      ))}
      <Link
        to="/minha-lista"
        activeProps={{ className: "bg-primary text-primary-foreground" }}
        className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Minha Lista
      </Link>
    </nav>
  );
}
