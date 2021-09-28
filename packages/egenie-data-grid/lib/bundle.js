import { useRef, useLayoutEffect, useMemo, useState, useCallback, useEffect, useContext, createContext, memo, forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$b = ".cj343x0{background-color:inherit;border-bottom:1px solid var(--border-color);border-right:1px solid var(--border-color);contain:strict;contain:size layout style paint;overflow:hidden;overflow:clip;padding:0 8px;text-overflow:ellipsis;white-space:nowrap}.cj343x0[aria-selected=true]{box-shadow:inset 0 0 0 2px var(--selection-color)}.csofj7r{position:sticky;z-index:1}.ch2wcw8{box-shadow:2px 0 5px -2px rgba(136,136,136,.3)}";
styleInject(css_248z$b);

const cell = "cj343x0";
const cellClassname = `rdg-cell ${cell}`;
const cellFrozen = "csofj7r";
const cellFrozenClassname = `rdg-cell-frozen ${cellFrozen}`;
const cellFrozenLast = "ch2wcw8";
const cellFrozenLastClassname = `rdg-cell-frozen-last ${cellFrozenLast}`;

var css_248z$a = ".rnvodz5{--color:#000;--border-color:#ddd;--summary-border-color:#aaa;--background-color:#fff;--header-background-color:#f9f9f9;--row-hover-background-color:#f5f5f5;--row-selected-background-color:#dbecfa;--row-selected-hover-background-color:#c9e3f8;--checkbox-color:#005194;--checkbox-focus-color:#61b8ff;--checkbox-disabled-border-color:#ccc;--checkbox-disabled-background-color:#ddd;--selection-color:#66afe9;--font-size:14px;content-visibility:auto;background-color:var(--background-color);border:1px solid var(--border-color);box-sizing:border-box;color:var(--color);contain:strict;contain:size layout style paint;font-size:var(--font-size);height:350px;overflow:auto;user-select:none}@supports not (contain:strict){.rnvodz5{position:relative;z-index:0}}.rnvodz5 *,.rnvodz5 :after,.rnvodz5 :before{box-sizing:inherit}.rnvodz5.rdg-dark{--color:#ddd;--border-color:#444;--summary-border-color:#555;--background-color:#212121;--header-background-color:#1b1b1b;--row-hover-background-color:#171717;--row-selected-background-color:#1a73bc;--row-selected-hover-background-color:#1768ab;--checkbox-color:#94cfff;--checkbox-focus-color:#c7e6ff;--checkbox-disabled-border-color:#000;--checkbox-disabled-background-color:#333}@media (prefers-color-scheme:dark){.rnvodz5:not(.rdg-light){--color:#ddd;--border-color:#444;--summary-border-color:#555;--background-color:#212121;--header-background-color:#1b1b1b;--row-hover-background-color:#171717;--row-selected-background-color:#1a73bc;--row-selected-hover-background-color:#1768ab;--checkbox-color:#94cfff;--checkbox-focus-color:#c7e6ff;--checkbox-disabled-border-color:#000;--checkbox-disabled-background-color:#333}}.flqv91k{height:0;left:0;outline:0;position:sticky;top:0;width:0}.v1lsfrzw.r1upfr80{cursor:move}";
styleInject(css_248z$a);

const root = "rnvodz5";
const rootClassname = `rdg ${root}`;
const focusSink = "flqv91k";
const focusSinkClassname = `rdg-focus-sink ${focusSink}`;
const viewportDragging = "v1lsfrzw";
const viewportDraggingClassname = `rdg-viewport-dragging ${viewportDragging}`;

var css_248z$9 = ".gajh8w5:not([aria-selected=true]){background-color:var(--header-background-color)}.gajh8w5>.cj343x0:not(:last-child):not(.ch2wcw8){border-right:none}.g17pnute:after{bottom:0;box-shadow:inset 0 0 0 2px var(--selection-color);content:\"\";left:0;pointer-events:none;position:absolute;right:0;top:0;z-index:2}.g17pnute>.cj343x0:first-child{box-shadow:inset 2px 0 0 0 var(--selection-color)}";
styleInject(css_248z$9);

const groupRow = "gajh8w5";
const groupRowClassname = `rdg-group-row ${groupRow}`;
const groupRowSelected = "g17pnute";
const groupRowSelectedClassname = `rdg-group-row-selected ${groupRowSelected}`;

var css_248z$8 = ".hz5s9zk{background-color:var(--header-background-color);contain:strict;contain:size layout style paint;display:grid;font-weight:700;grid-template-columns:var(--template-columns);grid-template-rows:var(--header-row-height);height:var(--header-row-height);line-height:var(--header-row-height);position:sticky;top:0;touch-action:none;width:var(--row-width);z-index:3}";
styleInject(css_248z$8);

const headerRow = "hz5s9zk";
const headerRowClassname = `rdg-header-row ${headerRow}`;

var css_248z$7 = ".r1upfr80{background-color:var(--background-color);contain:strict;contain:size layout style paint;display:grid;grid-template-columns:var(--template-columns);grid-template-rows:var(--row-height);height:var(--row-height);left:0;line-height:var(--row-height);position:absolute;width:var(--row-width)}.r1upfr80:hover{background-color:var(--row-hover-background-color)}.r1upfr80[aria-selected=true]{background-color:var(--row-selected-background-color)}.r1upfr80[aria-selected=true]:hover{background-color:var(--row-selected-hover-background-color)}.s190mhd3{grid-template-rows:var(--summary-row-height);height:var(--summary-row-height);line-height:var(--summary-row-height);position:sticky;z-index:3}.s190mhd3>.cj343x0{border-top:2px solid var(--summary-border-color)}";
styleInject(css_248z$7);

const row = "r1upfr80";
const rowClassname = `rdg-row ${row}`;
const summaryRow = "s190mhd3";
const summaryRowClassname = `rdg-summary-row ${summaryRow}`;

function useFocusRef(isCellSelected) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    var _ref$current;

    if (!isCellSelected) return;
    (_ref$current = ref.current) == null ? void 0 : _ref$current.focus({
      preventScroll: true
    });
  }, [isCellSelected]);
  return ref;
}

var css_248z$6 = ".c4l3n6v{align-items:center;bottom:0;cursor:pointer;display:flex;justify-content:center;left:0;margin-right:1px;position:absolute;right:0;top:0}.c1bikpmb{all:unset;margin:0;width:0}.c1eyot7g{background-color:var(--background-color);border:2px solid var(--border-color);content:\"\";height:20px;width:20px}.c1bikpmb:checked+.c1eyot7g{background-color:var(--checkbox-color);box-shadow:inset 0 0 0 4px var(--background-color)}.c1bikpmb:focus+.c1eyot7g{border-color:var(--checkbox-focus-color)}.c1jlcvp4{cursor:default}.c1jlcvp4 .c1eyot7g{background-color:var(--checkbox-disabled-background-color);border-color:var(--checkbox-disabled-border-color)}";
styleInject(css_248z$6);

const checkboxLabel = "c4l3n6v";
const checkboxLabelClassname = `rdg-checkbox-label ${checkboxLabel}`;
const checkboxInput = "c1bikpmb";
const checkboxInputClassname = `rdg-checkbox-input ${checkboxInput}`;
const checkbox = "c1eyot7g";
const checkboxClassname = `rdg-checkbox ${checkbox}`;
const checkboxLabelDisabled = "c1jlcvp4";
const checkboxLabelDisabledClassname = `rdg-checkbox-label-disabled ${checkboxLabelDisabled}`;
function SelectCellFormatter({
  value,
  tabIndex,
  isCellSelected,
  disabled,
  onClick,
  onChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy
}) {
  const inputRef = useFocusRef(isCellSelected);

  function handleChange(e) {
    onChange(e.target.checked, e.nativeEvent.shiftKey);
  }

  return /*#__PURE__*/jsxs("label", {
    className: clsx(checkboxLabelClassname, disabled && checkboxLabelDisabledClassname),
    children: [/*#__PURE__*/jsx("input", {
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      tabIndex: tabIndex,
      ref: inputRef,
      type: "checkbox",
      className: checkboxInputClassname,
      disabled: disabled,
      checked: value,
      onChange: handleChange,
      onClick: onClick
    }), /*#__PURE__*/jsx("div", {
      className: checkboxClassname
    })]
  });
}

function ValueFormatter(props) {
  try {
    return /*#__PURE__*/jsx(Fragment, {
      children: props.row[props.column.key]
    });
  } catch {
    return null;
  }
}

var css_248z$5 = ".g1vzro7t{outline:none}.c1fsqdic{stroke:currentColor;stroke-width:1.5px;fill:transparent;margin-left:4px;vertical-align:middle}.c1fsqdic>path{transition:d .1s}";
styleInject(css_248z$5);

const groupCellContent = "g1vzro7t";
const groupCellContentClassname = `rdg-group-cell-content ${groupCellContent}`;
const caret = "c1fsqdic";
const caretClassname = `rdg-caret ${caret}`;
function ToggleGroupFormatter({
  groupKey,
  isExpanded,
  isCellSelected,
  toggleGroup
}) {
  const cellRef = useFocusRef(isCellSelected);

  function handleKeyDown({
    key
  }) {
    if (key === 'Enter') {
      toggleGroup();
    }
  }

  const d = isExpanded ? 'M1 1 L 7 7 L 13 1' : 'M1 7 L 7 1 L 13 7';
  return /*#__PURE__*/jsxs("span", {
    ref: cellRef,
    className: groupCellContentClassname,
    tabIndex: -1,
    onKeyDown: handleKeyDown,
    children: [groupKey, /*#__PURE__*/jsx("svg", {
      viewBox: "0 0 14 8",
      width: "14",
      height: "8",
      className: caretClassname,
      children: /*#__PURE__*/jsx("path", {
        d: d
      })
    })]
  });
}

function getColSpan(column, lastFrozenColumnIndex, args) {
  const colSpan = typeof column.colSpan === 'function' ? column.colSpan(args) : 1;

  if (Number.isInteger(colSpan) && colSpan > 1 && (!column.frozen || column.idx + colSpan - 1 <= lastFrozenColumnIndex)) {
    return colSpan;
  }

  return undefined;
}

function stopPropagation(event) {
  event.stopPropagation();
}

