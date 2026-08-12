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

interface EdgeLevelSelectorProps {
  projectEdgeLevels: string[];
  selectedEdgeLevels: string[];
  onSelectEdgeLevels: (edgeLevels: string[]) => void;
}

export function EdgeLevelSelector({
  projectEdgeLevels,
  selectedEdgeLevels,
  onSelectEdgeLevels,
}: EdgeLevelSelectorProps) {
  const chooseAll = () => {
    console.log("choose all executed");
    onSelectEdgeLevels(projectEdgeLevels);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[200px] justify-between"
        >
          {selectedEdgeLevels.length === 0
            ? "All Edge Levels"
            : `${selectedEdgeLevels.length} Selected `}
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
              <CommandItem value="all-levels" onSelect={chooseAll}>
                <Check
                  className={`mr-2 h-4 w-4 ${selectedEdgeLevels.length === projectEdgeLevels.length ? "opacity-100" : "opacity-0"}`}
                />
                All Edge Levels
              </CommandItem>

              {projectEdgeLevels.map((level) => {
                const isSelected = selectedEdgeLevels.includes(level);

                return (
                  <CommandItem
                    key={level}
                    value={level.toLowerCase()}
                    onSelect={() => onSelectEdgeLevels([level])}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                    />
                    {level}
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
