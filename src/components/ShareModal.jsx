import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ShareModal({ isOpen, onClose, onShare, onUnshare, fetchSharedUsers, resourceId }) {
  const [email, setEmail] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSharedUsers = async () => {
    if (!resourceId) return;
    try {
      const users = await fetchSharedUsers(resourceId);
      setSharedUsers(users);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen && resourceId) {
      loadSharedUsers();
      setEmail("");
      setError("");
      setSuccess("");
    }
  }, [isOpen, resourceId]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!email.trim()) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const user = await onShare(resourceId, email.trim());
      setSharedUsers((prev) => [...prev, user]);
      setEmail("");
      setSuccess(`Compartilhado com ${user.display_name}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao compartilhar");
    } finally {
      setLoading(false);
    }
  };

  const handleUnshare = async (userId) => {
    setError("");
    setSuccess("");
    try {
      await onUnshare(resourceId, userId);
      setSharedUsers((prev) => prev.filter((u) => u.id !== userId));
      setSuccess("Acesso removido");
    } catch (err) {
      setError(err.response?.data?.detail || "Erro ao remover");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 animate-slide-in">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">🔗 Compartilhar</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              O usuário receberá acesso completo de edição.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 mb-4">{error}</div>
        )}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-700 mb-4">{success}</div>
        )}

        {/* Share input */}
        <div className="flex gap-2 mb-5">
          <input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleShare(); }}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            autoFocus
          />
          <button
            type="button"
            onClick={handleShare}
            disabled={loading || !email.trim()}
            className="btn-primary text-xs px-4 py-2 shrink-0"
          >
            {loading ? "..." : "Compartilhar"}
          </button>
        </div>

        {/* Shared users list */}
        {sharedUsers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Usuários com acesso ({sharedUsers.length})
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sharedUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{u.display_name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnshare(u.id)}
                    className="btn-outline text-[10px] px-2.5 py-1 border-red-200 text-red-500 hover:bg-red-50 shrink-0 ml-2"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {sharedUsers.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-4">
            Nenhum compartilhamento ainda.
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}