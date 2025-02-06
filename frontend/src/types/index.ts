export type ProductionOrderRecordsModal = {
  production_order_id: number;
  product_name: string;
  quantity_ordered: number;
  order_date: string;
  due_date: string;
  status: string;
  start_date_time: string;
  end_date_time: string;
  step_status: string;
  stage_name: string;
  stage_description: string;
  material_name: string;
  quantity_used: number;
  consumption_date: string;
  result_id: number;
  inspection_date: string;
  inspector_name: string;
  pass_fail_status: string;
  defect_count: number;
  comments: string;
};

export type ProductList = {
  product_id: number;
  product_name: string;
  description: string;
};

export type CreateProductionRecordInput = {
  product_name: string;
  quantity_ordered: number;
  due_date: string;
  notes: string;
};

export type UpdateProductionRecordInput = {
  production_order_id: number;
  quantity_ordered: number;
  due_date: string;
  status: string;
};
