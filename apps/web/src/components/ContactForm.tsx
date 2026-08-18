import { useState, useEffect, useRef, useCallback } from "react";

const STEPS = [
  { id: "intro" },
  { id: "empresa" },
  { id: "soluciones" },
  { id: "presupuesto" },
  { id: "email" },
  { id: "success" },
] as const;

function Icon({ d, size = 18, color = "currentColor" }: { d: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={d} fill={color} />
    </svg>
  );
}

const SOLUCIONES: { label: string; path: string }[] = [
  { label: "Landing Page", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
  { label: "Web App", path: "M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" },
  { label: "E-Commerce", path: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" },
  { label: "SaaS / Panel", path: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { label: "App Móvil", path: "M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" },
  { label: "UI/UX Design", path: "M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0112 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 00-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 012.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" },
  { label: "Branding", path: "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" },
  { label: "Consultoría", path: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" },
  { label: "DevOps / Infra", path: "M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" },
  { label: "AI / ML", path: "M21 11.18V9l-1.25-.61-1.75-3.5-1.25-.88V4h-1v.31l-1.5 1.09L13.18 4H12v.5l1.5 1.09L12 6.5V8h1V6.56l1.25-.61L15.5 4.5 16.75 4h1.25l1.5 1.09V6.5h1V5.09l1.25.88 1.25.61v2.18l-1.25.61-1.5 1.09V12h1v-1.09l1.25-.61L22.5 9l1.25-.88V6.5l-2.75 4.68zM9.5 7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zM16 17H8v-2h2.5c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5H7v-2h4c.55 0 1 .45 1 1v1.5c0 .28-.22.5-.5.5H7v2h9z" },
];

const MONEY = ["$1.000", "$5.000", "$10.000", "$25.000", "$50.000", "$100.000+"];
const TIME = ["1 mes", "2 meses", "+6 meses", "+1 año", "+2 años"];

function DualRange({
  min, max, value, onChange, labels, trackColor, dimColor
}: {
  min: number; max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  labels: string[];
  trackColor: string; dimColor: string;
}) {
  const [lo, hi] = value;
  const pctLo = (lo / (labels.length - 1)) * 100;
  const pctHi = (hi / (labels.length - 1)) * 100;
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"lo" | "hi" | null>(null);

  const valueFromX = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * (labels.length - 1));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const v = valueFromX(e.clientX);
    const distLo = Math.abs(v - lo);
    const distHi = Math.abs(v - hi);
    const target = distLo <= distHi ? "lo" : "hi";
    dragging.current = target;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (target === "lo") onChange([Math.min(v, hi), hi]);
    else onChange([lo, Math.max(v, lo)]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const v = valueFromX(e.clientX);
    if (dragging.current === "lo") onChange([Math.min(v, hi), hi]);
    else onChange([lo, Math.max(v, lo)]);
  };

  const onPointerUp = () => { dragging.current = null; };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="relative w-full h-8 flex items-center cursor-pointer touch-none select-none"
        role="slider"
        aria-label={labels[0] ? `Rango de ${labels[0]} a ${labels[labels.length - 1]}` : "Selector de rango"}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={lo}
        aria-valuetext={`${labels[lo]} a ${labels[hi]}`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="absolute w-full h-1 rounded-full pointer-events-none" style={{ backgroundColor: dimColor }} />
        <div
          className="absolute h-1 rounded-full pointer-events-none"
          style={{
            left: `${pctLo}%`,
            width: `${pctHi - pctLo}%`,
            backgroundColor: trackColor,
            transition: dragging.current ? "none" : "left 0.15s ease, width 0.15s ease",
          }}
        />
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{ left: `calc(${pctLo}% - 3px)`, backgroundColor: trackColor, transition: dragging.current ? "none" : "left 0.15s ease" }}
        />
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{ left: `calc(${pctHi}% - 3px)`, backgroundColor: trackColor, transition: dragging.current ? "none" : "left 0.15s ease" }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {labels.map((l, i) => (
          <span
            key={l} className="font-body text-xs"
            style={{ color: i >= lo && i <= hi ? trackColor : dimColor, transition: "color 0.15s ease" }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function useDarkMode() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const html = document.documentElement;
    const stored = localStorage.getItem("stratto-theme");
    const initial = stored ? stored === "dark" : html.classList.contains("dark");
    setDark(initial);
    const obs = new MutationObserver(() => setDark(html.classList.contains("dark")));
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function ContactForm() {
  const dark = useDarkMode();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [empresa, setEmpresa] = useState("");
  const [soluciones, setSoluciones] = useState<string[]>([]);
  const [presupuesto, setPresupuesto] = useState<[number, number]>([1, 4]);
  const [plazo, setPlazo] = useState<[number, number]>([0, 3]);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("/api/csrf-token", { method: "GET" })
      .then((r) => r.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => {});
  }, []);

  const stepRef = useRef(step);
  stepRef.current = step;

  const empresaRef = useRef(empresa);
  empresaRef.current = empresa;
  const solucionesRef = useRef(soluciones);
  solucionesRef.current = soluciones;
  const emailRef = useRef(email);
  emailRef.current = email;

  const isValid = useCallback(() => {
    switch (stepRef.current) {
      case 0: return true;
      case 1: return empresaRef.current.trim().length > 0;
      case 2: return solucionesRef.current.length > 0;
      case 3: return true;
      case 4: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRef.current);
      default: return false;
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csrfToken,
          empresa,
          soluciones,
          presupuesto: `${MONEY[presupuesto[0]]} – ${MONEY[presupuesto[1]]} (USD)`,
          plazo: `${TIME[plazo[0]]} – ${TIME[plazo[1]]}`,
          email,
        }),
      });
      if (res.ok) {
        setDirection("forward");
        setStep(5);
        setSubmitted(true);
      } else alert("Hubo un error al enviar. Intenta de nuevo.");
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [csrfToken, empresa, soluciones, presupuesto, plazo, email]);

  const goNext = useCallback(() => {
    if (!isValid() || isSubmitting || submitted) return;
    if (stepRef.current === STEPS.length - 2) { handleSubmit(); return; }
    setDirection("forward");
    setStep((s) => s + 1);
  }, [isValid, isSubmitting, submitted, handleSubmit]);

  const goPrev = useCallback(() => {
    if (stepRef.current === 0 || isSubmitting) return;
    setDirection("backward");
    setStep((s) => s - 1);
  }, [isSubmitting]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (isSubmitting || submitted) return;
      if (document.activeElement?.getAttribute("type") === "range") return;
      if (e.key === "Enter") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isSubmitting, submitted, goNext, goPrev]);

  const toggleSolucion = (label: string) => {
    setSoluciones((p) => p.includes(label) ? p.filter((x) => x !== label) : [...p, label]);
  };

  const t = dark
    ? { bg: "#202920", bgCard: "#1a231a", fg: "#dff4e0", fgMuted: "rgba(223,244,224,0.45)", fgDim: "rgba(223,244,224,0.15)", accent: "#CDFF00", border: "rgba(223,244,224,0.12)", borderInput: "rgba(223,244,224,0.15)" }
    : { bg: "#ffffff", bgCard: "#f7fffd", fg: "#1a1a1a", fgMuted: "rgba(26,26,26,0.5)", fgDim: "rgba(26,26,26,0.1)", accent: "#CDFF00", border: "rgba(26,26,26,0.12)", borderInput: "rgba(26,26,26,0.2)" };

  const progressPct = submitted ? 100 : ((step + 1) / STEPS.length) * 100;

  const stepContent = [
    /* 0: Intro */
    <div key="intro" className="w-full max-w-2xl text-center">
      <p className="font-mono text-sm mb-4" style={{ color: t.accent }}>// 00</p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight" style={{ color: t.fg, viewTransitionName: "hero-cta" }}>
        Trabajemos <span className="font-bold italic">juntos</span>
      </h2>
      <p className="font-body text-sm leading-relaxed mb-10 max-w-md mx-auto" style={{ color: t.fgMuted }}>
        Nos pondremos en contacto contigo para darte una mejor atención.
        Necesitamos algunos datos para entender el contexto de tu proyecto.
      </p>
      <button
        type="button" onClick={goNext}
        className="font-mono text-sm px-8 py-3 rounded-full cursor-pointer"
        style={{ backgroundColor: t.accent, color: "#000000" }}
      >
        Comenzar →
      </button>
      <p className="font-mono text-xs mt-4" style={{ color: t.fgDim }}>Enter</p>
    </div>,

    /* 1: Empresa */
    <div key="empresa" className="w-full max-w-2xl">
      <p className="font-mono text-sm mb-3" style={{ color: t.accent }}>// 01</p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight" style={{ color: t.fg }}>
        ¿Cómo se llama tu <span className="font-bold italic">empresa o proyecto</span>?
      </h2>
      <p className="font-body text-sm mb-10" style={{ color: t.fgMuted }}>Un nombre, una idea, lo que tengas.</p>
      <label htmlFor="empresa" className="block">
        <span className="sr-only">Nombre de tu empresa o proyecto</span>
        <input
          id="empresa"
          type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)}
          placeholder="Mi Startup, Proyecto X..." autoFocus={step === 1}
          className="contact-input w-full bg-transparent font-body text-lg md:text-xl py-3 outline-none transition-colors"
          style={{ borderBottom: `2px solid ${t.borderInput}`, color: t.fg }}
          onFocus={(e) => { e.currentTarget.style.borderBottomColor = t.accent; }}
          onBlur={(e) => { e.currentTarget.style.borderBottomColor = t.borderInput; }}
        />
      </label>
    </div>,

    /* 2: Soluciones */
    <div key="soluciones" className="w-full max-w-2xl">
      <p className="font-mono text-sm mb-3" style={{ color: t.accent }}>// 02</p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight" style={{ color: t.fg }}>
        ¿Qué <span className="font-bold italic">solución</span> necesitas?
      </h2>
      <p className="font-body text-sm mb-10" style={{ color: t.fgMuted }}>Selecciona todas las que apliquen.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="group" aria-label="Soluciones disponibles">
        {SOLUCIONES.map(({ label, path }) => {
          const active = soluciones.includes(label);
          return (
            <button
              key={label} type="button" onClick={() => toggleSolucion(label)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-body text-sm text-left transition-all duration-200"
              aria-pressed={active}
              style={{
                border: `1px solid ${active ? t.accent : t.border}`,
                backgroundColor: active ? `${t.accent}14` : "transparent",
                color: active ? t.accent : t.fgMuted,
              }}
            >
              <Icon d={path} size={18} color={active ? t.accent : t.fgMuted} />
              <span className="font-display font-bold italic text-sm">{label}</span>
            </button>
          );
        })}
      </div>
    </div>,

    /* 3: Presupuesto + Plazo */
    <div key="presupuesto" className="w-full max-w-2xl">
      <p className="font-mono text-sm mb-3" style={{ color: t.accent }}>// 03</p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight" style={{ color: t.fg }}>
        Presupuesto y <span className="font-bold italic">plazo</span>
      </h2>
      <p className="font-body text-sm mb-10" style={{ color: t.fgMuted }}>Una guía para dimensionar el proyecto.</p>

      <div className="mb-10">
        <p className="font-display font-bold italic text-sm mb-4 uppercase tracking-wide" style={{ color: t.fgDim }}>Inversión estimada <span className="font-body font-normal not-italic">(USD)</span></p>
        <DualRange min={0} max={MONEY.length - 1} value={presupuesto} onChange={setPresupuesto} labels={MONEY} trackColor={t.accent} dimColor={t.fgDim} />
      </div>

      <div>
        <p className="font-display font-bold italic text-sm mb-4 uppercase tracking-wide" style={{ color: t.fgDim }}>Plazo estimado</p>
        <DualRange min={0} max={TIME.length - 1} value={plazo} onChange={setPlazo} labels={TIME} trackColor={t.accent} dimColor={t.fgDim} />
      </div>
    </div>,

    /* 4: Email */
    <div key="email" className="w-full max-w-2xl">
      <p className="font-mono text-sm mb-3" style={{ color: t.accent }}>// 04</p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight" style={{ color: t.fg }}>
        ¿Cuál es tu <span className="font-bold italic">email</span> de contacto?
      </h2>
      <p className="font-body text-sm mb-10" style={{ color: t.fgMuted }}>Para que te contactemos de vuelta.</p>
      <label htmlFor="email" className="block">
        <span className="sr-only">Email de contacto</span>
        <input
          id="email"
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="hola@tuempresa.com" autoFocus={step === 4}
          className="contact-input w-full bg-transparent font-body text-lg md:text-xl py-3 outline-none transition-colors"
          style={{ borderBottom: `2px solid ${!email ? t.borderInput : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? t.accent : "#ef4444"}`, color: t.fg }}
          onFocus={(e) => { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.currentTarget.style.borderBottomColor = t.accent; }}
          onBlur={(e) => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.currentTarget.style.borderBottomColor = email ? "#ef4444" : t.borderInput; }}
        />
      </label>
      {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
        <p className="font-mono text-xs mt-3" style={{ color: "#ef4444" }}>
          {!email.includes("@") ? "Falta el @ — ejemplo: hola@empresa.com"
           : !/@\S+\.\S+/.test(email) ? "Falta el dominio — ejemplo: hola@empresa.com"
           : "Formato no válido — ejemplo: hola@empresa.com"}
        </p>
      )}
    </div>,

    /* 5: Success */
    <div key="success" className="w-full max-w-2xl text-center">
      <p className="font-mono text-sm mb-4" style={{ color: t.accent }}>$ ./proyecto-enviado.sh</p>
      <p className="font-mono text-xs mb-6" style={{ color: t.fgDim }}>exit status: 0</p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight" style={{ color: t.fg }}>
        <span className="font-bold italic">Datos</span> recibidos con éxito
      </h2>
      <p className="font-body text-sm leading-relaxed mb-10 max-w-md mx-auto" style={{ color: t.fgMuted }}>
        Gracias, esperamos con ansias el día en que tu proyecto cobre vida. Te contactaremos pronto.
      </p>
      <div className="pt-6 mb-8" style={{ borderTop: `1px solid ${t.accent}33` }}>
        <p className="font-mono text-xs" style={{ color: `${t.accent}66` }}>
          stratto@labs:~$<span className="cursor-blink ml-1">_</span>
        </p>
      </div>
      <a
        href="https://stratto.dev"
        className="font-mono text-sm px-8 py-3 rounded-full inline-block"
        style={{ backgroundColor: t.accent, color: "#000000" }}
      >
        ← Volver al inicio
      </a>
    </div>,
  ];

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden z-0" style={{ backgroundColor: t.bg, height: "100dvh" }}>
      <style>{`
        .contact-input:-webkit-autofill,
        .contact-input:-webkit-autofill:hover,
        .contact-input:-webkit-autofill:focus,
        .contact-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px ${t.bg} inset !important;
          -webkit-text-fill-color: ${t.fg} !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      <div className="absolute top-0 left-0 w-full z-10" style={{ height: "2px", backgroundColor: t.border }}>
        <div className="h-full" style={{ width: `${progressPct}%`, backgroundColor: t.accent, transition: "width 0.3s ease-out" }} />
      </div>

      <div className="absolute top-16 left-0 w-full text-center z-10">
        <span className="font-mono text-xs" style={{ color: t.fgDim }}>
          {String(Math.min(step + 1, STEPS.length - 1)).padStart(2, "0")} / {String(STEPS.length - 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-6 md:px-12">
        {stepContent.map((content, i) => {
          const isActive = i === step;

          let tx = "0%";
          if (i < step) tx = "-100%";
          if (i > step) tx = "100%";

          return (
            <div
              key={STEPS[i].id}
              className="absolute inset-0 flex items-center justify-center px-6 md:px-12 overflow-y-auto"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transform: `translateX(${tx})`,
              }}
            >
              {content}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-8 md:pb-12 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              type="button" onClick={goPrev}
              className="font-mono text-sm transition-opacity duration-200"
              style={{ opacity: step === 0 ? 0 : 0.6, color: t.fg, pointerEvents: step === 0 ? "none" : "auto" }}
            >
              ← Atrás
            </button>
            {step > 0 && <span className="font-mono text-xs" style={{ color: t.fgDim }}>←</span>}
          </div>

          {step > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs" style={{ color: t.fgDim }}>Enter</span>
              <button
                type="button" onClick={goNext} disabled={!isValid() || isSubmitting}
                className="font-mono text-sm px-6 py-3 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isValid() && !isSubmitting ? t.accent : t.border,
                  color: isValid() && !isSubmitting ? "#000000" : t.fgDim,
                  cursor: isValid() && !isSubmitting ? "pointer" : "not-allowed",
                }}
              >
                {isSubmitting ? "Enviando..." : step === STEPS.length - 2 ? "Enviar Proyecto 🚀" : "Siguiente →"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
