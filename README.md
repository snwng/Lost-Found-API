# lost_found_api

Express + Bun + SQLite API for tracking lost & found items.

## Setup

```bash
bun install
cp .env.example .env
```

Set `DB_PATH` in `.env` (e.g. `DB_PATH=./data.db`).

## Run

```bash
bun run app.ts
```

## API

Base URL: `/api`

- `GET /` — health check
- `POST /items` — create item
- `GET /items` — list items (search/sort/filter)
- `GET /items/:id` — get item by ID
- `PUT /items/:id` — update item
- `DELETE /items/:id` — delete item

Query params for `GET /items`:

- `search` (string)
- `sort` (`id` | `title` | `created_at`, default `created_at`)
- `order` (`asc` | `desc`, default `desc`)
- `status` (`resolved` | `pending`)
- `page`, `limit` (default `1`, `10`)
