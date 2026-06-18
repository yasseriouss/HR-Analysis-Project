import { useState, useMemo } from 'react';

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  pageData: T[];
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
}

const DEFAULT_PAGE_SIZE = 20;

export function usePagination<T>(
  data: T[],
  pageSize: number = DEFAULT_PAGE_SIZE
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.length / pageSize)), [data.length, pageSize]);

  // Reset to page 1 if data shrinks below current page
  if (currentPage > totalPages && data.length > 0) {
    setCurrentPage(totalPages);
  }

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  return {
    currentPage,
    totalPages,
    pageData,
    setPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    nextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage(p => Math.max(p - 1, 1)),
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    startIndex,
    endIndex,
  };
}

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export function PaginationBar(props: PaginationBarProps) {
  if (props.totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderTop: '1px solid var(--border-color)',
      marginTop: '12px',
      flexWrap: 'wrap',
      gap: '8px',
    }}>
      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
        {props.startIndex + 1}–{props.endIndex} of {props.totalItems}
      </span>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <button
          onClick={props.prevPage}
          disabled={!props.hasPrev}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: props.hasPrev ? 'var(--bg-card)' : 'transparent',
            color: props.hasPrev ? 'var(--text-main)' : 'var(--text-dim)',
            cursor: props.hasPrev ? 'pointer' : 'default',
            fontSize: '12px',
            opacity: props.hasPrev ? 1 : 0.4,
          }}
        >
          ‹ Prev
        </button>
        {Array.from({ length: Math.min(props.totalPages, 5) }, (_, i) => {
          let pageNum: number;
          if (props.totalPages <= 5) {
            pageNum = i + 1;
          } else if (props.currentPage <= 3) {
            pageNum = i + 1;
          } else if (props.currentPage >= props.totalPages - 2) {
            pageNum = props.totalPages - 4 + i;
          } else {
            pageNum = props.currentPage - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => props.setPage(pageNum)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: props.currentPage === pageNum ? 'var(--accent-purple)' : 'var(--bg-card)',
                color: props.currentPage === pageNum ? 'white' : 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: props.currentPage === pageNum ? 700 : 400,
                minWidth: '28px',
              }}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={props.nextPage}
          disabled={!props.hasNext}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: props.hasNext ? 'var(--bg-card)' : 'transparent',
            color: props.hasNext ? 'var(--text-main)' : 'var(--text-dim)',
            cursor: props.hasNext ? 'pointer' : 'default',
            fontSize: '12px',
            opacity: props.hasNext ? 1 : 0.4,
          }}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}