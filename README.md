# claude-harness

Arnés para trabajar con Claude Code de forma consistente en todos tus proyectos: memoria de proyecto (`.ai/`),
guía por repositorio (`AGENTS.md`) y un `.claude` general con las reglas de comportamiento.

## Qué contiene

| En el repo | Se instala en | Para qué |
|---|---|---|
| `dot-claude/rules/` (`autonomy`, `docs`) | `~/.claude/rules/` | comportamiento general: modo objetivo y cómo se escribe `.ai/` |
| `dot-claude/agents/guardian.md` | `~/.claude/agents/` | cierre de sesión (Haiku) |
| `dot-claude/CLAUDE.md` | bloque en `~/.claude/CLAUDE.md` | si un repo no tiene `AGENTS.md` y `.ai/`, se crean desde las plantillas según el repo |
| `templates/` (`.ai/` y `AGENTS.md`) | `~/.claude/templates/` | estructura inicial de memoria y guía del proyecto |

`.claude` solo existe en el home; cada repositorio solo tiene `.ai/` y `AGENTS.md`.

## Instalación

```sh
git clone https://github.com/xsteban1410/claude-harness ~/Projects/claude-harness
~/Projects/claude-harness/install.sh
```

Es idempotente y `CLAUDE_HOME` cambia el destino. Actualizar: `git pull` y volver a ejecutar `install.sh`.