const nonInputKeys = new Set(['Unidentified', 'Alt', 'AltGraph', 'CapsLock', 'Control', 'Fn', 'FnLock', 'Meta', 'NumLock', 'ScrollLock', 'Shift', 'Tab', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp', 'Insert', 'ContextMenu', 'Escape', 'Pause', 'Play', 'PrintScreen', 'F1', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']);
function isCtrlKeyHeldDown(e) {
  return (e.ctrlKey || e.metaKey) && e.key !== 'Control';
}
function isDefaultCellInput(event) {
  return !nonInputKeys.has(event.key);
}
function onEditorNavigation({
  key,
  target
}) {
  if (key === 'Tab' && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return target.matches('.rdg-editor-container > :only-child, .rdg-editor-container > label:only-child > :only-child');
  }

  return false;
}

function isSelectedCellEditable({
  selectedPosition,
  columns,
  rows,
  isGroupRow
}) {
  const column = columns[selectedPosition.idx];
  const row = rows[selectedPosition.rowIdx];
  return !isGroupRow(row) && isCellEditable(column, row);
}
function isCellEditable(column, row) {
  return column.editor != null && !column.rowGroup && (typeof column.editable === 'function' ? column.editable(row) : column.editable) !== false;
}
function getNextSelectedCellPosition({
  cellNavigationMode,
  columns,
  colSpanColumns,
  rows,
  currentPosition,
  nextPosition,
  lastFrozenColumnIndex,
  isCellWithinBounds,
  isGroupRow
}) {
  const rowsCount = rows.length;
  let position = nextPosition;

  const setColSpan = moveRight => {
    const row = rows[position.rowIdx];

    if (!isGroupRow(row)) {
      const posIdx = position.idx;

      for (const column of colSpanColumns) {
        const colIdx = column.idx;
        if (colIdx > posIdx) break;
        const colSpan = getColSpan(column, lastFrozenColumnIndex, {
          type: 'ROW',
          row
        });

        if (colSpan && posIdx > colIdx && posIdx < colSpan + colIdx) {
          position.idx = colIdx + (moveRight ? colSpan : 0);
          break;
        }
      }
    }
  };

  if (isCellWithinBounds(position)) {
    setColSpan(position.idx - currentPosition.idx > 0);
  }

  if (cellNavigationMode !== 'NONE') {
    const {
      idx,
      rowIdx
    } = nextPosition;
    const columnsCount = columns.length;
    const isAfterLastColumn = idx === columnsCount;
    const isBeforeFirstColumn = idx === -1;

    if (isAfterLastColumn) {
      if (cellNavigationMode === 'CHANGE_ROW') {
        const isLastRow = rowIdx === rowsCount - 1;

        if (!isLastRow) {
          position = {
            idx: 0,
            rowIdx: rowIdx + 1
          };
        }
      } else {
        position = {
          rowIdx,
          idx: 0
        };
      }

      setColSpan(true);
    } else if (isBeforeFirstColumn) {
      if (cellNavigationMode === 'CHANGE_ROW') {
        const isFirstRow = rowIdx === 0;

        if (!isFirstRow) {
          position = {
            rowIdx: rowIdx - 1,
            idx: columnsCount - 1
          };
        }
      } else {
        position = {
          rowIdx,
          idx: columnsCount - 1
        };
      }
    }

    setColSpan(false);
  }

  return position;
}
function canExitGrid({
  cellNavigationMode,
  columns,
  rowsCount,
  selectedPosition: {
    rowIdx,
    idx
  },
  shiftKey
}) {
  if (cellNavigationMode === 'NONE' || cellNavigationMode === 'CHANGE_ROW') {
    const atLastCellInRow = idx === columns.length - 1;
    const atFirstCellInRow = idx === 0;
    const atLastRow = rowIdx === rowsCount - 1;
    const atFirstRow = rowIdx === 0;
    return shiftKey ? atFirstCellInRow && atFirstRow : atLastCellInRow && atLastRow;
  }

  return false;
}

const {
  min,
  max,
  floor,
  sign
} = Math;
function assertIsValidKeyGetter(keyGetter) {
  if (typeof keyGetter !== 'function') {
    throw new Error('Please specify the rowKeyGetter prop to use selection');
  }
}
function getCellStyle(column, colSpan) {
  return {
    gridColumnStart: column.idx + 1,
    gridColumnEnd: colSpan !== undefined ? `span ${colSpan}` : undefined,
    left: column.frozen ? `var(--frozen-left-${column.key})` : undefined
  };
}
function getCellClassname(column, ...extraClasses) {
  return clsx(cellClassname, ...extraClasses, column.frozen && cellFrozenClassname, column.isLastFrozenColumn && cellFrozenLastClassname);
}

const SELECT_COLUMN_KEY = 'select-row';

function SelectFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection();
  return /*#__PURE__*/jsx(SelectCellFormatter, {
    "aria-label": "Select",
    tabIndex: -1,
    isCellSelected: props.isCellSelected,
    value: isRowSelected,
    onClick: stopPropagation,
    onChange: (checked, isShiftClick) => {
      onRowSelectionChange({
        rowIdx: props.rowIdx,
        checked,
        isShiftClick
      });
    }
  });
}

function SelectGroupFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection();
  return /*#__PURE__*/jsx(SelectCellFormatter, {
    "aria-label": "Select Group",
    tabIndex: -1,
    isCellSelected: props.isCellSelected,
    value: isRowSelected,
    onChange: checked => {
      onRowSelectionChange({
        checked,
        isShiftClick: false,
        rowIdx: props.rowIdx
      });
    },
    onClick: stopPropagation
  });
}

const SelectColumn = {
  key: SELECT_COLUMN_KEY,
  name: '',
  width: 35,
  maxWidth: 35,
  resizable: false,
  sortable: false,
  frozen: true,

  headerRenderer(props) {
    return /*#__PURE__*/jsx(SelectCellFormatter, {
      "aria-label": "Select All",
      isCellSelected: false,
      value: props.allRowsSelected,
      onChange: props.onAllRowsSelectionChange
    });
  },

  formatter: SelectFormatter,
  groupFormatter: SelectGroupFormatter
};

function useCalculatedColumns({
  rawColumns,
  columnWidths,
  viewportWidth,
  scrollLeft,
  defaultColumnOptions,
  rawGroupBy,
  enableVirtualization
}) {
  var _defaultColumnOptions, _defaultColumnOptions2, _defaultColumnOptions3, _defaultColumnOptions4;

  const minColumnWidth = (_defaultColumnOptions = defaultColumnOptions == null ? void 0 : defaultColumnOptions.minWidth) != null ? _defaultColumnOptions : 80;
  const defaultFormatter = (_defaultColumnOptions2 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.formatter) != null ? _defaultColumnOptions2 : ValueFormatter;
  const defaultSortable = (_defaultColumnOptions3 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.sortable) != null ? _defaultColumnOptions3 : false;
  const defaultResizable = (_defaultColumnOptions4 = defaultColumnOptions == null ? void 0 : defaultColumnOptions.resizable) != null ? _defaultColumnOptions4 : false;
  const {
    columns,
    colSpanColumns,
    lastFrozenColumnIndex,
    groupBy
  } = useMemo(() => {
    const groupBy = [];
    let lastFrozenColumnIndex = -1;
    const columns = rawColumns.map(rawColumn => {
      var _rawGroupBy$includes, _rawColumn$sortable, _rawColumn$resizable, _rawColumn$formatter;

      const rowGroup = (_rawGroupBy$includes = rawGroupBy == null ? void 0 : rawGroupBy.includes(rawColumn.key)) != null ? _rawGroupBy$includes : false;
      const frozen = rowGroup || rawColumn.frozen || false;
      const column = { ...rawColumn,
        idx: 0,
        frozen,
        isLastFrozenColumn: false,
        rowGroup,
        sortable: (_rawColumn$sortable = rawColumn.sortable) != null ? _rawColumn$sortable : defaultSortable,
        resizable: (_rawColumn$resizable = rawColumn.resizable) != null ? _rawColumn$resizable : defaultResizable,
        formatter: (_rawColumn$formatter = rawColumn.formatter) != null ? _rawColumn$formatter : defaultFormatter
      };

      if (rowGroup) {
        var _column$groupFormatte;

        (_column$groupFormatte = column.groupFormatter) != null ? _column$groupFormatte : column.groupFormatter = ToggleGroupFormatter;
      }

      if (frozen) {
        lastFrozenColumnIndex++;
      }

      return column;
    });
    columns.sort(({
      key: aKey,
      frozen: frozenA
    }, {
      key: bKey,
      frozen: frozenB
    }) => {
      if (aKey === SELECT_COLUMN_KEY) return -1;
      if (bKey === SELECT_COLUMN_KEY) return 1;

      if (rawGroupBy != null && rawGroupBy.includes(aKey)) {
        if (rawGroupBy.includes(bKey)) {
          return rawGroupBy.indexOf(aKey) - rawGroupBy.indexOf(bKey);
        }

        return -1;
      }

      if (rawGroupBy != null && rawGroupBy.includes(bKey)) return 1;

      if (frozenA) {
        if (frozenB) return 0;
        return -1;
      }

      if (frozenB) return 1;
      return 0;
    });
    const colSpanColumns = [];
    columns.forEach((column, idx) => {
      column.idx = idx;

      if (column.rowGroup) {
        groupBy.push(column.key);
      }

      if (column.colSpan != null) {
        colSpanColumns.push(column);
      }
    });

    if (lastFrozenColumnIndex !== -1) {
      columns[lastFrozenColumnIndex].isLastFrozenColumn = true;
    }

    return {
      columns,
      colSpanColumns,
      lastFrozenColumnIndex,
      groupBy
    };
  }, [rawColumns, defaultFormatter, defaultResizable, defaultSortable, rawGroupBy]);
  const {
    layoutCssVars,
    totalColumnWidth,
    totalFrozenColumnWidth,
    columnMetrics
  } = useMemo(() => {
    const columnMetrics = new Map();
    let left = 0;
    let totalColumnWidth = 0;
    let totalFrozenColumnWidth = 0;
    let templateColumns = '';
    let allocatedWidth = 0;
    let unassignedColumnsCount = 0;

    for (const column of columns) {
      let width = getSpecifiedWidth(column, columnWidths, viewportWidth);

      if (width === undefined) {
        unassignedColumnsCount++;
      } else {
        width = clampColumnWidth(width, column, minColumnWidth);
        allocatedWidth += width;
        columnMetrics.set(column, {
          width,
          left: 0
        });
      }
    }

    const unallocatedWidth = viewportWidth - allocatedWidth;
    const unallocatedColumnWidth = unallocatedWidth / unassignedColumnsCount;

    for (const column of columns) {
      let width;

      if (columnMetrics.has(column)) {
        const columnMetric = columnMetrics.get(column);
        columnMetric.left = left;
        ({
          width
        } = columnMetric);
      } else {
        width = clampColumnWidth(unallocatedColumnWidth, column, minColumnWidth);
        columnMetrics.set(column, {
          width,
          left
        });
      }

      totalColumnWidth += width;
      left += width;
      templateColumns += `${width}px `;
    }

    if (lastFrozenColumnIndex !== -1) {
      const columnMetric = columnMetrics.get(columns[lastFrozenColumnIndex]);
      totalFrozenColumnWidth = columnMetric.left + columnMetric.width;
    }

    const layoutCssVars = {
      '--template-columns': templateColumns
    };

    for (let i = 0; i <= lastFrozenColumnIndex; i++) {
      const column = columns[i];
      layoutCssVars[`--frozen-left-${column.key}`] = `${columnMetrics.get(column).left}px`;
    }

    return {
      layoutCssVars,
      totalColumnWidth,
      totalFrozenColumnWidth,
      columnMetrics
    };
  }, [columnWidths, columns, viewportWidth, minColumnWidth, lastFrozenColumnIndex]);
  const [colOverscanStartIdx, colOverscanEndIdx] = useMemo(() => {
    if (!enableVirtualization) {
      return [0, columns.length - 1];
    }

    const viewportLeft = scrollLeft + totalFrozenColumnWidth;
    const viewportRight = scrollLeft + viewportWidth;
    const lastColIdx = columns.length - 1;
    const firstUnfrozenColumnIdx = min(lastFrozenColumnIndex + 1, lastColIdx);

    if (viewportLeft >= viewportRight) {
      return [firstUnfrozenColumnIdx, firstUnfrozenColumnIdx];
    }

    let colVisibleStartIdx = firstUnfrozenColumnIdx;

    while (colVisibleStartIdx < lastColIdx) {
      const {
        left,
        width
      } = columnMetrics.get(columns[colVisibleStartIdx]);

      if (left + width > viewportLeft) {
        break;
      }

      colVisibleStartIdx++;
    }

    let colVisibleEndIdx = colVisibleStartIdx;

    while (colVisibleEndIdx < lastColIdx) {
      const {
        left,
        width
      } = columnMetrics.get(columns[colVisibleEndIdx]);

      if (left + width >= viewportRight) {
        break;
      }

      colVisibleEndIdx++;
    }

    const colOverscanStartIdx = max(firstUnfrozenColumnIdx, colVisibleStartIdx - 1);
    const colOverscanEndIdx = min(lastColIdx, colVisibleEndIdx + 1);
    return [colOverscanStartIdx, colOverscanEndIdx];
  }, [columnMetrics, columns, lastFrozenColumnIndex, scrollLeft, totalFrozenColumnWidth, viewportWidth, enableVirtualization]);
  return {
    columns,
    colSpanColumns,
    colOverscanStartIdx,
    colOverscanEndIdx,
    layoutCssVars,
    columnMetrics,
    totalColumnWidth,
    lastFrozenColumnIndex,
    totalFrozenColumnWidth,
    groupBy
  };
}

