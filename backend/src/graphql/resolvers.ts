import db from '../config/db';
import {
  ProductionRecord,
  CreateProductionRecordArgs,
  UpdateProductionRecordArgs,
} from '../types/productionRecord.types';
import {
  QualityInspection,
  CreateQualityInspectionArgs,
} from '../types/qualityInspection.types';
import { getIO } from '../socket';

export const resolvers = {
  Query: {
    // Fetch all production records
    productionRecords: async (): Promise<ProductionRecord[]> => {
      const res = await db.query('SELECT * FROM production_records');
      return res.rows;
    },

    // Fetch all quality inspections
    qualityInspections: async (): Promise<QualityInspection[]> => {
      const res = await db.query('SELECT * FROM quality_inspections');
      return res.rows;
    },

    // Calculate production status metrics (total, in progress, completed, scheduled)
    productionStatusMetrics: async () => {
      const totalProducedRes = await db.query(
        'SELECT COUNT(*) FROM production_records'
      );
      const inProgressRes = await db.query(
        "SELECT COUNT(*) FROM production_records WHERE status = 'in_progress'"
      );
      const completedRes = await db.query(
        "SELECT COUNT(*) FROM production_records WHERE status = 'completed'"
      );
      const scheduledRes = await db.query(
        "SELECT COUNT(*) FROM production_records WHERE status = 'scheduled'"
      );

      return {
        totalProduced: parseInt(totalProducedRes.rows[0].count, 10),
        inProgress: parseInt(inProgressRes.rows[0].count, 10),
        completed: parseInt(completedRes.rows[0].count, 10),
        scheduled: parseInt(scheduledRes.rows[0].count, 10),
      };
    },

    // Calculate average machine utilization per machine
    machineUtilizationMetrics: async () => {
      const res = await db.query(`
        SELECT machine_id, AVG(utilization_rate) AS utilization_rate
        FROM machine_utilization
        GROUP BY machine_id
      `);
      return res.rows.map((row: any) => ({
        machineId: row.machine_id,
        utilizationRate: parseFloat(row.utilization_rate),
      }));
    },

    // Calculate product defect rates
    productDefectRates: async () => {
      const res = await db.query(`
        SELECT product_id, AVG(defect_rate) AS defect_rate
        FROM product_defects
        GROUP BY product_id
      `);
      return res.rows.map((row: any) => ({
        productId: row.product_id,
        defectRate: parseFloat(row.defect_rate),
      }));
    },
  },
  Mutation: {
    // Create a new production record (tracking raw materials to finished goods, scheduling, etc.)
    createProductionRecord: async ({
      rawMaterials,
      finishedGoods,
      status,
      schedule,
    }: CreateProductionRecordArgs): Promise<ProductionRecord> => {
      const res = await db.query(
        'INSERT INTO production_records (raw_materials, finished_goods, status, schedule) VALUES ($1, $2, $3, $4) RETURNING *',
        [rawMaterials, finishedGoods, status, schedule]
      );
      return res.rows[0];
    },

    // Update an existing production record (to update status or schedule)
    updateProductionRecord: async ({
      id,
      status,
      schedule,
    }: UpdateProductionRecordArgs): Promise<ProductionRecord> => {
      const res = await db.query(
        'UPDATE production_records SET status = $1, schedule = $2 WHERE id = $3 RETURNING *',
        [status, schedule, id]
      );
      const updatedRecord = res.rows[0];
      const io = getIO();
      io.emit('productionStatusUpdated', updatedRecord);
      return updatedRecord;
    },

    // Delete a production record
    deleteProductionRecord: async ({
      id,
    }: {
      id: number;
    }): Promise<boolean> => {
      const res = await db.query(
        'DELETE FROM production_records WHERE id = $1',
        [id]
      );
      return res.rowCount !== null && res.rowCount > 0;
    },

    // Create a new quality inspection record (tracking inspection date, result, and defects)
    createQualityInspection: async ({
      productionRecordId,
      inspectionDate,
      passed,
      defects,
    }: CreateQualityInspectionArgs): Promise<QualityInspection> => {
      const res = await db.query(
        'INSERT INTO quality_inspections (production_record_id, inspection_date, passed, defects) VALUES ($1, $2, $3, $4) RETURNING *',
        [productionRecordId, inspectionDate, passed, defects]
      );
      return res.rows[0];
    },
  },
};
