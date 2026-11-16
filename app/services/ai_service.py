
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=True)


def generate_sql(question: str, schema_context: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or not api_key.strip():
        raise RuntimeError("GEMINI_API_KEY is missing or empty")

    try:
        client = genai.Client(
            api_key=api_key.strip(),
            http_options={"timeout": 30000},
        )

        prompt = f"""
You are IntelliSQL, an expert PostgreSQL SQL assistant.

Convert the user's natural language question into a PostgreSQL SELECT query.

DATABASE SCHEMA:
{schema_context}

USER QUESTION:
{question}

STRICT RULES:
1. Generate only SELECT queries.
2. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or CREATE.
3. Use only tables and columns in the provided schema.
4. Never invent table or column names.
5. Return only SQL. No markdown or explanations.
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        if not response.text:
            raise ValueError("Gemini returned an empty response")

        return response.text.strip()

    except Exception:
        logger.exception("Gemini SQL generation failed")
        raise
