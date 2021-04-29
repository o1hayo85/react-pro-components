import React from 'react';
import { SortableHeaderCell } from 'react-data-grid';
import type { HeaderRendererProps } from 'react-data-grid';
import { useDrag, useDrop } from 'react-dnd';
import type { DragObjectWithType } from 'react-dnd';

import { useCombinedRefs } from './useCombinedRefs';

interface ColumnDragObject extends DragObjectWithType {
  key: string;
}

interface DraggableHeaderRendererProps<R> extends HeaderRendererProps<R> {
  onColumnsReorder: (sourceKey: string, targetKey: string) => void;
}

export function DraggableHeaderRenderer<R>({ onColumnsReorder, column, sortColumn, sortDirection, onSort }: DraggableHeaderRendererProps<R>) {
  const [
    { isDragging },
    drag,
  ] = useDrag({
    item: {
      key: column.key,
      type: 'COLUMN_DRAG',
    },
    collect: (monitor) => ({ isDragging: Boolean(monitor.isDragging()) }),
  });

  const [
    { isOver },
    drop,
  ] = useDrop({
    accept: 'COLUMN_DRAG',
    drop({ key, type }: ColumnDragObject) {
      if (type === 'COLUMN_DRAG') {
        onColumnsReorder(key, column.key);
      }
    },
    collect: (monitor) => ({
      isOver: Boolean(monitor.isOver()),
      canDrop: Boolean(monitor.canDrop()),
    }),
  });

  return (
    <div
      ref={useCombinedRefs(drag, drop)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? '#ececec' : 'inherit',
        cursor: 'move',
      }}
    >
      {column.sortable ? (
        <SortableHeaderCell
          column={column}
          onSort={onSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        >
          {column.name}
        </SortableHeaderCell>
      ) : column.name}
    </div>
  );
}
