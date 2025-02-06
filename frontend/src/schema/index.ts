import gql from 'graphql-tag';
export const DASHBOARD = gql`
  query {
    inventoryTurnoverRatio {
      inventory_turnover_ratio
    }
    productionThroughput {
      production_month
      total_units_produced
    }
    productFPY {
      first_pass_yield_percentage
    }
    productDefectRates {
      product_id
      product_name
      defect_rate_percentage
    }
  }
`;

export const GET_PRODUCT = gql`
  query {
    products {
      product_id
      product_name
      description
    }
  }
`;

export const GET_PRODUCTION_RECORDS = gql`
  query {
    productionOrderRecords {
      production_order_id
      product_name
      quantity_ordered
      order_date
      due_date
      status
      start_date_time
      end_date_time
      step_status
      stage_name
      stage_description
      material_name
      quantity_used
      consumption_date
      result_id
      inspection_date
      inspector_name
      pass_fail_status
      defect_count
      comments
    }
  }
`;

export const CREATE_PRODUCTION_RECORD = gql`
  mutation CREATE_PRODUCTION_RECORD($input: CreateProductionRecordInput!) {
    createProductionRecord(input: $input) {
      product_id
      quantity_ordered
      due_date
      status
      notes
    }
  }
`;

export const UPDATE_PRODUCTION_RECORD = gql`
  mutation UPDATE_PRODUCTION_RECORD($input: UpdateProductionRecordInput!) {
    updateProductionRecord(input: $input) {
      production_order_id
      quantity_ordered
      due_date
      status
    }
  }
`;

export const DELETE_PRODUCTION_RECORD = gql`
  mutation DeleteProductionRecord($production_order_id: ID!) {
    deleteProductionRecord(production_order_id: $production_order_id)
  }
`;
