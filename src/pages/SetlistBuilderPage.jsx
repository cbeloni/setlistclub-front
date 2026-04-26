import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SetlistEditor from "../components/SetlistEditor";
import { fetchSetlist, reorderSetlist } from "../services/api";

const mockSetlist = {
  id: 1,
  name: "Culto Domingo",
  items: [
    { id: 11, position: 0, chord_sheet_id: 1, title: "Oceans" },
    { id: 12, position: 1, chord_sheet_id: 2, title: "Reckless Love" },
    { id: 13, position: 2, chord_sheet_id: 3, title: "10,000 Reasons" },
    { id: 14, position: 3, chord_sheet_id: 4, title: "Way Maker" },
  ],
};

export default function SetlistBuilderPage() {
  const { id } = useParams();
  const [setlist, setSetlist] = useState(mockSetlist);
  const [status, setStatus] = useState(null); // null | "saving" | "success" | "error"

  useEffect(() => {
    if (!id) return;
    fetchSetlist(id)
      .then((data) => setSetlist(data))
      .catch(() => setSetlist(mockSetlist));
  }, [id]);

  const handleSaveOrder = async (orderedItemIds) => {
    setStatus("saving");
    try {
      const token = localStorage.getItem("access_token") || "";
      await reorderSetlist(setlist.id, orderedItemIds, token);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <header className="panel p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <span className="label-section">Editor de Setlist</span>
        <h2 className="mt-3 text-4xl font-black text-slate-900">{setlist.name}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Arraste as músicas para definir a ordem do repertório.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge">🎵 {setlist.items.length} músicas</span>
          <span className="badge">🖱️ Drag & Drop</span>
        </div>
      </header>

      {/* ── Toast status ── */}
      {status && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-semibold animate-slide-in transition-all ${
            status === "saving"
              ? "border-slate-300 bg-slate-100 text-slate-700"
              : status === "success"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status === "saving" && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
          )}
          {status === "saving"
            ? "Salvando ordem..."
            : status === "success"
            ? "✓ Ordem salva com sucesso!"
            : "✗ Falha ao salvar. Verifique autenticação e API."}
        </div>
      )}

      {/* ── Editor ── */}
      <SetlistEditor initialItems={setlist.items} onSave={handleSaveOrder} />
    </section>
  );
}
