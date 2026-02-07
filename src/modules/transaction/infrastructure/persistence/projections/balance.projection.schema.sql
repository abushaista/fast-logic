CREATE TABLE organization (
  organization_id VARCHAR(100) PRIMARY KEY,
  organization_name VARCHAR(200),
  currency varchar(10),
  balance BIGINT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
