import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSetlistByToken } from "../services/api";

export default function SharedSetlistPage() {
  const { shareToken } = useParams();
  const [setlist, setSetlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shareToken) return;
    fetchSetlistByToken(shareToken)
      .then((data) => {
        setSetlist(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Setlist não encontrado");
        setLoading(false);
      });
  }, [shareToken]);

  if (loading) {
    return (
      <section className="space-y-6 animate-fade-in">
        <div className="panel p-12 text-center animate-pulse">Carregando setlist...</div>
      </section>
    );
  }

  if (error || !setlist) {
    return (
      <section className="space-y-6 animate-fade-in">
        <div className="panel p-12 text-center text-slate-500">{error || "Setlist não encontrado"}</div>
      </section>
    );
  }

  const songIds = (setlist.items || []).map((item) => item.chord_sheet_id).filter(Boolean);

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden panel p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <span className="label-section">Setlist Compartilhado</span>
        <h2 className="mt-3 text-3xl font-black text-slate-900">{setlist.name}</h2>
        {setlist.description && (
          <p className="mt-2 text-sm text-slate-600">{setlist.description}</p>
        )}
      </div>

      <div className="space-y-3">
        {(setlist.items || []).map((item, index) => (
          <div key={item.id} className="panel p-5 flex items-center justify-between gap-4 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-xs font-bold text-slate-400 w-6 shrink-0 text-right">{index + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{item.title || "Sem título"}</p>
                <p className="text-xs font-medium text-slate-500 truncate">{item.artist || "Sem artista"}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={`/cifras/${item.chord_sheet_id}?setlistId=${setlist.id}&songIds=${songIds.join(",")}&currentIndex=${index}`}
                className="btn-primary text-xs px-4 py-2"
              >
                Tocar
              </a>
              {/* Replaces internal Link with anchor to avoid React Router conflict on shared page */}
            </div>
          </div>
        ))}
        {(!setlist.items || setlist.items.length === 0) && (
          <div className="panel p-12 text-center text-slate-500">Nenhuma música neste setlist.</div>
        )}
      </div>
    </section>
  );
}