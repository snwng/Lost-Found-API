import Database, { type Changes } from "bun:sqlite";
import config from "./config";
import { Order, Sort, Status } from "./types";
import type { Item } from "./types";

const db = new Database(config.DB_PATH, { safeIntegers: true });

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

const ById = db.prepare<Item, bigint>("SELECT * FROM items WHERE id = ?");

const getItm = (sort: string, order: string) =>
	db.prepare<Item, [string, number | null, number | null, number, number]>(
		`SELECT * FROM items WHERE title LIKE ? AND ( ? IS NULL OR resolved = ? ) ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
	);

const updateItm = db.prepare<Changes, [string, string, number, bigint]>(
	"UPDATE items SET title = ?, description = ?, resolved = ? WHERE id = ?",
);

const deleteItm = db.prepare<Changes, bigint>("DELETE FROM items WHERE id = ?");

class Items {
	static add(title: string, descr: string): Changes {
		return addItm.run(title, descr);
	}

	static getById(id: bigint): Item | null {
		return ById.get(id);
	}

	static get(
		p: number,
		l: number,
		title: string,
		s: Sort,
		o: Order,
		stat: Status | null,
	): Item[] {
		const off = (p - 1) * l;
		const ord = o.toUpperCase();
		const queryTitle = title ? `%${title}%` : "%";
		const resolved = stat === null ? null : stat === Status.RESOLVED ? 1 : 0;

		return getItm(s, ord).all(queryTitle, resolved, resolved, l, off);
	}

	static update(
		id: bigint,
		title: string,
		description: string,
		resolved: boolean,
	): Changes {
		const r = resolved ? 1 : 0;
		return updateItm.run(title, description, r, id);
	}

	static delete(id: bigint): Changes {
		return deleteItm.run(id);
	}
}
