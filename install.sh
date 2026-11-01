#!/usr/bin/env bash
# Instala el .claude general en ~/.claude (idempotente) y el comando `claude-harness`.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
dest=${CLAUDE_HOME:-$HOME/.claude}
mkdir -p "$dest"/{rules,agents} "$HOME/.local/bin"

for f in "$here"/dot-claude/rules/*.md;  do ln -sfn "$f" "$dest/rules/$(basename "$f")"; done
for f in "$here"/dot-claude/agents/*.md; do ln -sfn "$f" "$dest/agents/$(basename "$f")"; done
ln -sfn "$here/init.sh" "$HOME/.local/bin/claude-harness"

# Bloque en CLAUDE.md global entre marcadores (se reemplaza en cada instalación)
md=$dest/CLAUDE.md; touch "$md"
b='<!-- claude-harness:begin -->'; e='<!-- claude-harness:end -->'
sed -i "/$b/,/$e/d" "$md"
{ echo; echo "$b"; cat "$here/dot-claude/CLAUDE.md"; echo "$e"; } >> "$md"
echo "Instalado en $dest. Comando: claude-harness init (en la raíz de un proyecto)."
