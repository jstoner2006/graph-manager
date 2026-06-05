import LineageGraph from "@/app/ui/graphPath/lineageGraph";

export default async function Page() {
  const data = [
    {
      nodeId: "customers",
      nodeName: "Customers",
      nodeType: "table",

      edgeId: "e1",
      edgeName: null,

      sourceNodeId: "customers",
      targetNodeId: "orders",

      depth: 0,
    },
    {
      nodeId: "orders",
      nodeName: "Orders",
      nodeType: "table",

      edgeId: "e2",
      edgeName: null,

      sourceNodeId: "orders",
      targetNodeId: "sales_report",

      depth: 1,
    },
    {
      nodeId: "sales_report",
      nodeName: "Sales Report",
      nodeType: "report",

      edgeId: null,
      edgeName: null,

      sourceNodeId: null,
      targetNodeId: null,

      depth: 2,
    },
  ];

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <LineageGraph data={data} />
    </main>
  );
}