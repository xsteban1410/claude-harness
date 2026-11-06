#!/usr/bin/env bash
# Instala el .claude general y las plantillas en ~/.claude (idempotente).
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
dest=${CLAUDE_HOME:-$HOME/.claude}
mkdir -p "$dest"/{rules,agents}

for f in "$here"/dot-claude/rules/*.md;  do ln -sfn "$f" "$dest/rules/$(basename "$f")"; done
for f in "$here"/dot-claude/agents/*.md; do ln -sfn "$f" "$dest/agents/$(basename "$f")"; done
ln -sfn "$here/templates" "$dest/templates"

# Bloque en CLAUDE.md global entre marcadores (se reemplaza en cada instalación)
md=$dest/CLAUDE.md; touch "$md"
b='<!-- claude-harness:begin -->'; e='<!-- claude-harness:end -->'
sed -i "/$b/,/$e/d" "$md"
printf "%s\n" "$(cat "$md")" > "$md"  # quita líneas en blanco finales
{ echo; echo "$b"; cat "$here/dot-claude/CLAUDE.md"; echo "$e"; } >> "$md"
# Mods (harness-sync, autopilot): se cargan en cada sesión por CLAUDE_CODE_PLUGIN_DIRS en settings.json
if [ -d "$here/mods" ] && command -v jq >/dev/null; then
  dirs=$(for m in "$here"/mods/*/; do printf '%s:' "${m%/}"; done); dirs=${dirs%:}
  [ -f "$dest/settings.json" ] || echo '{}' > "$dest/settings.json"
  jq --arg d "$dirs" '.env = ((.env // {}) + {CLAUDE_CODE_PLUGIN_DIRS: $d})' "$dest/settings.json" > "$dest/settings.json.tmp" \
    && mv "$dest/settings.json.tmp" "$dest/settings.json"
fi
echo "Instalado en $dest (rules, agents, templates, mods y bloque en CLAUDE.md)."
