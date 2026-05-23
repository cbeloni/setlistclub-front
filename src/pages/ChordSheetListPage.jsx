import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { deleteChordSheet, fetchChordSheets } from "../services/api";

export default function ChordSheetListPage() {
  const { isAuthenticated, user } = useAuth();
  const [chordSheets, setChordSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadChordSheets();
  }, []);

  const loadChordSheets = async () => {
    setLoading(true);
    try {
      const data = await fetchChordSheets();
      setChordSheets(data);
    } catch (err) {
      setError("Não foi possível carregar as cifras da API.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta cifra definitivamente?")) return;
    try {
      await deleteChordSheet(id);
      setChordSheets((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Erro ao excluir cifra. Verifique se você é o proprietário.");
    }
  };

  const filteredSheets = chordSheets.filter(
    (sheet) =>
      sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sheet.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="space-y-8 animate-fade-in">
      {/* ── Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 md:p-12 shadow-card">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <span className="label-section">Repertório</span>
        <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight">
          Explore Cifras <span className="text-blue-600">Públicas</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
          Pesquise músicas, visualize com auto-scroll integrado e vincule players do YouTube.
          {isAuthenticated ? " Adicione suas próprias criações!" : " Faça login para criar cifras!"}
        </p>

        <div className="mt-8 flex flex-wrap gap-4 items-center">
          {isAuthenticated ? (
            <Link to="/cifras/nova" className="btn-primary">
              + Criar Nova Cifra
            </Link>
          ) : (
            <Link to="/login" className="btn-outline text-xs px-4 py-2 bg-white">
              Entrar para Criar Cifras
            </Link>
          )}
        </div>
      </div>

      {/* ── Search & Filter Row ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Pesquise por música ou artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {filteredSheets.length} cifras encontradas
        </span>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel h-40 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="panel p-6 text-center text-slate-500">{error}</div>
      ) : filteredSheets.length === 0 ? (
        <div className="panel p-12 text-center text-slate-500">
          Nenhuma cifra encontrada para a pesquisa.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSheets.map((sheet, i) => {
            const isOwner = isAuthenticated && user && user.id === sheet.created_by_id;
            return (
              <article
                key={sheet.id}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="panel group flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-slate-300 animate-fade-in"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge">
                      {sheet.key_signature ? `Tom: ${sheet.key_signature}` : "Sem Tom"}
                    </span>
                    {isOwner && (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">
                        Sua Cifra
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {sheet.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{sheet.artist}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link to={`/cifras/${sheet.id}`} className="btn-primary text-xs px-4 py-2">
                    Tocar Cifra
                  </Link>

                  {isOwner && (
                    <div className="flex gap-2">
                      <Link
                        to={`/cifras/${sheet.id}/editar`}
                        className="btn-outline text-xs px-3 py-1.5"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(sheet.id)}
                        className="btn-outline text-xs px-3 py-1.5 border-red-200 hover:border-red-300 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
