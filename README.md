# Idle Architect

[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-7-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A modern incremental / idle game built with React + TypeScript + Vite.

## Features

- **Click mining** to earn money.
- **5 shop upgrades** with cost scaling and progressive unlocks.
- **Autosave (localStorage)**
  - Default ON
  - 1 or 10 minute intervals
  - Countdown to next save + last saved time
- **Manual save** button.
- **Notifications** (MUI Snackbar) for buy/save/reset events.
- **Settings** for number formatting.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Material UI (MUI)**
- **Jotai** (state management)
- **Zod** (schema validation)

## Getting Started

### Prerequisites

- Node.js (recommended: latest LTS)

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Data Persistence

- Game state and settings are persisted in **localStorage**.
- Use the in-game **Reset game** to clear progress.

## Project Structure (high level)

- `src/App.tsx`: main UI + autosave loop
- `src/gameStore.ts`: game state + actions
- `src/gamePersistence.ts`: localStorage load/save/clear
- `src/settingsStore.ts`: settings persistence
- `src/notificationStore.ts`: snackbar notification queue
- `src/components/*`: UI components (Shop / Stats / Tips / Settings / Notifications)
- `src/schema/*`: Zod schemas
