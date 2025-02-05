CREATE TABLE productions (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE
);

CREATE TABLE quality_controls (
  id SERIAL PRIMARY KEY,
  production_id INT REFERENCES productions(id),
  inspection_date DATE NOT NULL,
  result VARCHAR(50) NOT NULL,
  remarks TEXT
);
