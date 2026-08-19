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

interface pageFilterProps {
  selectedColumn: string;
  sortColumns: string[];
  selectedOrder: string;
  sortOrders: string[];
  setSortColumn: (sortColumn: string) => void;
  setSortOrder: (sortOrder: string) => void;
}
//**
// houses filters that will set the selected column */
export default function PageFilter({
  selectedColumn,
  sortColumns,
  selectedOrder,
  sortOrders,
  setSortColumn,
  setSortOrder,
}: pageFilterProps) {
  const applyColumnFilter = (e: string) => {
    console.log("executing set sort column");
    setSortColumn(e);
  };

  const applyOrderFilter = (e: string) => {
    console.log("executing set sort column");
    setSortOrder(e);
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
            {selectedColumn}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"></ChevronsUpDown>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
          <Command className="bg-zinc-900 text-white">
            <CommandInput placeholder="search Connected Components" />
            <CommandList>
              <CommandEmpty>No connnected components found</CommandEmpty>
              <CommandGroup>
                {sortColumns.map((c) => {
                  return (
                    <CommandItem key={c} onSelect={applyColumnFilter}>
                      {c}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w=[220px] justify-between"
          >
            {selectedOrder}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"></ChevronsUpDown>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0 bg-zinc-900 border border-zinc-700 text-white">
          <Command className="bg-zinc-900 text-white">
            <CommandInput placeholder="search Connected Components" />
            <CommandList>
              <CommandEmpty>No connnected components found</CommandEmpty>
              <CommandGroup>
                {sortOrders.map((c) => {
                  return (
                    <CommandItem key={c} onSelect={applyOrderFilter}>
                      {c}
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
  //import NodeType Popover similarly
}
