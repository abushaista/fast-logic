CREATE TABLE card (
  card_id UUID PRIMARY KEY,
  organization_id UUID,
  card_number varchar(100) UNIQUE NOT NULL,
  daily_limit BIGINT NOT NULL,
  monthly_limit BIGINT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