function getSpecifiedWidth({
  key,
  width
}, columnWidths, viewportWidth) {
  if (columnWidths.has(key)) {
    return columnWidths.get(key);
  }

  if (typeof width === 'number') {
    return width;
  }

  if (typeof width === 'string' && /^\d+%$/.test(width)) {
    return floor(viewportWidth * parseInt(width, 10) / 100);
  }

  return undefined;
}

function clampColumnWidth(width, {
  minWidth,
  maxWidth
}, minColumnWidth) {
  width = max(width, minWidth != null ? minWidth : minColumnWidth);

  if (typeof maxWidth === 'number') {
    return min(width, maxWidth);
  }

  return width;
}

function useGridDimensions() {
  const gridRef = useRef(null);
  const [gridWidth, setGridWidth] = useState(1);
  const [gridHeight, setGridHeight] = useState(1);
  useLayoutEffect(() => {
    const {
      ResizeObserver
    } = window;
    if (ResizeObserver == null) return;
    const resizeObserver = new ResizeObserver(() => {
      const {
        clientWidth,
        clientHeight
      } = gridRef.current;
      setGridWidth(clientWidth - (devicePixelRatio % 1 === 0 ? 0 : 1));
      setGridHeight(clientHeight);
    });
    resizeObserver.observe(gridRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return [gridRef, gridWidth, gridHeight];
}

function useLatestFunc(fn) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args) => {
    ref.current(...args);
  }, []);
}

const RowSelectionContext = /*#__PURE__*/createContext(undefined);
const RowSelectionProvider = RowSelectionContext.Provider;
const RowSelectionChangeContext = /*#__PURE__*/createContext(undefined);
const RowSelectionChangeProvider = RowSelectionChangeContext.Provider;
function useRowSelection() {
  const rowSelectionContext = useContext(RowSelectionContext);
  const rowSelectionChangeContext = useContext(RowSelectionChangeContext);

  if (rowSelectionContext === undefined || rowSelectionChangeContext === undefined) {
    throw new Error('useRowSelection must be used within DataGrid cells');
  }

  return [rowSelectionContext, rowSelectionChangeContext];
}

function useViewportColumns({
  columns,
  colSpanColumns,
  rows,
  summaryRows,
  colOverscanStartIdx,
  colOverscanEndIdx,
  lastFrozenColumnIndex,
  rowOverscanStartIdx,
  rowOverscanEndIdx,
  isGroupRow
}) {
  const startIdx = useMemo(() => {
    if (colOverscanStartIdx === 0) return 0;
    let startIdx = colOverscanStartIdx;

    const updateStartIdx = (colIdx, colSpan) => {
      if (colSpan !== undefined && colIdx + colSpan > colOverscanStartIdx) {
        startIdx = colIdx;
        return true;
      }

      return false;
    };

    for (const column of colSpanColumns) {
      const colIdx = column.idx;
      if (colIdx >= startIdx) break;

      if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
        type: 'HEADER'
      }))) {
        break;
      }

      for (let rowIdx = rowOverscanStartIdx; rowIdx <= rowOverscanEndIdx; rowIdx++) {
        const row = rows[rowIdx];
        if (isGroupRow(row)) continue;

        if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
          type: 'ROW',
          row
        }))) {
          break;
        }
      }

      if (summaryRows != null) {
        for (const row of summaryRows) {
          if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
            type: 'SUMMARY',
            row
          }))) {
            break;
          }
        }
      }
    }

    return startIdx;
  }, [rowOverscanStartIdx, rowOverscanEndIdx, rows, summaryRows, colOverscanStartIdx, lastFrozenColumnIndex, colSpanColumns, isGroupRow]);
  return useMemo(() => {
    const viewportColumns = [];

    for (let colIdx = 0; colIdx <= colOverscanEndIdx; colIdx++) {
      const column = columns[colIdx];
      if (colIdx < startIdx && !column.frozen) continue;
      viewportColumns.push(column);
    }

    return viewportColumns;
  }, [startIdx, colOverscanEndIdx, columns]);
}

function isReadonlyArray(arr) {
  return Array.isArray(arr);
}

function useViewportRows({
  rawRows,
  rowHeight,
  clientHeight,
  scrollTop,
  groupBy,
  rowGrouper,
  expandedGroupIds,
  enableVirtualization
}) {
  const [groupedRows, rowsCount] = useMemo(() => {
    if (groupBy.length === 0 || rowGrouper == null) return [undefined, rawRows.length];

    const groupRows = (rows, [groupByKey, ...remainingGroupByKeys], startRowIndex) => {
      let groupRowsCount = 0;
      const groups = {};

      for (const [key, childRows] of Object.entries(rowGrouper(rows, groupByKey))) {
        const [childGroups, childRowsCount] = remainingGroupByKeys.length === 0 ? [childRows, childRows.length] : groupRows(childRows, remainingGroupByKeys, startRowIndex + groupRowsCount + 1);
        groups[key] = {
          childRows,
          childGroups,
          startRowIndex: startRowIndex + groupRowsCount
        };
        groupRowsCount += childRowsCount + 1;
      }

      return [groups, groupRowsCount];
    };

    return groupRows(rawRows, groupBy, 0);
  }, [groupBy, rowGrouper, rawRows]);
  const [rows, isGroupRow] = useMemo(() => {
    const allGroupRows = new Set();
    if (!groupedRows) return [rawRows, isGroupRow];
    const flattenedRows = [];

    const expandGroup = (rows, parentId, level) => {
      if (isReadonlyArray(rows)) {
        flattenedRows.push(...rows);
        return;
      }

      Object.keys(rows).forEach((groupKey, posInSet, keys) => {
        var _expandedGroupIds$has;

        const id = parentId !== undefined ? `${parentId}__${groupKey}` : groupKey;
        const isExpanded = (_expandedGroupIds$has = expandedGroupIds == null ? void 0 : expandedGroupIds.has(id)) != null ? _expandedGroupIds$has : false;
        const {
          childRows,
          childGroups,
          startRowIndex
        } = rows[groupKey];
        const groupRow = {
          id,
          parentId,
          groupKey,
          isExpanded,
          childRows,
          level,
          posInSet,
          startRowIndex,
          setSize: keys.length
        };
        flattenedRows.push(groupRow);
        allGroupRows.add(groupRow);

        if (isExpanded) {
          expandGroup(childGroups, id, level + 1);
        }
      });
    };

    expandGroup(groupedRows, undefined, 0);
    return [flattenedRows, isGroupRow];

    function isGroupRow(row) {
      return allGroupRows.has(row);
    }
  }, [expandedGroupIds, groupedRows, rawRows]);
  const {
    totalRowHeight,
    getRowTop,
    getRowHeight,
    findRowIdx
  } = useMemo(() => {
    if (typeof rowHeight === 'number') {
      return {
        totalRowHeight: rowHeight * rows.length,
        getRowTop: rowIdx => rowIdx * rowHeight,
        getRowHeight: () => rowHeight,
        findRowIdx: offset => floor(offset / rowHeight)
      };
    }

    let totalRowHeight = 0;
    const rowPositions = rows.map(row => {
      const currentRowHeight = isGroupRow(row) ? rowHeight({
        type: 'GROUP',
        row
      }) : rowHeight({
        type: 'ROW',
        row
      });
      const position = {
        top: totalRowHeight,
        height: currentRowHeight
      };
      totalRowHeight += currentRowHeight;
      return position;
    });

    const validateRowIdx = rowIdx => {
      return max(0, min(rows.length - 1, rowIdx));
    };

    return {
      totalRowHeight,
      getRowTop: rowIdx => rowPositions[validateRowIdx(rowIdx)].top,
      getRowHeight: rowIdx => rowPositions[validateRowIdx(rowIdx)].height,

      findRowIdx(offset) {
        let start = 0;
        let end = rowPositions.length - 1;

        while (start <= end) {
          const middle = start + floor((end - start) / 2);
          const currentOffset = rowPositions[middle].top;
          if (currentOffset === offset) return middle;

          if (currentOffset < offset) {
            start = middle + 1;
          } else if (currentOffset > offset) {
            end = middle - 1;
          }

          if (start > end) return end;
        }

        return 0;
      }

    };
  }, [isGroupRow, rowHeight, rows]);

  if (!enableVirtualization) {
    return {
      rowOverscanStartIdx: 0,
      rowOverscanEndIdx: rows.length - 1,
      rows,
      rowsCount,
      totalRowHeight,
      isGroupRow,
      getRowTop,
      getRowHeight,
      findRowIdx
    };
  }

  const overscanThreshold = 4;
  const rowVisibleStartIdx = findRowIdx(scrollTop);
  const rowVisibleEndIdx = findRowIdx(scrollTop + clientHeight);
  const rowOverscanStartIdx = max(0, rowVisibleStartIdx - overscanThreshold);
  const rowOverscanEndIdx = min(rows.length - 1, rowVisibleEndIdx + overscanThreshold);
  return {
    rowOverscanStartIdx,
    rowOverscanEndIdx,
    rows,
    rowsCount,
    totalRowHeight,
    isGroupRow,
    getRowTop,
    getRowHeight,
    findRowIdx
  };
}

