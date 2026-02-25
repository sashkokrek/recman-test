# Recman Test

## System Requirements

- **Node.js** 22+ and **npm** (or **yarn**/**pnpm**)

## Installation

```bash
npm install
```
or
```bash
yarn install
```
or
```bash
pnpm install
```

## Development

Start the development server with hot module reloading:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Testing

Run tests once:

```bash
npm run test
```

## Linting

Check for code style and TypeScript errors:

```bash
npm run lint
```

## Building

Create a production-optimized build:

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
src/
├── components/       # React components (UI library, dialogs, etc.)
├── lib/              # Utilities (helpers, constants, localStorage, etc.)
├── store/            # State management (React Context + Reducer pattern)
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```
