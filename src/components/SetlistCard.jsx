import { Link } from "react-router-dom";

export default function SetlistCard({ setlist, style }) {
  const count = setlist.items?.length || 0;

  return (
    <article
      className="panel group flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-green-500/40 animate-fade-in"
      style={style}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="label-section">Setlist</span>
        <span className="badge">{count} {count === 1 ? "música" : "músicas"}</span>
      </div>

      {/* Name */}
      <div>
        <h3 className="text-xl font-bold text-green-50 group-hover:text-green-300 transition-colors duration-200">
          {setlist.name}
        </h3>
        <p className="mt-1.5 min-h-10 text-sm leading-relaxed text-green-300/70">
          {setlist.description || "Sem descrição"}
        </p>
      </div>

      {/* Song preview dots */}
      {count > 0 && (
        <div className="flex gap-1.5">
          {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-green-500/60"
              style={{ opacity: 1 - i * 0.12 }}
            />
          ))}
          {count > 6 && (
            <span className="text-[10px] text-green-500/60 font-semibold ml-1">+{count - 6}</span>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-2 border-t border-green-700/20 flex items-center justify-between">
        <Link
          to={`/setlists/${setlist.id}/edit`}
          className="btn-outline text-xs px-4 py-2"
        >
          Abrir editor →
        </Link>
        <Link
          to={`/cifras/1`}
          className="text-xs text-green-500/70 hover:text-green-400 transition-colors"
        >
          Ver cifras
        </Link>
      </div>
    </article>
  );
}
