# Database Standards & Implementation Guidelines

These guidelines define the mandatory database design, naming conventions, relationship management, data integrity, performance and implementation standards for this project.

GitHub Copilot and developers must follow these standards whenever creating, modifying or maintaining database entities, tables, columns, relationships, indexes, queries and migrations.

## 1. Naming Conventions

- All foreign key names must follow the primary key naming convention of the referenced parent table.
- For example, if the primary key of the `Users` table is `userId`, the corresponding foreign key in a child table should also be named `userId`.
- When a table references the same parent table multiple times, use descriptive role-based names, such as `createdByUserId` and `approvedByUserId`.

### Table and Column Naming

- Tables: Use plural nouns in PascalCase (e.g., `Users`, `Orders`, `Invoices`).
- Primary keys: Use camelCase (e.g., `userId`, `orderId`).
- Foreign keys: Use camelCase and follow the referenced primary key naming convention.
- Columns: Use camelCase (e.g., `fullName`, `vatIdNumber`, `createdAt`).
- Indexes: Use the format `IX_<TableName>_<ColumnName>` (e.g., `IX_Users_Email`).
- Unique indexes: Use the format `UX_<TableName>_<ColumnName>` (e.g., `UX_Users_Email`).
- Foreign key constraints: Use the format `FK_<ChildTable>_<ParentTable>` (e.g., `FK_Orders_Users`).
- Check constraints: Use the format `CK_<TableName>_<ConstraintDescription>`.
- Default constraints: Use the format `DF_<TableName>_<ColumnName>` where supported.

For composite indexes, include all indexed columns in their defined order.

## 2. Primary Keys

- Every table must have a clearly defined primary key.
- Primary keys must be unique and non-nullable.
- Primary keys must be immutable after record creation.
- Use a consistent primary key strategy throughout the application.
- Never use business values such as email addresses, phone numbers or invoice numbers as primary keys.
- Prefer surrogate keys for application-managed entities.

## 3. Foreign Keys and Relationships

- All foreign key relationships must have explicitly defined database constraints.
- Foreign keys must reference an existing primary key or an appropriately constrained unique key.
- Foreign key columns must have compatible data types with their referenced primary keys.
- Define relationships explicitly rather than relying exclusively on application-level validation.
- Avoid unnecessary circular dependencies between tables.
- Use junction tables for many-to-many relationships.
- Define appropriate one-to-one, one-to-many and many-to-many relationships.
- Referential actions such as CASCADE, RESTRICT and SET NULL must be selected deliberately.
- Do not enable cascading deletes by default.
- Never allow orphaned records where referential integrity is required.

## 4. Column Data Types and Nullability

- Always select the most appropriate data type for each column.
- Avoid using generic text types for every field.
- Use VARCHAR for variable-length strings with reasonable length limits.
- Use TEXT for genuinely long-form content.
- Use INTEGER or BIGINT for whole-number values as appropriate.
- Use DECIMAL/NUMERIC for financial amounts. Never use FLOAT or DOUBLE for monetary calculations.
- Use BOOLEAN for true/false values where supported.
- Use appropriate date/time types for dates and timestamps.
- Use JSON only when the data structure genuinely requires flexible or semi-structured storage.
- Avoid storing relational data as comma-separated strings or JSON when proper relational tables are more appropriate.
- Columns should be NOT NULL by default unless NULL has a meaningful business purpose.
- Define appropriate default values where necessary.
- Avoid unnecessary default values that could hide missing application data.

## 5. Standard Audit Columns

Where applicable, business tables should include:

- `createdAt`: Date and time the record was created.
- `updatedAt`: Date and time the record was last updated.
- `createdByUserId`: User responsible for creating the record, where applicable.
- `updatedByUserId`: User responsible for the latest modification, where applicable.

Additional audit requirements:

- Store timestamps consistently in UTC.
- Use the same timestamp precision throughout the application.
- Update `updatedAt` whenever a record is modified.
- Do not allow application users to arbitrarily modify creation timestamps.
- Maintain a separate audit history for important business operations where necessary.

## 6. Data Integrity and Constraints

- Enforce business-critical data integrity rules at database level wherever possible.
- Use UNIQUE constraints for values that must be unique.
- Use CHECK constraints for appropriate data validation.
- Use NOT NULL constraints for mandatory fields.
- Use foreign key constraints to maintain referential integrity.
- Avoid relying exclusively on frontend validation.
- Validate data in the backend before database insertion or modification.
- Never assume that application-level validation alone guarantees data integrity.

## 7. Indexing Strategy

- Create indexes for frequently queried columns where beneficial.
- Foreign key columns should generally be indexed where the database does not automatically create an appropriate index.
- Create composite indexes for queries that frequently filter or sort using multiple columns.
- Consider column order when defining composite indexes.
- Use unique indexes where uniqueness must be enforced.
- Avoid creating unnecessary indexes.
- Consider the performance impact of indexes on INSERT, UPDATE and DELETE operations.
- Review query execution plans when optimizing slow queries.
- Do not create duplicate indexes.

