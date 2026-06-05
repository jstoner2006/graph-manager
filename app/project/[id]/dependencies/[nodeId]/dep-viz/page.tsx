import LineageGraph from "@/app/ui/graphPath/lineageGraph";

interface PageProps {
  params: Promise<{
    id: string;
    nodeId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id, nodeId } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/project/${id}/dependencies/${nodeId}/viz`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load graph data");
  }

  //const data = await response.json();

  const json = await response.json();

const { nodes, edges } = json.data;

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
       <LineageGraph nodes={nodes} edges={edges} />
    </main>
  );
}