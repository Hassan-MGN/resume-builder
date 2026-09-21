import React, {createContext, useCallback, useContext, useEffect, useRef, useState,} from "react";
import {DndContext, DragOverlay, PointerSensor, closestCorners, pointerWithin, useSensor, useSensors, useDroppable,} from "@dnd-kit/core";
import {SortableContext, arrayMove, verticalListSortingStrategy,} from "@dnd-kit/sortable";


const TwoColumnCtx = createContext(null);

const collisionDetectionStrategy = (args) => {
  const pointerHits = pointerWithin(args);
  return pointerHits.length ? pointerHits : closestCorners(args);
};

export const useTwoColumnLayout = () => useContext(TwoColumnCtx);

export const ColumnZone = ({ columnId, children, className, style }) => {
  const ctx = useContext(TwoColumnCtx);
  const { setNodeRef, isOver } = useDroppable({ id: `droppable-${columnId}` });
  const items = ctx?.columns[columnId] ?? [];
  const otherCol = columnId === "left" ? "right" : "left";
  const activeIsFromOtherCol = ctx?.activeId && (ctx.columns[otherCol] ?? []).includes(ctx.activeId);
  const showHighlight = isOver && activeIsFromOtherCol && !ctx?.isExporting;
  const showEmptyTarget = !!ctx?.activeId && items.length === 0 && !ctx?.isExporting;

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div ref={ctx ? setNodeRef : undefined} className={`${className ?? ""} min-h-[40px] transition-colors duration-150 ${showHighlight ? "ring-2 ring-inset ring-cyan-400/50 bg-cyan-50/20" : ""}`} style={style}>
        {showEmptyTarget && (
          <div data-pdf-ignore="true" className={`my-3 mx-1 rounded border-2 border-dashed py-8 text-center text-xs font-medium transition-colors select-none ${ isOver ? "border-cyan-400 bg-cyan-50 text-cyan-600" : "border-gray-200 text-gray-300"}`}> Drop section here</div>)}{children}</div>
    </SortableContext>
  );
};

const TwoColumnDndContext = ({leftItems,rightItems,onColumnsChange,isExporting = false,children,}) => {
  const [columns, setColumnsState] = useState({left: leftItems ?? [],right: rightItems ?? [],});
  const columnsRef = useRef(columns);
  const [activeId, setActiveId] = useState(null);
  const dragStartSnapshotRef = useRef(null);
  const dragOverRafRef = useRef(null);
  const lastDragOverRef = useRef(null);
  const setColumns = useCallback((updater) => {
    setColumnsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      columnsRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    setColumnsState((prev) => {
      const nextLeft = leftItems ?? [];
      const nextRight = rightItems ?? [];
      const leftSame = prev.left.length === nextLeft.length && prev.left.every((val, i) => val === nextLeft[i]);
      const rightSame = prev.right.length === nextRight.length && prev.right.every((val, i) => val === nextRight[i]);
      if (leftSame && rightSame) {
        return prev;
      }
      
      const next = { left: nextLeft, right: nextRight };
      columnsRef.current = next;
      return next;
    });
  }, [leftItems, rightItems]);

  const findColumn = useCallback((id) => {
    if (columnsRef.current.left.includes(id)) return "left";
    if (columnsRef.current.right.includes(id)) return "right";
    return null;
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback(({ active }) => {
    setActiveId(active.id);
    dragStartSnapshotRef.current = {left: [...columnsRef.current.left], right: [...columnsRef.current.right],};
  }, []);

  const handleDragOver = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return;

    // Store latest args and batch via rAF to avoid jitter from rapid pointer events
    lastDragOverRef.current = { active, over };
    if (dragOverRafRef.current) return;
    dragOverRafRef.current = requestAnimationFrame(() => {
      dragOverRafRef.current = null;
      const args = lastDragOverRef.current;
      if (!args) return;
      const { active: act, over: ov } = args;

      const activeCol = findColumn(act.id);
      const overCol =
        findColumn(ov.id) ?? (ov.id === "droppable-left" ? "left" : ov.id === "droppable-right" ? "right" : null);
      if (!activeCol || !overCol) return;
      if (activeCol === overCol) {
        const items = columnsRef.current[activeCol];
        const oldIdx = items.indexOf(act.id);
        const newIdx = items.indexOf(ov.id);
        if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
          setColumns((prev) => ({ ...prev, [activeCol]: arrayMove([...prev[activeCol]], oldIdx, newIdx) }));
        }
        return;
      }

      setColumns((prev) => {
        const src = prev[activeCol].filter((id) => id !== act.id);
        const dst = [...prev[overCol]];
        const overItemIdx = dst.indexOf(ov.id);
        const insertAt = overItemIdx >= 0 ? overItemIdx : dst.length;
        dst.splice(insertAt, 0, act.id);
        return { ...prev, [activeCol]: src, [overCol]: dst };
      });
    });
  }, [findColumn, setColumns]);

  const handleDragEnd = useCallback(() => {
    if (dragOverRafRef.current) { cancelAnimationFrame(dragOverRafRef.current); dragOverRafRef.current = null; }
    setActiveId(null);
    if (typeof onColumnsChange === "function") {onColumnsChange(columnsRef.current.left, columnsRef.current.right);}
  }, [onColumnsChange]);

  const handleDragCancel = useCallback(() => {
    if (dragOverRafRef.current) { cancelAnimationFrame(dragOverRafRef.current); dragOverRafRef.current = null; }
    setActiveId(null);
    if (dragStartSnapshotRef.current) {
      setColumns(dragStartSnapshotRef.current);
    }
  }, [setColumns]);

  const ctxValue = React.useMemo(() => ({columns, activeId, isExporting,}), [columns, activeId, isExporting]);
  return (
    <TwoColumnCtx.Provider value={ctxValue}>
      <DndContext sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel} autoScroll={false}>
        {children}
        {!isExporting && (<DragOverlay dropAnimation={null}>{activeId ? (<div data-pdf-ignore="true" className="px-3 py-1.5 bg-white border border-cyan-400 rounded shadow-xl text-xs font-semibold text-cyan-700 opacity-90 select-none cursor-grabbing">⠿ {activeId.charAt(0).toUpperCase() + activeId.slice(1)}</div>) : null}</DragOverlay>)}
      </DndContext>
    </TwoColumnCtx.Provider>
  );
};

export default TwoColumnDndContext;
