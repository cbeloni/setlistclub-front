import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AutoScrollControls from "../components/AutoScrollControls";
import YouTubePlayer from "../components/YouTubePlayer";
import { fetchChordSheet } from "../services/api";

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
  const [chordSheet, setChordSheet] = useState(mockChord);

  useEffect(() => {
    if (!id) return;
    fetchChordSheet(id)
      .then((data) => setChordSheet(data))
      .catch(() => setChordSheet(mockChord));
  }, [id]);

  return (
    <article className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <header className="relative overflow-hidden panel p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        <span className="label-section">Cifra Pública</span>
        <h2 className="mt-3 text-4xl font-black text-slate-900">{chordSheet.title}</h2>
        <p className="mt-1 text-base font-medium text-slate-600">{chordSheet.artist}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge">🎸 Acordes</span>
          <span className="badge">📺 YouTube</span>
          <span className="badge">⬇️ Auto-scroll</span>
        </div>
      </header>

      {/* ── Controls & Player ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AutoScrollControls />
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
      </div>
    </article>
  );
}
