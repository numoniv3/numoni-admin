'use client'

import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { motion, type MotionProps } from 'framer-motion'
import {
  FlexRender,
  tableFeatures,
  useTable,
  type CellData,
  type ColumnDef,
  type RowData,
  type TableFeatures,
} from '@tanstack/react-table'

declare module '@tanstack/table-core' {
  /**
   * Per-column rendering hints, set via `columnDef.meta`. Merged globally
   * (rather than through a `columnMeta` feature slot) so `cellClassName` can
   * receive the row typed as the table's own data.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> {
    /** Appended to the table's `headerCellClassName` for this column's `<th>`. */
    headerClassName?: string
    /** Appended to the table's `cellClassName` for this column's `<td>`; a function gets the row. */
    cellClassName?: string | ((row: TData, index: number) => string | undefined)
    /** Replace the table's base `cellClassName` instead of appending to it. */
    ownCellClassName?: boolean
    /** Clicks inside this cell don't trigger `onRowClick` — for action buttons. */
    stopRowClick?: boolean
  }
}

export const dataTableFeatures = tableFeatures({})

/** A column for `<DataTable>`: `{ id, header, cell: ({ row }) => …, meta? }`. */
export type DataTableColumn<TData extends RowData> = ColumnDef<typeof dataTableFeatures, TData, unknown>

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  /** Stable key per row. Defaults to the row index. */
  getRowId?: (row: TData, index: number) => string

  // ── Styling — every class string is explicit so a table renders exactly as designed
  /** `<table>` classes. */
  className?: string
  /** When set, the table is wrapped in a `<div>` with these classes (e.g. `overflow-x-auto`). */
  wrapperClassName?: string
  headerRowClassName?: string
  headerCellClassName?: string
  /** Base `<td>` classes; a column's `meta.cellClassName` is appended. */
  cellClassName?: string
  rowClassName?: string | ((row: TData, index: number) => string)

  // ── Rows
  onRowClick?: (row: TData, index: number) => void
  /** Animate rows in (renders `motion.tr` with these props). */
  rowMotion?: (index: number) => MotionProps
  /** `false` renders no `<thead>` — for key/value style tables. */
  showHeader?: boolean
  /** Extra rows appended inside `<tbody>` after the data rows (totals, footers). */
  afterRows?: ReactNode
  /** Rendered as a full-width row when `data` is empty. */
  emptyState?: ReactNode
  emptyCellClassName?: string
}

const join = (...parts: (string | false | null | undefined)[]) => clsx(parts) || undefined

/**
 * The one table every list screen renders. Headless TanStack Table v9 under the
 * hood; markup and classes are the screen's own, so swapping a hand-written
 * `<table>` for this changes nothing on screen.
 *
 * Defaults match the most common table in the app; pass the class props to
 * match a screen that differs.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  className = 'w-full text-sm',
  wrapperClassName,
  headerRowClassName = 'border-b text-left',
  headerCellClassName = 'label-caps font-semibold px-4 py-3',
  cellClassName = 'px-4 py-3',
  rowClassName = 'border-b last:border-0',
  onRowClick,
  rowMotion,
  showHeader = true,
  afterRows,
  emptyState,
  emptyCellClassName,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  })

  const body = (
    <table className={className}>
      {showHeader && <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id} className={headerRowClassName || undefined}>
            {group.headers.map((header) => (
              <th key={header.id} className={join(headerCellClassName, header.column.columnDef.meta?.headerClassName)}>
                {header.isPlaceholder ? null : <FlexRender header={header} />}
              </th>
            ))}
          </tr>
        ))}
      </thead>}
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const original = row.original
          const index = row.index
          const cells = row.getAllCells().map((cell) => {
            const meta = cell.column.columnDef.meta
            const extra = typeof meta?.cellClassName === 'function' ? meta.cellClassName(original, index) : meta?.cellClassName
            return (
              <td
                key={cell.id}
                className={meta?.ownCellClassName ? join(extra) : join(cellClassName, extra)}
                onClick={meta?.stopRowClick ? (e) => e.stopPropagation() : undefined}
              >
                <FlexRender cell={cell} />
              </td>
            )
          })
          const rowProps = {
            className: join(typeof rowClassName === 'function' ? rowClassName(original, index) : rowClassName),
            onClick: onRowClick ? () => onRowClick(original, index) : undefined,
          }
          return rowMotion ? (
            <motion.tr key={row.id} {...rowMotion(index)} {...rowProps}>{cells}</motion.tr>
          ) : (
            <tr key={row.id} {...rowProps}>{cells}</tr>
          )
        })}
        {data.length === 0 && emptyState !== undefined && (
          <tr>
            <td colSpan={columns.length} className={emptyCellClassName || undefined}>{emptyState}</td>
          </tr>
        )}
        {afterRows}
      </tbody>
    </table>
  )

  return wrapperClassName ? <div className={wrapperClassName}>{body}</div> : body
}
