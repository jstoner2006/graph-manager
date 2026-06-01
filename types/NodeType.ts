export interface ProjectNodeType {
  projectId: string;
  nodeType: string;
  // Relations are omitted here as they are typically fetched separately,
  // but you can add them if your API returns them included.
}
