import { ccSummary } from "@/types/ccSummary";

export default function filterCCSummary(
  ccSummary: ccSummary[],
  beginRank: number,
  endRank: number,
): ccSummary[] {
  const filteredCcSummary = ccSummary.filter((s) => {
    const rank = s?.rank;
    if (typeof rank !== "number" || Number.isNaN(rank)) {
      return true;
    }
    return rank >= beginRank && rank <= endRank;
  });
  return filteredCcSummary;
}
