export type ProductionRecord = {
  id: number;
  rawMaterials: string[];
  finishedGoods: string[];
  status: string;
  schedule: string;
};

export type CreateProductionRecordArgs = {
  rawMaterials: string[];
  finishedGoods: string[];
  status: string;
  schedule: string;
};

export type UpdateProductionRecordArgs = {
  id: number;
  status: string;
  schedule: string;
};
