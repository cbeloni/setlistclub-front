import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { fetchRecentlyViewedChordSheets } from "../services/api";

export default function RecentlyViewedPage() {
  const { isAuthenticated, user } = useAuth();
  const [chordSheets, setChordSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    loadRecentlyViewed();
  }, [isAuthenticated]);

  const loadRecentlyViewed = async () => {
    setLoading(true);
    try {
      const data = await fetchRecentlyViewedChordSheets();
      setChordSheets(data);
    } catch (err) {
      setError("Erro ao carregar cifras recentes.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="space-y-6 animate-fade-in">
        <div className="panel p-12 text-center">
          <p className="text-slate-500 font-semibold">
            Faça login para ver seu histórico de cifras acessadas.
          </p>
          <Link to="/login" className="btn-primary inline-block mt-4 text-xs px-6 py-3">
            Entrar
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
      <header className="panel p-8 relative overflow-hidden bg-gradient-to-r from-white to-slate-50">
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <span className="label-section">Histórico</span>
        <h2 className="mt-3 text-3xl font-black text-slate-900">
          Cifras Acessadas Recentemente
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          As últimas cifras que você visualizou, em ordem decrescente de acesso.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel h-40 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="panel p-6 text-center text-slate-500">{error}</div>
      ) : chordSheets.length === 0 ? (
        <div className="panel p-12 text-center text-slate-500">
          Nenhuma cifra acessada recentemente.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chordSheets.map((sheet, i) => {
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

                  {isAuthenticated && (
                    <Link
                      to={`/cifras/${sheet.id}/editar`}
                      className="btn-outline text-xs px-3 py-1.5"
                    >
                      ✏️
                    </Link>
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