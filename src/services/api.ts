/**
 * Serviço centralizado de comunicação com a API do TMDB.
 *
 * Como a API é consumida:
 * - Todas as requisições passam por `request()`, que monta a URL base
 *   (https://api.themoviedb.org/3), acrescenta a API KEY e o idioma pt-BR.
 * - A chave NUNCA é escrita nos componentes: ela vem do arquivo .env
 *   (VITE_REACT_APP_KEY / REACT_APP_KEY no projeto original do professor).
 */

export const API_BASE = "https://api.themoviedb.org/3";
export const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";

/**
 * Retorna a API KEY do TMDB.
 * 1º) variável de ambiente (.env) — forma oficial usada no projeto do professor;
 * 2º) fallback local (localStorage) para permitir testar no preview quando o
 *     .env ainda não foi configurado neste ambiente.
 */
export function getApiKey(): string {
  const env =
    (import.meta.env["VITE_REACT_APP_KEY"] as string | undefined) ??
    (import.meta.env["VITE_TMDB_KEY"] as string | undefined) ??
    (import.meta.env["REACT_APP_KEY"] as string | undefined);


  if (env) return env;

  if (typeof window !== "undefined") {
    return window.localStorage.getItem("tmdb_api_key") ?? "";
  }
  return "";
}

/** Permite salvar a chave localmente (apenas fallback de desenvolvimento). */
export function setLocalApiKey(key: string) {
  window.localStorage.setItem("tmdb_api_key", key.trim());
}

/** Executa uma requisição GET na API do TMDB e devolve o JSON já tratado. */
async function request<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = getApiKey();
  if (!key) {
    throw new Error(
      "API KEY do TMDB não configurada. Defina REACT_APP_KEY (VITE_REACT_APP_KEY) no arquivo .env.",
    );
  }

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "pt-BR");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Não foi possível carregar os filmes.");
  }
  return (await response.json()) as T;
}

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
};

export type MovieDetails = Movie & {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline?: string;
};

/** Categorias do menu -> endpoints correspondentes na API do TMDB. */
export const CATEGORIES = {
  populares: { label: "Populares", endpoint: "/movie/popular" },
  "melhores-avaliados": { label: "Melhores Avaliados", endpoint: "/movie/top_rated" },
  "em-cartaz": { label: "Em Cartaz", endpoint: "/movie/now_playing" },
  "proximos-lancamentos": { label: "Próximos Lançamentos", endpoint: "/movie/upcoming" },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(CATEGORIES, value);
}

/** Busca a lista de filmes de uma categoria (popular, top_rated, etc). */
export async function getMoviesByCategory(slug: CategorySlug): Promise<Movie[]> {
  const data = await request<{ results: Movie[] }>(CATEGORIES[slug].endpoint);
  return data.results ?? [];
}

/** Pesquisa filmes pelo nome usando o endpoint /search/movie. */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];
  const data = await request<{ results: Movie[] }>("/search/movie", {
    query: query.trim(),
    include_adult: "false",
  });
  return data.results ?? [];
}

/** Busca os detalhes completos de um filme pelo ID (/movie/:id). */
export async function getMovieDetails(id: string | number): Promise<MovieDetails> {
  return request<MovieDetails>(`/movie/${id}`);
}

/** Monta a URL do poster; devolve null quando o filme não tem imagem. */
export function posterUrl(path: string | null | undefined) {
  return path ? `${IMAGE_PATH}${path}` : null;
}
