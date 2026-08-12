export type EdgeCustomData = {
  weight?: number;
  edgeType?: string;
  edgeLevel?: string;
  [key: string]: unknown; // Any custom application metadata
};
