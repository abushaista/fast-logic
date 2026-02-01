CREATE TABLE event_store (
  id UUID PRIMARY KEY,
  aggregate_id VARCHAR(100) NOT NULL,
  aggregate_type VARCHAR(50) NOT NULL,
  version INT NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now(),

  UNIQUE (aggregate_id, version)
);

CREATE INDEX idx_event_store_aggregate
ON event_store (aggregate_id);
