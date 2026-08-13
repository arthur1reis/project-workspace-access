import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { addComment, getComments, removeComment, type Comment } from "@/utils/storage";

/**
 * Área de comentários do filme.
 *
 * Como os comentários são armazenados: em localStorage, na chave
 * `comments_<email>`, num array de objetos { movieId, comments: [...] }.
 * Assim os comentários ficam ligados ao ID do filme e ao usuário logado —
 * nunca uma lista global única.
 */
export function CommentSection({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setComments(user ? getComments(user.email, movieId) : []);
  }, [user, movieId]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user || !text.trim()) return;
    const novo: Comment = {
      id: Date.now(),
      author: user.name,
      text: text.trim(),
      date: new Date().toLocaleString("pt-BR"),
    };
    setComments(addComment(user.email, movieId, novo));
    setText("");
    toast.success("Comentário publicado.");
  }

  function handleDelete(id: number) {
    if (!user) return;
    setComments(removeComment(user.email, movieId, id));
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground">Comentários</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Escreva seu comentário..."
            className="w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Enviar comentário
          </button>
        </form>
      ) : (
        <p className="mt-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          É necessário estar logado para comentar.{" "}
          <Link to="/login" className="font-semibold text-primary">
            Fazer login
          </Link>
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {comments.length === 0 && user && (
          <li className="text-sm text-muted-foreground">Nenhum comentário ainda.</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.author}</p>
                <p className="text-xs text-muted-foreground">{c.date}</p>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                aria-label="Excluir comentário"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-foreground">{c.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