var css_248z$4 = ".h1j9yp5q{cursor:pointer;display:flex}.h1e6at1o{flex-grow:1;overflow:hidden;overflow:clip;text-overflow:ellipsis}";
styleInject(css_248z$4);

const headerSortCell = "h1j9yp5q";
const headerSortCellClassname = `rdg-header-sort-cell ${headerSortCell}`;
const headerSortName = "h1e6at1o";
const headerSortNameClassname = `rdg-header-sort-name ${headerSortName}`;
function SortableHeaderCell({
  onSort,
  sortDirection,
  priority,
  children
}) {
  let sortText = '';

  if (sortDirection === 'ASC') {
    sortText = '\u25B2';
  } else if (sortDirection === 'DESC') {
    sortText = '\u25BC';
  }

  return /*#__PURE__*/jsxs("span", {
    className: headerSortCellClassname,
    onClick: e => {
      console.log('react-data-grid组件，点击了表头排序');
      onSort(e.ctrlKey);
    },
    children: [/*#__PURE__*/jsx("span", {
      className: headerSortNameClassname,
      children: children
    }), /*#__PURE__*/jsxs("span", {
      children: [sortText, priority]
    })]
  });
}

var css_248z$3 = ".c6l2wv1:after{bottom:0;content:\"\";cursor:col-resize;position:absolute;right:0;top:0;width:10px}";
styleInject(css_248z$3);

const cellResizable = "c6l2wv1";
const cellResizableClassname = `rdg-cell-resizable ${cellResizable}`;
function HeaderCell({
  column,
  colSpan,
  onResize,
  allRowsSelected,
  onAllRowsSelectionChange,
  sortColumns,
  onSortColumnsChange
}) {
  function onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.buttons !== 1) {
      return;
    }

    const {
      currentTarget,
      pointerId
    } = event;
    const {
      right
    } = currentTarget.getBoundingClientRect();
    const offset = right - event.clientX;

    if (offset > 11) {
      return;
    }

    function onPointerMove(event) {
      if (event.pointerId !== pointerId) return;

      if (event.pointerType === 'mouse' && event.buttons !== 1) {
        onPointerUp(event);
        return;
      }

      const width = event.clientX + offset - currentTarget.getBoundingClientRect().left;

      if (width > 0) {
        onResize(column, width);
      }
    }

    function onPointerUp(event) {
      if (event.pointerId !== pointerId) return;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    event.preventDefault();
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  const sortIndex = sortColumns == null ? void 0 : sortColumns.findIndex(sort => sort.columnKey === column.key);
  const sortColumn = sortIndex !== undefined && sortIndex > -1 ? sortColumns[sortIndex] : undefined;
  const sortDirection = sortColumn == null ? void 0 : sortColumn.direction;
  const priority = sortColumn !== undefined && sortColumns.length > 1 ? sortIndex + 1 : undefined;
  const ariaSort = sortDirection && !priority ? sortDirection === 'ASC' ? 'ascending' : 'descending' : undefined;

  const onSort = ctrlClick => {
    if (onSortColumnsChange == null) return;
    const {
      sortDescendingFirst
    } = column;

    if (sortColumn === undefined) {
      const nextSort = {
        columnKey: column.key,
        direction: sortDescendingFirst ? 'DESC' : 'ASC'
      };
      onSortColumnsChange(sortColumns && ctrlClick ? [...sortColumns, nextSort] : [nextSort]);
    } else {
      let nextSortColumn;

      if (sortDescendingFirst && sortDirection === 'DESC' || !sortDescendingFirst && sortDirection === 'ASC') {
        nextSortColumn = {
          columnKey: column.key,
          direction: sortDirection === 'ASC' ? 'DESC' : 'ASC'
        };
      }

      if (ctrlClick) {
        const nextSortColumns = [...sortColumns];

        if (nextSortColumn) {
          nextSortColumns[sortIndex] = nextSortColumn;
        } else {
          nextSortColumns.splice(sortIndex, 1);
        }

        onSortColumnsChange(nextSortColumns);
      } else {
        onSortColumnsChange(nextSortColumn ? [nextSortColumn] : []);
      }
    }
  };

  function getCell() {
    if (column.headerRenderer) {
      return /*#__PURE__*/jsx(column.headerRenderer, {
        column: column,
        sortDirection: sortDirection,
        priority: priority,
        onSort: onSort,
        allRowsSelected: allRowsSelected,
        onAllRowsSelectionChange: onAllRowsSelectionChange
      });
    }

    if (column.sortable) {
      return /*#__PURE__*/jsx(SortableHeaderCell, {
        onSort: onSort,
        sortDirection: sortDirection,
        priority: priority,
        children: column.name
      });
    }

    return column.name;
  }

  const className = getCellClassname(column, column.headerCellClass, column.resizable && cellResizableClassname);
  return /*#__PURE__*/jsx("div", {
    role: "columnheader",
    "aria-colindex": column.idx + 1,
    "aria-sort": ariaSort,
    "aria-colspan": colSpan,
    className: className,
    style: getCellStyle(column, colSpan),
    onPointerDown: column.resizable ? onPointerDown : undefined,
    children: getCell()
  });
}

function HeaderRow({
  columns,
  allRowsSelected,
  onAllRowsSelectionChange,
  onColumnResize,
  sortColumns,
  onSortColumnsChange,
  lastFrozenColumnIndex
}) {
  const cells = [];

  for (let index = 0; index < columns.length; index++) {
    const column = columns[index];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: 'HEADER'
    });

    if (colSpan !== undefined) {
      index += colSpan - 1;
    }

    cells.push( /*#__PURE__*/jsx(HeaderCell, {
      column: column,
      colSpan: colSpan,
      onResize: onColumnResize,
      allRowsSelected: allRowsSelected,
      onAllRowsSelectionChange: onAllRowsSelectionChange,
      onSortColumnsChange: onSortColumnsChange,
      sortColumns: sortColumns
    }, column.key));
  }

  return /*#__PURE__*/jsx("div", {
    role: "row",
    "aria-rowindex": 1,
    className: headerRowClassname,
    children: cells
  });
}

const HeaderRow$1 = /*#__PURE__*/memo(HeaderRow);

var css_248z$2 = ".c6ra8a3,.cq910m0{background-color:#ccf}.cq910m0.c6ra8a3{background-color:#99f}.cjdi1s6{background-color:var(--selection-color);bottom:0;cursor:move;height:8px;position:absolute;right:0;width:8px}.cjdi1s6:hover{background-color:var(--background-color);border:2px solid var(--selection-color);height:16px;width:16px}";
styleInject(css_248z$2);

