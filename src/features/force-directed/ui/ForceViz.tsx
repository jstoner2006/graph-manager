import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Edge,
  Node,
} from "@xyflow/react";

import { useRef, useEffect } from "react";

import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
} from "d3-force";

interface forceVizProps {
  edges: Edge[];
  nodes: Node[];
}
export default function ForceViz({
  edges: initialEdges,
  nodes: initalNodes,
}: forceVizProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initalNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  //this will be used to capture static simulations for restartign
  //on node drag and other events
  const simRef = useRef<any>(null);

  useEffect(() => {
    //create the d3 nodes initially with random positions
    console.log("use effect started");
    const d3nodes = nodes.map((node) => ({
      ...node,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    //create the d3 edges
    const d3Edges = edges.map((edge) => ({ ...edge }));

    //create the force simulation

    //initialize the simulation
    const simulation = forceSimulation(d3nodes)
      .force("charge", forceManyBody().strength(-200))
      .force(
        "link",
        forceLink(d3Edges)
          .id((d: any) => d.id)
          .distance((d) => {
            return Number(d.data.weight);
          }),
        //.strength((d) => {
        //  return d.data.weight * 0.1;
        //}),
      );
    //stop the simulation
    simulation.stop();
    //run for fixed time
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }
    //update the nodes state
    setNodes((nodes) =>
      nodes.map((node) => {
        const matchingD3Node = d3nodes.find((d3n) => d3n.id === node.id);
        if (!matchingD3Node) return node;
        return {
          ...node,
          position: {
            x: Number.isFinite(matchingD3Node.x) ? matchingD3Node.x : 0,
            y: Number.isFinite(matchingD3Node.y) ? matchingD3Node.y : 0,
          },
        };
      }),
    );

    //reset the simulation ref to the rendered simulation
    simRef.current = simulation;
    //stop the simulation again even though it should be stopped

    return () => simulation.stop();
  }, [initalNodes, initialEdges]);

  //add drag handlers

  const onNodeDragStart = (event: any, node: any) => {
    const simulation = simRef.current;
    if (!simulation) return;
    simulation.alpha(1);
    console.log("started");
  };

  const onNodeDrag = (event: any, node: any) => {
    const simulation = simRef.current;
    if (!simulation) return;
    const d3node = simulation.nodes().find((n: any) => n.id === node.id);
    if (d3node) {
      d3node.fx = node.position.x;
      d3node.fy = node.position.y;
    }
    simulation.tick();
    console.log("going");
    setNodes(
      nodes.map((node) => {
        //find the matched node in the simulation
        const matchedD3node = simulation
          .nodes()
          .find((n: any) => n.id === node.id);

        if (!matchedD3node) return node;
        if (matchedD3node) {
          console.log("found node", matchedD3node.x);
        }
        return {
          ...node,
          position: { x: matchedD3node.x, y: matchedD3node.y }, //reset reacts node back to d3 positions
        };
      }),
    );
  };

  const onNodeDragStop = (event: any, node: any) => {
    const simulation = simRef.current;
    if (!simulation) return;
    const d3node = simulation.nodes().find((n: any) => n.id === node.id);
    d3node.fx = null;
    d3node.fy = null;
    for (let i = 0; i < 8; i++) {
      simulation.tick();
    }

    setNodes(
      nodes.map((node) => {
        const d3Matched = simulation.nodes().find((n: any) => n.id === node.id);

        if (!d3Matched) return node;
        return { ...node, position: { x: d3Matched.x, y: d3Matched.y } };
      }),
    );
    simulation.stop();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#1a1a1a",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="dark"
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <ol>
        <li key="1">1</li>;
      </ol>
    </div>
  );
}
