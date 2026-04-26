import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ item, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex cursor-grab items-center gap-4 rounded-xl border px-4 py-3.5 transition-all duration-150 ${
        isDragging
          ? "border-blue-200 bg-blue-50 shadow-glow scale-[1.01]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Drag handle */}
      <span className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity shrink-0">
        <span className="block h-0.5 w-4 rounded bg-slate-400" />
        <span className="block h-0.5 w-4 rounded bg-slate-400" />
        <span className="block h-0.5 w-4 rounded bg-slate-400" />
      </span>

      {/* Position badge */}
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
        {index + 1}
      </span>

      {/* Title */}
      <strong className="flex-1 text-sm font-semibold text-slate-800">
        {item.title || `Cifra #${item.chord_sheet_id}`}
      </strong>

      {/* Chord ref */}
      <span className="text-[10px] text-slate-400 font-mono shrink-0">
        #{item.chord_sheet_id}
      </span>
    </li>
  );
}

export default function SetlistEditor({ initialItems = [], onSave }) {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(useSensor(PointerSensor));
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const moved = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      position: index,
    }));

    setItems(moved);
  };

  return (
    <section className="panel p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reordenar músicas</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Arraste e solte para organizar o repertório.
          </p>
        </div>
        <span className="badge">{items.length} itens</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <ul className="grid gap-2.5">
            {items.map((item, index) => (
              <SortableItem key={item.id} item={item} index={index} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          Após reordenar, clique em salvar para confirmar.
        </p>
        <button
          onClick={() => onSave(items.map((item) => item.id))}
          className="btn-primary"
        >
          Salvar Ordem
        </button>
      </div>
    </section>
  );
}
