-- Up
    CREATE TABLE reference (
        ref_id INTEGER PRIMARY KEY,
        ref_tag VARCHAR(255),
        ref_json TEXT
    )

-- Down
DROP TABLE reference;