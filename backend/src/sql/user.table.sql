CREATE TYPE developer_role AS ENUM (
    'admin',
    'developer',
    'maintainer',
    'contributor',
    'guest'
);

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    user_name VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_role developer_role DEFAULT 'developer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
