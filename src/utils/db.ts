import Database, { type Changes } from "bun:sqlite";
import config from "./config";
import type { Order, Sort, Status } from "./types";
import type { Item } from "./types";

const db = new Database(config.DB_PATH);

// Init the sqlite table
db.run(
	` CREATE TABLE IF NOT EXISTS items
	( id INTEGER PRIMARY KEY,
	 title TEXT NOT NULL,
	 description TEXT NOT NULL,
	 resolved INTEGER NOT NULL DEFAULT 0,
	 created_at DATETIME DEFAULT CURRENT_TIMESTAMP );
	`,
);

const addItm = db.prepare<Changes, [string, string]>(
	"INSERT INTO items (title, description) VALUES (?, ?)",
);

const ById = db.prepare<Item, number>("SELECT * FROM items WHERE id = ?");

const getItm = (sort: string, order: string) =>
	db.prepare<Item, [string, number | null, number | null, number, number]>(
		`SELECT * FROM items WHERE title LIKE ? AND ( ? IS NULL OR resolved = ? ) ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
	);

const updateItm = db.prepare<Changes, [string, string, number, number]>(
	"UPDATE items SET title = ?, description = ?, resolved = ? WHERE id = ?",
);

const deleteItm = db.prepare<Changes, number>("DELETE FROM items WHERE id = ?");

class Items {
	static add(title: string, descr: string): Changes {
		return addItm.run(title, descr);
	}

	static getById(id: number): Item | null {
		return ById.get(id);
	}

	static get(
		offset: number,
		limit: number,
		search: string,
		sort: Sort,
		order: Order,
		stat: Status,
	): Item[] {
		const q = `%${search}%`;
		const o = order === "asc" ? "ASC" : "DESC";
		const s = stat === null ? null : stat === "resolved" ? 1 : 0;
		return getItm(sort, o).all(q, s, s, limit, offset);
	}

	static update(
		id: number,
		title: string,
		description: string,
		resolved: boolean,
	): Changes {
		const r = resolved ? 1 : 0;
		return updateItm.run(title, description, r, id);
	}

	static delete(id: number): Changes {
		return deleteItm.run(id);
	}
}

export { Items, db };
