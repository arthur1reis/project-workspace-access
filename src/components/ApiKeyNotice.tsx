import { useState } from "react";
import { getApiKey, setLocalApiKey } from "@/services/api";

/**
 * Aviso exibido quando a API KEY do TMDB não está configurada.
 * Em produção/local a chave deve vir do .env (REACT_APP_KEY / VITE_REACT_APP_KEY).
 * Este campo é apenas um atalho para testar a aplicação neste preview.
 */
export function ApiKeyNotice() {
  const [key, setKey] = useState("");
  if (getApiKey()) return null;

  return (
    <div className="mx-auto my-6 max-w-2xl rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground">API KEY do TMDB não configurada</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Crie um arquivo <code>.env</code> na raiz com{" "}
        <code>VITE_REACT_APP_KEY=sua_chave</code> (no projeto original do professor:{" "}
        <code>REACT_APP_KEY</code>). Para testar agora, cole a chave abaixo.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Sua chave TMDB"
          className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
        />
        <button
          onClick={() => {
            if (!key.trim()) return;
            setLocalApiKey(key);
            window.location.reload();
          }}
          className="rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
