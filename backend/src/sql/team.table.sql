CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES devhub.organizations(organization_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (organization_id, name)
);
