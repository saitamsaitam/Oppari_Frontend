// src/components/FilterPanel.tsx

import React from "react";
import "../styles/FilterPanelStyles.css";

export type ColumnKey =
  | "name"
  | "category"
  | "quantity"
  | "price"
  | "totalValue"
  | "dateOfPurchase"
  | "expirationDate"
  | "expire";

interface FilterPanelProps {
  visibleColumns: Record<ColumnKey, boolean>;
  onToggleColumn: (column: ColumnKey) => void;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  visibleColumns,
  onToggleColumn,
  onClose,
}) => {
  return (
    <div className="filter-overlay" onClick={onClose}>
      <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Choose Columns</h3>
        {Object.keys(visibleColumns).map((column) => (
          <div key={column}>
            <label>
              <input
                type="checkbox"
                checked={visibleColumns[column as ColumnKey]}
                onChange={() => onToggleColumn(column as ColumnKey)}
              />
              {column}
            </label>
          </div>
        ))}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FilterPanel;
