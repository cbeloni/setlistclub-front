import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SetlistEditor from "../components/SetlistEditor";
import { useAuth } from "../components/AuthContext";
import {
  fetchSetlist,
  reorderSetlist,
  addSongToSetlist,
  removeSongFromSetlist,
  fetchChordSheets
} from "../services/api";

export default function SetlistBuilderPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [setlist, setSetlist] = useState(null);
  const [chordSheets, setChordSheets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // null | "saving" | "success" | "error" | "added" | "deleted"

  const isOwner = isAuthenticated && user && setlist && setlist.created_by_id === user.id;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const setlistData = await fetchSetlist(id);
      setSetlist(setlistData);

      // Só carrega a lista de cifras se for o dono (para poder adicionar)
      if (isAuthenticated) {
        const sheetsData = await fetchChordSheets();
        setChordSheets(sheetsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrder = async (orderedItemIds) => {
    setStatus("saving");
    try {
      const updated = await reorderSetlist(setlist.id, orderedItemIds);
      setSetlist(updated);
      showStatus("success");
    } catch (err) {
      showStatus("error");
    }
  };

  const handleAddSong = async (chordSheetId) => {
    setStatus("saving");
    try {
      const updated = await addSongToSetlist(setlist.id, chordSheetId);
      setSetlist(updated);
      showStatus("added");
    } catch (err) {
      showStatus("error");
    }
  };

  const handleRemoveSong = async (itemId) => {
    if (!window.confirm("Remover esta música do setlist?")) return;
    setStatus("saving");
    try {
      const updated = await removeSongFromSetlist(setlist.id, itemId);
      setSetlist(updated);
      showStatus("deleted");
    } catch (err) {
      showStatus("error");
    }
  };

  const showStatus = (type) => {
    setStatus(type);
    setTimeout(() => setStatus(null), 3000);
  };

  const filteredSheets = chordSheets.filter(
    (sheet) =>
      sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="panel p-12 text-center animate-pulse">
        Carregando informações do repertório...
      </div>
    );
  }

  if (!setlist) {
    return (
      <div className="panel p-12 text-center text-slate-500">
        Repertório não encontrado ou indisponível.
      </div>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <header className="panel p-8 relative overflow-hidden bg-gradient-to-r from-white to-slate-50">
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <span className="label-section">Setlist</span>
        <h2 className="mt-3 text-4xl font-black text-slate-900">{setlist.name}</h2>
        {setlist.description && (
          <p className="mt-2 text-sm text-slate-600 max-w-xl">{setlist.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge">📋 {setlist.items?.length || 0} músicas</span>
          {isOwner ? (
            <span className="badge bg-blue-50 text-blue-700 border-blue-100">🛡️ Modo Editor</span>
          ) : (
            <span className="badge bg-slate-50 text-slate-600 border-slate-100">👁️ Modo Leitura</span>
          )}
        </div>
      </header>

      {/* ── Toast status ── */}
      {status && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-5 py-3.5 text-sm font-semibold animate-slide-in transition-all ${
            status === "saving"
              ? "border-slate-300 bg-slate-100 text-slate-700"
              : status === "success" || status === "added" || status === "deleted"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status === "saving" && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
          )}
          {status === "saving"
            ? "Processando..."
            : status === "success"
            ? "✓ Ordem das músicas salva com sucesso!"
            : status === "added"
            ? "✓ Música adicionada ao setlist!"
            : status === "deleted"
            ? "✓ Música removida do setlist!"
            : "✗ Falha na operação. Verifique a sua conexão."}
        </div>
      )}

      {/* ── 2-Column Editor Layout ── */}
      <div className={`grid grid-cols-1 gap-6 ${isOwner ? "lg:grid-cols-3" : ""}`}>
        {/* Editor Area */}
        <div className={isOwner ? "lg:col-span-2" : "w-full"}>
          <SetlistEditor
            initialItems={setlist.items || []}
            isOwner={isOwner}
            onSave={handleSaveOrder}
            onDelete={handleRemoveSong}
          />
        </div>

        {/* Efetivamente Adiciona Músicas (Side panel) */}
        {isOwner && (
          <aside className="panel p-6 space-y-4 h-fit">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Adicionar Músicas</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Escolha uma das cifras públicas para adicionar a este setlist.
              </p>
            </div>

            {/* Mini Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                placeholder="Filtrar cifras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
              {filteredSheets.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Nenhuma cifra encontrada.
                  <div className="mt-2">
                    <Link to="/cifras/nova" className="text-blue-600 hover:underline font-semibold">
                      Criar nova cifra →
                    </Link>
                  </div>
                </div>
              ) : (
                filteredSheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-all duration-150"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{sheet.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium truncate">{sheet.artist}</p>
                    </div>
                    <button
                      onClick={() => handleAddSong(sheet.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shrink-0 text-sm font-black shadow-sm"
                      title="Adicionar ao repertório"
                    >
                      +
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
