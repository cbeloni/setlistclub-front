import { useEffect, useRef, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import AutoScrollControls from "../components/AutoScrollControls";
import YouTubePlayer from "../components/YouTubePlayer";
import { fetchChordSheet, recordChordSheetView, updateChordSheetScrollSpeed } from "../services/api";
import { useAuth } from "../components/AuthContext";

const mockChord = {
  id: 1,
  title: "Oceans",
  artist: "Hillsong United",
  content: `[Intro]
Am  F  C  G

[Verso]
Am                F
You call me out upon the waters
C                    G
The great unknown where feet may fail
Am               F
And there I find you in the mystery
C                      G
In oceans deep my faith will stand

[Pré-Refrão]
Am        F
And I will call upon your name
C                 G
And keep my eyes above the waves

[Refrão]
F         C         G
Spirit lead me where my trust is without borders
F         C         G
Let me walk upon the waters wherever you would call me`,
  youtube_url: "https://www.youtube.com/watch?v=dy9nwe9_xzw",
};

export default function ChordSheetPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [chordSheet, setChordSheet] = useState(mockChord);
  const [currentScrollSpeed, setCurrentScrollSpeed] = useState(1);
  const [savedScrollSpeed, setSavedScrollSpeed] = useState(1);
  const saveTimeoutRef = useRef(null);
  const lastScheduledSpeedRef = useRef(1);

  const isOwner = isAuthenticated && user && chordSheet && chordSheet.created_by_id === user.id;

  useEffect(() => {
    if (!id) return;
    fetchChordSheet(id)
      .then((data) => {
        setChordSheet(data);
        const normalized = Number(
          Math.min(1.8, Math.max(0.2, Number(data?.scroll_speed ?? 1))).toFixed(1)
        );
        setCurrentScrollSpeed(normalized);
        setSavedScrollSpeed(normalized);

        // Registra a visualização no Redis (apenas se autenticado)
        if (isAuthenticated) {
          recordChordSheetView(id).catch(() => {});
        }
      })
      .catch(() => setChordSheet(mockChord));
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [chordSheet.id]);

  useEffect(() => {
    if (!id || !isOwner) return;
    if (currentScrollSpeed === savedScrollSpeed) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    lastScheduledSpeedRef.current = currentScrollSpeed;
    saveTimeoutRef.current = setTimeout(async () => {
      if (lastScheduledSpeedRef.current === savedScrollSpeed) return;
      try {
        await updateChordSheetScrollSpeed(id, lastScheduledSpeedRef.current);
        setSavedScrollSpeed(lastScheduledSpeedRef.current);
        setChordSheet((prev) => ({ ...prev, scroll_speed: lastScheduledSpeedRef.current }));
      } catch {
        // Silent fail to avoid disrupting playback interaction.
      }
    }, 60000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentScrollSpeed, id, isOwner, savedScrollSpeed]);

  const setlistId = searchParams.get("setlistId");
  const currentIndex = Number(searchParams.get("currentIndex") || 0);
  const songIds = (searchParams.get("songIds") || "")
    .split(",")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);
  const hasNextSong = songIds.length > 0 && currentIndex < songIds.length - 1;
  const hasPreviousSong = songIds.length > 0 && currentIndex > 0;
  const previousSongId = hasPreviousSong ? songIds[currentIndex - 1] : null;
  const nextSongId = hasNextSong ? songIds[currentIndex + 1] : null;
  const previousSongHref = hasPreviousSong
    ? `/cifras/${previousSongId}?setlistId=${setlistId || ""}&songIds=${songIds.join(",")}&currentIndex=${
        currentIndex - 1
      }`
    : null;
  const nextSongHref = hasNextSong
    ? `/cifras/${nextSongId}?setlistId=${setlistId || ""}&songIds=${songIds.join(",")}&currentIndex=${
        currentIndex + 1
      }`
    : null;

  return (
    <article className="space-y-6 animate-fade-in pb-32">
      {/* ── Header ── */}
      <header className="relative overflow-hidden panel p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <span className="label-section">Cifra Pública</span>
            <h2 className="mt-3 text-4xl font-black text-slate-900">{chordSheet.title}</h2>
            <p className="mt-1 text-base font-medium text-slate-600">{chordSheet.artist}</p>
          </div>
          {isAuthenticated && (
            <Link
              to={`/cifras/${chordSheet.id}/editar`}
              className="btn-outline text-xs px-4 py-2"
            >
              ✏️ Editar Cifra
            </Link>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="badge">🎸 Acordes</span>
          <span className="badge">📺 YouTube</span>
          <span className="badge">⬇️ Auto-scroll</span>
          {hasPreviousSong && previousSongHref && (
            <Link to={previousSongHref} className="btn-outline text-xs px-3 py-1.5">
              ← Música anterior
            </Link>
          )}
          {hasNextSong && nextSongHref && (
            <Link to={nextSongHref} className="btn-outline text-xs px-3 py-1.5">
              Próxima música →
            </Link>
          )}
        </div>
      </header>

      {/* ── Controls & Player ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AutoScrollControls initialSpeed={currentScrollSpeed} onSpeedChange={setCurrentScrollSpeed} />
        <YouTubePlayer url={chordSheet.youtube_url} />
      </div>

      {/* ── Chord content ── */}
      <div className="panel p-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Cifra
        </h3>
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-8 text-slate-800">
          {chordSheet.content}
        </pre>
        {(hasPreviousSong || hasNextSong) && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {hasPreviousSong && previousSongHref && (
              <Link to={previousSongHref} className="btn-outline text-xs px-3 py-1.5">
                ← Música anterior
              </Link>
            )}
            {hasNextSong && nextSongHref && (
              <Link to={nextSongHref} className="btn-outline text-xs px-3 py-1.5">
                Próxima música →
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
