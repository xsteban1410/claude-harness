## Harness por proyecto (claude-harness)
Si el proyecto tiene `AGENTS.md` o `.ai/`:
- Al empezar leer `AGENTS.md` (raíz) y, en orden, `.ai/currentplan.md`, `.ai/status.md`, `.ai/task.md`, `.ai/memory.md`.
- Extras opcionales del proyecto dentro de `.ai/`: `rules/*.md` (las que llevan `paths` se leen solo al tocar esos archivos),
  `skills/<nombre>/SKILL.md` (cuando su descripción encaje), `design/`, y `hooks/pre.sh` / `post.sh` (los ejecuta el despachador global).
- Reglas generales (autonomy, docs) y subagente `guardian`: ~/.claude/rules y ~/.claude/agents.
- Proyecto nuevo sin harness: `claude-harness init` en su raíz.
