import type { Key } from 'react';
import type { ReactElement } from 'react';
import type { RefAttributes } from 'react';

export declare interface CalculatedColumn<TRow, TSummaryRow = unknown> extends Column<TRow, TSummaryRow> {
    idx: number;
    resizable: boolean;
    sortable: boolean;
    frozen: boolean;
    isLastFrozenColumn: boolean;
    rowGroup: boolean;
    formatter: React.ComponentType<FormatterProps<TRow, TSummaryRow>>;
}

export declare type CellNavigationMode = 'NONE' | 'CHANGE_ROW' | 'LOOP_OVER_ROW';

export declare interface CellRendererProps<TRow, TSummaryRow> extends Omit_2<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
    rowIdx: number;
    column: CalculatedColumn<TRow, TSummaryRow>;
    colSpan: number | undefined;
    row: TRow;
    isCopied: boolean;
    isDraggedOver: boolean;
    isCellSelected: boolean;
    dragHandleProps: Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onDoubleClick'> | undefined;
    onRowChange: (rowIdx: number, newRow: TRow) => void;
    onRowClick: ((rowIdx: number, row: TRow, column: CalculatedColumn<TRow, TSummaryRow>) => void) | undefined | null;
    selectCell: SelectCellFn;
}

export declare type ColSpanArgs<R, SR> = {
    type: 'HEADER';
} | {
    type: 'ROW';
    row: R;
} | {
    type: 'SUMMARY';
    row: SR;
};

export declare interface Column<TRow, TSummaryRow = unknown> {
    /** The name of the column. By default it will be displayed in the header cell */
    name: string | ReactElement;
    /** A unique key to distinguish each column */
    key: string;
    /** Column width. If not specified, it will be determined automatically based on grid width and specified widths of other columns */
    width?: number | string | null;
    /** Minimum column width in px. */
    minWidth?: number | null;
    /** Maximum column width in px. */
    maxWidth?: number | null;
    cellClass?: string | ((row: TRow) => string | undefined | null) | null;
    headerCellClass?: string | null;
    summaryCellClass?: string | ((row: TSummaryRow) => string) | null;
    /** Formatter to be used to render the cell content */
    formatter?: React.ComponentType<FormatterProps<TRow, TSummaryRow>> | null;
    /** Formatter to be used to render the summary cell content */
    summaryFormatter?: React.ComponentType<SummaryFormatterProps<TSummaryRow, TRow>> | null;
    /** Formatter to be used to render the group cell content */
    groupFormatter?: React.ComponentType<GroupFormatterProps<TRow, TSummaryRow>> | null;
    /** Enables cell editing. If set and no editor property specified, then a textinput will be used as the cell editor */
    editable?: boolean | ((row: TRow) => boolean) | null;
    colSpan?: ((args: ColSpanArgs<TRow, TSummaryRow>) => number | undefined | null) | null;
    /** Determines whether column is frozen or not */
    frozen?: boolean | null;
    /** Enable resizing of a column */
    resizable?: boolean | null;
    /** Enable sorting of a column */
    sortable?: boolean | null;
    /** Sets the column sort order to be descending instead of ascending the first time the column is sorted */
    sortDescendingFirst?: boolean | null;
    /** Editor to be rendered when cell of column is being edited. If set, then the column is automatically set to be editable */
    editor?: React.ComponentType<EditorProps<TRow, TSummaryRow>> | null;
    editorOptions?: {
        /** @default false */
        createPortal?: boolean | null;
        /** @default false */
        editOnClick?: boolean | null;
        /** Prevent default to cancel editing */
        onCellKeyDown?: ((event: React.KeyboardEvent<HTMLDivElement>) => void) | null;
        /** Control the default cell navigation behavior while the editor is open */
        onNavigation?: ((event: React.KeyboardEvent<HTMLDivElement>) => boolean) | null;
    } | null;
    /** Header renderer for each header cell */
    headerRenderer?: React.ComponentType<HeaderRendererProps<TRow, TSummaryRow>> | null;
}

export declare interface DataGridHandle {
    element: HTMLDivElement | null;
    scrollToColumn: (colIdx: number) => void;
    scrollToRow: (rowIdx: number) => void;
    selectCell: SelectCellFn;
}

