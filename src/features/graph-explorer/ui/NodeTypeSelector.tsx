// features/graph-visualizer/components/ui/NodeTypeSelector.tsx
"use client";

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

interface NodeType {
  projectId: string;
  nodeType: string;
}

interface NodeTypeSelectorProps {
  nodeTypes: NodeType[];
  selectedNodeType: string;
  onSelectNodeType: (type: string) => void;
}

export function NodeTypeSelector({
  nodeTypes,
  selectedNodeType,
  onSelectNodeType,
}: NodeTypeSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[220px] justify-between"
        >
          {selectedNodeType
            ? nodeTypes.find((t) => t.nodeType === selectedNodeType)?.nodeType
            : "All Types"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
        <Command className="bg-zinc-900 text-white">
          <CommandInput placeholder="Search types..." />
          <CommandList>
            <CommandEmpty>No node type found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all-types"
                onSelect={() => onSelectNodeType("")}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${selectedNodeType === "" ? "opacity-100" : "opacity-0"}`}
                />
                All Types
              </CommandItem>
              {nodeTypes.map((type) => (
                <CommandItem
                  key={type.nodeType}
                  value={type.nodeType}
                  onSelect={() => onSelectNodeType(String(type.nodeType))}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${selectedNodeType === type.nodeType ? "opacity-100" : "opacity-0"}`}
                  />
                  {type.nodeType}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
