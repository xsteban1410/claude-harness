#!/usr/bin/env bash
# Instala el harness global en ~/.claude (idempotente) y el comando `claude-harness`.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
dest=${CLAUDE_HOME:-$HOME/.claude}
mkdir -p "$dest"/{rules,agents,harness/hooks} "$HOME/.local/bin"

for f in "$here"/global/rules/*.md;  do ln -sfn "$f" "$dest/rules/$(basename "$f")"; done
for f in "$here"/global/agents/*.md; do ln -sfn "$f" "$dest/agents/$(basename "$f")"; done
ln -sfn "$here/global/hooks/dispatch.sh" "$dest/harness/hooks/dispatch.sh"
ln -sfn "$here/init.sh" "$HOME/.local/bin/claude-harness"

# Bloque en CLAUDE.md global entre marcadores (se reemplaza en cada instalación)
md=$dest/CLAUDE.md; touch "$md"
b='<!-- claude-harness:begin -->'; e='<!-- claude-harness:end -->'
sed -i "/$b/,/$e/d" "$md"
{ echo; echo "$b"; cat "$here/global/CLAUDE.md"; echo "$e"; } >> "$md"

# Hooks en settings.json: un despachador que no hace nada sin .agents/hooks/
command -v jq >/dev/null || { echo "jq es necesario para editar settings.json" >&2; exit 1; }
s=$dest/settings.json; [[ -f $s ]] || echo '{}' > "$s"
tmp=$(mktemp)
jq --arg pre "bash $dest/harness/hooks/dispatch.sh pre" --arg post "bash $dest/harness/hooks/dispatch.sh post" '
  def add($ev; $m; $c): .hooks[$ev] = ((.hooks[$ev] // []) | map(select(.hooks[0].command | test("harness/hooks/dispatch.sh") | not))
    + [{matcher: $m, hooks: [{type: "command", command: $c}]}]);
  add("PreToolUse"; "Bash|Edit|Write|NotebookEdit"; $pre) | add("PostToolUse"; "Edit|Write"; $post)' "$s" > "$tmp"
mv "$tmp" "$s"
echo "Instalado en $dest. Comando: claude-harness init (en la raíz de un proyecto)."
