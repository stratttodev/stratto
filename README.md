<p align="center">
  <img src="https://img.shields.io/badge/stratt%CF%83-202920?style=for-the-badge&logoColor=dff4e0&labelColor=141D18" alt="strattσ">
</p>

<p align="center">
  <b>Laboratorio de tecnología, desarrollo de software y diseño de interfaces.</b>
</p>

<p align="center">
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-5-FF5D01?style=flat-square&logo=astro&logoColor=white" alt="Astro"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"></a>
  <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-2-EF4444?style=flat-square&logo=turborepo&logoColor=white" alt="Turborepo"></a>
  <a href="https://pnpm.io"><img src="https://img.shields.io/badge/pnpm-9-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm"></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"></a>
  <a href="https://webgl2fundamentals.org"><img src="https://img.shields.io/badge/WebGL2-GLSL-990000?style=flat-square&logo=webgl&logoColor=white" alt="WebGL2"></a>
</p>

---

## Stack

| Capa | Tecnología |
|------|------------|
| <img src="https://img.shields.io/badge/Framework-000?style=flat-square&logo=astro&logoColor=FF5D01" height="22"> | **Astro 5** — islas de React 18 + View Transitions |
| <img src="https://img.shields.io/badge/Monorepo-000?style=flat-square&logo=turborepo&logoColor=EF4444" height="22"> | **Turborepo 2** — pnpm workspaces 9 |
| <img src="https://img.shields.io/badge/Estilos-000?style=flat-square&logo=tailwindcss&logoColor=06B6D4" height="22"> | **Tailwind CSS v4** — `@theme` en CSS nativo |
| <img src="https://img.shields.io/badge/UI-000?style=flat-square&logo=shadcnui&logoColor=white" height="22"> | **shadcn/ui** — Base UI (New York) |
| <img src="https://img.shields.io/badge/Animación-000?style=flat-square&logo=framer&logoColor=white" height="22"> | **Motion 11** + View Transitions + GSAP |
| <img src="https://img.shields.io/badge/Tipografía-000?style=flat-square&logo=googlefonts&logoColor=white" height="22"> | **Lilex** + **Cascadia Code** (Fontsource self-hosted) |
| <img src="https://img.shields.io/badge/Shader-000?style=flat-square&logo=webgl&logoColor=990000" height="22"> | **WebGL2** — GLSL fluid background interactivo |
| <img src="https://img.shields.io/badge/Deploy-000?style=flat-square&logo=vercel&logoColor=white" height="22"> | **Vercel** — `@astrojs/vercel` |

---

## Arquitectura

```mermaid
graph TD
  subgraph apps[" apps "]
    WEB["@stratto/web<br><small>Landing Astro</small>"]
    LAB["@stratto/lab<br><small>Futuro SaaS</small>"]
  end

  subgraph packages[" packages "]
    TOKENS["@stratto/tokens<br><small>Design Tokens</small>"]
    UI["@stratto/ui<br><small>Componentes React</small>"]
    CFG["@stratto/config<br><small>Config compartida</small>"]
  end

  WEB --> UI
  WEB --> TOKENS
  LAB --> UI
  LAB --> TOKENS
  UI --> TOKENS

  style WEB fill:#202920,stroke:#1D5336,color:#dff4e0
  style LAB fill:#202920,stroke:#1D5336,color:#dff4e0,stroke-dasharray: 4 4
  style TOKENS fill:#123329,stroke:#1D5336,color:#dff4e0
  style UI fill:#123329,stroke:#1D5336,color:#dff4e0
  style CFG fill:#141D18,stroke:#1D5336,color:#dff4e0,stroke-dasharray: 4 4
  style apps fill:transparent,stroke:#1D5336,color:#dff4e0
  style packages fill:transparent,stroke:#1D5336,color:#dff4e0
```

Cada paquete es un workspace independiente versionado, consumido por las apps como dependencias locales via `workspace:*`.

---

## Design System

### Paleta Ancla

<table>
  <tr>
    <td width="120"><b>Terminal Black</b></td>
    <td width="80"><code>#202920</code></td>
    <td width="60"><code>--color-terminal-black</code></td>
    <td width="100"><img src="https://img.shields.io/badge/&#9632;-202920?style=flat-square&labelColor=202920&color=202920" alt="#202920"></td>
  </tr>
  <tr>
    <td><b>Pixel Clean</b></td>
    <td><code>#dff4e0</code></td>
    <td><code>--color-pixel-clean</code></td>
    <td><img src="https://img.shields.io/badge/&#9632;-dff4e0?style=flat-square&labelColor=dff4e0&color=dff4e0" alt="#dff4e0"></td>
  </tr>
  <tr>
    <td><b>Syntax Lime</b></td>
    <td><code>oklch(93.1% 0.228 122.9)</code></td>
    <td><code>--color-syntax-lime</code></td>
    <td><img src="https://img.shields.io/badge/&#9632;-lime?style=flat-square&labelColor=93ee7a&color=93ee7a" alt="syntax-lime"></td>
  </tr>
</table>

### Paleta Fluid Background

