# claude-harness

Arnés general para Claude Code. Usa solo mecanismos nativos: el `CLAUDE.md` global define cómo trabajar en todos los
proyectos, cada repo tiene su `CLAUDE.md` (se carga solo) y un `.ai/` mínimo, y los hechos duraderos van a la memoria
nativa de Claude Code (`~/.claude/projects/<repo>/memory`).

## Qué contiene

| En el repo | Se instala en | Para qué |
|---|---|---|
| `dot-claude/CLAUDE.md` | bloque en `~/.claude/CLAUDE.md` | estructura por repo; si falta, se crea desde las plantillas |
| `dot-claude/rules/` (`autonomy`, `docs`) | `~/.claude/rules/` | modo objetivo y cómo se escribe `.ai/` |
| `dot-claude/agents/guardian.md` | `~/.claude/agents/` | cierre de sesión (Haiku) |
| `templates/` (`CLAUDE.md`, `.ai/currentplan.md`, `.ai/history.md`) | `~/.claude/templates/` | estructura inicial de cada repo |

`.claude` solo existe en el home. Cada repositorio: `CLAUDE.md` + `.ai/` (plan vigente e historial), fuera de git.

## Instalación

```sh
git clone https://github.com/xsteban1410/claude-harness ~/Projects/claude-harness
~/Projects/claude-harness/install.sh
```

Es idempotente y `CLAUDE_HOME` cambia el destino. Actualizar: `git pull` y volver a ejecutar `install.sh`.
