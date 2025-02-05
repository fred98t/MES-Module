import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # Production Tracking Module
  type ProductionRecord {
    id: ID!
    rawMaterials: [String]
    finishedGoods: [String]
    status: String
    schedule: String
  }

  # Quality Control Module
  type QualityInspection {
    id: ID!
    productionRecordId: ID!
    inspectionDate: String
    passed: Boolean
    defects: [String]
  }

  # Metrics Types
  type ProductionStatusMetrics {
    totalProduced: Int
    inProgress: Int
    completed: Int
    scheduled: Int
  }

  type MachineUtilizationMetrics {
    machineId: ID!
    utilizationRate: Float
  }

  type ProductDefectRates {
    productId: ID!
    defectRate: Float
  }

  type Query {
    # Basic Data Queries
    productionRecords: [ProductionRecord]
    qualityInspections: [QualityInspection]

    # Metrics Queries
    productionStatusMetrics: ProductionStatusMetrics
    machineUtilizationMetrics: [MachineUtilizationMetrics]
    productDefectRates: [ProductDefectRates]
  }

  type Mutation {
    # Production Tracking Mutations
    createProductionRecord(
      rawMaterials: [String]
      finishedGoods: [String]
      status: String
      schedule: String
    ): ProductionRecord

    updateProductionRecord(
      id: ID!
      status: String
      schedule: String
    ): ProductionRecord

    deleteProductionRecord(id: ID!): Boolean

    # Quality Control Mutation
    createQualityInspection(
      productionRecordId: ID!
      inspectionDate: String
      passed: Boolean
      defects: [String]
    ): QualityInspection
  }
`;
