import { useEffect, useState } from "react";

export default function AmbientBackground() {
  const [pointer, setPointer] = useState({
    x: "50%",
    y: "20%",
    opacity: 0.65,
  });

  useEffect(() => {
    const handlePointerMove = (event) => {
      setPointer({
        x: `${event.clientX}px`,
        y: `${event.clientY}px`,
        opacity: 0.85,
      });
    };

    const handlePointerLeave = () => {
      setPointer((current) => ({
        ...current,
        opacity: 0.35,
      }));
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="subtle-grid absolute inset-0 opacity-30" />

      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: pointer.opacity,
          background: `
            radial-gradient(320px circle at ${pointer.x} ${pointer.y}, rgba(56, 189, 248, 0.14), transparent 65%),
            radial-gradient(220px circle at calc(${pointer.x} - 120px) calc(${pointer.y} + 80px), rgba(249, 115, 22, 0.08), transparent 72%)
          `,
        }}
      />

      <div className="absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[140px]" />
      <div className="absolute bottom-[-8rem] right-[8%] h-[20rem] w-[20rem] rounded-full bg-orange-500/10 blur-[140px]" />
    </div>
  );
}
