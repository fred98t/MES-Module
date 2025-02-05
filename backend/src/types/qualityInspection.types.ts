export type QualityInspection = {
  id: number;
  productionRecordId: number;
  inspectionDate: string;
  passed: boolean;
  defects: string[];
};

export type CreateQualityInspectionArgs = {
  productionRecordId: number;
  inspectionDate: string;
  passed: boolean;
  defects: string[];
};
