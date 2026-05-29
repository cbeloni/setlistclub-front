import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function AutoScrollControls() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef(null);
  const lastManualScrollRef = useRef(0);
  const scrollRemainderRef = useRef(0);
  const [areBarsHidden, setAreBarsHidden] = useState(false);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    const markManualScroll = () => {
      lastManualScrollRef.current = performance.now();
    };

    const keyHandler = (event) => {
      const manualScrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (manualScrollKeys.includes(event.key)) {
        markManualScroll();
      }
    };

    window.addEventListener("wheel", markManualScroll, { passive: true });
    window.addEventListener("touchmove", markManualScroll, { passive: true });
    window.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("wheel", markManualScroll);
      window.removeEventListener("touchmove", markManualScroll);
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      scrollRemainderRef.current = 0;
      return;
    }

    let last = performance.now();
    const step = (now) => {
      const delta = now - last;
      last = now;
      const elapsedSinceManual = now - lastManualScrollRef.current;
      const manualPriorityWindowMs = 1200;

      if (elapsedSinceManual > manualPriorityWindowMs) {
        // Keep fractional movement so very low speeds still advance smoothly.
        const nextDelta = (speed * delta) / 32 + scrollRemainderRef.current;
        const wholePixels = Math.trunc(nextDelta);
        scrollRemainderRef.current = nextDelta - wholePixels;

        if (wholePixels !== 0) {
          window.scrollBy({ top: wholePixels, behavior: "auto" });
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, speed]);

  useEffect(() => {
    if (!isRunning) {
      setAreBarsHidden(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      return;
    }

    // Schedule initial auto-hide after 2 seconds
    hideTimeoutRef.current = setTimeout(() => {
      setAreBarsHidden(true);
    }, 2000);

    const scheduleHideBars = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setAreBarsHidden(true);
      }, 2000);
    };

    const showBarsTemporarily = () => {
      setAreBarsHidden(false);
      scheduleHideBars();
    };

    const handleInteraction = (clientY) => {
      const topThreshold = 60;
      const bottomThreshold = window.innerHeight - 80;

      if (clientY < topThreshold || clientY > bottomThreshold) {
        setAreBarsHidden(false);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else {
        scheduleHideBars();
      }
    };

    const onMouseMove = (e) => handleInteraction(e.clientY);
    const onTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        handleInteraction(e.touches[0].clientY);
      }
    };
    const onTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        handleInteraction(e.touches[0].clientY);
      }
    };
    const onClickAnywhere = () => showBarsTemporarily();
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSpeed((prev) => Math.max(0.2, Number((prev - 0.1).toFixed(1))));
        setAreBarsHidden(false);
        handleInteraction(window.innerHeight / 2);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSpeed((prev) => Math.min(1.8, Number((prev + 0.1).toFixed(1))));
        setAreBarsHidden(false);
        handleInteraction(window.innerHeight / 2);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsRunning(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("click", onClickAnywhere);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("click", onClickAnywhere);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isRunning]);

  useEffect(() => {
    if (areBarsHidden) {
      document.body.classList.add("hide-bars-active");
    } else {
      document.body.classList.remove("hide-bars-active");
    }
    return () => {
      document.body.classList.remove("hide-bars-active");
    };
  }, [areBarsHidden]);

  const controlsContent = (
    <div className="panel flex flex-wrap items-center gap-5 p-4">
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

      <label className="flex flex-1 min-w-56 items-center gap-4 text-sm font-medium text-slate-700">
        <span className="shrink-0 text-xs text-slate-500 uppercase tracking-widest">
          Velocidade
        </span>
        <div className="relative flex-1">
          <input
            type="range"
            min="0.2"
            max="1.8"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
          />
        </div>
        <span className="w-12 shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-center text-xs font-bold text-slate-700">
          {speed.toFixed(1)}×
        </span>
      </label>
    </div>
  );

  if (isRunning && typeof document !== "undefined") {
    return createPortal(
      <div id="autoscroll-panel" className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
        <div className="mx-auto w-full max-w-6xl shadow-2xl">{controlsContent}</div>
      </div>,
      document.body
    );
  }

  return controlsContent;
}
