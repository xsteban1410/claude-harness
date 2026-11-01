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
{ echo; echo "$b"; cat "$here/dot-claude/CLAUDE.md"; echo "$e"; } >> "$md"
echo "Instalado en $dest (rules, agents, templates y bloque en CLAUDE.md)."
