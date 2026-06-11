import { useCallback, useEffect, useState } from "react";
import { searchUsers } from "../services/api";

export default function ShareSection({
  resourceType,  // "chord-sheets" or "setlists"
  resourceId,
  onShare,
  onUnshare,
  fetchSharedUsers,
  isOwner,
}) {
  const [email, setEmail] = useState("");
  const [sharedUsers, setSharedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSharedUsers = useCallback(async () => {
    if (!resourceId) return;
    try {
      const users = await fetchSharedUsers(resourceId);
      setSharedUsers(users);
    } catch {
      // ignore
    }
  }, [resourceId, fetchSharedUsers]);

  useEffect(() => {
    loadSharedUsers();
  }, [loadSharedUsers]);

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

  if (!isOwner) {
    if (sharedUsers.length === 0) return null;
    return (
      <div className="panel p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Compartilhado com</p>
        <div className="space-y-1">
          {sharedUsers.map((u) => (
            <div key={u.id} className="text-sm text-slate-700">
              • {u.display_name} ({u.email})
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-5 space-y-4">
      <div>
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">🔗 Compartilhar com usuário</span>
        <p className="text-[11px] text-slate-400 mt-0.5">
          O usuário receberá acesso completo de edição.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs font-semibold text-green-700">{success}</div>
      )}

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleShare(); }}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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

      {sharedUsers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Usuários com acesso ({sharedUsers.length})
          </p>
          <div className="space-y-2">
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
    </div>
  );
}