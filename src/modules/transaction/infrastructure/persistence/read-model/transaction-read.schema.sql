CREATE TABLE transaction_read (
  transaction_id UUID PRIMARY KEY,
  status VARCHAR(30) NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