const cellCopied = "c6ra8a3";
const cellCopiedClassname = `rdg-cell-copied ${cellCopied}`;
const cellDraggedOver = "cq910m0";
const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver}`;
const cellDragHandle = "cjdi1s6";
const cellDragHandleClassname = `rdg-cell-drag-handle ${cellDragHandle}`;

function Cell({
  column,
  colSpan,
  isCellSelected,
  isCopied,
  isDraggedOver,
  row,
  rowIdx,
  dragHandleProps,
  onRowClick,
  onRowChange,
  selectCell,
  ...props
}) {
  const {
    cellClass
  } = column;
  const className = getCellClassname(column, typeof cellClass === 'function' ? cellClass(row) : cellClass, isCopied && cellCopiedClassname, isDraggedOver && cellDraggedOverClassname);

  function selectCellWrapper(openEditor) {
    selectCell({
      idx: column.idx,
      rowIdx
    }, openEditor);
  }

  function handleClick() {
    var _column$editorOptions;

    selectCellWrapper((_column$editorOptions = column.editorOptions) == null ? void 0 : _column$editorOptions.editOnClick);
    onRowClick == null ? void 0 : onRowClick(rowIdx, row, column);
  }

  function handleContextMenu() {
    selectCellWrapper();
  }

  function handleDoubleClick() {
    selectCellWrapper(true);
  }

  function handleRowChange(newRow) {
    onRowChange(rowIdx, newRow);
  }

  return /*#__PURE__*/jsx("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-selected": isCellSelected,
    "aria-colspan": colSpan,
    "aria-readonly": !isCellEditable(column, row) || undefined,
    className: className,
    style: getCellStyle(column, colSpan),
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    onContextMenu: handleContextMenu,
    ...props,
    children: !column.rowGroup && /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx(column.formatter, {
        column: column,
        rowIdx: rowIdx,
        row: row,
        isCellSelected: isCellSelected,
        onRowChange: handleRowChange
      }), dragHandleProps && /*#__PURE__*/jsx("div", {
        className: cellDragHandleClassname,
        ...dragHandleProps
      })]
    })
  });
}

const Cell$1 = /*#__PURE__*/memo(Cell);

var css_248z$1 = ".cis5rrm{padding:0}";
styleInject(css_248z$1);

const cellEditing = "cis5rrm";
const cellEditingClassname = `rdg-editor-container ${cellEditing}`;
function EditCell({
  column,
  colSpan,
  row,
  rowIdx,
  onRowChange,
  onClose,
  onKeyDown,
  editorPortalTarget
}) {
  const frameRequestRef = useRef();
  const commitOnOutsideMouseDown = useLatestFunc(() => {
    onRowChange(row, true);
  });

  function cancelFrameRequest() {
    cancelAnimationFrame(frameRequestRef.current);
  }

  useEffect(() => {
    function onWindowCaptureMouseDown() {
      frameRequestRef.current = requestAnimationFrame(commitOnOutsideMouseDown);
    }

    addEventListener('mousedown', onWindowCaptureMouseDown, {
      capture: true
    });
    return () => {
      removeEventListener('mousedown', onWindowCaptureMouseDown, {
        capture: true
      });
      cancelFrameRequest();
    };
  }, [commitOnOutsideMouseDown]);
  const {
    cellClass
  } = column;
  const className = getCellClassname(column, cellEditingClassname, typeof cellClass === 'function' ? cellClass(row) : cellClass);
  let content;

  if (column.editor != null) {
    var _column$editorOptions;

    content = /*#__PURE__*/jsx(column.editor, {
      column: column,
      row: row,
      rowIdx: rowIdx,
      onRowChange: onRowChange,
      onClose: onClose,
      editorPortalTarget: editorPortalTarget
    });

    if ((_column$editorOptions = column.editorOptions) != null && _column$editorOptions.createPortal) {
      content = /*#__PURE__*/createPortal(content, editorPortalTarget);
    }
  }

  return /*#__PURE__*/jsx("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-selected": true,
    className: className,
    style: getCellStyle(column, colSpan),
    onKeyDown: onKeyDown,
    onMouseDownCapture: cancelFrameRequest,
    children: content
  });
}

function Row({
  className,
  rowIdx,
  isRowSelected,
  copiedCellIdx,
  draggedOverCellIdx,
  lastFrozenColumnIndex,
  row,
  viewportColumns,
  selectedCellProps,
  onRowClick,
  rowClass,
  setDraggedOverRowIdx,
  onMouseEnter,
  top,
  height,
  onRowChange,
  selectCell,
  onMouseInRow,
  onMouseOverRow,
  ...props
}, ref) {
  const [hoverClassName, setClassName] = useState('');

  function handleDragEnter(event) {
    setDraggedOverRowIdx == null ? void 0 : setDraggedOverRowIdx(rowIdx);
    onMouseEnter == null ? void 0 : onMouseEnter(event);
  }

  className = clsx(rowClassname, `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`, rowClass == null ? void 0 : rowClass(row), className, (selectedCellProps == null ? void 0 : selectedCellProps.idx) === -1 && groupRowSelectedClassname);
  const cells = [];

  for (let index = 0; index < viewportColumns.length; index++) {
    const column = viewportColumns[index];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: 'ROW',
      row
    });

    if (colSpan !== undefined) {
      index += colSpan - 1;
    }

    const isCellSelected = (selectedCellProps == null ? void 0 : selectedCellProps.idx) === column.idx;

    if ((selectedCellProps == null ? void 0 : selectedCellProps.mode) === 'EDIT' && isCellSelected) {
      cells.push( /*#__PURE__*/jsx(EditCell, {
        rowIdx: rowIdx,
        column: column,
        colSpan: colSpan,
        onKeyDown: selectedCellProps.onKeyDown,
        ...selectedCellProps.editorProps
      }, column.key));
      continue;
    }

    cells.push( /*#__PURE__*/jsx(Cell$1, {
      rowIdx: rowIdx,
      column: column,
      colSpan: colSpan,
      row: row,
      isCopied: copiedCellIdx === column.idx,
      isDraggedOver: draggedOverCellIdx === column.idx,
      isCellSelected: isCellSelected,
      dragHandleProps: isCellSelected ? selectedCellProps.dragHandleProps : undefined,
      onFocus: isCellSelected ? selectedCellProps.onFocus : undefined,
      onKeyDown: isCellSelected ? selectedCellProps.onKeyDown : undefined,
      onRowClick: onRowClick,
      onRowChange: onRowChange,
      selectCell: selectCell
    }, column.key));
  }

  const onMouseMove = event => {
    event.stopPropagation();
    setClassName('rdg-hover-row');
    onMouseInRow == null ? void 0 : onMouseInRow(rowIdx, row);
  };

  const onMouseOut = event => {
    event.stopPropagation();
    setClassName('');
    onMouseOverRow == null ? void 0 : onMouseOverRow(rowIdx, row);
  };

  return /*#__PURE__*/jsx(RowSelectionProvider, {
    value: isRowSelected,
    children: /*#__PURE__*/jsx("div", {
      role: "row",
      ref: ref,
      className: `${className} ${hoverClassName}`,
      onMouseEnter: handleDragEnter,
      onMouseOut: onMouseOut,
      onMouseOver: onMouseMove,
      style: {
        top,
        '--row-height': `${height}px`
      },
      ...props,
      children: cells
    })
  });
}

const Row$1 = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(Row));

function GroupCell({
  id,
  rowIdx,
  groupKey,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  groupColumnIndex,
  toggleGroup: toggleGroupWrapper
}) {
  function toggleGroup() {
    toggleGroupWrapper(id);
  }

  const isLevelMatching = column.rowGroup && groupColumnIndex === column.idx;
  return /*#__PURE__*/jsx("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    className: getCellClassname(column),
    style: { ...getCellStyle(column),
      cursor: isLevelMatching ? 'pointer' : 'default'
    },
    onClick: isLevelMatching ? toggleGroup : undefined,
    children: (!column.rowGroup || groupColumnIndex === column.idx) && column.groupFormatter && /*#__PURE__*/jsx(column.groupFormatter, {
      rowIdx: rowIdx,
      groupKey: groupKey,
      childRows: childRows,
      column: column,
      isExpanded: isExpanded,
      isCellSelected: isCellSelected,
      toggleGroup: toggleGroup
    })
  }, column.key);
}

const GroupCell$1 = /*#__PURE__*/memo(GroupCell);

function GroupedRow({
  id,
  groupKey,
  viewportColumns,
  childRows,
  rowIdx,
  top,
  height,
  level,
  isExpanded,
  selectedCellIdx,
  isRowSelected,
  selectCell,
  toggleGroup,
  ...props
}) {
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;

  function selectGroup() {
    selectCell({
      rowIdx,
      idx: -1
    });
  }

  return /*#__PURE__*/jsx(RowSelectionProvider, {
    value: isRowSelected,
    children: /*#__PURE__*/jsx("div", {
      role: "row",
      "aria-level": level,
      "aria-expanded": isExpanded,
      className: clsx(rowClassname, groupRowClassname, `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`, selectedCellIdx === -1 && groupRowSelectedClassname),
      onClick: selectGroup,
      style: {
        top,
        '--row-height': `${height}px`
      },
      ...props,
      children: viewportColumns.map(column => /*#__PURE__*/jsx(GroupCell$1, {
        id: id,
        rowIdx: rowIdx,
        groupKey: groupKey,
        childRows: childRows,
        isExpanded: isExpanded,
        isCellSelected: selectedCellIdx === column.idx,
        column: column,
        groupColumnIndex: idx,
        toggleGroup: toggleGroup
      }, column.key))
    })
  });
}

const GroupRowRenderer = /*#__PURE__*/memo(GroupedRow);

function SummaryCell({
  column,
  colSpan,
  row
}) {
  const {
    summaryFormatter: SummaryFormatter,
    summaryCellClass
  } = column;
  const className = getCellClassname(column, typeof summaryCellClass === 'function' ? summaryCellClass(row) : summaryCellClass);
  return /*#__PURE__*/jsx("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-colspan": colSpan,
    className: className,
    style: getCellStyle(column, colSpan),
    children: SummaryFormatter && /*#__PURE__*/jsx(SummaryFormatter, {
      column: column,
      row: row
    })
  });
}

const SummaryCell$1 = /*#__PURE__*/memo(SummaryCell);

function SummaryRow({
  rowIdx,
  row,
  viewportColumns,
  bottom,
  lastFrozenColumnIndex,
  'aria-rowindex': ariaRowIndex
}) {
  const cells = [];

  for (let index = 0; index < viewportColumns.length; index++) {
    const column = viewportColumns[index];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: 'SUMMARY',
      row
    });

    if (colSpan !== undefined) {
      index += colSpan - 1;
    }

    cells.push( /*#__PURE__*/jsx(SummaryCell$1, {
      column: column,
      colSpan: colSpan,
      row: row
    }, column.key));
  }

  return /*#__PURE__*/jsx("div", {
    role: "row",
    "aria-rowindex": ariaRowIndex,
    className: `${rowClassname} rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'} ${summaryRowClassname}`,
    style: {
      bottom
    },
    children: cells
  });
}

const SummaryRow$1 = /*#__PURE__*/memo(SummaryRow);

var _globalThis$document;
const globalThis = window.globalThis || window;
const body = (_globalThis$document = globalThis.document) == null ? void 0 : _globalThis$document.body;
const initialPosition = {
  idx: -1,
  rowIdx: -1,
  mode: 'SELECT'
};

