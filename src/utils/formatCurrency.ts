// src/utils/formatCurrency.ts

export function formatCurrency(
  amount: number,
  currency: string = "EUR",
  locale?: string
): string {
  // Set default locale based on currency if none provided
  const defaultLocale =
    locale || (currency === "EUR" ? "fi-FI" : currency === "USD" ? "en-US" : "en-GB");

  return new Intl.NumberFormat(defaultLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}