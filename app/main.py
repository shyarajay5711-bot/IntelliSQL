
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.database.connection import (
    test_connection,
    execute_read_only_query,
)
from app.database.schema_inspector import inspect_database
from app.database.schema_context import get_schema_context
from app.services.ai_service import generate_sql


app = FastAPI(
    title="IntelliSQL API",
    description="AI-powered Natural Language to SQL platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SQLRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)


class SQLExecutionRequest(BaseModel):
    sql: str = Field(min_length=1, max_length=10000)


@app.get("/")
def root():
    return {
        "message": "Welcome to IntelliSQL API",
        "status": "running",
    }


@app.get("/api/health")
def health_check():
    try:
        test_connection()
        return {
            "api": "online",
            "database": "connected",
        }
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed",
        )


@app.get("/api/database/schema")
def database_schema():
    try:
        return inspect_database()
    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to inspect database schema",
        )


@app.post("/api/generate-sql")
def generate_sql_endpoint(request: SQLRequest):
    try:
        schema_context = get_schema_context()

        sql = generate_sql(
            question=request.question,
            schema_context=schema_context,
        )

        return {
            "question": request.question,
            "sql": sql,
            "status": "success",
        }

    except RuntimeError:
        raise HTTPException(
            status_code=503,
            detail="AI service configuration error",
        )

    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI Error: {type(e).__name__}",
        )


@app.post("/api/execute-sql")
def execute_sql_endpoint(request: SQLExecutionRequest):
    try:
        result = execute_read_only_query(request.sql)

        return {
            "status": "success",
            "sql": request.sql,
            "columns": result["columns"],
            "rows": result["rows"],
            "row_count": result["row_count"],
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="SQL execution failed. Check the query and database.",
        )