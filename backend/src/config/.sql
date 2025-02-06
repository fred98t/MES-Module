-- Create Tables
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE production_order (
    production_order_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity_ordered INT NOT NULL,
    order_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE production_stage (
    stage_id SERIAL PRIMARY KEY,
    stage_name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE production_step (
    production_step_id SERIAL PRIMARY KEY,
    production_order_id INT NOT NULL,
    stage_id INT NOT NULL,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    FOREIGN KEY (production_order_id) REFERENCES production_order(production_order_id),
    FOREIGN KEY (stage_id) REFERENCES production_stage(stage_id)
);

CREATE TABLE material (
    material_id SERIAL PRIMARY KEY,
    material_name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    unit_of_measure VARCHAR(20)
);

CREATE TABLE material_inventory (
    material_inventory_id SERIAL PRIMARY KEY,
    material_id INT NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    quantity_available DECIMAL(10, 2) NOT NULL,
    received_date DATE NOT NULL,
    expiry_date DATE,
    FOREIGN KEY (material_id) REFERENCES material(material_id)
);

CREATE TABLE material_consumption (
    material_consumption_id SERIAL PRIMARY KEY,
    production_step_id INT NOT NULL,
    material_inventory_id INT NOT NULL,
    quantity_used DECIMAL(10, 2) NOT NULL,
    consumption_date DATE NOT NULL,
    FOREIGN KEY (production_step_id) REFERENCES production_step(production_step_id),
    FOREIGN KEY (material_inventory_id) REFERENCES material_inventory(material_inventory_id)
);

CREATE TABLE quality_inspection (
    inspection_id SERIAL PRIMARY KEY,
    stage_id INT NOT NULL,
    inspection_name VARCHAR(100) NOT NULL,
    parameters_to_check VARCHAR(255),
    frequency VARCHAR(50),
    FOREIGN KEY (stage_id) REFERENCES production_stage(stage_id)
);

CREATE TABLE inspection_result (
    result_id SERIAL PRIMARY KEY,
    production_step_id INT NOT NULL,
    inspection_id INT NOT NULL,
    inspection_date DATE NOT NULL,
    inspector_name VARCHAR(100) NOT NULL,
    pass_fail_status VARCHAR(10) NOT NULL,
    defect_count INT,
    comments TEXT,
    FOREIGN KEY (production_step_id) REFERENCES production_step(production_step_id),
    FOREIGN KEY (inspection_id) REFERENCES quality_inspection(inspection_id)
);

CREATE TABLE defect (
    defect_id SERIAL PRIMARY KEY,
    result_id INT NOT NULL,
    defect_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    corrective_action VARCHAR(255),
    FOREIGN KEY (result_id) REFERENCES inspection_result(result_id)
);

CREATE TABLE bill_of_materials (
    bom_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity_required VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (material_id) REFERENCES material(material_id)
);

-- Insert Sample Data
INSERT INTO product (product_id, product_name, description) VALUES
(1, 'Widget A', 'Industrial component'),
(2, 'Gadget B', 'Consumer electronics');

INSERT INTO production_order (production_order_id, product_id, quantity_ordered, order_date, due_date, status, notes) VALUES
(1001, 1, 500, '2023-10-01', '2023-10-15', 'in progress', NULL),
(1002, 2, 300, '2023-10-05', '2023-10-20', 'completed', NULL);

INSERT INTO production_stage (stage_id, stage_name, description) VALUES
(1, 'Rough Planning', 'Initial resource allocation'),
(2, 'Production', 'Assembly line execution'),
(3, 'Quality Check', 'Final product inspection'),
(4, 'Wrapping', 'Packaging stage');

INSERT INTO production_step (production_step_id, production_order_id, stage_id, start_date_time, end_date_time, status, notes) VALUES
(501, 1001, 2, '2023-10-10 09:00:00', NULL, 'in progress', NULL),
(502, 1002, 4, '2023-10-18 14:00:00', '2023-10-18 16:30:00', 'completed', NULL);

INSERT INTO material (material_id, material_name, description, unit_of_measure) VALUES
(101, 'Steel', 'High-grade steel', 'kg'),
(102, 'Plastic', 'ABS plastic', 'units');

INSERT INTO material_inventory (material_inventory_id, material_id, batch_number, quantity_available, received_date, expiry_date) VALUES
(2001, 101, 'BATCH-2023A', 1000.00, '2023-09-01', '2025-09-01'),
(2002, 102, 'BATCH-2023B', 5000.00, '2023-09-15', '2024-09-15');

INSERT INTO material_consumption (material_consumption_id, production_step_id, material_inventory_id, quantity_used, consumption_date) VALUES
(3001, 501, 2001, 50.00, '2023-10-10'),
(3002, 501, 2002, 200.00, '2023-10-10');

INSERT INTO quality_inspection (inspection_id, stage_id, inspection_name, parameters_to_check, frequency) VALUES
(401, 2, 'Pre-Production Check', 'Material dimensions', 'Per Batch'),
(402, 3, 'Final Product Test', 'Weight, Surface Finish', 'Per Unit');

INSERT INTO inspection_result (result_id, production_step_id, inspection_id, inspection_date, inspector_name, pass_fail_status, defect_count, comments) VALUES
(701, 501, 401, '2023-10-10', 'John Doe', 'Pass', 0, 'All parameters met'),
(702, 502, 402, '2023-10-18', 'Jane Smith', 'Fail', 2, 'Surface defects found');

INSERT INTO defect (defect_id, result_id, defect_type, severity, corrective_action) VALUES
(901, 702, 'Surface Crack', 'High', 'Rework'),
(902, 702, 'Misalignment', 'Medium', 'Adjust machinery');

INSERT INTO bill_of_materials (bom_id, product_id, material_id, quantity_required) VALUES
(601, 1, 101, '2.5 kg'),
(602, 1, 102, '10 units');

CREATE INDEX idx_product_name ON product (product_name);
CREATE INDEX idx_production_order_product_id ON production_order (product_id);
CREATE INDEX idx_production_order_status ON production_order (status);

CREATE INDEX idx_production_step_order_stage ON production_step (production_order_id, stage_id);
CREATE INDEX idx_production_step_status ON production_step (status);

CREATE INDEX idx_material_inventory_material_id ON material_inventory (material_id);
CREATE INDEX idx_material_inventory_batch_number ON material_inventory (batch_number);

CREATE INDEX idx_material_consumption_step_inventory ON material_consumption (production_step_id, material_inventory_id);

CREATE INDEX idx_quality_inspection_stage_id ON quality_inspection (stage_id);

CREATE INDEX idx_inspection_result_step_inspection ON inspection_result (production_step_id, inspection_id);
CREATE INDEX idx_inspection_result_date ON inspection_result (inspection_date);

CREATE INDEX idx_defect_result_id ON defect (result_id);

CREATE INDEX idx_bom_product_material ON bill_of_materials (product_id, material_id);

-- Define the trigger function
CREATE OR REPLACE FUNCTION notify_production_order_update() RETURNS trigger AS $$
BEGIN
  -- Convert the updated row to JSON and send a notification
  PERFORM pg_notify('production_order_update', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger function to the production_order table
CREATE TRIGGER production_order_update_trigger
AFTER UPDATE ON production_order
FOR EACH ROW
EXECUTE FUNCTION notify_production_order_update();