export declare interface DataGridProps<R, SR = unknown, K extends Key = Key> extends SharedDivProps {
    /**
     * Grid and data Props
     */
    /** An array of objects representing each column on the grid */
    columns: readonly Column<R, SR>[];
    /** A function called for each rendered row that should return a plain key/value pair object */
    rows: readonly R[];
    /**
     * Rows to be pinned at the bottom of the rows view for summary, the vertical scroll bar will not scroll these rows.
     * Bottom horizontal scroll bar can move the row left / right. Or a customized row renderer can be used to disabled the scrolling support.
     */
    summaryRows?: readonly SR[] | null;
    /** The getter should return a unique key for each row */
    rowKeyGetter?: ((row: R) => K) | null;
    onRowsChange?: ((rows: R[], data: RowsChangeData<R, SR>) => void) | null;
    /**
     * Dimensions props
     */
    /** The height of each row in pixels */
    rowHeight?: number | ((args: RowHeightArgs<R>) => number) | null;
    /** The height of the header row in pixels */
    headerRowHeight?: number | null;
    /** The height of each summary row in pixels */
    summaryRowHeight?: number | null;
    /**
     * Feature props
     */
    /** Set of selected row keys */
    selectedRows?: ReadonlySet<K> | null;
    /** Function called whenever row selection is changed */
    onSelectedRowsChange?: ((selectedRows: Set<K>) => void) | null;
    /**Used for multi column sorting */
    sortColumns?: readonly Readonly<SortColumn>[] | null;
    onSortColumnsChange?: ((sortColumns: SortColumn[]) => void) | null;
    defaultColumnOptions?: DefaultColumnOptions<R, SR> | null;
    groupBy?: readonly string[] | null;
    rowGrouper?: ((rows: readonly R[], columnKey: string) => Record<string, readonly R[]>) | null;
    expandedGroupIds?: ReadonlySet<unknown> | null;
    onExpandedGroupIdsChange?: ((expandedGroupIds: Set<unknown>) => void) | null;
    onFill?: ((event: FillEvent<R>) => R[]) | null;
    onPaste?: ((event: PasteEvent<R>) => R) | null;
    /**
     * Custom renderers
     */
    rowRenderer?: React.ComponentType<RowRendererProps<R, SR>> | null;
    emptyRowsRenderer?: React.ComponentType | null;
    /**
     * Event props
     */
    /** Function called whenever a row is clicked */
    onRowClick?: ((rowIdx: number, row: R, column: CalculatedColumn<R, SR>) => void) | null;
    /** Called when the grid is scrolled */
    onScroll?: ((event: React.UIEvent<HTMLDivElement>) => void) | null;
    /** Called when a column is resized */
    onColumnResize?: ((idx: number, width: number) => void) | null;
    /** Function called whenever selected cell is changed */
    onSelectedCellChange?: ((position: Position) => void) | null;
    /**
     * Toggles and modes
     */
    cellNavigationMode?: CellNavigationMode | null;
    enableVirtualization?: boolean | null;
    /**
     * Miscellaneous
     */
    /** The node where the editor portal should mount. */
    editorPortalTarget?: Element | null;
    rowClass?: ((row: R) => string | undefined | null) | null;
    /** Function called whenever a row is out or in. */
    onMouseInRow?: ((rowIdx: number, row: R) => void) | null;
    onMouseOverRow?: ((rowIdx: number, row: R) => void) | null;
}

declare const _default: <R, SR = unknown, K extends Key = Key>(props: DataGridProps<R, SR, K> & RefAttributes<DataGridHandle>) => JSX.Element;
export default _default;

declare type DefaultColumnOptions<R, SR> = Pick<Column<R, SR>, 'formatter' | 'minWidth' | 'resizable' | 'sortable'>;

declare interface EditCellProps<TRow> extends SelectedCellPropsBase {
    mode: 'EDIT';
    editorProps: SharedEditorProps<TRow>;
}

export declare interface EditorProps<TRow, TSummaryRow = unknown> extends SharedEditorProps<TRow> {
    rowIdx: number;
    column: Readonly<CalculatedColumn<TRow, TSummaryRow>>;
}

export declare interface FillEvent<TRow> {
    columnKey: string;
    sourceRow: TRow;
    targetRows: TRow[];
}

export declare interface FormatterProps<TRow, TSummaryRow = unknown> {
    rowIdx: number;
    column: CalculatedColumn<TRow, TSummaryRow>;
    row: TRow;
    isCellSelected: boolean;
    onRowChange: (row: Readonly<TRow>) => void;
}

export declare interface GroupFormatterProps<TRow, TSummaryRow = unknown> {
    rowIdx: number;
    groupKey: unknown;
    column: CalculatedColumn<TRow, TSummaryRow>;
    childRows: readonly TRow[];
    isExpanded: boolean;
    isCellSelected: boolean;
    toggleGroup: () => void;
}

declare interface GroupRow<TRow> {
    childRows: readonly TRow[];
    id: string;
    parentId: unknown;
    groupKey: unknown;
    isExpanded: boolean;
    level: number;
    posInSet: number;
    setSize: number;
    startRowIndex: number;
}

