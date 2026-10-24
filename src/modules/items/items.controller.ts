import { Items } from "../../utils/db";
import {
	createItemSchema,
	getItemsSchema,
	idSchema,
	updateItemSchema,
} from "../../utils/validation";
import type { Request, Response } from "express";
import type { Order, Sort, Status } from "../../utils/types";

function createItem(req: Request, res: Response) {
	try {
		const item = req.body || {};
		const parsedItem = createItemSchema.safeParse(item);
		if (!parsedItem.success) {
			return res.status(400).json({
				message: "Invalid request body",
				errors: parsedItem.error.issues,
			});
		}
		const { title, description } = parsedItem.data;

		const { lastInsertRowid } = Items.add(title, description);
		const id = Number(lastInsertRowid);

		res.status(201).json({ id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

function getItems(req: Request, res: Response) {
	try {
		const query = req.query || {};

		const parsedQuery = getItemsSchema.safeParse(query);
		if (!parsedQuery.success) {
			return res.status(400).json({
				message: "Invalid query parameters",
				errors: parsedQuery.error.issues,
			});
		}

		const { page, limit, search, sort, order, status } = parsedQuery.data;

		const offset = (page - 1) * limit;

		const items = Items.get(
			offset,
			limit,
			search,
			sort as Sort,
			order as Order,
			status as Status,
		);

		res.status(200).json({ items });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

function getItemById(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const parsedId = idSchema.safeParse(id);
		if (!parsedId.success) {
			return res.status(400).json({
				message: "Invalid item ID",
				errors: parsedId.error.issues,
			});
		}

		const item = Items.getById(parsedId.data);
		if (!item) {
			return res.status(404).json({ message: "Item not found" });
		}

		res.status(200).json({ item });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

function updateItem(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const parsedId = idSchema.safeParse(id);
		if (!parsedId.success) {
			return res.status(400).json({
				message: "Invalid item ID",
				errors: parsedId.error.issues,
			});
		}

		const item = req.body || {};
		const parsedItem = updateItemSchema.safeParse(item);
		if (!parsedItem.success) {
			return res.status(400).json({
				message: "Invalid request body",
				errors: parsedItem.error.issues,
			});
		}
		const { title, description, resolved } = parsedItem.data;

		const changes = Items.update(parsedId.data, title, description, resolved);
		if (changes.changes === 0) {
			return res.status(404).json({ message: "Item not found" });
		}

		res.status(200).json({ message: "Item updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

function deleteItem(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const parsedId = idSchema.safeParse(id);
		if (!parsedId.success) {
			return res.status(400).json({
				message: "Invalid item ID",
				errors: parsedId.error.issues,
			});
		}

		const changes = Items.delete(parsedId.data);
		if (changes.changes === 0) {
			return res.status(404).json({ message: "Item not found" });
		}

		res.status(200).json({ message: "Item deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export { createItem, getItems, getItemById, updateItem, deleteItem };
