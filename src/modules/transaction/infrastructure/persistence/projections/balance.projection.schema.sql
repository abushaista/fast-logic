CREATE TABLE organization (
  organization_id VARCHAR(100) PRIMARY KEY,
  organization_name VARCHAR(200),
  balance BIGINT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true
  updated_at TIMESTAMP NOT NULL
);
