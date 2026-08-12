Add a component to return all graph :{{nodes:nodes[]} ,edges:edges[], nodeTypes:nodeTypes[]}  
Add server component after that creates the adjacency map grom the graph
Its location is src\features\graph-explorer\getGraphData.ts


Add the client component that takes the nodes, nodetypes and the adjacency map
This component has the drop downs
src\features\graph-explorer\ClientGraph.ts

The ClientGraph should transform the adjacency structure to the right structure for 
react flow.
ClientGraph also imports the react flow canvas stored in src\features\graph-explorer\ClientGraphViz.ts, passing it the proper structure for react flow to render it.