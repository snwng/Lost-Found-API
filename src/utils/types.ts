interface Item {
	id: bigint;
	title: string;
	description: string;
	resolved: number;
	created_at: string;
}

enum Order {
	ASC = "asc",
	DESC = "desc",
}

enum Sort {
	ID = "id",
	TITLE = "title",
	CREATED_AT = "created_at",
}

enum Status {
	RESOLVED = "resolved",
	NOT_FOUND = "not_resolved",
}

export type { Item };
export { Order, Sort, Status };
