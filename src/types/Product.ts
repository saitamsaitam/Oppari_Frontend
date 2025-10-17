// src/types/Product.ts

// (?) tell TypeScript they may be undefined.
export interface Product {
  id: number;
  name: string;
  category: string | { name: string }; // support both string and object
  quantity: number;
  leftOver: number;
  price?: number; // price per unit
  dateOfPurchase: string; // or Date if parsed
  expirationDate?: string | null; // or Date if parsed
}
