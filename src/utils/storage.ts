/**
 * Utilitários de persistência em localStorage.
 *
 * Estrutura usada:
 *  users                          -> lista de usuários cadastrados
 *  currentUser                    -> sessão do usuário logado
 *  favorites_<email>              -> favoritos daquele usuário
 *  comments_<email>               -> comentários daquele usuário, agrupados por movieId
 *
 * Como os dados são separados por usuário: a chave sempre recebe o e-mail
 * do usuário logado, então nunca há mistura entre contas diferentes.
 */

export type StoredUser = { name: string; email: string; password: string };
export type SessionUser = { name: string; email: string };

export type FavoriteMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

export type Comment = {
  id: number;
  author: string;
  text: string;
  date: string;
};

export type MovieComments = { movieId: number; comments: Comment[] };

/** Lê um valor JSON do localStorage com fallback seguro. */
function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Grava um valor JSON no localStorage. */
function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/* ------------------------------ Usuários ------------------------------ */

export const getUsers = () => read<StoredUser[]>("users", []);
export const saveUsers = (users: StoredUser[]) => write("users", users);

export const getCurrentUser = () => read<SessionUser | null>("currentUser", null);
export const saveCurrentUser = (user: SessionUser) => write("currentUser", user);
export const clearCurrentUser = () => window.localStorage.removeItem("currentUser");

/* ------------------------------ Favoritos ----------------------------- */

const favoritesKey = (email: string) => `favorites_${email}`;

/** Retorna os favoritos do usuário informado. */
export function getFavorites(email: string): FavoriteMovie[] {
  return read<FavoriteMovie[]>(favoritesKey(email), []);
}

/**
 * Adiciona ou remove um filme dos favoritos (toggle).
 * Evita duplicação verificando o id antes de inserir.
 */
export function toggleFavorite(email: string, movie: FavoriteMovie): FavoriteMovie[] {
  const list = getFavorites(email);
  const exists = list.some((m) => m.id === movie.id);
  const next = exists ? list.filter((m) => m.id !== movie.id) : [...list, movie];
  write(favoritesKey(email), next);
  return next;
}

export function isFavorite(email: string, movieId: number) {
  return getFavorites(email).some((m) => m.id === movieId);
}

/* ----------------------------- Comentários ---------------------------- */

const commentsKey = (email: string) => `comments_${email}`;

/** Lê todos os comentários do usuário (agrupados por filme). */
function getAllComments(email: string): MovieComments[] {
  return read<MovieComments[]>(commentsKey(email), []);
}

/** Comentários de um filme específico — nunca uma lista global única. */
export function getComments(email: string, movieId: number): Comment[] {
  return getAllComments(email).find((entry) => entry.movieId === movieId)?.comments ?? [];
}

/** Adiciona um comentário ao filme informado e devolve a lista atualizada. */
export function addComment(email: string, movieId: number, comment: Comment): Comment[] {
  const all = getAllComments(email);
  const entry = all.find((e) => e.movieId === movieId);
  if (entry) {
    entry.comments = [comment, ...entry.comments];
  } else {
    all.push({ movieId, comments: [comment] });
  }
  write(commentsKey(email), all);
  return getComments(email, movieId);
}

/** Exclui um comentário do próprio usuário. */
export function removeComment(email: string, movieId: number, commentId: number): Comment[] {
  const all = getAllComments(email);
  const entry = all.find((e) => e.movieId === movieId);
  if (entry) {
    entry.comments = entry.comments.filter((c) => c.id !== commentId);
    write(commentsKey(email), all);
  }
  return getComments(email, movieId);
}
