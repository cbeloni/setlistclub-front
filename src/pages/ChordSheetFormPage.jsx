import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createChordSheet, fetchChordSheet, updateChordSheet } from "../services/api";

export default function ChordSheetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [keySignature, setKeySignature] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadChordSheet();
    }
  }, [id]);

  const loadChordSheet = async () => {
    setFetching(true);
    try {
      const data = await fetchChordSheet(id);
      setTitle(data.title);
      setArtist(data.artist);
      setKeySignature(data.key_signature || "");
      setYoutubeUrl(data.youtube_url || "");
      setContent(data.content);
    } catch (err) {
      setError("Erro ao carregar a cifra para edição.");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validação simples
    if (!title.trim() || !artist.trim() || !content.trim()) {
      setError("Por favor, preencha os campos obrigatórios (Título, Artista e Cifra).");
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await updateChordSheet(id, title, artist, keySignature, content, youtubeUrl);
        navigate(`/cifras/${id}`);
      } else {
        const newSheet = await createChordSheet(title, artist, keySignature, content, youtubeUrl);
        navigate(`/cifras/${newSheet.id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Erro ao salvar a cifra. Verifique os dados inseridos."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="panel p-12 text-center animate-pulse">
        Carregando informações da cifra...
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <header className="panel p-8 relative overflow-hidden bg-gradient-to-r from-white to-slate-50">
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <span className="label-section">Formulário</span>
        <h2 className="mt-3 text-3xl font-black text-slate-900">
          {isEditMode ? "Editar Cifra" : "Criar Nova Cifra"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Insira os detalhes da música, os acordes e as letras abaixo.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-slide-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="panel p-6 space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Título da Música *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Oceans"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Artista / Banda *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Hillsong United"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Tom da Música
            </label>
            <input
              type="text"
              placeholder="Ex: Am, G, F#m"
              value={keySignature}
              onChange={(e) => setKeySignature(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Link do YouTube (Opcional)
            </label>
            <input
              type="url"
              placeholder="Ex: https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Content Area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Cifra e Letra *
            </label>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              Formato monoespaçado padrão
            </span>
          </div>
          <textarea
            required
            rows={15}
            placeholder={`[Intro]\nAm  F  C  G\n\n[Verso]\nAm                F\nYou call me out upon the waters\nC                    G\nThe great unknown where feet may fail...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-6 text-slate-800 transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              isEditMode ? "Salvar Alterações" : "Criar Cifra"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