function DataGrid({
  columns: rawColumns,
  rows: rawRows,
  summaryRows,
  rowKeyGetter,
  onRowsChange,
  rowHeight,
  headerRowHeight: rawHeaderRowHeight,
  summaryRowHeight: rawSummaryRowHeight,
  selectedRows,
  onSelectedRowsChange,
  sortColumns,
  onSortColumnsChange,
  defaultColumnOptions,
  groupBy: rawGroupBy,
  rowGrouper,
  expandedGroupIds,
  onExpandedGroupIdsChange,
  rowRenderer,
  emptyRowsRenderer: EmptyRowsRenderer,
  onRowClick,
  onScroll,
  onColumnResize,
  onSelectedCellChange,
  onFill,
  onPaste,
  cellNavigationMode: rawCellNavigationMode,
  enableVirtualization,
  editorPortalTarget: rawEditorPortalTarget,
  className,
  style,
  rowClass,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  onMouseInRow,
  onMouseOverRow
}, ref) {
  var _rowHeight, _enableVirtualization, _summaryRows$length;

  (_rowHeight = rowHeight) != null ? _rowHeight : rowHeight = 35;
  const headerRowHeight = rawHeaderRowHeight != null ? rawHeaderRowHeight : typeof rowHeight === 'number' ? rowHeight : 35;
  const summaryRowHeight = rawSummaryRowHeight != null ? rawSummaryRowHeight : typeof rowHeight === 'number' ? rowHeight : 35;
  const RowRenderer = rowRenderer != null ? rowRenderer : Row$1;
  const cellNavigationMode = rawCellNavigationMode != null ? rawCellNavigationMode : 'NONE';
  (_enableVirtualization = enableVirtualization) != null ? _enableVirtualization : enableVirtualization = true;
  const editorPortalTarget = rawEditorPortalTarget != null ? rawEditorPortalTarget : body;
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [columnWidths, setColumnWidths] = useState(() => new Map());
  const [selectedPosition, setSelectedPosition] = useState(initialPosition);
  const [copiedCell, setCopiedCell] = useState(null);
  const [isDragging, setDragging] = useState(false);
  const [draggedOverRowIdx, setOverRowIdx] = useState(undefined);
  const focusSinkRef = useRef(null);
  const prevSelectedPosition = useRef(selectedPosition);
  const latestDraggedOverRowIdx = useRef(draggedOverRowIdx);
  const lastSelectedRowIdx = useRef(-1);
  const isCellFocusable = useRef(false);
  const selectRowLatest = useLatestFunc(selectRow);
  const selectAllRowsLatest = useLatestFunc(selectAllRows);
  const selectCellLatest = useLatestFunc(selectCell);
  const toggleGroupLatest = useLatestFunc(toggleGroup);
  const handleFormatterRowChangeLatest = useLatestFunc(updateRow);
  const [gridRef, gridWidth, gridHeight] = useGridDimensions();
  const headerRowsCount = 1;
  const summaryRowsCount = (_summaryRows$length = summaryRows == null ? void 0 : summaryRows.length) != null ? _summaryRows$length : 0;
  const clientHeight = gridHeight - headerRowHeight - summaryRowsCount * summaryRowHeight;
  const isSelectable = selectedRows != null && onSelectedRowsChange != null;
  const allRowsSelected = useMemo(() => {
    const {
      length
    } = rawRows;
    return length !== 0 && selectedRows != null && rowKeyGetter != null && selectedRows.size >= length && rawRows.every(row => selectedRows.has(rowKeyGetter(row)));
  }, [rawRows, selectedRows, rowKeyGetter]);
  const {
    columns,
    colSpanColumns,
    colOverscanStartIdx,
    colOverscanEndIdx,
    layoutCssVars,
    columnMetrics,
    totalColumnWidth,
    lastFrozenColumnIndex,
    totalFrozenColumnWidth,
    groupBy
  } = useCalculatedColumns({
    rawColumns,
    columnWidths,
    scrollLeft,
    viewportWidth: gridWidth,
    defaultColumnOptions,
    rawGroupBy: rowGrouper ? rawGroupBy : undefined,
    enableVirtualization
  });
  const {
    rowOverscanStartIdx,
    rowOverscanEndIdx,
    rows,
    rowsCount,
    totalRowHeight,
    isGroupRow,
    getRowTop,
    getRowHeight,
    findRowIdx
  } = useViewportRows({
    rawRows,
    groupBy,
    rowGrouper,
    rowHeight,
    clientHeight,
    scrollTop,
    expandedGroupIds,
    enableVirtualization
  });
  const viewportColumns = useViewportColumns({
    columns,
    colSpanColumns,
    colOverscanStartIdx,
    colOverscanEndIdx,
    lastFrozenColumnIndex,
    rowOverscanStartIdx,
    rowOverscanEndIdx,
    rows,
    summaryRows,
    isGroupRow
  });
  const hasGroups = groupBy.length > 0 && typeof rowGrouper === 'function';
  const minColIdx = hasGroups ? -1 : 0;
  const enableCellDragAndDrop = hasGroups ? false : onFill != null;
  useLayoutEffect(() => {
    if (selectedPosition === prevSelectedPosition.current || selectedPosition.mode === 'EDIT' || !isCellWithinBounds(selectedPosition)) {
      return;
    }

    prevSelectedPosition.current = selectedPosition;
    scrollToCell(selectedPosition);

    if (isCellFocusable.current) {
      isCellFocusable.current = false;
      return;
    }

    focusSinkRef.current.focus({
      preventScroll: true
    });
  });
  useImperativeHandle(ref, () => ({
    element: gridRef.current,

    scrollToColumn(idx) {
      scrollToCell({
        idx
      });
    },

    scrollToRow(rowIdx) {
      const {
        current
      } = gridRef;
      if (!current) return;
      current.scrollTo({
        top: getRowTop(rowIdx),
        behavior: 'smooth'
      });
    },

    selectCell
  }));
  const handleColumnResize = useCallback((column, width) => {
    setColumnWidths(columnWidths => {
      const newColumnWidths = new Map(columnWidths);
      newColumnWidths.set(column.key, width);
      return newColumnWidths;
    });
    onColumnResize == null ? void 0 : onColumnResize(column.idx, width);
  }, [onColumnResize]);
  const setDraggedOverRowIdx = useCallback(rowIdx => {
    setOverRowIdx(rowIdx);
    latestDraggedOverRowIdx.current = rowIdx;
  }, []);

  function selectRow({
    rowIdx,
    checked,
    isShiftClick
  }) {
    if (!onSelectedRowsChange) return;
    assertIsValidKeyGetter(rowKeyGetter);
    const newSelectedRows = new Set(selectedRows);
    const row = rows[rowIdx];

    if (isGroupRow(row)) {
      for (const childRow of row.childRows) {
        const rowKey = rowKeyGetter(childRow);

        if (checked) {
          newSelectedRows.add(rowKey);
        } else {
          newSelectedRows.delete(rowKey);
        }
      }

      onSelectedRowsChange(newSelectedRows);
      return;
    }

    const rowKey = rowKeyGetter(row);

    if (checked) {
      newSelectedRows.add(rowKey);
      const previousRowIdx = lastSelectedRowIdx.current;
      lastSelectedRowIdx.current = rowIdx;

      if (isShiftClick && previousRowIdx !== -1 && previousRowIdx !== rowIdx) {
        const step = sign(rowIdx - previousRowIdx);

        for (let i = previousRowIdx + step; i !== rowIdx; i += step) {
          const row = rows[i];
          if (isGroupRow(row)) continue;
          newSelectedRows.add(rowKeyGetter(row));
        }
      }
    } else {
      newSelectedRows.delete(rowKey);
      lastSelectedRowIdx.current = -1;
    }

    onSelectedRowsChange(newSelectedRows);
  }

  function selectAllRows(checked) {
    if (!onSelectedRowsChange) return;
    assertIsValidKeyGetter(rowKeyGetter);
    const newSelectedRows = new Set(selectedRows);

    for (const row of rawRows) {
      const rowKey = rowKeyGetter(row);

      if (checked) {
        newSelectedRows.add(rowKey);
      } else {
        newSelectedRows.delete(rowKey);
      }
    }

    onSelectedRowsChange(newSelectedRows);
  }

  function toggleGroup(expandedGroupId) {
    if (!onExpandedGroupIdsChange) return;
    const newExpandedGroupIds = new Set(expandedGroupIds);

    if (newExpandedGroupIds.has(expandedGroupId)) {
      newExpandedGroupIds.delete(expandedGroupId);
    } else {
      newExpandedGroupIds.add(expandedGroupId);
    }

    onExpandedGroupIdsChange(newExpandedGroupIds);
  }

  function onGridFocus() {
    if (!isCellWithinBounds(selectedPosition)) {
      const initialPosition = {
        idx: 0,
        rowIdx: 0,
        mode: 'SELECT'
      };

      if (isCellWithinBounds(initialPosition)) {
        setSelectedPosition(initialPosition);
      }
    } else {
      scrollToCell(selectedPosition);
    }
  }

  function handleKeyDown(event) {
    const {
      key,
      keyCode
    } = event;
    const row = rows[selectedPosition.rowIdx];

    if (onPaste && isCtrlKeyHeldDown(event) && isCellWithinBounds(selectedPosition) && !isGroupRow(row) && selectedPosition.idx !== -1 && selectedPosition.mode === 'SELECT') {
      const cKey = 67;
      const vKey = 86;

      if (keyCode === cKey) {
        handleCopy();
        return;
      }

      if (keyCode === vKey) {
        handlePaste();
        return;
      }
    }

    if (isCellWithinBounds(selectedPosition) && isGroupRow(row) && selectedPosition.idx === -1 && (key === 'ArrowLeft' && row.isExpanded || key === 'ArrowRight' && !row.isExpanded)) {
      event.preventDefault();
      toggleGroup(row.id);
      return;
    }

    switch (event.key) {
      case 'Escape':
        setCopiedCell(null);
        closeEditor();
        return;

      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Tab':
      case 'Home':
      case 'End':
      case 'PageUp':
      case 'PageDown':
        navigate(event);
        break;

      default:
        handleCellInput(event);
        break;
    }
  }

  function handleFocus() {
    isCellFocusable.current = true;
  }

  function handleScroll(event) {
    const {
      scrollTop,
      scrollLeft
    } = event.currentTarget;
    setScrollTop(scrollTop);
    setScrollLeft(scrollLeft);
    onScroll == null ? void 0 : onScroll(event);
  }

  function getRawRowIdx(rowIdx) {
    return hasGroups ? rawRows.indexOf(rows[rowIdx]) : rowIdx;
  }

  function updateRow(rowIdx, row) {
    if (typeof onRowsChange !== 'function') return;
    if (row === rawRows[rowIdx]) return;
    const updatedRows = [...rawRows];
    updatedRows[rowIdx] = row;
    onRowsChange(updatedRows, {
      indexes: [rowIdx],
      column: columns[selectedPosition.idx]
    });
  }

  function commitEditorChanges() {
    var _columns$selectedPosi;

    if (((_columns$selectedPosi = columns[selectedPosition.idx]) == null ? void 0 : _columns$selectedPosi.editor) == null || selectedPosition.mode === 'SELECT' || selectedPosition.row === selectedPosition.originalRow) {
      return;
    }

    const rowIdx = getRawRowIdx(selectedPosition.rowIdx);
    updateRow(rowIdx, selectedPosition.row);
  }

  function handleCopy() {
    const {
      idx,
      rowIdx
    } = selectedPosition;
    setCopiedCell({
      row: rawRows[getRawRowIdx(rowIdx)],
      columnKey: columns[idx].key
    });
  }

  function handlePaste() {
    const {
      idx,
      rowIdx
    } = selectedPosition;
    const targetRow = rawRows[getRawRowIdx(rowIdx)];

    if (!onPaste || !onRowsChange || copiedCell === null || !isCellEditable(selectedPosition)) {
      return;
    }

    const updatedTargetRow = onPaste({
      sourceRow: copiedCell.row,
      sourceColumnKey: copiedCell.columnKey,
      targetRow,
      targetColumnKey: columns[idx].key
    });
    updateRow(rowIdx, updatedTargetRow);
  }

  function handleCellInput(event) {
    var _column$editorOptions;

    if (!isCellWithinBounds(selectedPosition)) return;
    const row = rows[selectedPosition.rowIdx];
    if (isGroupRow(row)) return;
    const {
      key
    } = event;
    const column = columns[selectedPosition.idx];

    if (selectedPosition.mode === 'EDIT') {
      if (key === 'Enter') {
        commitEditorChanges();
        closeEditor();
      }

      return;
    }

    (_column$editorOptions = column.editorOptions) == null ? void 0 : _column$editorOptions.onCellKeyDown == null ? void 0 : _column$editorOptions.onCellKeyDown(event);
    if (event.isDefaultPrevented()) return;

    if (isCellEditable(selectedPosition) && isDefaultCellInput(event)) {
      setSelectedPosition(({
        idx,
        rowIdx
      }) => ({
        idx,
        rowIdx,
        key,
        mode: 'EDIT',
        row,
        originalRow: row
      }));
    }
  }

  function handleDragEnd() {
    const overRowIdx = latestDraggedOverRowIdx.current;
    if (overRowIdx === undefined || !onFill || !onRowsChange) return;
    const {
      idx,
      rowIdx
    } = selectedPosition;
    const sourceRow = rawRows[rowIdx];
    const startRowIndex = rowIdx < overRowIdx ? rowIdx + 1 : overRowIdx;
    const endRowIndex = rowIdx < overRowIdx ? overRowIdx + 1 : rowIdx;
    const targetRows = rawRows.slice(startRowIndex, endRowIndex);
    const column = columns[idx];
    const updatedTargetRows = onFill({
      columnKey: column.key,
      sourceRow,
      targetRows
    });
    const updatedRows = [...rawRows];
    const indexes = [];

    for (let i = startRowIndex; i < endRowIndex; i++) {
      const targetRowIdx = i - startRowIndex;

      if (updatedRows[i] !== updatedTargetRows[targetRowIdx]) {
        updatedRows[i] = updatedTargetRows[targetRowIdx];
        indexes.push(i);
      }
    }

    if (indexes.length > 0) {
      onRowsChange(updatedRows, {
        indexes,
        column
      });
    }

    setDraggedOverRowIdx(undefined);
  }

  function handleMouseDown(event) {
    if (event.buttons !== 1) return;
    setDragging(true);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseup', onMouseUp);

    function onMouseOver(event) {
      if (event.buttons !== 1) onMouseUp();
    }

    function onMouseUp() {
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseup', onMouseUp);
      setDragging(false);
      handleDragEnd();
    }
  }

  function handleDoubleClick(event) {
    event.stopPropagation();
    if (!onFill || !onRowsChange) return;
    const {
      idx,
      rowIdx
    } = selectedPosition;
    const sourceRow = rawRows[rowIdx];
    const targetRows = rawRows.slice(rowIdx + 1);
    const column = columns[idx];
    const updatedTargetRows = onFill({
      columnKey: column.key,
      sourceRow,
      targetRows
    });
    const updatedRows = [...rawRows];
    const indexes = [];

    for (let i = rowIdx + 1; i < updatedRows.length; i++) {
      const targetRowIdx = i - rowIdx - 1;

      if (updatedRows[i] !== updatedTargetRows[targetRowIdx]) {
        updatedRows[i] = updatedTargetRows[targetRowIdx];
        indexes.push(i);
      }
    }

    if (indexes.length > 0) {
      onRowsChange(updatedRows, {
        indexes,
        column
      });
    }
  }

  function handleEditorRowChange(row, commitChanges) {
    if (selectedPosition.mode === 'SELECT') return;

    if (commitChanges) {
      updateRow(getRawRowIdx(selectedPosition.rowIdx), row);
      closeEditor();
    } else {
      setSelectedPosition(position => ({ ...position,
        row
      }));
    }
  }

  function handleOnClose(commitChanges) {
    if (commitChanges) {
      commitEditorChanges();
    }

    closeEditor();
  }

  function isCellWithinBounds({
    idx,
    rowIdx
  }) {
    return rowIdx >= 0 && rowIdx < rows.length && idx >= minColIdx && idx < columns.length;
  }

  function isCellEditable(position) {
    return isCellWithinBounds(position) && isSelectedCellEditable({
      columns,
      rows,
      selectedPosition: position,
      isGroupRow
    });
  }

  function selectCell(position, enableEditor) {
    if (!isCellWithinBounds(position)) return;
    commitEditorChanges();

    if (enableEditor && isCellEditable(position)) {
      const row = rows[position.rowIdx];
      setSelectedPosition({ ...position,
        mode: 'EDIT',
        key: null,
        row,
        originalRow: row
      });
    } else {
      setSelectedPosition({ ...position,
        mode: 'SELECT'
      });
    }

    onSelectedCellChange == null ? void 0 : onSelectedCellChange({ ...position
    });
  }

  function closeEditor() {
    if (selectedPosition.mode === 'SELECT') return;
    setSelectedPosition(({
      idx,
      rowIdx
    }) => ({
      idx,
      rowIdx,
      mode: 'SELECT'
    }));
  }

  function scrollToCell({
    idx,
    rowIdx
  }) {
    const {
      current
    } = gridRef;
    if (!current) return;

    if (typeof idx === 'number' && idx > lastFrozenColumnIndex) {
      var _rowIdx;

      (_rowIdx = rowIdx) != null ? _rowIdx : rowIdx = selectedPosition.rowIdx;
      if (!isCellWithinBounds({
        rowIdx,
        idx
      })) return;
      const {
        clientWidth
      } = current;
      const column = columns[idx];
      const {
        left,
        width
      } = columnMetrics.get(column);
      let right = left + width;
      const row = rows[rowIdx];

      if (!isGroupRow(row)) {
        const colSpan = getColSpan(column, lastFrozenColumnIndex, {
          type: 'ROW',
          row
        });

        if (colSpan !== undefined) {
          const {
            left,
            width
          } = columnMetrics.get(columns[column.idx + colSpan - 1]);
          right = left + width;
        }
      }

      const isCellAtLeftBoundary = left < scrollLeft + totalFrozenColumnWidth;
      const isCellAtRightBoundary = right > clientWidth + scrollLeft;

      if (isCellAtLeftBoundary) {
        current.scrollLeft = left - totalFrozenColumnWidth;
      } else if (isCellAtRightBoundary) {
        current.scrollLeft = right - clientWidth;
      }
    }

    if (typeof rowIdx === 'number') {
      const rowTop = getRowTop(rowIdx);
      const rowHeight = getRowHeight(rowIdx);

      if (rowTop < scrollTop) {
        current.scrollTop = rowTop;
      } else if (rowTop + rowHeight > scrollTop + clientHeight) {
        current.scrollTop = rowTop + rowHeight - clientHeight;
      }
    }
  }

  function getNextPosition(key, ctrlKey, shiftKey) {
    const {
      idx,
      rowIdx
    } = selectedPosition;
    const row = rows[rowIdx];
    const isRowSelected = isCellWithinBounds(selectedPosition) && idx === -1;

    if (key === 'ArrowLeft' && isRowSelected && isGroupRow(row) && !row.isExpanded && row.level !== 0) {
      let parentRowIdx = -1;

      for (let i = selectedPosition.rowIdx - 1; i >= 0; i--) {
        const parentRow = rows[i];

        if (isGroupRow(parentRow) && parentRow.id === row.parentId) {
          parentRowIdx = i;
          break;
        }
      }

      if (parentRowIdx !== -1) {
        return {
          idx,
          rowIdx: parentRowIdx
        };
      }
    }

    switch (key) {
      case 'ArrowUp':
        return {
          idx,
          rowIdx: rowIdx - 1
        };

      case 'ArrowDown':
        return {
          idx,
          rowIdx: rowIdx + 1
        };

      case 'ArrowLeft':
        return {
          idx: idx - 1,
          rowIdx
        };

      case 'ArrowRight':
        return {
          idx: idx + 1,
          rowIdx
        };

      case 'Tab':
        if (selectedPosition.idx === -1 && selectedPosition.rowIdx === -1) {
          return shiftKey ? {
            idx: columns.length - 1,
            rowIdx: rows.length - 1
          } : {
            idx: 0,
            rowIdx: 0
          };
        }

        return {
          idx: idx + (shiftKey ? -1 : 1),
          rowIdx
        };

      case 'Home':
        if (isRowSelected) return {
          idx,
          rowIdx: 0
        };
        return ctrlKey ? {
          idx: 0,
          rowIdx: 0
        } : {
          idx: 0,
          rowIdx
        };

      case 'End':
        if (isRowSelected) return {
          idx,
          rowIdx: rows.length - 1
        };
        return ctrlKey ? {
          idx: columns.length - 1,
          rowIdx: rows.length - 1
        } : {
          idx: columns.length - 1,
          rowIdx
        };

      case 'PageUp':
        {
          const nextRowY = getRowTop(rowIdx) + getRowHeight(rowIdx) - clientHeight;
          return {
            idx,
            rowIdx: nextRowY > 0 ? findRowIdx(nextRowY) : 0
          };
        }

      case 'PageDown':
        {
          const nextRowY = getRowTop(rowIdx) + clientHeight;
          return {
            idx,
            rowIdx: nextRowY < totalRowHeight ? findRowIdx(nextRowY) : rows.length - 1
          };
        }

      default:
        return selectedPosition;
    }
  }

  function navigate(event) {
    if (selectedPosition.mode === 'EDIT') {
      var _columns$selectedPosi2, _columns$selectedPosi3;

      const onNavigation = (_columns$selectedPosi2 = (_columns$selectedPosi3 = columns[selectedPosition.idx].editorOptions) == null ? void 0 : _columns$selectedPosi3.onNavigation) != null ? _columns$selectedPosi2 : onEditorNavigation;
      if (!onNavigation(event)) return;
    }

    const {
      key,
      shiftKey
    } = event;
    let mode = cellNavigationMode;

    if (key === 'Tab') {
      if (canExitGrid({
        shiftKey,
        cellNavigationMode,
        columns,
        rowsCount: rows.length,
        selectedPosition
      })) {
        commitEditorChanges();
        return;
      }

      mode = cellNavigationMode === 'NONE' ? 'CHANGE_ROW' : cellNavigationMode;
    }

    event.preventDefault();
    const ctrlKey = isCtrlKeyHeldDown(event);
    const nextPosition = getNextSelectedCellPosition({
      columns,
      colSpanColumns,
      rows,
      lastFrozenColumnIndex,
      cellNavigationMode: mode,
      currentPosition: selectedPosition,
      nextPosition: getNextPosition(key, ctrlKey, shiftKey),
      isCellWithinBounds,
      isGroupRow
    });
    selectCell(nextPosition);
  }

  function getDraggedOverCellIdx(currentRowIdx) {
    if (draggedOverRowIdx === undefined) return;
    const {
      rowIdx
    } = selectedPosition;
    const isDraggedOver = rowIdx < draggedOverRowIdx ? rowIdx < currentRowIdx && currentRowIdx <= draggedOverRowIdx : rowIdx > currentRowIdx && currentRowIdx >= draggedOverRowIdx;
    return isDraggedOver ? selectedPosition.idx : undefined;
  }

  function getSelectedCellProps(rowIdx) {
    if (selectedPosition.rowIdx !== rowIdx) return;

    if (selectedPosition.mode === 'EDIT') {
      return {
        mode: 'EDIT',
        idx: selectedPosition.idx,
        onKeyDown: handleKeyDown,
        editorProps: {
          editorPortalTarget,
          row: selectedPosition.row,
          onRowChange: handleEditorRowChange,
          onClose: handleOnClose
        }
      };
    }

    return {
      mode: 'SELECT',
      idx: selectedPosition.idx,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      dragHandleProps: enableCellDragAndDrop && isCellEditable(selectedPosition) ? {
        onMouseDown: handleMouseDown,
        onDoubleClick: handleDoubleClick
      } : undefined
    };
  }

  function getViewportRows() {
    const rowElements = [];
    let startRowIndex = 0;

    for (let rowIdx = rowOverscanStartIdx; rowIdx <= rowOverscanEndIdx; rowIdx++) {
      const row = rows[rowIdx];
      const top = getRowTop(rowIdx) + headerRowHeight;

      if (isGroupRow(row)) {
        ({
          startRowIndex
        } = row);
        const isGroupRowSelected = isSelectable && row.childRows.every(cr => selectedRows == null ? void 0 : selectedRows.has(rowKeyGetter(cr)));
        rowElements.push( /*#__PURE__*/jsx(GroupRowRenderer, {
          "aria-level": row.level + 1,
          "aria-setsize": row.setSize,
          "aria-posinset": row.posInSet + 1,
          "aria-rowindex": headerRowsCount + startRowIndex + 1,
          "aria-selected": isSelectable ? isGroupRowSelected : undefined,
          id: row.id,
          groupKey: row.groupKey,
          viewportColumns: viewportColumns,
          childRows: row.childRows,
          rowIdx: rowIdx,
          top: top,
          height: getRowHeight(rowIdx),
          level: row.level,
          isExpanded: row.isExpanded,
          selectedCellIdx: selectedPosition.rowIdx === rowIdx ? selectedPosition.idx : undefined,
          isRowSelected: isGroupRowSelected,
          onFocus: selectedPosition.rowIdx === rowIdx ? handleFocus : undefined,
          onKeyDown: selectedPosition.rowIdx === rowIdx ? handleKeyDown : undefined,
          selectCell: selectCellLatest,
          toggleGroup: toggleGroupLatest
        }, row.id));
        continue;
      }

      startRowIndex++;
      let key;
      let isRowSelected = false;

      if (typeof rowKeyGetter === 'function') {
        var _selectedRows$has;

        key = rowKeyGetter(row);
        isRowSelected = (_selectedRows$has = selectedRows == null ? void 0 : selectedRows.has(key)) != null ? _selectedRows$has : false;
      } else {
        key = hasGroups ? startRowIndex : rowIdx;
      }

      rowElements.push( /*#__PURE__*/jsx(RowRenderer, {
        "aria-rowindex": headerRowsCount + (hasGroups ? startRowIndex : rowIdx) + 1,
        "aria-selected": isSelectable ? isRowSelected : undefined,
        rowIdx: rowIdx,
        row: row,
        onMouseInRow: onMouseInRow,
        onMouseOverRow: onMouseOverRow,
        viewportColumns: viewportColumns,
        isRowSelected: isRowSelected,
        onRowClick: onRowClick,
        rowClass: rowClass,
        top: top,
        height: getRowHeight(rowIdx),
        copiedCellIdx: copiedCell !== null && copiedCell.row === row ? columns.findIndex(c => c.key === copiedCell.columnKey) : undefined,
        draggedOverCellIdx: getDraggedOverCellIdx(rowIdx),
        setDraggedOverRowIdx: isDragging ? setDraggedOverRowIdx : undefined,
        lastFrozenColumnIndex: lastFrozenColumnIndex,
        selectedCellProps: getSelectedCellProps(rowIdx),
        onRowChange: handleFormatterRowChangeLatest,
        selectCell: selectCellLatest
      }, key));
    }

    return rowElements;
  }

  if (selectedPosition.idx >= columns.length || selectedPosition.rowIdx >= rows.length) {
    setSelectedPosition(initialPosition);
    setDraggedOverRowIdx(undefined);
  }

  if (selectedPosition.mode === 'EDIT' && rows[selectedPosition.rowIdx] !== selectedPosition.originalRow) {
    closeEditor();
  }

  return /*#__PURE__*/jsxs("div", {
    role: hasGroups ? 'treegrid' : 'grid',
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-multiselectable": isSelectable ? true : undefined,
    "aria-colcount": columns.length,
    "aria-rowcount": headerRowsCount + rowsCount + summaryRowsCount,
    className: clsx(rootClassname, className, isDragging && viewportDraggingClassname),
    style: { ...style,
      '--header-row-height': `${headerRowHeight}px`,
      '--row-width': `${totalColumnWidth}px`,
      '--summary-row-height': `${summaryRowHeight}px`,
      ...layoutCssVars
    },
    ref: gridRef,
    onScroll: handleScroll,
    children: [/*#__PURE__*/jsx(HeaderRow$1, {
      columns: viewportColumns,
      onColumnResize: handleColumnResize,
      allRowsSelected: allRowsSelected,
      onAllRowsSelectionChange: selectAllRowsLatest,
      sortColumns: sortColumns,
      onSortColumnsChange: onSortColumnsChange,
      lastFrozenColumnIndex: lastFrozenColumnIndex
    }), rows.length === 0 && EmptyRowsRenderer ? /*#__PURE__*/jsx(EmptyRowsRenderer, {}) : /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx("div", {
        ref: focusSinkRef,
        tabIndex: 0,
        className: focusSinkClassname,
        onKeyDown: handleKeyDown,
        onFocus: onGridFocus
      }), /*#__PURE__*/jsx("div", {
        style: {
          height: max(totalRowHeight, clientHeight)
        }
      }), /*#__PURE__*/jsx(RowSelectionChangeProvider, {
        value: selectRowLatest,
        children: getViewportRows()
      }), summaryRows == null ? void 0 : summaryRows.map((row, rowIdx) => /*#__PURE__*/jsx(SummaryRow$1, {
        "aria-rowindex": headerRowsCount + rowsCount + rowIdx + 1,
        rowIdx: rowIdx,
        row: row,
        bottom: summaryRowHeight * (summaryRows.length - 1 - rowIdx),
        viewportColumns: viewportColumns,
        lastFrozenColumnIndex: lastFrozenColumnIndex
      }, rowIdx))]
    })]
  });
}

