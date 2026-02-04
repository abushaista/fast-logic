CREATE TABLE transaction_read (
  transaction_id UUID PRIMARY KEY,
  card_id UUID NOT NULL,
  amount decimal(12,4) NOT NULL,
  status VARCHAR(30) NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
