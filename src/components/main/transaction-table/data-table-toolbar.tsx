"use client";

import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { File, X } from "lucide-react";
import { category_options, type_options } from "./filters";

import DeleteDialog from "@/components/main/transaction-table/delete-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { handleExportCSV, handleExportPDF } from "@/lib/export";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={type_options}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={category_options}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {selectedRows.length > 0 && (
          <DeleteDialog
            rowIds={selectedRows.map(
              (row) => (row.original as { id: string }).id,
            )}
            onDelete={() => {
              table.resetRowSelection();
            }}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="sm"
              disabled={table.getPrePaginationRowModel().rows.length === 0}
            >
              <FileDown />
              {table.getSelectedRowModel().rows.length > 0
                ? `Export ${table.getSelectedRowModel().rows.length}`
                : "Export All"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().rows;
                const rowsToExport =
                  selectedRows.length > 0
                    ? selectedRows
                    : table.getPrePaginationRowModel().rows;
                handleExportCSV(rowsToExport, table);
              }}
            >
              <FileSpreadsheet />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().rows;
                const rowsToExport =
                  selectedRows.length > 0
                    ? selectedRows
                    : table.getPrePaginationRowModel().rows;
                handleExportPDF(rowsToExport, table);
              }}
            >
              <File />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
