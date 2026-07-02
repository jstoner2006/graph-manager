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
import { ProjectNodeType } from "@prisma/client";

interface NodeTypeSelectorProps {
  projectNodeTypes: ProjectNodeType[];
  selectedNodeTypes: string[];
  onToggle: (type: string) => void;
  onClear: () => void;
}

export default function NodeTypeSelector({
  projectNodeTypes,
  selectedNodeTypes,
  onToggle,
  onClear,
}: NodeTypeSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[220px] justify-between"
        >
          {selectedNodeTypes.length === 0
            ? "All Node Types"
            : selectedNodeTypes.length === 1
              ? selectedNodeTypes[0]
              : `${selectedNodeTypes.length} Selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
        <Command className="bg-zinc-900 text-white">
          <CommandInput placeholder="Search Node types..." />
          <CommandList>
            <CommandEmpty>No Node type found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value="all-types" onSelect={onClear}>
                <Check
                  className={`mr-2 h-4 w-4 ${selectedNodeTypes.length === 0 ? "opacity-100" : "opacity-0"}`}
                />
                Clear Selection
              </CommandItem>
              {projectNodeTypes.map((type) => {
                const isSelected = selectedNodeTypes.includes(type.nodeType);
                return (
                  <CommandItem
                    key={type.nodeType}
                    value={type.nodeType.toLowerCase()}
                    onSelect={() => onToggle(type.nodeType)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                    />
                    {type.nodeType}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
