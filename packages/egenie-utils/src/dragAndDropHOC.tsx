import React, { useRef } from 'react';
import { DndProvider, createDndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const DragAndDropHOC: React.FC = (props) => {
  const RNDContext = React.useMemo(() => createDndContext(HTML5Backend), []);
  const manager = useRef(RNDContext);
  return (
    <DndProvider manager={manager.current.dragDropManager}>
      {props.children}
    </DndProvider>
  );
};
