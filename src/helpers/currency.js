const idNumber = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export function parseCurrencyInput(value) {
  return String(value).replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

export function formatCurrencyInput(value) {
  if (value === "" || value == null) return "";
  const amount = Number(value);
  return Number.isFinite(amount) ? `Rp ${idNumber.format(amount)}` : "";
}

export function benefitsText(value) {
  return typeof value === "string" && value.trim() ? value : "-";
}

export function formatRupiah(value) {
  return formatCurrencyInput(value) || "-";
}
