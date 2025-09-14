export function formatCurrency(value: number | string): string {
  return `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
