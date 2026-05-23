import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { fetchGoogleAuthUrl } from "../services/api";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Erro ao fazer login. Verifique suas credenciais."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const url = await fetchGoogleAuthUrl();
      window.location.href = url; // Redireciona para o Google
    } catch (err) {
      setError("Erro ao obter URL de autenticação do Google.");
      setGoogleLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setEmail("teste@teste.com");
    setPassword("123");
    setError("");
    setLoading(true);
    try {
      await login("teste@teste.com", "123");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Erro ao fazer login com usuário de teste."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md w-full animate-fade-in py-8">
      <div className="panel p-8 relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
        {/* Decorative blob */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        
        <header className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-glow text-white font-black text-xl mb-4">
            ♪
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            Bem-vindo de volta
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-wider">
            Acesse seu repertório
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-slide-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              placeholder="Sua senha secreta"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 text-sm font-bold shadow-md rounded-xl"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Entrar"
            )}
          </button>

          <button
            type="button"
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/30 px-4 py-3 text-sm font-bold text-blue-700 shadow-sm transition-all duration-200 hover:bg-blue-50/80 hover:border-blue-400 hover:text-blue-800 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            ⚡ Acesso Rápido (Usuário de Teste)
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            ou
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
        >
          {googleLoading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.28 1.844 15.42 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.709H12.24z"
              />
            </svg>
          )}
          Entrar com o Google
        </button>

        <footer className="mt-8 text-center text-xs text-slate-500 font-medium">
          Ainda não tem conta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Crie uma conta grátis
          </Link>
        </footer>
      </div>
    </div>
  );
}
