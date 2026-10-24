import type * as z from "zod";
import {
	Itemschema,
	OrderSchema,
	SortSchema,
	StatusSchema,
} from "./validation";

type Item = z.infer<typeof Itemschema>;
type Order = z.infer<typeof OrderSchema>;
type Sort = z.infer<typeof SortSchema>;
type Status = z.infer<typeof StatusSchema>;

export type { Item, Order, Sort, Status };
