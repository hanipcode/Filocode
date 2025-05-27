CREATE TABLE contexts (
    id TEXT PRIMARY KEY,
    type TEXT,
    path TEXT,
    parentId TEXT,
    selected INTEGER
);
