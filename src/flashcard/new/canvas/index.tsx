import { useRef, useEffect, useCallback } from "react";

import "./styles.scss";

type PropTypes = {
  setImage: (image: string | undefined) => void;
  onCancel?: () => void;
};

const MAX_WIDTH = 15;
const MIN_WIDTH = 10;
const STROKE_FADE_STEPS = 10; // Number of segments to fade from thick to thin

let _dirty = false;

const FlashcardCanvas = ({ setImage, onCancel }: PropTypes) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const strokeStep = useRef(0);

  const resetCanvas = useCallback(() => {
    _dirty = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    ctx.clearRect(0, 0, width, height);
  }, [canvasRef]);

  const saveCanvas = useCallback(() => {
    if (!_dirty) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    const data = canvas.toDataURL("image/jpeg", 0.1);
    setImage(data);
  }, [canvasRef, setImage]);

  // Get mouse or touch coordinates relative to the canvas
  const getPoint = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if (e instanceof TouchEvent) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = (e as MouseEvent).clientX - rect.left;
        y = (e as MouseEvent).clientY - rect.top;
      }
      return { x, y };
    },
    [canvasRef]
  );

  const handlePointerDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      drawing.current = true;
      strokeStep.current = 0;
      const point = getPoint(e);
      if (point) {
        lastPoint.current = point;
      }
    },
    [getPoint]
  );

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!drawing.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const point = getPoint(e);
      if (ctx && point && lastPoint.current) {
        // Calculate width: linear fade from MAX_WIDTH to MIN_WIDTH
        const t = Math.min(strokeStep.current / STROKE_FADE_STEPS, 1);
        const width = MAX_WIDTH * (1 - t) + MIN_WIDTH * t;
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.stroke();
        lastPoint.current = point;
        strokeStep.current += 1;
        _dirty = true;
      }
    },
    [getPoint]
  );

  const handlePointerUp = useCallback(() => {
    drawing.current = false;
    lastPoint.current = null;
    strokeStep.current = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Mouse events
    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    // Touch events
    canvas.addEventListener("touchstart", handlePointerDown);
    canvas.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);
    return () => {
      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Handle HiDPI/retina screens
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetCanvas();
    }
  }, [resetCanvas]);

  return (
    <div className="canvas-container">
      <div className="crosshairs" />
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          touchAction: "none",
        }}
      ></canvas>
      <div className="buttons-section">
        {onCancel && (
          <button className="button cancel-button" onClick={onCancel}>
            ❌
          </button>
        )}
        <button className="button clear-button" onClick={resetCanvas}>
          🗑️
        </button>
        <button className="button save-button" onClick={saveCanvas}>
          💾
        </button>
      </div>
    </div>
  );
};

export default FlashcardCanvas;
