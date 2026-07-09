<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/stratt%CF%83-202920?style=flat-square&labelColor=141D18">
  <img alt="strattσ" src="https://img.shields.io/badge/stratt%CF%83-202920?style=flat-square&labelColor=141D18">
</picture>

**Laboratorio de tecnología, desarrollo de software y diseño de interfaces.**

[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)
[![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

---

- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Design System](#design-system)
- [Componentes](#componentes)
- [Primeros pasos](#primeros-pasos)
- [Scripts](#scripts)
- [Estructura](#estructura)

---

## Stack

| Capa | Tecnología |
|------|------------|
| **Framework** | Astro 5 con islas de React 18 |
| **Monorepo** | Turborepo 2 + pnpm workspaces 9 |
| **Estilos** | Tailwind CSS v4 (config en CSS con `@theme`) |
| **UI** | shadcn/ui sobre Base UI (New York style) |
| **Animación** | Motion 11 (React), View Transitions API, GSAP (scroll storytelling) |
| **Tipografía** | Lilex + Cascadia Code vía Fontsource (self-hosted) |
| **Shader** | WebGL2 con GLSL (fluid background interactivo) |
| **Deploy** | Vercel via `@astrojs/vercel` |

## Arquitectura

```
stratto/
├── apps/
│   └── web/          → Landing pública (@stratto/web)
├── packages/
│   ├── tokens/       → Design tokens (@stratto/tokens)
│   ├── ui/           → Componentes React compartidos (@stratto/ui)
│   └── config/       → Configuraciones compartidas
```

Cada paquete es un workspace independiente versionado, consumido por las apps como dependencias locales via `workspace:*`.

## Design System

Tres colores ancla definidos en `packages/tokens/tokens.css` desde el brand board de Figma:

| Token | CSS Variable | Valor |
|-------|-------------|-------|
| Terminal Black | `--color-terminal-black` | `#202920` |
| Pixel Clean | `--color-pixel-clean` | `#dff4e0` |
| Syntax Lime | `--color-syntax-lime` | `oklch(93.1% 0.228 122.9)` |

Mapeo semántico:
- `--color-bg` → Terminal Black
- `--color-fg` → Pixel Clean
- `--color-accent` → Syntax Lime

Las escalas de grises y verdes se completan con la paleta nativa `neutral-*` y `lime-*` de Tailwind.

### Fluid Background

El componente `FluidBackground` renderiza un shader WebGL2 con dominio warping que genera patrones fluidos orgánicos. Configurable via props:

| Prop | Default | Descripción |
|------|---------|-------------|
| `color1` | `#202920` | Base oscura |
| `color2` | `#123329` | Tono medio |
| `color3` | `#1D5336` | Acento |
| `opacity` | `0.5` | Opacidad del efecto |
| `speed` | `0.1` | Velocidad de flujo |
| `noiseScale` | `1.4` | Escala del ruido |
| `grainFilm` | `0.071` | Granulado |
| `pointerEffect` | `true` | Interacción con el mouse |

## Componentes

Todos los componentes están en `packages/ui/src/` y se exportan desde `@stratto/ui`.

Para agregar componentes de shadcn/ui:

```bash
cd apps/web
pnpm dlx shadcn@latest add button card dialog
```

Se registran automáticamente en `packages/ui/src/` y se re-exportan.

## Primeros pasos

```bash
# Clonar e instalar
git clone https://github.com/<user>/stratto.git
cd stratto
pnpm install

# Desarrollo
pnpm web          # apps/web → http://localhost:4321

# O desde la raíz
pnpm dev          # turbo corre todas las apps en paralelo

# Build
pnpm build

# Lint
pnpm lint
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Turbo: todas las apps en dev |
| `pnpm web` | Solo apps/web con Astro |
| `pnpm build` | Build completo |
| `pnpm lint` | Type-check con `astro check` |
| `pnpm format` | Prettier |

## Estructura

```
apps/web/src/
├── layouts/
│   └── Layout.astro     → Layout base (head, fonts, body)
├── pages/
│   └── index.astro      → Landing page
└── styles/
    └── global.css       → Tailwind v4 + @theme

packages/
├── tokens/
│   └── tokens.css       → CSS custom properties
├── ui/src/
│   ├── index.ts
│   └── fluid-background.tsx  → Shader WebGL2
└── config/
```

---

Hecho con [Astro](https://astro.build), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com) y [Turborepo](https://turbo.build).
