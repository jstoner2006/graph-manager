import { useState } from "react";
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

interface EdgeTypePopoverProp {
  EdgeTypes: string[];
  setEdgeTypes: any;
}

export default function EdgeTypePopover({
  EdgeTypes,
  setEdgeTypes,
}: EdgeTypePopoverProp) {
  const [selectedEdgeTypes, setSelectedEdgeTypes] = useState<string[]>([]);

  const clearEdgeTypes = () => setSelectedEdgeTypes([]);

  //toggle presence of selected edge type
  const addEdgeType = (e: string) => {
    if (selectedEdgeTypes.includes(e)) {
      const newEdges = selectedEdgeTypes.filter((edge: string) => edge !== e);

      setSelectedEdgeTypes([...newEdges]);
      setEdgeTypes([...newEdges]);
    } else {
      setSelectedEdgeTypes([...selectedEdgeTypes, e]);
      setEdgeTypes([...selectedEdgeTypes, e]);
    }
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w=[220px] justify-between"
          >
            {selectedEdgeTypes.length === 0
              ? "All Edge Types"
              : selectedEdgeTypes.length === 1
                ? selectedEdgeTypes[0]
                : `${selectedEdgeTypes.length} Selected`}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"></ChevronsUpDown>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
          <Command className="bg-zinc-900 text-white">
            <CommandInput placeholder="search edge types" />
            <CommandList>
              <CommandEmpty>No edge type found</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all-types" onSelect={clearEdgeTypes}>
                  Select All
                  <Check
                    className={`mr-2 h-4 w-4 ${selectedEdgeTypes.length === 0 ? "opacity-100" : "opacity-0"}`}
                  ></Check>
                </CommandItem>

                {EdgeTypes.map((type) => {
                  const isSelected = selectedEdgeTypes.includes(type);

                  return (
                    <CommandItem key={type} onSelect={addEdgeType}>
                      {type}
                      <Check
                        className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                      ></Check>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
