import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function GoogleCallbackPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        let idToken = null;

        // Tenta buscar no hash (#id_token=...) que é o padrão do response_type=id_token do Google
        const hash = window.location.hash;
        if (hash) {
          const params = new URLSearchParams(hash.replace("#", "?"));
          idToken = params.get("id_token");
        }

        // Tenta buscar nos query params se não achou no hash
        if (!idToken) {
          const searchParams = new URLSearchParams(window.location.search);
          idToken = searchParams.get("id_token");
        }

        if (!idToken) {
          throw new Error("Token do Google não encontrado na URL.");
        }

        await loginWithGoogle(idToken);
        navigate("/");
      } catch (err) {
        console.error("Erro no callback do Google:", err);
        setError(
          err.response?.data?.detail || err.message || "Erro desconhecido ao autenticar com Google."
        );
      }
    };

    handleCallback();
  }, [loginWithGoogle, navigate]);

  return (
    <div className="mx-auto max-w-md w-full animate-fade-in py-16 text-center">
      <div className="panel p-8 relative overflow-hidden">
        {/* Loading ring */}
        {!error ? (
          <div className="flex flex-col items-center gap-6">
            <span className="relative flex h-14 w-14">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-14 w-14 bg-blue-600 items-center justify-center text-white text-xl font-bold">
                ♪
              </span>
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Autenticando...</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Por favor, aguarde enquanto conectamos com o Google.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-lg">
              ✗
            </div>
            <h3 className="text-xl font-bold text-slate-900">Falha na Autenticação</h3>
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left">
              {error}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn-primary mt-2"
            >
              Voltar para o Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
