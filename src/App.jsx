import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChordSheetPage from "./pages/ChordSheetPage";
import SetlistBuilderPage from "./pages/SetlistBuilderPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import ChordSheetListPage from "./pages/ChordSheetListPage";
import ChordSheetFormPage from "./pages/ChordSheetFormPage";
import { AuthProvider, useAuth } from "./components/AuthContext";

function MainAppContent() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/20">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-glow text-white font-black text-lg transition-transform duration-200 group-hover:scale-105">
              ♪
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Gestão de Repertório
              </p>
              <h1 className="text-lg font-black text-slate-900 leading-none">
                Setlist Club
              </h1>
            </div>
          </Link>

          {/* Nav & Auth */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <Link className="btn-ghost" to="/">
                Home
              </Link>
              <Link className="btn-ghost" to="/cifras">
                Cifras
              </Link>
            </nav>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link className="btn-outline text-xs px-3.5 py-1.5 hidden sm:inline-flex" to="/cifras/nova">
                    + Cifra
                  </Link>
                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full pl-3 pr-1 py-1">
                    <span className="text-xs font-bold text-slate-700 max-w-28 truncate">
                      {user?.display_name || user?.email}
                    </span>
                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center uppercase shadow-sm">
                      {user?.display_name?.substring(0, 2) || "U"}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="btn-ghost text-xs px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn-ghost text-xs px-4 py-2" to="/cifras">
                    Explorar
                  </Link>
                  <Link className="btn-outline text-xs px-4 py-2" to="/register">
                    Cadastrar
                  </Link>
                  <Link className="btn-primary text-xs px-4 py-2" to="/login">
                    Entrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cifras" element={<ChordSheetListPage />} />
          <Route path="/cifras/nova" element={<ChordSheetFormPage />} />
          <Route path="/cifras/:id" element={<ChordSheetPage />} />
          <Route path="/cifras/:id/editar" element={<ChordSheetFormPage />} />
          <Route path="/setlists/:id/edit" element={<SetlistBuilderPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        </Routes>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Setlist Club — Gestão de repertório para músicos
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
