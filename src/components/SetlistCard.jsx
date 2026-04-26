import { Link } from "react-router-dom";

export default function SetlistCard({ setlist, style }) {
  const count = setlist.items?.length || 0;

  return (
    <article
      className="panel group flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-slate-300 animate-fade-in"
      style={style}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="label-section">Setlist</span>
        <span className="badge">{count} {count === 1 ? "música" : "músicas"}</span>
      </div>

      {/* Name */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
          {setlist.name}
        </h3>
        <p className="mt-1.5 min-h-10 text-sm leading-relaxed text-slate-600">
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
      <div className="mt-auto pt-2 border-t border-slate-200 flex items-center justify-between">
        <Link
          to={`/setlists/${setlist.id}/edit`}
          className="btn-outline text-xs px-4 py-2"
        >
          Abrir editor →
        </Link>
        <Link
          to={`/cifras/1`}
          className="text-xs text-slate-600 hover:text-blue-700 transition-colors"
        >
          Ver cifras
        </Link>
      </div>
    </article>
  );
}
