import type { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  pageSize?: number;
}

import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export function Table<T extends object>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Aucune donnée',
  pageSize = 10,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as Record<string, unknown>)[sortKey];
    const bv = (b as Record<string, unknown>)[sortKey];
    if (av === bv) return 0;
    const cmp = av! < bv! ? -1 : 1;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={String(col.key)} onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                  className={col.sortable ? 'sortable' : ''}>
                  <span className="th-content">
                    {col.header}
                    {col.sortable && (
                      sortKey === String(col.key)
                        ? sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        : <ChevronsUpDown size={14} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="empty-cell">{emptyMessage}</td></tr>
            ) : (
              paged.map(row => (
                <tr key={keyExtractor(row)} className="table-row">
                  {columns.map(col => (
                    <td key={String(col.key)}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-pagination">
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            ← Précédent
          </button>
          <span className="pagination-info">Page {page + 1} / {totalPages}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}
