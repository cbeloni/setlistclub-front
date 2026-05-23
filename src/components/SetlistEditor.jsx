import { useEffect, useMemo, useState } from "react";
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
import { Link } from "react-router-dom";

function SortableItem({ item, index, isOwner, onDelete }) {
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
      className={`group flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-150 ${
        isDragging
          ? "border-blue-200 bg-blue-50 shadow-glow scale-[1.01]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {/* Drag handle - Listeners only here */}
      {isOwner && (
        <span
          {...attributes}
          {...listeners}
          className="flex flex-col gap-0.5 opacity-40 hover:opacity-100 transition-opacity cursor-grab p-2 shrink-0"
        >
          <span className="block h-0.5 w-4 rounded bg-slate-400" />
          <span className="block h-0.5 w-4 rounded bg-slate-400" />
          <span className="block h-0.5 w-4 rounded bg-slate-400" />
        </span>
      )}

      {/* Position badge */}
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
        {index + 1}
      </span>

      {/* Title & Link */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/cifras/${item.chord_sheet_id}`}
          className="block text-sm font-bold text-slate-800 hover:text-blue-700 transition-colors truncate"
        >
          {item.title || `Cifra #${item.chord_sheet_id}`}
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] text-slate-400 font-mono">
          #{item.chord_sheet_id}
        </span>
        {isOwner && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            title="Remover música"
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
}

export default function SetlistEditor({ initialItems = [], isOwner, onSave, onDelete }) {
  const [items, setItems] = useState(initialItems);

  // Mantém o estado interno em sincronia quando o banco atualizar
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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
          <h2 className="text-xl font-bold text-slate-900">Músicas no Repertório</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {isOwner
              ? "Use o puxador de 3 linhas à esquerda para reordenar."
              : "Visualize as músicas que compõem este setlist."}
          </p>
        </div>
        <span className="badge">{items.length} itens</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
          Este setlist está vazio. Adicione músicas pelo painel lateral!
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <ul className="grid gap-2">
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  index={index}
                  isOwner={isOwner}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {isOwner && items.length > 0 && (
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Lembre-se de salvar para confirmar a nova ordem das músicas.
          </p>
          <button
            onClick={() => onSave(items.map((item) => item.id))}
            className="btn-primary shrink-0"
          >
            Salvar Ordem
          </button>
        </div>
      )}
    </section>
  );
}
