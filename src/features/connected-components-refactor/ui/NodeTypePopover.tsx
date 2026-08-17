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

interface NodeTypePopoverProps {
  NodeTypes: string[];
  setNodeTypes: any;
}

export default function NodeTypePopover({
  NodeTypes,
  setNodeTypes,
}: NodeTypePopoverProps) {
  const [selectedNodeTypes, setselectedNodeTypes] = useState<string[]>([]);

  const clearNodeTypes = () => setselectedNodeTypes([]);
  //toggle selected node

  const addNodeType = (updatedNode: string) => {
    if (selectedNodeTypes.includes(updatedNode)) {
      const newNodes = selectedNodeTypes.filter((node) => {
        node != updatedNode;
      });
      setselectedNodeTypes([...newNodes]);
      setNodeTypes([...newNodes]);
    } else {
      setselectedNodeTypes([...selectedNodeTypes, updatedNode]);
      setNodeTypes([...selectedNodeTypes, updatedNode]);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w[220px] justify-between"
          >
            {selectedNodeTypes.length === 0
              ? "All Node Types"
              : selectedNodeTypes.length === 1
                ? selectedNodeTypes[0]
                : `${selectedNodeTypes.length} Selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"></ChevronsUpDown>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border border-zinc-700 text-white">
          <Command className="bg-zinc-900 text-white">
            <CommandInput placeholder="search nodeTypes" />
            <CommandList>
              <CommandEmpty>No Node Type found</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all-types" onSelect={clearNodeTypes}>
                  Select All
                  <Check
                    className={`mr-2 h-4 w-4 ${selectedNodeTypes.length === 0 ? "opacity-100" : "opacity-0"}`}
                  ></Check>
                </CommandItem>
                {NodeTypes.map((type: string) => {
                  const isSelected = selectedNodeTypes.includes(type);
                  return (
                    <CommandItem key={type} onSelect={addNodeType}>
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
