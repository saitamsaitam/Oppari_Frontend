// src/utils/formatHelpers.ts

// ✅ Formats a date string or Date object to readable format
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ✅ Returns a friendly expiration text like “3 days left” or “Expired 2 days ago”
export function getExpirationText(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const now = new Date();
  const exp = new Date(date);
  if (isNaN(exp.getTime())) return "—";

  const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
  if (diffDays === 0) return "Expires today";
  return `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`;
}

// ✅ Formats category names (e.g. “DAIRY_PRODUCTS” → “Dairy Products”, “snacks&sweets” → “Snacks & Sweets”)
export function formatCategoryName(name: string): string {
  if (!name) return "";

  return name
    // Replace underscores and hyphens with spaces
    .replace(/[_-]/g, " ")
    // Add spaces around '&' so words are split properly
    .replace(/&/g, " & ")
    // Remove extra spaces
    .replace(/\s+/g, " ")
    // Lowercase everything first
    .toLowerCase()
    // Capitalize first letter of each word
    .replace(/\b\w/g, (char) => char.toUpperCase())
    // Trim trailing spaces
    .trim();
}
