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

interface ConnectedComponentPopoverProp {
  ConnectedComponents: any;
  setConnectedComponent: any;
}

export default function ConnectedComponentPopover({
  ConnectedComponents,
  setConnectedComponent,
}: ConnectedComponentPopoverProp) {
  const [selectedConnectedComponent, setselectedConnectedComponent] =
    useState();

  const clearsetselectedConnectedComponent = () => {
    setselectedConnectedComponent();
  };

  const applyConnectedComponent = (e: string) => {
    setselectedConnectedComponent([e]);
    const matchedComponent = ConnectedComponents.find((c) => c.name === e);
    setConnectedComponent(matchedComponent);
    console.log(
      "popover says",
      "connected component is ",
      matchedComponent.name,
      " with edges ",
      matchedComponent.edges,
      " and nodes ",
      matchedComponent.nodes,
    );
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
            {selectedConnectedComponent}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"></ChevronsUpDown>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
          <Command className="bg-zinc-900 text-white">
            <CommandInput placeholder="search Connected Components" />
            <CommandList>
              <CommandEmpty>No connnected components found</CommandEmpty>
              <CommandGroup>
                {ConnectedComponents.map((connectedComponent) => {
                  return (
                    <CommandItem
                      key={connectedComponent.name}
                      onSelect={applyConnectedComponent}
                    >
                      {connectedComponent.name}
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
