import db from '../config/db';
import {
  ProductionOrderRecords,
  CreateProductionRecordArgs,
  UpdateProductionRecordArgs,
  Product,
} from '../types/productionRecord.types';
import { QualityInspection } from '../types/qualityInspection.types';
import { getIO } from '../socket';
import { ProductionOrderStatus } from '../const/productionOrder';

export const resolvers = {
  Query: {
    // Overall Records
    productionOrderRecords: async (): Promise<ProductionOrderRecords[]> => {
      const res = await db.query(`SELECT
    po.production_order_id,
    pr.product_name,
    po.quantity_ordered,
    po.order_date,
    po.due_date,
    po.status AS status,
    ps.start_date_time,
    ps.end_date_time,
    ps.status AS step_status,
    pst.stage_name,
    pst.description AS stage_description,
    ma.material_name,
    mc.quantity_used,
    mc.consumption_date,
    ir.result_id,
    ir.inspection_date,
    ir.inspector_name,
    ir.pass_fail_status,
    ir.defect_count,
    ir.comments
FROM
    production_order po
    JOIN production_step ps ON po.production_order_id = ps.production_order_id
    JOIN production_stage pst ON ps.stage_id = pst.stage_id
	LEFT JOIN product pr ON po.product_id = pr.product_id
    LEFT JOIN material_consumption mc ON ps.production_step_id = mc.production_step_id
	LEFT JOIN material_inventory mi ON mi.material_inventory_id = mc.material_inventory_id
	LEFT JOIN material ma ON mi.material_id = ma.material_id
    LEFT JOIN inspection_result ir ON ps.production_step_id = ir.production_step_id
  WHERE
    po.status != 'DELETED'
ORDER BY
    po.production_order_id,
    ps.production_step_id
`);
      return res.rows;
    },

    // Fetch product defect rates
    productDefectRates: async (): Promise<QualityInspection[]> => {
      const res = await db.query(`SELECT
    po.product_id,
    p.product_name,
    (COUNT(ir.result_id) FILTER (WHERE ir.pass_fail_status = 'Fail')::NUMERIC / COUNT(ir.result_id)) * 100 AS defect_rate_percentage
FROM
    production_order po
    JOIN production_step ps ON po.production_order_id = ps.production_order_id
    JOIN inspection_result ir ON ps.production_step_id = ir.production_step_id
    JOIN product p ON po.product_id = p.product_id
GROUP BY
    po.product_id,
    p.product_name
`);
      return res.rows;
    },

    // Fetch all product
    products: async (): Promise<Product[]> => {
      const res = await db.query(`SELECT
       * FROM product
    `);
      return res.rows;
    },

    // Calculate inventory turnover ratio
    inventoryTurnoverRatio: async () => {
      const res = await db.query(
        `SELECT
    (SUM(quantity_used) / AVG(quantity_available)) AS inventory_turnover_ratio
FROM
    material_consumption mc
    JOIN material_inventory mi ON mc.material_inventory_id = mi.material_inventory_id;
`
      );

      return res.rows;
    },

    // product output include defect
    productionThroughput: async () => {
      const res = await db.query(`
      SELECT
    DATE_TRUNC('month', order_date) AS production_month,
    SUM(quantity_ordered) AS total_units_produced
FROM
    production_order
GROUP BY
    production_month
ORDER BY
    production_month;
      `);
      return res.rows;
    },

    // product First Pass Yield
    productFPY: async () => {
      const res = await db.query(`
        SELECT
    (COUNT(*) FILTER (WHERE pass_fail_status = 'Pass')::NUMERIC / COUNT(*)) * 100 AS first_pass_yield_percentage
FROM
    inspection_result;
      `);
      return res.rows;
    },
  },
  Mutation: {
    // Create a new production record (tracking raw materials to finished goods, scheduling, etc.)
    createProductionRecord: async (
      parent: any,
      args: { input: CreateProductionRecordArgs }
    ) => {
      const { product_id, quantity_ordered, due_date, status, notes } =
        args.input;
      try {
        // Begin transaction
        await db.query('BEGIN');

        // Insert into production_order and return the inserted record
        const res = await db.query(
          'INSERT INTO production_order (product_id, quantity_ordered, order_date, due_date, status, notes) VALUES ($1, $2, NOW(), $3, $4, $5) RETURNING *',
          [product_id, quantity_ordered, due_date, status, notes]
        );

        const newRecord = res.rows[0];

        // Only if newRecord exists, insert into production_step
        if (newRecord && newRecord.production_order_id) {
          await db.query(
            'INSERT INTO production_step (production_order_id, stage_id, start_date_time, status) VALUES ($1, 2, NOW(), $2)',
            [newRecord.production_order_id, status]
          );
        }

        // Commit the transaction
        await db.query('COMMIT');

        return newRecord;
      } catch (err) {
        await db.query('ROLLBACK');
        throw err;
      }
    },

    // Update an existing production record
    updateProductionRecord: async (
      parent: any,
      args: { input: UpdateProductionRecordArgs }
    ) => {
      const { production_order_id, quantity_ordered, due_date, status } =
        args.input;
      try {
        // Begin transaction
        await db.query('BEGIN');

        // Update production order
        const res = await db.query(
          'UPDATE production_order SET quantity_ordered = $1, due_date = $2, status = $3 WHERE production_order_id = $4 RETURNING *',
          [quantity_ordered, due_date, status, production_order_id]
        );

        // If the update is successful and status is COMPLETED, update production_step
        if (status === ProductionOrderStatus[1]) {
          await db.query(
            'UPDATE production_step SET stage_id = 3, end_date_time = NOW(), status = $2 WHERE production_order_id = $1',
            [production_order_id, status]
          );
        }

        // Commit the transaction
        await db.query('COMMIT');

        const updatedRecord = res.rows[0];

        // Emit socket event
        const io = getIO();
        io.emit('productionStatusUpdated', updatedRecord);

        return updatedRecord;
      } catch (err) {
        // Rollback transaction on error
        await db.query('ROLLBACK');
        throw err;
      }
    },

    // Delete a production record
    deleteProductionRecord: async (
      parent: any,
      args: { production_order_id: number }
    ) => {
      const { production_order_id } = args;

      try {
        await db.query('BEGIN');

        // Mark production order as deleted
        const orderRes = await db.query(
          'UPDATE production_order SET status = $1 WHERE production_order_id = $2 RETURNING *',
          [ProductionOrderStatus[999], production_order_id]
        );

        // Mark production step as deleted
        const stepRes = await db.query(
          'UPDATE production_step SET status = $1 WHERE production_order_id = $2 RETURNING *',
          [ProductionOrderStatus[999], production_order_id]
        );

        await db.query('COMMIT'); // Commit transaction

        return stepRes?.rowCount ?? 0 > 0;
      } catch (err) {
        await db.query('ROLLBACK'); // Rollback if an error occurs
        throw err; // Throw error to be handled by higher layers
      }
    },
  },
};
