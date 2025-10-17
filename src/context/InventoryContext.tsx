// src/pages/Inventory.tsx
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
} from "react";
import axios from "axios";
import "../styles/InventoryPageStyles.css";
import FilterPanel, { ColumnKey } from "../components/FilterPanel";
import ProductModal from "../components/ProductModal";
import ConfirmModal from "../components/ConfirmModal";

import { Product } from "../types/Product";
import { formatCurrency } from "../utils/formatCurrency";

// -------------- Types and Interfaces -------------------
type VirtualKey = "totalValue" | "expire";
type SortableKey = keyof Product | VirtualKey;

interface SortConfig {
  key: SortableKey;
  direction: "asc" | "desc";
}

interface InventoryState {
  products: Product[];
  sortConfig: SortConfig;
  visibleColumns: Record<string, boolean>;
  showFilter: boolean;
  confirmDelete: { id: number | null; show: boolean };
  selectedProduct: Product | null;
  loading: boolean;
  error: Error | null;
  selectedCurrency: string;
}

// -------------- Actions -------------------
type Action =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: Error | null }
  | { type: "TOGGLE_FILTER" }
  | { type: "TOGGLE_COLUMN"; payload: string }
  | { type: "SET_SORT"; payload: SortConfig }
  | { type: "SET_SELECTED_PRODUCT"; payload: Product | null }
  | {
      type: "SET_CONFIRM_DELETE";
      payload: { id: number | null; show: boolean };
    }
  | { type: "SET_CURRENCY"; payload: string };

// -------------- Reducer -------------------
function inventoryReducer(
  state: InventoryState,
  action: Action
): InventoryState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "TOGGLE_FILTER":
      return { ...state, showFilter: !state.showFilter };
    case "TOGGLE_COLUMN":
      return {
        ...state,
        visibleColumns: {
          ...state.visibleColumns,
          [action.payload]: !state.visibleColumns[action.payload],
        },
      };
    case "SET_SORT":
      return { ...state, sortConfig: action.payload };
    case "SET_SELECTED_PRODUCT":
      return { ...state, selectedProduct: action.payload };
    case "SET_CONFIRM_DELETE":
      return { ...state, confirmDelete: action.payload };
    case "SET_CURRENCY":
      return { ...state, selectedCurrency: action.payload };
    default:
      return state;
  }
}

// -------------- Initial State -------------------
const initialState: InventoryState = {
  products: [],
  sortConfig: { key: "expire", direction: "asc" },
  visibleColumns: {
    name: true,
    category: true,
    quantity: true,
    leftOver: true,
    price: true,
    totalValue: true,
    dateOfPurchase: true,
    expirationDate: true,
    expire: true,
  },
  showFilter: false,
  confirmDelete: { id: null, show: false },
  selectedProduct: null,
  loading: true,
  error: null,
  selectedCurrency: "EUR",
};

// -------------- Context -------------------
const InventoryContext = createContext<{
  state: InventoryState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

  // -------------- Provider -------------------
  export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(inventoryReducer, initialState);

    useEffect(() => {
      dispatch({type: "SET_LOADING", payload:true});
      axios
      .get<Product[]>(`http://localhost:8080/api/item/getAllByUserID/1`)
      .then((res) => dispatch({ type: "SET_PRODUCTS", payload: res.data}))
      .catch((err) => dispatch({ type: "SET_ERROR", payload: err}))
      .finally(() => dispatch({ type: "SET_LOADING", payload: false}));
    }, []);

    return (
      <InventoryContext.Provider value={{state, dispatch }}>
        {children}
      </InventoryContext.Provider>
    );
  };


    // -------------- Hook -------------------
  export const useInventory = () => useContext(InventoryContext);