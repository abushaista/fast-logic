CREATE TABLE organization_balance (
  organization_id VARCHAR(100) PRIMARY KEY,
  balance BIGINT NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
