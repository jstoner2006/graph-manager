import { JsonValue } from "@prisma/client/runtime/client";

export type NodeData = {
  label?: string | null;
  url?: string | null;
  nodeType?: string | null;
  fullNodeName?: string | null;
  lastUpdateDts?: Date;
  attributes?: JsonValue | null;
};
