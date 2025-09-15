import { Table, Row } from "@tanstack/react-table";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { generateCsv, download, mkConfig } from "export-to-csv";
const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: `ExpenseAI_Transactions_${new Date().toISOString().split("T")[0]}`,
});
export const handleExportCSV = <TData>(
  rows: Row<TData>[],
  table: Table<TData>,
): void => {
  // Get only visible columns
  const visibleColumns = table
    .getAllLeafColumns()
    .filter(
      (col) =>
        col.getIsVisible() && col.id !== "actions" && col.id !== "select",
    );

  const rowData: Record<string, any>[] = rows.map((row) => {
    const original = row.original as Record<string, any>;

    return Object.fromEntries(
      visibleColumns.map((col) => {
        const key = col.id;
        let value = original[key as keyof typeof original];

        if (value instanceof Date) {
          value = value.toISOString().split("T")[0]; // format date as YYYY-MM-DD
        } else if (value === null || value === undefined) {
          value = "";
        }
        return [key, value];
      }),
    );
  });

  const csv = generateCsv(csvConfig)(rowData);

  download(csvConfig)(csv);
};
export const handleExportPDF = <TData>(
  rows: Row<TData>[],
  table: Table<TData>,
) => {
  const visibleColumns = table
    .getAllLeafColumns()
    .filter(
      (col) =>
        col.getIsVisible() && col.id !== "select" && col.id !== "actions",
    );

  const headers = visibleColumns.map((col) => col.id);
  const body = rows.map((row) => {
    const original = row.original as Record<string, any>;
    return visibleColumns.map((col) => {
      const value = original[col.id as keyof typeof original];
      if (value instanceof Date) return value.toISOString().split("T")[0];
      if (value === null || value === undefined) return "";
      return value;
    });
  });

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ---- PREMIUM HEADER SECTION ----
  // Header background gradient effect (simulated with rectangles)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 45, "F");

  // Accent stripe
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 0, pageWidth, 3, "F");

  // Company Logo/Brand Area (left side)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("ExpenseAI", 14, 22);

  // Tagline
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Smart Financial Management", 14, 30);

  // Website URL (styled)
  doc.setFontSize(8);
  doc.setTextColor(59, 130, 246); // blue-500
  doc.text("expenseai.tech", 14, 38);

  // Export Info (right side)
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TRANSACTION REPORT", pageWidth - 14, 18, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${dateStr}`, pageWidth - 14, 26, { align: "right" });
  doc.text(`Time: ${timeStr}`, pageWidth - 14, 32, { align: "right" });
  doc.text(`Records: ${rows.length}`, pageWidth - 14, 38, { align: "right" });

  // ---- DECORATIVE ELEMENTS ----
  // Add some subtle geometric elements
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(14, 48, pageWidth - 14, 48);

  // ---- ENHANCED TABLE ----
  autoTable(doc, {
    head: [headers],
    body,
    startY: 55,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [51, 65, 85], // slate-700
    },
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    tableLineColor: [226, 232, 240], // slate-200
    tableLineWidth: 0.1,
    margin: { left: 14, right: 14 },
  });

  // ---- PREMIUM FOOTER ----
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer background
    const footerY = pageHeight - 20;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(0, footerY, pageWidth, 20, "F");

    // Footer border line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(0, footerY, pageWidth, footerY);

    // Left side - branding
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("ExpenseAI", 14, footerY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("• Powered by AI Technology", 40, footerY + 8);

    // Center - website
    doc.setTextColor(59, 130, 246); // blue-500
    doc.setFontSize(7);
    doc.text("www.expenseai.tech", pageWidth / 2, footerY + 8, {
      align: "center",
    });

    // Right side - page info
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFontSize(7);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, footerY + 8, {
      align: "right",
    });

    // Copyright
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      "© 2025 ExpenseAI. All rights reserved.",
      pageWidth / 2,
      footerY + 14,
      { align: "center" },
    );
  }

  // ---- SAVE WITH DYNAMIC FILENAME ----
  const filename = `ExpenseAI_Transactions_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};
