## Harness por proyecto (claude-harness)
- Cada repositorio tiene solo `AGENTS.md` (raíz) y `.ai/`; `.claude` existe únicamente en ~/.claude.
- Si un repositorio no los tiene, créalos desde las plantillas de ~/.claude/templates (`AGENTS.md` y `.ai/`), rellenando
  `AGENTS.md` en base al repositorio (qué es, cómo se ejecuta, convenciones) y añadiéndolos a `.git/info/exclude`.
- Al empezar leer `AGENTS.md` y, en orden, `.ai/currentplan.md`, `.ai/status.md`, `.ai/task.md`, `.ai/memory.md`.
- Reglas generales (autonomy, docs) y subagente `guardian`: ~/.claude/rules y ~/.claude/agents.
