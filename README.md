# claude-harness

Arnés para trabajar con Claude Code de forma consistente en todos tus proyectos: memoria de proyecto (`.ai/`),
guía por repositorio (`AGENTS.md`) y un `.claude` general con las reglas de comportamiento.

## Qué contiene

| En el repo | Se instala / se copia en | Para qué |
|---|---|---|
| `dot-claude/rules/` (`autonomy`, `docs`) | `~/.claude/rules/` | comportamiento general: modo objetivo y cómo se escribe `.ai/` |
| `dot-claude/agents/guardian.md` | `~/.claude/agents/` | cierre de sesión (Haiku) |
| `dot-claude/CLAUDE.md` | bloque en `~/.claude/CLAUDE.md` | lee `AGENTS.md` y `.ai/` al empezar |
| `templates/.ai/` | `<proyecto>/.ai/` | memoria: `currentplan`, `status`, `task`, `memory`, `history`, `decisions`, `design`, `roadmap`, `changelog` |
| `templates/AGENTS.md` | `<proyecto>/AGENTS.md` | guía del proyecto: entorno y convenciones |

Nada más: cada proyecto solo tiene `.ai/` y `AGENTS.md`; el comportamiento general vive en `~/.claude`.

## Instalación

```sh
git clone https://github.com/xsteban1410/claude-harness ~/Projects/claude-harness
~/Projects/claude-harness/install.sh
```

Enlaza reglas y subagente en `~/.claude` y añade un bloque a `~/.claude/CLAUDE.md`. Es idempotente; `CLAUDE_HOME` cambia el destino.

## Uso

```sh
cd mi-proyecto && claude-harness init     # crea AGENTS.md y .ai/ (no pisa lo existente)
claude-harness update                     # git pull + reinstalar
```

Después edita `AGENTS.md`.

## Versionado

Los cambios del arnés se hacen aquí y se publican con tags (`v0.1.0`…). Cada máquina solo necesita `claude-harness update`.
