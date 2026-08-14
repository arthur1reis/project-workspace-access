# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## CineApp — aplicação de filmes (TMDB)

### Configuração da API
A chave do TMDB vem do arquivo `.env` (copie de `.env.example`):

```
VITE_REACT_APP_KEY=sua_chave_do_tmdb
```

No projeto original do professor a variável é `REACT_APP_KEY`; aqui o Vite exige o prefixo `VITE_`.
Nenhum componente acessa a chave diretamente — tudo passa por `src/services/api.ts`.

### Executar
```
npm install
npm run dev      # equivalente ao npm start do Create React App
```

### Estrutura
```
src/
  components/  Header, CategoryMenu, SearchBar, MovieCard, MovieList,
               FavoriteButton, CommentSection, FavoritesPage, ApiKeyNotice
  routes/      index (Home), categoria.$slug, busca, filme.$id,
               favoritos, minha-lista, login, cadastro
  services/    api.ts (todas as chamadas ao TMDB)
  context/     AuthContext.tsx (cadastro, login, logout, sessão)
  utils/       storage.ts (favoritos e comentários por usuário)
```
