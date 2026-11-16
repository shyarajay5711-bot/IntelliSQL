
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

export interface SQLGenerationResponse {
  question: string;
  sql: string;
  status: string;
}

export interface SQLExecutionResponse {
  status: string;
  sql: string;
  columns: string[];
  rows: Record<string, unknown>[];
  row_count: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.detail || `Request failed: ${response.status}`
    );
  }

  return response.json();
}

export async function getHealth(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return handleResponse<HealthStatus>(response);
}

export async function getDatabaseSchema(): Promise<DatabaseSchema> {
  const response = await fetch(`${API_BASE_URL}/api/database/schema`);
  return handleResponse<DatabaseSchema>(response);
}

export async function generateSQL(
  question: string
): Promise<SQLGenerationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate-sql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  return handleResponse<SQLGenerationResponse>(response);
}

export async function executeSQL(
  sql: string
): Promise<SQLExecutionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/execute-sql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql }),
  });

  return handleResponse<SQLExecutionResponse>(response);
}