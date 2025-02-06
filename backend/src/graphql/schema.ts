import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # Enum for Production Order Status
  enum ProductionOrderStatus {
    IN_PROGRESS
    COMPLETED
    CANCELLED
    DELETED
    # Add other statuses as needed
  }

  # Type for Production Order Records
  type ProductionOrderRecord {
    production_order_id: ID!
    product_id: ID
    product_name: String
    quantity_ordered: Int
    order_date: String
    due_date: String
    status: ProductionOrderStatus
    start_date_time: String
    end_date_time: String
    step_status: String
    stage_name: String
    stage_description: String
    material_name: String
    quantity_used: Int
    consumption_date: String
    result_id: ID
    inspection_date: String
    inspector_name: String
    pass_fail_status: String
    defect_count: Int
    comments: String
    notes: String
  }

  # Type for Product
  type Product {
    product_id: ID!
    product_name: String
    description: String
  }

  # Type for Quality Inspection
  type QualityInspection {
    product_id: ID!
    product_name: String
    defect_rate_percentage: Float
  }

  # Type for Inventory Turnover Ratio
  type InventoryTurnoverRatio {
    inventory_turnover_ratio: Float
  }

  # Type for Production Throughput
  type ProductionThroughput {
    production_month: String
    total_units_produced: Int
  }

  # Type for Product First Pass Yield
  type ProductFPY {
    first_pass_yield_percentage: Float
  }

  # Input type for creating a production record
  input CreateProductionRecordInput {
    product_id: ID!
    quantity_ordered: Int!
    due_date: String!
    status: ProductionOrderStatus
    notes: String
  }

  # Input type for updating a production record
  input UpdateProductionRecordInput {
    production_order_id: ID!
    quantity_ordered: Int
    due_date: String
    status: ProductionOrderStatus
  }

  type Query {
    productionOrderRecords: [ProductionOrderRecord]
    productDefectRates: [QualityInspection]
    inventoryTurnoverRatio: [InventoryTurnoverRatio]
    productionThroughput: [ProductionThroughput]
    productFPY: [ProductFPY]
    products: [Product]
  }

  type Mutation {
    createProductionRecord(
      input: CreateProductionRecordInput
    ): ProductionOrderRecord
    updateProductionRecord(
      input: UpdateProductionRecordInput
    ): ProductionOrderRecord
    deleteProductionRecord(production_order_id: ID!): Boolean
  }
`;
