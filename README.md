# claude-harness

Arnés para trabajar con Claude Code de forma consistente en todos tus proyectos: memoria de proyecto (`.ai/`),
guía y reglas por repositorio (`.agents/`) y una parte global (`~/.claude`) con reglas, subagente y despachador de hooks.

## Estructura

| Dónde | Qué | Alcance |
|---|---|---|
| `~/.claude/rules/` | `autonomy` (modo objetivo), `docs` (cómo se escribe `.ai/`) | global |
| `~/.claude/agents/guardian.md` | cierre de sesión (Haiku) | global |
| `~/.claude/harness/hooks/dispatch.sh` | ejecuta `.agents/hooks/pre.sh` / `post.sh` del proyecto, si existen | global |
| `<proyecto>/.ai/` | `currentplan`, `status`, `task`, `memory`, `history`, `decisions`, `design`, `roadmap`, `changelog` | por proyecto |
| `<proyecto>/.agents/` | `AGENTS.md`, `rules/`, `skills/`, `agents/`, `design/`, `hooks/` | por proyecto |

`.ai/` es memoria viva (plan vigente, estado, tareas, historial). `.agents/` es lo que depende del repositorio:
entorno, reglas por tipo de archivo, skills, referencias de diseño y hooks. Ambos se crean con `claude-harness init` y
por defecto quedan en `.git/info/exclude`.

## Instalación

```sh
git clone https://github.com/xsteban1410/claude-harness ~/Projects/claude-harness
~/Projects/claude-harness/install.sh      # requiere jq
```

Enlaza reglas y subagente en `~/.claude`, añade un bloque a `~/.claude/CLAUDE.md` y registra el despachador de hooks en
`~/.claude/settings.json`. Es idempotente; `CLAUDE_HOME` cambia el destino.

## Uso

```sh
cd mi-proyecto && claude-harness init     # crea .ai/ y .agents/ (no pisa lo existente)
claude-harness update                     # git pull + reinstalar
```

Después edita `.agents/AGENTS.md` (entorno y convenciones) y añade reglas, skills o hooks del proyecto. Para un hook,
copia `.agents/hooks/pre.sh.example` a `pre.sh` (`chmod +x`): recibe el JSON del hook por stdin y `exit 2` bloquea.

## Versionado

Los cambios del arnés se hacen aquí y se publican con tags (`v0.1.0`…). Cada máquina solo necesita `claude-harness update`.
