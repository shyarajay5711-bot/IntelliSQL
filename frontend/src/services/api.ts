
const API_BASE_URL = "http://127.0.0.1:8000";

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
}

export interface ForeignKey {
  columns: string[];
  references_table: string;
  references_columns: string[];
}

export interface DatabaseTable {
  columns: DatabaseColumn[];
  primary_key: string[];
  foreign_keys: ForeignKey[];
}

export type DatabaseSchema = Record<string, DatabaseTable>;

export interface HealthStatus {
  api: string;
  database: string;
}

export async function getHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Unable to connect to IntelliSQL API");
  }

  return response.json();
}

export async function getDatabaseSchema(): Promise<DatabaseSchema> {
  const response = await fetch(
    `${API_BASE_URL}/api/database/schema`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch database schema");
  }

  return response.json();
}
