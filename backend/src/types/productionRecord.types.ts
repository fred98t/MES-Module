export type ProductionOrderRecords = {
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
  material_name: string;
  quantity_used: number;
  consumption_date: string;
  inspection_date: string;
  inspector_name: string;
  pass_fail_status: string;
  defect_count: number;
};

export type Product = {
  product_id: number;
  product_name: string;
  description: string;
};

export type CreateProductionRecordArgs = {
  product_id: string;
  quantity_ordered: number;
  due_date: string;
  status: string;
  notes: string;
};

export type UpdateProductionRecordArgs = {
  production_order_id: number;
  quantity_ordered: number;
  due_date: string;
  status: string;
};
