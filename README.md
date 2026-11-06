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

| `mods/harness-sync`, `mods/autopilot` | cargan por `env.CLAUDE_CODE_PLUGIN_DIRS` en `~/.claude/settings.json` | `/harness-sync` (copia al repo privado) y `/piloto` (trabajo autónomo por cuota) |

`.claude` solo existe en el home. Cada repositorio: `CLAUDE.md` + `.ai/` (plan vigente e historial), fuera de git.

## Instalación

```sh
git clone https://github.com/xsteban1410/claude-harness ~/Projects/claude-harness
~/Projects/claude-harness/install.sh
```

Es idempotente y `CLAUDE_HOME` cambia el destino. Actualizar: `git pull` y volver a ejecutar `install.sh`.

## Mods
`install.sh` (con `jq`) añade `CLAUDE_CODE_PLUGIN_DIRS` apuntando a `mods/*`; se cargan en cada sesión. Cada mod se valida con
`claude plugin validate mods/<mod>` y se prueba con `claude plugin test mods/<mod>`.
- `harness-sync`: ajuste `autoSync` (`ask`|`auto`|`off`) y `repo` (por defecto `~/Projects/claude-harness-private`).
- `autopilot`: ajustes `floor` (10 %) y `reviewMinutes` (10). Comando `/piloto` (`/autopilot` es nombre reservado de Claude Code).
