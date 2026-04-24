import { useEffect, useRef, useState } from "react";

export default function AutoScrollControls() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    let last = performance.now();
    const step = (now) => {
      const delta = now - last;
      last = now;
      window.scrollBy({ top: (speed * delta) / 16, behavior: "auto" });
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, speed]);

  return (
    <div className="panel flex flex-wrap items-center gap-5 p-5">
      {/* Toggle button */}
      <button
        onClick={() => setIsRunning((v) => !v)}
        className={`btn-primary shrink-0 ${isRunning ? "bg-red-500 hover:bg-red-400 shadow-none" : ""}`}
      >
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            isRunning ? "bg-white animate-pulse" : "bg-white/60"
          }`}
        />
        {isRunning ? "Parar Auto-scroll" : "Iniciar Auto-scroll"}
      </button>

      {/* Speed slider */}
      <label className="flex flex-1 min-w-56 items-center gap-4 text-sm font-medium text-green-300">
        <span className="shrink-0 text-xs text-green-400/70 uppercase tracking-widest">
          Velocidade
        </span>
        <div className="relative flex-1">
          <input
            type="range"
            min="0.5"
            max="6"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-green-800 accent-green-500"
          />
        </div>
        <span className="w-12 shrink-0 rounded-full border border-green-700/40 bg-green-900/60 px-2 py-0.5 text-center text-xs font-bold text-green-400">
          {speed.toFixed(1)}×
        </span>
      </label>
    </div>
  );
}
