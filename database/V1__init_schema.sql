/* database/v1_init_schema.sql */
/* Your test table "lmfao" */
CREATE TABLE test_table (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

/* Insert a test row */
INSERT INTO test_table (id, name)
VALUES (1, 'name');