from app.database.schema_inspector import inspect_database


def get_schema_context():
    schema = inspect_database()

    context = ["DATABASE SCHEMA:"]

    for table_name, details in schema.items():
        context.append(f"\nTable: {table_name}")

        context.append("Columns:")
        for column in details["columns"]:
            context.append(
                f"- {column['name']} ({column['type']})"
            )

        context.append(
            f"Primary Key: {details['primary_key']}"
        )

        if details["foreign_keys"]:
            context.append("Foreign Keys:")

            for fk in details["foreign_keys"]:
                context.append(
                    f"- {fk['columns']} -> "
                    f"{fk['references_table']}."
                    f"{fk['references_columns']}"
                )

    return "\n".join(context)


if __name__ == "__main__":
    print(get_schema_context())
