"use client";

import React, { useMemo, useState } from "react";
import { Column, Table as TableInterface } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";
import { EscrowStatus, EscrowTx } from "@/types/escrow";
import { sepoliaAaveReserveTokens } from "@/lib/aave-contracts";

interface TableDropMenusProps {
  table: TableInterface<EscrowTx>;
}

const FiltersController: React.FC<
  TableDropMenusProps & {
    globalFilter: string;
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  }
> = ({ table, globalFilter, setGlobalFilter }) => {
  return (
    <div className="flex gap-2 justify-between">
      {/* Search bar */}
      <Input
        placeholder="Search by status or address"
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(String(e.target.value))}
        className="md:min-w-64 md:max-w-80"
      />
      <div className="hidden md:flex md:space-x-1">
        <FilterByToken table={table} />
        <FilterByStatus table={table} />
        <Button
          variant="secondary"
          className="hidden md:block md:w-fit"
          onClick={() => {
            table.resetColumnFilters();
            setGlobalFilter("");
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

const FilterByToken: React.FC<TableDropMenusProps> = ({ table }) => {
  const [isOpen, setIsOpen] = useState(false);
  const column = table.getColumn("tokenAddr") as Column<EscrowTx, unknown>;
  const columnFilter = column.getFilterValue() as string | undefined;

  const selectedFilterText = useMemo(() => {
    return sepoliaAaveReserveTokens.find(
      (token) => token.address === columnFilter
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilter]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex rounded-lg border">
        <DropdownMenuTrigger asChild>
          {selectedFilterText ? (
            <div className="flex items-center justify-between">
              <Button type="button" variant={null}>
                {selectedFilterText.name}
              </Button>
            </div>
          ) : (
            <Button type="button" variant={null}>
              Token
            </Button>
          )}
        </DropdownMenuTrigger>
        {selectedFilterText ? (
          <Button
            type="button"
            size="icon"
            variant={null}
            onMouseDown={(e) => {
              e.preventDefault();
              table.getColumn("tokenAddr")?.setFilterValue("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant={null}
            size="icon"
            onMouseDown={() => setIsOpen(!isOpen)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      <DropdownMenuContent align="start">
        {sepoliaAaveReserveTokens.map((token, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => column.setFilterValue(token.address)}
          >
            {token.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FilterByStatus: React.FC<TableDropMenusProps> = ({ table }) => {
  const [isOpen, setIsOpen] = useState(false);
  const column = table.getColumn("status") as Column<EscrowTx, unknown>;
  const columnFilter = column.getFilterValue() as string | undefined;

  const selectedFilterText = useMemo(() => {
    return EscrowStatus.find((status) => status === columnFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilter]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex rounded-lg border">
        <DropdownMenuTrigger asChild>
          {selectedFilterText ? (
            <div className="flex items-center justify-between">
              <Button type="button" variant={null}>
                {selectedFilterText}
              </Button>
            </div>
          ) : (
            <Button type="button" variant={null}>
              Status
            </Button>
          )}
        </DropdownMenuTrigger>
        {selectedFilterText ? (
          <Button
            type="button"
            size="icon"
            variant={null}
            onMouseDown={(e) => {
              e.preventDefault();
              table.getColumn("status")?.setFilterValue("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant={null}
            size="icon"
            onMouseDown={() => setIsOpen(!isOpen)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      <DropdownMenuContent align="start">
        {EscrowStatus.map((status, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => column.setFilterValue(EscrowStatus[index])}
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FiltersController;
