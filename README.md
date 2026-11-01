# claude-harness

Arnés para trabajar con Claude Code de forma consistente en todos tus proyectos: memoria de proyecto (`.ai/`),
guía por repositorio (`AGENTS.md`) y una parte global (`~/.claude`) con reglas, subagente y despachador de hooks.

## Estructura

| Dónde | Qué | Alcance |
|---|---|---|
| `~/.claude/rules/` | `autonomy` (modo objetivo), `docs` (cómo se escribe `.ai/`) | global |
| `~/.claude/agents/guardian.md` | cierre de sesión (Haiku) | global |
| `~/.claude/harness/hooks/dispatch.sh` | ejecuta `.ai/hooks/pre.sh` / `post.sh` del proyecto, si existen | global |
| `<proyecto>/.ai/` | `currentplan`, `status`, `task`, `memory`, `history`, `decisions`, `design`, `roadmap`, `changelog` | por proyecto |
| `<proyecto>/AGENTS.md` | guía del proyecto: entorno, convenciones | por proyecto |

`.ai/` es memoria viva (plan vigente, estado, tareas, historial); `AGENTS.md` es lo propio del repositorio (entorno y
convenciones). Si un proyecto necesita reglas, skills, diseño o hooks propios, van dentro de `.ai/` (`rules/`, `skills/`,
`design/`, `hooks/`). Ambos se crean con `claude-harness init` y por defecto quedan en `.git/info/exclude`.

## Instalación

```sh
git clone https://github.com/xsteban1410/claude-harness ~/Projects/claude-harness
~/Projects/claude-harness/install.sh      # requiere jq
```

Enlaza reglas y subagente en `~/.claude`, añade un bloque a `~/.claude/CLAUDE.md` y registra el despachador de hooks en
`~/.claude/settings.json`. Es idempotente; `CLAUDE_HOME` cambia el destino.

## Uso

```sh
cd mi-proyecto && claude-harness init     # crea AGENTS.md y .ai/ (no pisa lo existente)
claude-harness update                     # git pull + reinstalar
```

Después edita `AGENTS.md`. Para un hook del proyecto, crea `.ai/hooks/pre.sh` o `post.sh` (`chmod +x`): recibe el JSON del
hook por stdin y `exit 2` bloquea.

## Versionado

Los cambios del arnés se hacen aquí y se publican con tags (`v0.1.0`…). Cada máquina solo necesita `claude-harness update`.
