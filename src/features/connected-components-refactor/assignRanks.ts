import { Graph } from "@/types/graph";
import { ccSummary } from "@/types/ccSummary";
/** returns a ranked and ordered array of objects based on the sort column */
export function rankAndSortCCSummary(
  data: ccSummary[],
  column: string,
  order: string = "asc",
): ccSummary[] {
  if (!data || data.length === 0) return [];

  const multiplier = order === "asc" ? 1 : -1;

  // 1. Sort a shallow copy based on numeric conversion
  const sorted = [...data].sort((a, b) => {
    // Convert string numeric values (or handle number for rank)
    const valA = a[column] !== undefined ? Number(a[column]) : 0;
    const valB = b[column] !== undefined ? Number(b[column]) : 0;

    return (valA - valB) * multiplier;
  });

  // 2. Map through the sorted list to assign the updated rank (1-based index)
  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
