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
import { ProjectEdgeType } from "@prisma/client";

interface EdgeTypeSelectorProps {
  projectEdgeTypes: ProjectEdgeType[];
  selectedEdgeTypes: string[];
  onToggle: (type: string) => void;
  onClear: () => void;
}

export default function EdgeTypeSelector({
  projectEdgeTypes,
  selectedEdgeTypes,
  onToggle,
  onClear,
}: EdgeTypeSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[220px] justify-between"
        >
          {selectedEdgeTypes.length === 0
            ? "All Edge Types"
            : selectedEdgeTypes.length === 1
              ? selectedEdgeTypes[0]
              : `${selectedEdgeTypes.length} Selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
        <Command className="bg-zinc-900 text-white">
          <CommandInput placeholder="Search edge types..." />
          <CommandList>
            <CommandEmpty>No edge type found.</CommandEmpty>
            <CommandGroup>
              <CommandItem value="all-types" onSelect={onClear}>
                <Check
                  className={`mr-2 h-4 w-4 ${selectedEdgeTypes.length === 0 ? "opacity-100" : "opacity-0"}`}
                />
                Clear Selection
              </CommandItem>
              {projectEdgeTypes.map((type) => {
                const isSelected = selectedEdgeTypes.includes(type.edgeType);
                return (
                  <CommandItem
                    key={type.edgeType}
                    value={type.edgeType.toLowerCase()}
                    onSelect={() => onToggle(type.edgeType)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                    />
                    {type.edgeType}
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