<table>
  <tr>
    <td width="120"><b>Deep Base</b></td>
    <td width="80"><code>#202920</code></td>
    <td><code>color1</code></td>
    <td><img src="https://img.shields.io/badge/&#9632;-202920?style=flat-square&labelColor=202920&color=202920" alt="#202920"></td>
    <td rowspan="4" align="center">
      <span style="display:inline-block;padding:8px 16px;border-radius:6px;background:linear-gradient(135deg,#202920,#123329,#1D5336);color:#dff4e0;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,0.1)">fluido<br>orgánico</span>
    </td>
  </tr>
  <tr>
    <td><b>Forest</b></td>
    <td><code>#123329</code></td>
    <td><code>color2</code></td>
    <td><img src="https://img.shields.io/badge/&#9632;-123329?style=flat-square&labelColor=123329&color=123329" alt="#123329"></td>
  </tr>
  <tr>
    <td><b>Accent</b></td>
    <td><code>#1D5336</code></td>
    <td><code>color3</code></td>
    <td><img src="https://img.shields.io/badge/&#9632;-1D5336?style=flat-square&labelColor=1D5336&color=1D5336" alt="#1D5336"></td>
  </tr>
  <tr>
    <td><b>Deepest</b></td>
    <td><code>#141D18</code></td>
    <td>—</td>
    <td><img src="https://img.shields.io/badge/&#9632;-141D18?style=flat-square&labelColor=141D18&color=141D18" alt="#141D18"></td>
  </tr>
</table>

### Mapeo Semántico

| Variable | Token |
|----------|-------|
| `--color-bg` | <img src="https://img.shields.io/badge/&#9632;-202920?style=flat-square&labelColor=202920&color=202920" width="16"> Terminal Black |
| `--color-bg-inverse` | <img src="https://img.shields.io/badge/&#9632;-dff4e0?style=flat-square&labelColor=dff4e0&color=dff4e0" width="16"> Pixel Clean |
| `--color-fg` | <img src="https://img.shields.io/badge/&#9632;-dff4e0?style=flat-square&labelColor=dff4e0&color=dff4e0" width="16"> Pixel Clean |
| `--color-fg-inverse` | <img src="https://img.shields.io/badge/&#9632;-202920?style=flat-square&labelColor=202920&color=202920" width="16"> Terminal Black |
| `--color-accent` | <img src="https://img.shields.io/badge/&#9632;-lime?style=flat-square&labelColor=93ee7a&color=93ee7a" width="16"> Syntax Lime |

Las escalas de grises y verdes se completan con la paleta nativa `neutral-*` y `lime-*` de Tailwind v4 (~123° hue).

---

## Fluid Background

El componente <code>FluidBackground</code> renderiza un shader **WebGL2 con GLSL** que genera patrones fluidos orgánicos mediante domain warping, con capas de ruido FBM, modulación plasma, granulado y puntos de luz interactivos.

```
                          ┌──────────────┐
        Noise Scale ─────→│   FBM × 5    │
                          │ Domain Warp  │────→ f
        Mouse ───────────→│  (q → r → f) │
                          └──────────────┘
                          ┌──────────────┐
        Plasma ──────────→│  Modulation  │────→ mix(f, plasma, 0.1)
                          └──────────────┘
                          ┌──────────────┐
        Grain ───────────→│  Film Grain  │────→ col += grain
                          └──────────────┘
                          ┌──────────────┐
        Point ───────────→│   Particles  │────→ col = mix(col, pointCol)
                          └──────────────┘

        Color1 ─── #202920 ──┐
        Color2 ─── #123329 ──┤──→ mix → col
        Color3 ─── #1D5336 ──┘
```

### Props

| Prop | Default | Descripción |
|------|---------|-------------|
| <code>color1</code> | <img src="https://img.shields.io/badge/-202920?style=flat-square&labelColor=202920&color=202920" width="14"> `#202920` | Base oscura |
| <code>color2</code> | <img src="https://img.shields.io/badge/-123329?style=flat-square&labelColor=123329&color=123329" width="14"> `#123329` | Tono medio |
| <code>color3</code> | <img src="https://img.shields.io/badge/-1D5336?style=flat-square&labelColor=1D5336&color=1D5336" width="14"> `#1D5336` | Acento |
| <code>opacity</code> | `0.5` | Opacidad del efecto |
| <code>speed</code> | `0.10` | Velocidad de flujo |
| <code>noiseScale</code> | `1.4` | Escala del ruido |
| <code>grainFilm</code> | `0.071` | Intensidad de granulado |
| <code>pointerEffect</code> | `true` | Interacción con el mouse |

---

## Componentes

Todos los componentes están en <code>packages/ui/src/</code> y se exportan desde <code>@stratto/ui</code>.

Para agregar componentes de shadcn/ui:

```bash
cd apps/web
pnpm dlx shadcn@latest add button card dialog
```

Se registran automáticamente en <code>packages/ui/src/</code> y se re-exportan.

---

## Primeros pasos

```bash
# Clonar e instalar
git clone https://github.com/rodfuentealba/stratto.git
cd stratto
pnpm install

# Desarrollo
pnpm web          # apps/web → http://localhost:4321
pnpm dev          # turbo corre todas las apps en paralelo

# Build & Lint
pnpm build
pnpm lint
pnpm format
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Turbo: todas las apps en dev |
| `pnpm web` | Solo <code>apps/web</code> con Astro |
| `pnpm build` | Build completo |
| `pnpm lint` | Type-check con <code>astro check</code> |
| `pnpm format` | Prettier |

## Estructura

```
apps/web/src/
├── layouts/
│   └── Layout.astro          Layout base (head, fonts, body)
├── pages/
│   └── index.astro           Landing page con typewriter
└── styles/
    └── global.css            Tailwind v4 + @theme

packages/
├── tokens/
│   └── tokens.css            CSS custom properties (paleta)
├── ui/src/
│   ├── index.ts              Export público
│   └── fluid-background.tsx  Shader WebGL2 con GLSL
└── config/                   (reservado)
```

---

<p align="center">
  <sub>Hecho con </sub>
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-FF5D01?style=flat-square&logo=astro&logoColor=white" height="20" alt="Astro"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white" height="20" alt="React"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" height="20" alt="Tailwind"></a>
  <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" height="20" alt="Turborepo"></a>
  <sub> · STRATTO 2026</sub>
</p>
