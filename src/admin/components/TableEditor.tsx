/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, X } from 'lucide-react';
import { SampleTable } from '../../types';
import ToggleField from './ToggleField';

interface TableEditorProps {
  label: string;
  value: SampleTable | null;
  onChange: (value: SampleTable | null) => void;
}

const EMPTY_TABLE: SampleTable = { columns: ['Column 1'], rows: [{ cells: [''] }] };

export default function TableEditor({ label, value, onChange }: TableEditorProps) {
  const hasTable = value !== null;

  const setHasTable = (checked: boolean) => {
    onChange(checked ? EMPTY_TABLE : null);
  };

  const updateColumn = (colIndex: number, name: string) => {
    if (!value) return;
    const columns = [...value.columns];
    columns[colIndex] = name;
    onChange({ ...value, columns });
  };

  const addColumn = () => {
    if (!value) return;
    const columns = [...value.columns, `Column ${value.columns.length + 1}`];
    const rows = value.rows.map((row) => ({ cells: [...row.cells, ''] }));
    onChange({ columns, rows });
  };

  const removeColumn = (colIndex: number) => {
    if (!value) return;
    const columns = value.columns.filter((_, i) => i !== colIndex);
    const rows = value.rows.map((row) => ({ cells: row.cells.filter((_, i) => i !== colIndex) }));
    onChange({ columns, rows });
  };

  const updateCell = (rowIndex: number, colIndex: number, cellValue: string) => {
    if (!value) return;
    const rows = value.rows.map((row, r) => {
      if (r !== rowIndex) return row;
      const cells = [...row.cells];
      cells[colIndex] = cellValue;
      return { cells };
    });
    onChange({ ...value, rows });
  };

  const addRow = () => {
    if (!value) return;
    onChange({ ...value, rows: [...value.rows, { cells: value.columns.map(() => '') }] });
  };

  const removeRow = (rowIndex: number) => {
    if (!value) return;
    onChange({ ...value, rows: value.rows.filter((_, i) => i !== rowIndex) });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="font-mono text-xs text-on-surface-variant uppercase font-bold">{label}</label>
      <ToggleField label="Has sample table" checked={hasTable} onChange={setHasTable} />

      {hasTable && value && (
        <div className="border-[0.5px] border-outline-variant bg-surface-container-low p-4 rounded-[2px] overflow-x-auto">
          <div className="flex items-center gap-2 mb-2" style={{ minWidth: 'max-content' }}>
            {value.columns.map((col, colIndex) => (
              <div key={colIndex} className="flex items-center gap-1 w-36 flex-shrink-0">
                <input
                  value={col}
                  onChange={(e) => updateColumn(colIndex, e.target.value)}
                  className="w-full bg-transparent border-b-[0.5px] border-outline focus:outline-none focus:border-primary py-1.5 text-xs font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => removeColumn(colIndex)}
                  className="p-1 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Remove column"
                >
                  <X className="w-3 h-3 stroke-[1.5]" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColumn}
              className="p-1.5 border-[0.5px] border-outline rounded-[2px] hover:border-primary transition-colors cursor-pointer flex-shrink-0"
              aria-label="Add column"
            >
              <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          {value.rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2 mb-2" style={{ minWidth: 'max-content' }}>
              {row.cells.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  value={cell}
                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                  className="w-36 flex-shrink-0 bg-transparent border-b-[0.5px] border-outline-variant focus:outline-none focus:border-primary py-1.5 text-xs font-mono"
                />
              ))}
              <button
                type="button"
                onClick={() => removeRow(rowIndex)}
                className="p-1 border-[0.5px] border-outline rounded-[2px] hover:border-error hover:text-error transition-colors cursor-pointer flex-shrink-0"
                aria-label="Remove row"
              >
                <X className="w-3 h-3 stroke-[1.5]" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 mt-2 font-mono text-[11px] uppercase tracking-wider text-primary hover:text-secondary transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
            Add Row
          </button>
        </div>
      )}
    </div>
  );
}
