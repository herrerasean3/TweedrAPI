DROP DATABASE IF EXISTS tweedr;
CREATE DATABASE tweedr;

\c tweedr;

DROP TABLE IF EXISTS tweed;

CREATE TABLE tweed (
    tweed_id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR NOT NULL,
    tweed_content VARCHAR(120) NOT NULL,
    tweed_timestamp TIMESTAMP NOT NULL,
    reply_id INTEGER REFERENCES tweed(tweed_id)
);