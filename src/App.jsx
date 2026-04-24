import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChordSheetPage from "./pages/ChordSheetPage";
import SetlistBuilderPage from "./pages/SetlistBuilderPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-green-700/30 bg-green-950/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500 shadow-glow text-green-950 font-black text-lg transition-transform duration-200 group-hover:scale-105">
              ♪
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-400">
                Gestão de Repertório
              </p>
              <h1 className="text-xl font-black text-green-50 leading-none">
                Setlist Club
              </h1>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Link className="btn-ghost" to="/">
              Home
            </Link>
            <Link className="btn-primary" to="/setlists/1/edit">
              Editor de Setlist
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cifras/:id" element={<ChordSheetPage />} />
          <Route path="/setlists/:id/edit" element={<SetlistBuilderPage />} />
        </Routes>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-green-800/40 py-6 text-center text-xs text-green-600">
        © {new Date().getFullYear()} Setlist Club — Gestão de repertório para músicos
      </footer>
    </div>
  );
}
