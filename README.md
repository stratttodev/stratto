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
</p>

---

## Stack

| Capa | Tecnología |
|------|------------|
| <img src="https://img.shields.io/badge/Framework-000?style=flat-square&logo=astro&logoColor=FF5D01" height="22"> | **Astro 5** + islas de React 18 |
| <img src="https://img.shields.io/badge/Monorepo-000?style=flat-square&logo=turborepo&logoColor=EF4444" height="22"> | **Turborepo 2** · pnpm workspaces 9 |
| <img src="https://img.shields.io/badge/Estilos-000?style=flat-square&logo=tailwindcss&logoColor=06B6D4" height="22"> | **Tailwind CSS v4** · configuración CSS nativa |
| <img src="https://img.shields.io/badge/UI-000?style=flat-square&logo=shadcnui&logoColor=white" height="22"> | **shadcn/ui** sobre Base UI (New York) |
| <img src="https://img.shields.io/badge/Animación-000?style=flat-square&logo=framer&logoColor=white" height="22"> | **Motion 11** + View Transitions + GSAP |
| <img src="https://img.shields.io/badge/Fonts-000?style=flat-square&logo=googlefonts&logoColor=white" height="22"> | **Lilex** + **Cascadia Code** (self-hosted) |
| <img src="https://img.shields.io/badge/Shader-000?style=flat-square&logo=webgl&logoColor=990000" height="22"> | **WebGL2** · fluid background interactivo |
| <img src="https://img.shields.io/badge/Deploy-000?style=flat-square&logo=vercel&logoColor=white" height="22"> | **Vercel** via `@astrojs/vercel` |

---

## Arquitectura

```mermaid
graph LR
  subgraph apps["apps"]
    WEB["@stratto/web"]
    LAB["@stratto/lab"]
  end

  subgraph packages["packages"]
    TOKENS["@stratto/tokens"]
    UI["@stratto/ui"]
  end

  WEB --> UI
  WEB --> TOKENS
  LAB -.-> UI
  LAB -.-> TOKENS
  UI --> TOKENS

  style WEB fill:#202920,stroke:#1D5336,color:#dff4e0
  style LAB fill:#202920,stroke:#1D5336,color:#dff4e0,stroke-dasharray:4 4
  style TOKENS fill:#123329,stroke:#1D5336,color:#dff4e0
  style UI fill:#123329,stroke:#1D5336,color:#dff4e0
  style apps fill:transparent,stroke:#1D5336,color:#dff4e0
  style packages fill:transparent,stroke:#1D5336,color:#dff4e0
```

```
stratto/
├── apps/
│   └── web/            Landing pública (@stratto/web)
├── packages/
│   ├── tokens/         Design tokens (@stratto/tokens)
│   └── ui/             Componentes React (@stratto/ui)
```

Cada paquete es workspace independiente, consumido por las apps via `workspace:*`.

---

## Design System

### Paleta Ancla

<table>
  <tr>
    <td width="110"><b>Terminal Black</b></td>
    <td width="70"><code>#202920</code></td>
    <td width="100"><img src="https://img.shields.io/badge/&#9632;-202920?style=flat-square&labelColor=202920&color=202920" alt="#202920"></td>
    <td><code>--color-terminal-black</code></td>
  </tr>
  <tr>
    <td><b>Pixel Clean</b></td>
    <td><code>#dff4e0</code></td>
    <td><img src="https://img.shields.io/badge/&#9632;-dff4e0?style=flat-square&labelColor=dff4e0&color=dff4e0" alt="#dff4e0"></td>
    <td><code>--color-pixel-clean</code></td>
  </tr>
  <tr>
    <td><b>Syntax Lime</b></td>
    <td><code>oklch(93.1% 0.228 122.9)</code></td>
    <td><img src="https://img.shields.io/badge/&#9632;-lime?style=flat-square&labelColor=93ee7a&color=93ee7a" alt="syntax-lime"></td>
    <td><code>--color-syntax-lime</code></td>
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

Grises y verdes complementarios via `neutral-*` y `lime-*` de Tailwind v4.

---

## Primeros pasos

```bash
git clone https://github.com/rodfuentealba/stratto.git
cd stratto
pnpm install
pnpm web        # http://localhost:4321
pnpm build      # build completo
pnpm lint       # type-check
pnpm format     # prettier
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Turbo: todas las apps |
| `pnpm web` | Solo apps/web |
| `pnpm build` | Build completo |
| `pnpm lint` | Type-check |
| `pnpm format` | Prettier |

---

<p align="center">
  <sub>Hecho con </sub>
  <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-FF5D01?style=flat-square&logo=astro&logoColor=white" height="20" alt="Astro"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white" height="20" alt="React"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" height="20" alt="Tailwind"></a>
  <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" height="20" alt="Turborepo"></a>
  <sub> · STRATTO 2026</sub>
</p>
