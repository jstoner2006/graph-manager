"use client";

import { useState, ChangeEvent } from "react";

export interface NodeItem {
  nodeId: string;
  nodeName: string;
  projectId: string;
  nodeType: string;
}

interface NodeSelectionDropdownsProps {
  nodeNames: NodeItem[];
  onSelectionChange?: (startId: string, endId: string) => void;
}

export function NodeSelectionDropdowns({
  nodeNames,
  onSelectionChange,
}: NodeSelectionDropdownsProps) {
  const [startNodeId, setStartNodeId] = useState<string>("");
  const [endNodeId, setEndNodeId] = useState<string>("");

  const handleStartChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStartNodeId(val);
    if (onSelectionChange) onSelectionChange(val, endNodeId);
  };

  const handleEndChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setEndNodeId(val);
    if (onSelectionChange) onSelectionChange(startNodeId, val);
  };

  return (
    <div className="node-dropdown-wrapper">
      {/* Start Node Dropdown */}
      <div className="dropdown-group">
        <label htmlFor="start-node-dropdown">From: </label>
        <select
          id="start-node-dropdown"
          value={startNodeId}
          onChange={handleStartChange}
        >
          <option value="">-- Select Start Node --</option>
          {nodeNames.map((node) => (
            <option key={`start-${node.nodeId}`} value={node.nodeId}>
              {node.nodeName}
            </option>
          ))}
        </select>
      </div>

      {/* End Node Dropdown */}
      <div className="dropdown-group">
        <label htmlFor="end-node-dropdown">To: </label>
        <select
          id="end-node-dropdown"
          value={endNodeId}
          onChange={handleEndChange}
        >
          <option value="">-- Select End Node --</option>
          {nodeNames.map((node) => (
            <option key={`end-${node.nodeId}`} value={node.nodeId}>
              {node.nodeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