const DataGrid$1 = /*#__PURE__*/forwardRef(DataGrid);

var css_248z = ".t1u15qzo{appearance:none;background-color:var(--background-color);border:2px solid #ccc;box-sizing:border-box;color:var(--color);font-family:inherit;font-size:var(--font-size);height:100%;padding:0 6px;vertical-align:top;width:100%}.t1u15qzo:focus{border-color:var(--selection-color);outline:none}.t1u15qzo::placeholder{color:#999;opacity:1}";
styleInject(css_248z);

const textEditor = "t1u15qzo";
const textEditorClassname = `rdg-text-editor ${textEditor}`;

function autoFocusAndSelect(input) {
  input == null ? void 0 : input.focus();
  input == null ? void 0 : input.select();
}

function TextEditor({
  row,
  column,
  onRowChange,
  onClose
}) {
  return /*#__PURE__*/jsx("input", {
    className: textEditorClassname,
    ref: autoFocusAndSelect,
    value: row[column.key],
    onChange: event => onRowChange({ ...row,
      [column.key]: event.target.value
    }),
    onBlur: () => onClose(true)
  });
}

export { Row$1 as Row, SELECT_COLUMN_KEY, SelectCellFormatter, SelectColumn, SortableHeaderCell, TextEditor, ToggleGroupFormatter, ValueFormatter, DataGrid$1 as default, useRowSelection };
//# sourceMappingURL=bundle.js.map