## 8. Soft Deletes and Record Retention

- Avoid physically deleting important business records.
- Use soft deletion for records that need to be retained for historical or operational purposes.
- Where applicable, use:
    - `isDeleted`: Boolean indicating whether a record is deleted.
    - `deletedAt`: Timestamp indicating when the record was deleted.
    - `deletedByUserId`: User responsible for the deletion, where applicable.
- Exclude soft-deleted records from normal application queries by default.
- Provide an explicit mechanism for retrieving deleted records when required.
- Do not use soft deletion indiscriminately for every table.
- Implement retention and permanent deletion policies where legally required.
- Soft deletion must not be used as a substitute for GDPR-compliant erasure.

## 9. Database Transactions

- Use transactions when an operation involves multiple related database changes that must succeed or fail together.
- Never leave partially completed business operations.
- Keep transactions as short as reasonably possible.
- Handle transaction failures and rollbacks appropriately.
- Ensure financial operations and payment-related changes maintain data consistency.
- Avoid external API calls inside long-running database transactions.
- Use appropriate concurrency controls when multiple requests could modify the same record.

## 10. Database Migrations

- All database schema changes must be managed through version-controlled migrations.
- Never modify production database structures manually without a corresponding migration.
- Every migration must be repeatable within the supported migration workflow.
- Migrations should have clear and descriptive names.
- Prefer small, focused migrations over large migrations containing unrelated changes.
- Include rollback procedures where supported.
- Never delete or modify previously applied production migrations without an explicit migration strategy.
- Consider existing production data when changing column types, constraints or relationships.
- Seed data must be separated appropriately from schema migrations.
- Test migrations against a representative database before deployment.

## 11. Query and Performance Standards

- Retrieve only the columns required by the application.
- Avoid SELECT * in production application queries.
- Prevent N+1 query problems.
- Use pagination for potentially large result sets.
- Use filtering and sorting at database level rather than retrieving entire datasets into application memory.
- Avoid unnecessary database round trips.
- Use parameterized queries and ORM parameter binding.
- Never construct SQL queries by concatenating untrusted user input.
- Use bulk operations where appropriate.
- Monitor slow queries and review execution plans when necessary.

## 12. Security and Sensitive Data

- Never store passwords in plain text.
- Store passwords using an established, secure password-hashing algorithm.
- Never store authentication tokens or API secrets in plain text.
- Restrict database permissions according to application responsibilities.
- Do not expose internal database identifiers or sensitive fields unnecessarily through public API responses.
- Apply appropriate encryption to sensitive personal and business information.
- Avoid logging passwords, payment credentials, authentication tokens or sensitive personal data.
- Use environment variables or secure secret management for database credentials.
- Never commit database credentials or connection strings containing secrets to Git.

## 13. Financial Data Standards

- Store monetary values using DECIMAL/NUMERIC types with explicitly defined precision and scale.
- Never use floating-point types for financial calculations.
- Store currency explicitly where a system supports multiple currencies.
- Do not assume all monetary values are denominated in EUR.
- Keep financial transaction records immutable wherever practical.
- Corrections to completed financial transactions should be represented through adjustments, reversals or additional transaction records.
- Maintain appropriate references between invoices, payments, refunds and related business transactions.
- Use database transactions to ensure consistency during financial operations.

## 14. Concurrency and Data Consistency

- Consider concurrent updates when designing database operations.
- Use optimistic or pessimistic concurrency controls where appropriate.
- Prevent duplicate processing of operations that must only happen once.
- Use unique constraints and idempotency mechanisms for critical operations.
- Ensure that inventory, balances, payment status and other sensitive business values cannot be incorrectly overwritten by concurrent requests.
- Handle database deadlocks and transient failures appropriately.

## 15. General Development Rules

- Maintain consistent database conventions across all modules.
- Avoid unnecessary duplication of data.
- Normalize relational data appropriately.
- Denormalization must be intentional and justified by performance or business requirements.
- Do not introduce new tables or columns without understanding their business purpose.
- Reuse existing entities and relationships where appropriate.
- Keep database entities separate from API request and response DTOs.
- Never expose database entities directly as public API contracts.
- Document complex relationships and non-obvious database design decisions.
- Before introducing a schema change, inspect existing tables and relationships to avoid duplication or conflicts.

## 16. Instructions for GitHub Copilot

Before implementing any database-related functionality:

1. Inspect the existing database schema and related entities.
2. Identify existing tables, relationships, indexes and constraints.
3. Reuse existing structures where appropriate.
4. Follow all naming conventions defined in this document.
5. Consider data integrity, security and performance implications.
6. Create appropriate migrations for schema changes.
7. Ensure related backend entities, configurations and repositories remain consistent.
8. Do not introduce breaking schema changes without explicitly identifying their impact.
9. Do not invent relationships or business rules without understanding the existing application requirements.
10. If a database design decision is ambiguous, ask for clarification rather than making assumptions.

These standards apply to all new database implementations and modifications unless an explicitly documented project-specific exception is approved.