import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const DndLayoutCtx = createContext(null);

export const useMultiContainerLayout = () => useContext(DndLayoutCtx);
export const useTwoColumnLayout = () => useContext(DndLayoutCtx); // Alias for backwards compatibility

const customCollisionDetection = (args) => {
  const pointerIntersections = pointerWithin(args);
  const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args);
  let overId = getFirstCollision(intersections, "id");
  
  if (overId != null) {
    return [{ id: overId }];
  }
  return closestCenter(args);
};

export const ColumnZone = ({ columnId, children, className, style }) => {
  const ctx = useContext(DndLayoutCtx);
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  
  // Use the layout context to figure out the items in this column
  // Fallback to legacy context keys if needed, but MultiContainer is dict-based.
  const items = ctx?.containers?.[columnId] ?? ctx?.columns?.[columnId] ?? [];
  
  const activeContainer = ctx?.activeId && ctx.findContainer ? ctx.findContainer(ctx.activeId) : null;
  const activeIsFromOtherCol = activeContainer && activeContainer !== columnId;
  const showHighlight = isOver && activeIsFromOtherCol && !ctx?.isExporting;
  const showEmptyTarget = !!ctx?.activeId && items.length === 0 && !ctx?.isExporting;

  return (
    <SortableContext id={columnId} items={items} strategy={verticalListSortingStrategy}>
      <div 
        ref={ctx ? setNodeRef : undefined} 
        className={`${className ?? ""} min-h-[40px] transition-colors duration-150 ${showHighlight ? "ring-2 ring-inset ring-cyan-400/50 bg-cyan-50/20" : ""}`} 
        style={style}
      >
        {showEmptyTarget && (
          <div data-pdf-ignore="true" className={`my-3 mx-1 rounded border-2 border-dashed py-8 text-center text-xs font-medium transition-colors select-none ${ isOver ? "border-cyan-400 bg-cyan-50 text-cyan-600" : "border-gray-200 text-gray-300"}`}> Drop section here</div>
        )}
        {children}
      </div>
    </SortableContext>
  );
};

const MultiContainerDndContext = ({
  initialContainers,
  onContainersChange,
  isExporting = false,
  children,
}) => {
  const [containers, setContainersState] = useState(initialContainers ?? {});
  const containersRef = useRef(containers);
  const [activeId, setActiveId] = useState(null);
  const dragStartSnapshotRef = useRef(null);

  const setContainers = useCallback((updater) => {
    setContainersState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      containersRef.current = next;
      return next;
    });
  }, []);

  const prevInitialContainersRef = useRef(null);

  useEffect(() => {
    // Sync from initialContainers only when the actual VALUES change.
    // initialContainers is created as a new object literal on every render of
    // Preview.jsx, so we cannot use it as a dep-array value (would fire every
    // render). Instead we run this effect every render but guard with a
    // JSON.stringify comparison — O(n) per render but zero spurious state updates.
    const nextStr = JSON.stringify(initialContainers);
    if (prevInitialContainersRef.current !== nextStr) {
      prevInitialContainersRef.current = nextStr;
      if (initialContainers) {
        setContainers(initialContainers);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const findContainer = useCallback((id) => {
    if (id in containersRef.current) return id;
    for (const [key, items] of Object.entries(containersRef.current)) {
      if (items.includes(id)) return key;
    }
    return null;
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback(({ active }) => {
    setActiveId(active.id);
    dragStartSnapshotRef.current = JSON.parse(JSON.stringify(containersRef.current));
  }, []);

  const handleDragOver = useCallback(({ active, over }) => {
    const overId = over?.id;
    if (!overId || active.id === overId) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setContainers((prev) => {
      const activeItems = prev[activeContainer] || [];
      const overItems = prev[overContainer] || [];
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item !== active.id),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          active.id,
          ...overItems.slice(newIndex, overItems.length),
        ],
      };
    });
  }, [findContainer, setContainers]);

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over) {
      setActiveId(null);
      if (typeof onContainersChange === "function") {
        onContainersChange(containersRef.current);
      }
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = containersRef.current[activeContainer].indexOf(active.id);
      const overIndex = containersRef.current[overContainer].indexOf(over.id);

      if (activeIndex !== overIndex) {
        setContainers((prev) => {
            const next = {
                ...prev,
                [overContainer]: arrayMove([...prev[overContainer]], activeIndex, overIndex),
            };
            if (typeof onContainersChange === "function") {
                onContainersChange(next);
            }
            return next;
        });
      } else {
          if (typeof onContainersChange === "function") {
            onContainersChange(containersRef.current);
          }
      }
    } else if (activeContainer && overContainer && activeContainer !== overContainer) {
      if (typeof onContainersChange === "function") {
        onContainersChange(containersRef.current);
      }
    }
    setActiveId(null);
  }, [findContainer, setContainers, onContainersChange]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    if (dragStartSnapshotRef.current) {
      setContainers(dragStartSnapshotRef.current);
    }
  }, [setContainers]);

  const ctxValue = React.useMemo(() => ({
    containers, 
    columns: containers, // Alias for backward compatibility
    activeId, 
    isExporting,
    findContainer
  }), [containers, activeId, isExporting, findContainer]);

  return (
    <DndLayoutCtx.Provider value={ctxValue}>
      <DndContext 
        sensors={sensors} 
        collisionDetection={customCollisionDetection} 
        onDragStart={handleDragStart} 
        onDragOver={handleDragOver} 
        onDragEnd={handleDragEnd} 
        onDragCancel={handleDragCancel} 
        autoScroll={false}
      >
        {children}
        {!isExporting && (
          <DragOverlay dropAnimation={null}>
            {activeId ? (
              <div data-pdf-ignore="true" className="px-3 py-1.5 bg-white border border-cyan-400 rounded shadow-xl text-xs font-semibold text-cyan-700 opacity-90 select-none cursor-grabbing">
                ⠿ {activeId.charAt(0).toUpperCase() + activeId.slice(1)}
              </div>
            ) : null}
          </DragOverlay>
        )}
      </DndContext>
    </DndLayoutCtx.Provider>
  );
};

export default MultiContainerDndContext;
