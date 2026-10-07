# Power BI Link Manager

A professional web dashboard to **manage, embed, and audit Power BI report links** from a single place.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma (SQLite) · TanStack Query**.

---

## ✨ Features

- **Embedded Power BI viewer** — the active report renders live in an iframe (full Power BI interactivity).
- **Link library** — save unlimited Power BI "publish to web" links, each with a title, category, description and view counter.
- **Add / edit / delete / switch** links from a clean, responsive UI.
- **Default link** — ships with a default Power BI report; the app auto-seeds it on first run. You can change it any time from the UI (header → *Add Link* or the *Edit* button on the active report).
- **Activity log** — every action (create, update, delete, switch, seed, clear) is recorded with a timestamp, an icon and a human-readable description, so you always know what happened and when.
- **Responsive & themeable** — mobile-first layout with a light/dark theme toggle and a sticky footer.
- **Instant feedback** — toast notifications for every mutation and auto-refreshing activity log.

---

## 🚀 Getting started

```bash
# 1. install dependencies
bun install            # or: npm install

# 2. push the database schema
bun run db:push

# 3. start the dev server
bun run dev
```

Open the app at <http://localhost:3000>.

> The SQLite database is created automatically on first run and the default Power BI link is seeded for you. No manual setup required.

### Environment

A single env var is needed (already provided in `.env`):

```
DATABASE_URL=file:./db/custom.db
```

---

## 🗂️ Project structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ powerbi-links/          # GET, POST + [id] PATCH/DELETE + [id]/activate
│  │  └─ activity-logs/          # GET (recent) + DELETE (clear)
│  ├─ layout.tsx                 # root layout + providers
│  └─ page.tsx                   # the dashboard (single visible route)
├─ components/
│  ├─ powerbi/                   # app-header, link-library, link-card,
│  │                             # link-form-dialog, report-viewer,
│  │                             # activity-log, theme-toggle
│  └─ providers.tsx              # TanStack Query + next-themes
├─ hooks/use-powerbi.ts          # data + mutation hooks
├─ lib/{api,db,format,powerbi-seed}.ts
└─ types/powerbi.ts
prisma/schema.prisma              # PowerBILink + ActivityLog models
```

---

## 🔌 API reference

| Method | Endpoint                          | Description                         |
|-------:|-----------------------------------|-------------------------------------|
| GET    | `/api/powerbi-links`              | List all links (ordered)            |
| POST   | `/api/powerbi-links`              | Create a link                        |
| PATCH  | `/api/powerbi-links/:id`          | Update a link                       |
| DELETE | `/api/powerbi-links/:id`          | Delete a link                        |
| POST   | `/api/powerbi-links/:id/activate` | Set a link as the active report     |
| GET    | `/api/activity-logs?limit=200`    | List recent activity                |
| DELETE | `/api/activity-logs`             | Clear the activity log              |

---

## 🖼️ Legacy tool — `Screen_Shot_Tools_V16.zip`

This repository also ships the original **Screen Shot Tools V16** — a Python + Playwright tool that takes automated screenshots of Power BI reports across multiple pages and resto slicers. Extract the zip and run `python app.py`. It reads its own `config.json` (`powerbi_url`, page list, resto list, etc.). The web app above is the modern companion for managing which Power BI link to use.

---

## 🛠️ Tech stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York style) + **Lucide** icons
- **Prisma ORM** (SQLite) for persistence
- **TanStack Query** for server state + **Zustand** ready for client state
- **next-themes** for light/dark mode

---

## 📄 License

MIT — free to use and adapt.
