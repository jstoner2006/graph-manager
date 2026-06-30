// features/graph-visualizer/components/ui/EdgeLevelSelector.tsx
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
import { ProjectEdgeLevel } from "@prisma/client";

interface EdgeLevelSelectorProps {
  projectEdgeLevels: ProjectEdgeLevel[];
  selectedEdgeLevel: string;
  onSelectEdgeLevel: (level: string) => void;
}

export function EdgeLevelSelector({
  projectEdgeLevels,
  selectedEdgeLevel,
  onSelectEdgeLevel,
}: EdgeLevelSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
          {selectedEdgeLevel
            ? projectEdgeLevels.find((el) => el.edgeLevel === selectedEdgeLevel)
                ?.edgeLevel
            : "All Edge Levels"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-zinc-900 border border-zinc-700 text-white">
        <Command className="bg-zinc-900 text-white">
          <CommandInput placeholder="Search levels..." />
          <CommandList>
            <CommandEmpty>No level found.</CommandEmpty>
            <CommandGroup>
              {/* Default Option to clear filter */}
              <CommandItem
                value="all-levels"
                onSelect={() => onSelectEdgeLevel("")}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${selectedEdgeLevel === "" ? "opacity-100" : "opacity-0"}`}
                />
                All Edge Levels
              </CommandItem>

              {/* Dynamic levels map */}
              {projectEdgeLevels.map((level) => (
                <CommandItem
                  key={level.edgeLevel}
                  value={level.edgeLevel.toLowerCase()}
                  onSelect={() => onSelectEdgeLevel(level.edgeLevel)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${selectedEdgeLevel === level.edgeLevel ? "opacity-100" : "opacity-0"}`}
                  />
                  {level.edgeLevel}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
