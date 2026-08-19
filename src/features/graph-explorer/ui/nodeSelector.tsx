// features/graph-visualizer/components/ui/NodeSelector.tsx
"use client";

import { useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Nodes } from "@/types/nodes";

interface NodeSelectorProps {
  nodes: Nodes;
  availableNodes: Nodes;
  selectedNodeId: string;
  onSelectNodeId: (id: string) => void;
}

export function NodeSelector({
  nodes,
  availableNodes,
  selectedNodeId,
  onSelectNodeId,
}: NodeSelectorProps) {
  const commandListRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[300px] justify-between"
        >
          {selectedNodeId ? selectedNode?.data.label : "Select Node"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search nodes..."
            onValueChange={() => {
              if (commandListRef.current) {
                commandListRef.current.scrollTop = 0;
              }
            }}
          />
          <CommandList ref={commandListRef}>
            <CommandEmpty>No node found.</CommandEmpty>
            <CommandGroup>
              {availableNodes.map((node) => (
                <CommandItem
                  key={node.id}
                  value={`${node.data?.label?.toLowerCase()}||${node.id}`}
                  onSelect={() => onSelectNodeId(node.id)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${selectedNodeId === node.id ? "opacity-100" : "opacity-0"}`}
                  />
                  {node.data?.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
