import { useState, useEffect, useRef, useCallback } from "react";
import {
  Globe, Laptop, Cart, Layout, Mobile,
  Palette, Brush2, Chat, Server, CpuBolt,
} from "reicon-react";

const STEPS = [
  { id: "intro" },
  { id: "empresa" },
  { id: "soluciones" },
  { id: "presupuesto" },
  { id: "email" },
] as const;

const SOLUCIONES: { label: string; icon: typeof Globe }[] = [
  { label: "Landing Page", icon: Globe },
  { label: "Web App", icon: Laptop },
  { label: "E-Commerce", icon: Cart },
  { label: "SaaS / Panel", icon: Layout },
  { label: "App Móvil", icon: Mobile },
  { label: "UI/UX Design", icon: Palette },
  { label: "Branding", icon: Brush2 },
  { label: "Consultoría", icon: Chat },
  { label: "DevOps / Infra", icon: Server },
  { label: "AI / ML", icon: CpuBolt },
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

  const stepRef = useRef(step);
  stepRef.current = step;

  const isValid = useCallback(() => {
    switch (stepRef.current) {
      case 0: return true;
      case 1: return empresa.trim().length > 0;
      case 2: return soluciones.length > 0;
      case 3: return true;
      case 4: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      default: return false;
    }
  }, [empresa, soluciones, email]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa,
          soluciones,
          presupuesto: `${MONEY[presupuesto[0]]} – ${MONEY[presupuesto[1]]} (USD)`,
          plazo: `${TIME[plazo[0]]} – ${TIME[plazo[1]]}`,
          email,
        }),
      });
      if (res.ok) setSubmitted(true);
      else alert("Hubo un error al enviar. Intenta de nuevo.");
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [empresa, soluciones, presupuesto, plazo, email]);

  const goNext = useCallback(() => {
    if (!isValid() || isSubmitting) return;
    if (stepRef.current === STEPS.length - 1) { handleSubmit(); return; }
    setDirection("forward");
    setStep((s) => s + 1);
  }, [isValid, isSubmitting, handleSubmit]);

  const goPrev = useCallback(() => {
    if (stepRef.current === 0 || isSubmitting) return;
    setDirection("backward");
    setStep((s) => s - 1);
  }, [isSubmitting]);

  const goNextRef = useRef(goNext);
  const goPrevRef = useRef(goPrev);
  goNextRef.current = goNext;
  goPrevRef.current = goPrev;

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (isSubmitting || submitted) return;
      if (document.activeElement?.getAttribute("type") === "range") return;
      if (e.key === "Enter") { e.preventDefault(); goNextRef.current(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrevRef.current(); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isSubmitting, submitted]);

  const toggleSolucion = (label: string) => {
    setSoluciones((p) => p.includes(label) ? p.filter((x) => x !== label) : [...p, label]);
  };

  const t = dark
    ? { bg: "#000000", bgCard: "#0a0f0a", fg: "#dff4e0", fgMuted: "rgba(223,244,224,0.45)", fgDim: "rgba(223,244,224,0.15)", accent: "#00DA9D", border: "rgba(223,244,224,0.12)", borderInput: "rgba(223,244,224,0.15)" }
    : { bg: "#ffffff", bgCard: "#f7fffd", fg: "#1a1a1a", fgMuted: "rgba(26,26,26,0.5)", fgDim: "rgba(26,26,26,0.1)", accent: "#00DA9D", border: "rgba(26,26,26,0.12)", borderInput: "rgba(26,26,26,0.2)" };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  if (submitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: t.bg }}>
        <div className="max-w-lg w-full px-8 text-center">
          <div className="border rounded-lg p-8 text-left" style={{ borderColor: `${t.accent}4D`, backgroundColor: t.bgCard }}>
            <p className="font-mono text-sm mb-2" style={{ color: t.accent }}>$ ./proyecto-enviado.sh</p>
            <p className="font-mono text-xs mb-6" style={{ color: t.fgDim }}>exit status: 0</p>
            <h2 className="font-display font-bold italic text-2xl md:text-3xl mb-4" style={{ color: t.fg }}>Datos recibidos con éxito</h2>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: t.fgMuted }}>
              Gracias, esperamos con ansias el día en que tu proyecto cobre vida. Te contactaremos pronto.
            </p>
            <div className="pt-4" style={{ borderTop: `1px solid ${t.accent}33` }}>
              <p className="font-mono text-xs" style={{ color: `${t.accent}66` }}>
                stratto@labs:~$<span className="cursor-blink ml-1">_</span>
              </p>
            </div>
          </div>
          <a href="/" className="block mt-6 font-mono text-sm" style={{ color: t.accent }}>← Volver al inicio</a>
        </div>
      </div>
    );
  }

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
      <input
        type="text" value={empresa} onChange={(e) => setEmpresa(e.target.value)}
        placeholder="Mi Startup, Proyecto X..." autoFocus={step === 1}
        className="contact-input w-full bg-transparent font-body text-lg md:text-xl py-3 outline-none transition-colors"
        style={{ borderBottom: `2px solid ${t.borderInput}`, color: t.fg }}
        onFocus={(e) => { e.currentTarget.style.borderBottomColor = t.accent; }}
        onBlur={(e) => { e.currentTarget.style.borderBottomColor = t.borderInput; }}
      />
    </div>,

    /* 2: Soluciones */
    <div key="soluciones" className="w-full max-w-2xl">
      <p className="font-mono text-sm mb-3" style={{ color: t.accent }}>// 02</p>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight" style={{ color: t.fg }}>
        ¿Qué <span className="font-bold italic">solución</span> necesitas?
      </h2>
      <p className="font-body text-sm mb-10" style={{ color: t.fgMuted }}>Selecciona todas las que apliquen.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SOLUCIONES.map(({ label, icon: Icon }) => {
          const active = soluciones.includes(label);
          return (
            <button
              key={label} type="button" onClick={() => toggleSolucion(label)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-body text-sm text-left transition-all duration-200"
              style={{
                border: `1px solid ${active ? t.accent : t.border}`,
                backgroundColor: active ? `${t.accent}14` : "transparent",
                color: active ? t.accent : t.fgMuted,
              }}
            >
              <Icon size={18} color={active ? t.accent : t.fgMuted} weight="Outline" />
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
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="hola@tuempresa.com" autoFocus={step === 4}
        className="contact-input w-full bg-transparent font-body text-lg md:text-xl py-3 outline-none transition-colors"
        style={{ borderBottom: `2px solid ${!email ? t.borderInput : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? t.accent : "#ef4444"}`, color: t.fg }}
        onFocus={(e) => { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.currentTarget.style.borderBottomColor = t.accent; }}
        onBlur={(e) => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.currentTarget.style.borderBottomColor = email ? "#ef4444" : t.borderInput; }}
      />
      {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
        <p className="font-mono text-xs mt-3" style={{ color: "#ef4444" }}>
          {!email.includes("@") ? "Falta el @ — ejemplo: hola@empresa.com"
           : !/@\S+\.\S+/.test(email) ? "Falta el dominio — ejemplo: hola@empresa.com"
           : "Formato no válido — ejemplo: hola@empresa.com"}
        </p>
      )}
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
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-6 md:px-12">
        {stepContent.map((content, i) => {
          const isActive = i === step;
          const isPast = i < step;
          const isFuture = i > step;

          let tx = "0%";
          if (isPast) tx = "-100%";
          if (isFuture) tx = "100%";

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
              {isSubmitting ? "Enviando..." : step === STEPS.length - 1 ? "Enviar Proyecto 🚀" : "Siguiente →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
