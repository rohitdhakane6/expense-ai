"use client";
import { useTransactions } from "@/hooks/useTransaction";
import { columns, Transaction } from "./columns";
import { DataTable } from "./data-table";

export default function Page() {
  const { data } = useTransactions();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
