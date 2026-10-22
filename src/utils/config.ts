import "dotenv/config";

function required(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

const config = {
	PORT: process.env.PORT || 5000,
	DB_PATH: required("DB_PATH"),
};

export default config;
