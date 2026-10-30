"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppContent } from "@/i18n/locale-provider";

export function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = useAppContent().driver.job;
  const [drawing, setDrawing] = useState(false);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#1c1917";
    setDrawing(true);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
    onChange(canvas?.toDataURL("image/png") ?? null);
  };

  const end = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    onChange(null);
  };

  return <div className="space-y-3"><canvas ref={canvasRef} width={640} height={220} className="h-48 w-full touch-none rounded-xl border border-stone-300 bg-white" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} aria-label={t.signaturePadLabel} /><Button variant="outline" onClick={clear}>{t.clearSignature}</Button></div>;
}
