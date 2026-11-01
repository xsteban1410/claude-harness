## Harness por proyecto (claude-harness)
Si el proyecto tiene `.agents/` o `.ai/`:
- Al empezar leer `.agents/AGENTS.md` y, en orden, `.ai/currentplan.md`, `.ai/status.md`, `.ai/task.md`, `.ai/memory.md`.
- Reglas: `.agents/rules/*.md`; las que llevan `paths` se leen solo al tocar esos archivos.
- Skills: `.agents/skills/<nombre>/SKILL.md` cuando su descripción encaje. Subagentes del proyecto: `.agents/agents/`.
- Hooks del proyecto: `.agents/hooks/pre.sh` y `post.sh` los ejecuta el despachador global.
- Reglas generales (autonomy, docs) y subagente `guardian`: ~/.claude/rules y ~/.claude/agents.
- Proyecto nuevo sin harness: `claude-harness init` en su raíz.
