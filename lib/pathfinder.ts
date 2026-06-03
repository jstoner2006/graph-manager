// utils/pathfinder.ts

export interface PrismaEdge {
  fromNodeId: string;
  toNodeId: string;
  // including other properties from your Prisma model if needed
  [key: string]: any;
}

export function findShortestPath(
  edges: PrismaEdge[],
  startNodeId: string,
  endNodeId: string,
): string[] | null {
  if (startNodeId === endNodeId) return [startNodeId];

  // 1. Build an undirected adjacency list from the Prisma edges
  const adjacencyList = new Map<string, string[]>();

  for (const edge of edges) {
    if (!adjacencyList.has(edge.fromNodeId))
      adjacencyList.set(edge.fromNodeId, []);
    if (!adjacencyList.has(edge.toNodeId)) adjacencyList.set(edge.toNodeId, []);

    // Assuming undirected graph based on the Train Route map style
    adjacencyList.get(edge.fromNodeId)!.push(edge.toNodeId);
    adjacencyList.get(edge.toNodeId)!.push(edge.fromNodeId);
  }

  // 2. BFS Setup
  const queue: string[] = [startNodeId];
  const visited = new Set<string>([startNodeId]);

  // Track parent nodes to reconstruct the path later: Key = Child, Value = Parent
  const parents = new Map<string, string>();

  // 3. Traverse the Graph
  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    if (currentNode === endNodeId) {
      // Destination found! Reconstruct the path backwards
      const path: string[] = [];
      let current: string | undefined = endNodeId;

      while (current) {
        path.push(current);
        current = parents.get(current);
      }
      return path.reverse(); // Flip it so it goes Start -> End
    }

    const neighbors = adjacencyList.get(currentNode) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parents.set(neighbor, currentNode);
        queue.push(neighbor);
      }
    }
  }

  return null; // Return null if there is no path linking the nodes
}
