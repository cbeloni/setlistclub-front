import { useEffect, useState } from "react";
import SetlistCard from "../components/SetlistCard";
import { fetchMainSetlists } from "../services/api";

const mockSetlists = [
  {
    id: 1,
    name: "Culto Domingo",
    description: "Set principal da semana com louvor e adoração.",
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    id: 2,
    name: "Acústico",
    description: "Repertório intimista de voz e violão para pequenos grupos.",
    items: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 3,
    name: "Ensaio Geral",
    description: "Músicas em preparação para o próximo evento da banda.",
    items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  },
];

export default function HomePage() {
  const [setlists, setSetlists] = useState(mockSetlists);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMainSetlists()
      .then((data) => setSetlists(data))
      .catch(() => setSetlists(mockSetlists))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-10 animate-fade-in">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-green-700/30 bg-gradient-to-br from-green-900/70 via-green-800/50 to-green-950/80 p-8 md:p-12 shadow-card">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-green-400/8 blur-2xl" />

        <span className="label-section">Comunidade</span>
        <h2 className="mt-3 text-4xl font-black text-green-50 leading-tight max-w-lg">
          Organize seu repertório<br />
          <span className="text-green-400">com simplicidade</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-green-300/80">
          Explore setlists públicos, abra qualquer repertório e organize as
          cifras com drag&#8202;&amp;&#8202;drop. Tudo em um só lugar.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="badge">🎸 {mockSetlists.reduce((t, s) => t + s.items.length, 0)} músicas</div>
          <div className="badge">📋 {mockSetlists.length} setlists</div>
          <div className="badge">🎵 Auto-scroll</div>
        </div>
      </div>

      {/* ── Section header ── */}
      <div className="flex items-center justify-between">
        <div>
          <span className="label-section">Setlists</span>
          <h3 className="mt-1 text-2xl font-bold text-green-50">
            Principais setlists
          </h3>
        </div>
        <span className="badge">{setlists.length} encontrados</span>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="panel h-48 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {setlists.map((setlist, i) => (
            <SetlistCard
              key={setlist.id}
              setlist={setlist}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
