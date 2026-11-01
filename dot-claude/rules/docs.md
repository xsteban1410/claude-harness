---
paths:
  - ".ai/**"
---
# Plan e historial del proyecto (.ai/)

- `.ai/` solo tiene `currentplan.md` (plan vigente: contexto, pasos con ✓, verificación) y `history.md` (una línea
  `AAAA-MM-DD <cambio>` por cambio; leer con tail). Puede haber docs propios del repo (diseño, roadmap) que se leen solo si la tarea los pide.
- Plan primero: antes de cambiar algo se escribe el plan y se acuerda con el usuario; al terminarlo, se resume en history.md y se sustituye.
- Hechos duraderos, decisiones y preferencias van a la memoria nativa (~/.claude/projects/<repo>/memory), no a archivos de `.ai/`.
- Quien escribe `.ai/` es un subagente Haiku con effort low (`Agent` con `model: haiku`, `effort: low`, Read/Write, sin heredocs);
  al cerrar la sesión, subagente `guardian`.
- `.ai/` y `CLAUDE.md` son privados (`.git/info/exclude`).
