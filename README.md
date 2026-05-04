# CollabDocs

> Real-time collaborative document editor with AI writing assistant, built as a full-stack portfolio project.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-↗-black?style=for-the-badge&logo=vercel&logoColor=white)](https://collab-docs-bay.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-Prisma-4479A1?style=flat-square&logo=mysql)](https://prisma.io)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

![CollabDocs Demo](./demo.gif)

---

## What is CollabDocs?

CollabDocs is a Google Docs-style collaborative editor where multiple users can edit the same document simultaneously — with zero conflicts. It combines **Yjs CRDTs** for real-time sync, a **Groq-powered AI writing assistant** accessible via slash commands, and **binary document snapshots** for one-click version restore.

Built to demonstrate full-stack product engineering: WebSocket architecture, CRDT-based state sync, SSE streaming, JWT auth, and production deployment across Vercel + Render + Aiven.

---

## Features

- **Real-time collaboration** — Multiple users edit the same document simultaneously. Conflict-free sync powered by Yjs CRDTs over WebSocket.
- **Collaborative cursors** — See exactly where teammates are typing with colored name labels in real time, implemented directly on the Yjs awareness protocol (no broken third-party extension).
- **AI slash commands** — Type `/` to access AI writing tools: `/improve`, `/summarize`, `/expand`, `/fix grammar`. Responses stream token-by-token via SSE using the Groq API.
- **Document versioning** — Save named snapshots at any point. View full version history, restore any version — syncs instantly to all connected clients via LevelDB state replay.
- **Public share links** — Generate a shareable URL for any document. Anyone with the link can view and edit without signing up.
- **JWT authentication** — Secure register/login flow with bcrypt password hashing and Zustand-persisted auth state.
- **Rich text editor** — Bold, italic, H1, H2, bullet lists, ordered lists. Built on Tiptap v3 + ProseMirror.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite | UI framework |
| Styling | Tailwind CSS + Geist Mono | Dark Vercel-style design |
| Editor | Tiptap v3 + ProseMirror | Rich text editing |
| Real-time | Yjs + y-websocket | CRDT-based conflict-free sync |
| Backend | Node.js + Express (ESM) | REST API + WebSocket server |
| Database | MySQL + Prisma ORM | Persistent storage |
| AI | Groq API (llama-3.1-8b-instant) | Streaming AI completions |
| Auth | JWT + bcrypt | Stateless authentication |
| State | Zustand + React Query | Client-side state management |
| Persistence | LevelDB | Yjs document state cache |
| Deployment | Vercel + Render + Aiven | Frontend + Backend + DB |

---



**Key decisions:**
- The Yjs WebSocket server shares port 4000 with Express via the HTTP `upgrade` event — no separate WebSocket port needed.
- LevelDB runs as a **shared singleton** across all document rooms. Two instances caused `LEVEL_DATABASE_NOT_OPEN` errors in production.
- Collaborative cursors are implemented directly on the **Yjs awareness protocol** instead of `@tiptap/extension-collaboration-cursor` which has a v2/v3 constructor conflict with Tiptap v3.
- Version restore works by clearing LevelDB for the document, replaying the snapshot, and triggering a page reload so all clients re-hydrate from the fresh state.

---
## Try it out

**Demo account** — no signup needed

| | |
|---|---|
| Email | `demo@collabdocs.app` |
| Password | `123456` |

## Local Setup

### Prerequisites
- Node.js 18+
- MySQL running locally
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/Mridul012/collab-docs.git
cd collab-docs
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend (--legacy-peer-deps required for Tiptap v3)
cd ../client
npm install --legacy-peer-deps
```

### 3. Configure environment variables

**`server/.env`**
```env
DATABASE_URL="mysql://root@localhost:3306/collab_docs"
JWT_SECRET="your-secret-key"
PORT=4000
CLIENT_URL="http://localhost:5175"
GROQ_API_KEY="gsk_..."
```

**`client/.env`**
```env
VITE_API_URL="http://localhost:4000"
VITE_WS_URL="ws://localhost:4000"
```

### 4. Set up the database

```bash
cd server
npx prisma db push
```

### 5. Run the app

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```


