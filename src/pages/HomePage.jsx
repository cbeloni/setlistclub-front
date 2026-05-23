import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SetlistCard from "../components/SetlistCard";
import { fetchMainSetlists, createSetlist, deleteSetlist } from "../services/api";
import { useAuth } from "../components/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [setlists, setSetlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para criação de setlist
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    loadSetlists();
  }, []);

  const loadSetlists = async () => {
    setLoading(true);
    try {
      const data = await fetchMainSetlists();
      setSetlists(data);
    } catch (err) {
      setError("Não foi possível conectar à API do Setlist Club. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSetlist = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);

    if (!newName.trim()) {
      setCreateError("O nome do setlist é obrigatório.");
      setCreateLoading(false);
      return;
    }

    try {
      const data = await createSetlist(newName, newDescription);
      setSetlists((prev) => [data, ...prev]);
      setNewName("");
      setNewDescription("");
      setShowCreateForm(false);
    } catch (err) {
      setCreateError("Erro ao criar setlist. Tente novamente.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSetlist = async (id) => {
    if (!window.confirm("Deseja realmente excluir este setlist?")) return;
    try {
      await deleteSetlist(id);
      setSetlists((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Erro ao deletar setlist. Verifique se você é o autor.");
    }
  };

  return (
    <section className="space-y-10 animate-fade-in">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 md:p-12 shadow-card">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-slate-400/12 blur-2xl" />

        <span className="label-section">Comunidade</span>
        <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight max-w-lg">
          Organize seu repertório<br />
          <span className="text-blue-600">com simplicidade</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
          Explore setlists públicos, abra qualquer repertório e organize as
          cifras com drag&#8202;&amp;&#8202;drop. Tudo em um só lugar.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 items-center">
          {isAuthenticated ? (
            <button
              onClick={() => setShowCreateForm((v) => !v)}
              className="btn-primary"
            >
              {showCreateForm ? "Fechar Formulário" : "+ Criar Setlist"}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-4 py-2">
                🎸 Crie sua conta para montar e gerenciar seus setlists
              </div>
              <Link to="/register" className="btn-primary text-xs px-4 py-2">
                Cadastrar
              </Link>
              <Link to="/login" className="btn-ghost text-xs px-4 py-2">
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Form de Criação de Setlist ── */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateSetlist}
          className="panel p-6 space-y-4 max-w-lg animate-slide-in"
        >
          <div>
            <h3 className="text-lg font-bold text-slate-900">Novo Setlist</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Insira as informações do novo repertório.
            </p>
          </div>

          {createError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {createError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Nome do Repertório *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Culto Domingo, Show de Sábado"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              placeholder="Ex: Setlist principal com louvor e adoração"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="btn-ghost text-xs px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="btn-primary text-xs px-4 py-2"
            >
              {createLoading ? "Criando..." : "Salvar Setlist"}
            </button>
          </div>
        </form>
      )}

      {/* ── Section Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <span className="label-section">Setlists</span>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">
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
      ) : error ? (
        <div className="panel p-6 text-center text-slate-500">{error}</div>
      ) : setlists.length === 0 ? (
        <div className="panel p-12 text-center text-slate-500">
          Nenhum setlist cadastrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {setlists.map((setlist, i) => (
            <SetlistCard
              key={setlist.id}
              setlist={setlist}
              style={{ animationDelay: `${i * 0.08}s` }}
              onDelete={handleDeleteSetlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}
