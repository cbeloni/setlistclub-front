import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function SetlistCard({ setlist, style, onDelete }) {
  const { isAuthenticated, user } = useAuth();
  const count = setlist.items?.length || 0;
  const isOwner = isAuthenticated && user && setlist.created_by_id === user.id;

  // Encontra a primeira música para poder navegar direto se houver, ou cifra #1
  const firstSongId = setlist.items?.[0]?.chord_sheet_id || 1;
  const songIds = (setlist.items || []).map((item) => item.chord_sheet_id).filter(Boolean);
  const playHref =
    count > 0
      ? `/cifras/${firstSongId}?setlistId=${setlist.id}&songIds=${songIds.join(",")}&currentIndex=0`
      : `/cifras/${firstSongId}`;

  return (
    <article
      className="panel group flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-slate-300 animate-fade-in"
      style={style}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="label-section">Setlist</span>
        <div className="flex items-center gap-2">
          {isOwner && (
            <span className="text-[9px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-1.5 py-0.5">
              Seu Set
            </span>
          )}
          <span className="badge">{count} {count === 1 ? "música" : "músicas"}</span>
        </div>
      </div>

      {/* Name */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
          {setlist.name}
        </h3>
        <p className="mt-1.5 min-h-10 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {setlist.description || "Sem descrição"}
        </p>
      </div>

      {/* Song preview dots */}
      {count > 0 && (
        <div className="flex gap-1.5">
          {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-500/70"
              style={{ opacity: 1 - i * 0.12 }}
            />
          ))}
          {count > 6 && (
            <span className="text-[10px] text-slate-500 font-semibold ml-1">+{count - 6}</span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Link
            to={`/setlists/${setlist.id}/edit`}
            className="btn-outline text-xs px-4 py-2"
          >
            {isOwner ? "Editar →" : "Ver Setlist →"}
          </Link>
          {count > 0 && (
            <Link
              to={playHref}
              className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors p-2"
            >
              Tocar Cifras
            </Link>
          )}
        </div>

        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(setlist.id)}
            className="text-xs text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
            title="Excluir setlist"
          >
            🗑️
          </button>
        )}
      </div>
    </article>
  );
}