export declare interface HeaderRendererProps<TRow, TSummaryRow = unknown> {
    column: CalculatedColumn<TRow, TSummaryRow>;
    sortDirection: SortDirection | undefined;
    priority: number | undefined;
    onSort: (ctrlClick: boolean) => void;
    allRowsSelected: boolean;
    onAllRowsSelectionChange: (checked: boolean) => void;
}

declare type Omit_2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export declare interface PasteEvent<TRow> {
    sourceColumnKey: string;
    sourceRow: TRow;
    targetColumnKey: string;
    targetRow: TRow;
}

declare interface Position {
    idx: number;
    rowIdx: number;
}

declare interface Props<R, SR> extends SharedHeaderCellProps<R, SR> {
    children: React.ReactNode;
}

export declare const Row: <R, SR>(props: RowRendererProps<R, SR> & RefAttributes<HTMLDivElement>) => JSX.Element;

export declare type RowHeightArgs<R> = {
    type: 'ROW';
    row: R;
} | {
    type: 'GROUP';
    row: GroupRow<R>;
};

export declare interface RowRendererProps<TRow, TSummaryRow = unknown> extends Omit_2<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
    viewportColumns: readonly CalculatedColumn<TRow, TSummaryRow>[];
    row: TRow;
    rowIdx: number;
    copiedCellIdx: number | undefined;
    draggedOverCellIdx: number | undefined;
    lastFrozenColumnIndex: number;
    isRowSelected: boolean;
    top: number;
    height: number;
    selectedCellProps: EditCellProps<TRow> | SelectedCellProps | undefined;
    onRowChange: (rowIdx: number, row: TRow) => void;
    onRowClick: ((rowIdx: number, row: TRow, column: CalculatedColumn<TRow, TSummaryRow>) => void) | undefined | null;
    rowClass: ((row: TRow) => string | undefined | null) | undefined | null;
    setDraggedOverRowIdx: ((overRowIdx: number) => void) | undefined;
    selectCell: SelectCellFn;
    onMouseInRow: ((rowIdx: number, row: TRow) => void) | undefined | null;
    onMouseOverRow: ((rowIdx: number, row: TRow) => void) | undefined | null;
}

export declare interface RowsChangeData<R, SR = unknown> {
    indexes: number[];
    column: CalculatedColumn<R, SR>;
}

export declare const SELECT_COLUMN_KEY = "select-row";

declare type SelectCellFn = (position: Position, enableEditor?: boolean | null) => void;

export declare function SelectCellFormatter({ value, tabIndex, isCellSelected, disabled, onClick, onChange, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy }: SelectCellFormatterProps): JSX.Element;

declare interface SelectCellFormatterProps extends SharedInputProps {
    isCellSelected: boolean;
    value: boolean;
    onChange: (value: boolean, isShiftClick: boolean) => void;
}

export declare const SelectColumn: Column<any, any>;

declare interface SelectedCellProps extends SelectedCellPropsBase {
    mode: 'SELECT';
    onFocus: () => void;
    dragHandleProps: Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onDoubleClick'> | undefined;
}

declare interface SelectedCellPropsBase {
    idx: number;
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export declare interface SelectRowEvent {
    rowIdx: number;
    checked: boolean;
    isShiftClick: boolean;
}

declare type SharedDivProps = Pick<React.HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'className' | 'style'>;

declare interface SharedEditorProps<TRow> {
    row: Readonly<TRow>;
    editorPortalTarget: Element;
    onRowChange: (row: Readonly<TRow>, commitChanges?: boolean) => void;
    onClose: (commitChanges?: boolean) => void;
}

declare type SharedHeaderCellProps<R, SR> = Pick<HeaderRendererProps<R, SR>, 'sortDirection' | 'onSort' | 'priority'>;

declare type SharedInputProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'tabIndex' | 'onClick' | 'aria-label' | 'aria-labelledby'>;

export declare function SortableHeaderCell<R, SR>({ onSort, sortDirection, priority, children }: Props<R, SR>): JSX.Element;

export declare interface SortColumn {
    columnKey: string;
    direction: SortDirection;
}

export declare type SortDirection = 'ASC' | 'DESC';

export declare interface SummaryFormatterProps<TSummaryRow, TRow = unknown> {
    column: CalculatedColumn<TRow, TSummaryRow>;
    row: TSummaryRow;
}

export declare function TextEditor<TRow, TSummaryRow>({ row, column, onRowChange, onClose }: EditorProps<TRow, TSummaryRow>): JSX.Element;

export declare function ToggleGroupFormatter<R, SR>({ groupKey, isExpanded, isCellSelected, toggleGroup }: GroupFormatterProps<R, SR>): JSX.Element;

export declare function useRowSelection(): [boolean, (selectRowEvent: SelectRowEvent) => void];

export declare function ValueFormatter<R, SR>(props: FormatterProps<R, SR>): JSX.Element | null;

export { }
