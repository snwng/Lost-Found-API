import * as z from "zod";

const Itemschema = z.object({
	id: z.number(),
	title: z.string().nonempty(),
	description: z.string().nonempty(),
	resolved: z.number(),
	created_at: z.string(),
});

const OrderSchema = z.enum(["asc", "desc"]).default("desc");
const SortSchema = z.enum(["id", "title", "created_at"]).default("created_at");
const StatusSchema = z.enum(["resolved", "pending"]).nullable().default(null);

const createItemSchema = z.object({
	title: z.string().nonempty(),
	description: z.string().nonempty(),
});

const getItemsSchema = z.object({
	page: z.int().positive().default(1),
	limit: z.int().positive().max(100).default(10),
	search: z.string().default(""),
	sort: SortSchema,
	order: OrderSchema,
	status: StatusSchema,
});

const updateItemSchema = z.object({
	title: z.string().nonempty(),
	description: z.string().nonempty(),
	resolved: z.boolean(),
});

const idSchema = z.string().nonempty().pipe(z.coerce.number());

export {
	Itemschema,
	OrderSchema,
	SortSchema,
	StatusSchema,
	createItemSchema,
	getItemsSchema,
	updateItemSchema,
	idSchema,
};
