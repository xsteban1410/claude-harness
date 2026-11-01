#!/usr/bin/env bash
# claude-harness init [dir]  — crea AGENTS.md y .ai/ desde las plantillas (sin pisar lo existente).
# claude-harness update      — git pull del harness e instalación otra vez.
set -euo pipefail
here=$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)
case ${1:-} in
  update) git -C "$here" pull --ff-only && exec "$here/install.sh" ;;
  init) shift ;;
  *) echo "uso: claude-harness init [dir] | update" >&2; exit 1 ;;
esac
dir=$(cd "${1:-.}" && pwd)
cp -rn "$here/templates/.ai" "$here/templates/AGENTS.md" "$dir/"
if [[ -d $dir/.git ]]; then
  mkdir -p "$dir/.git/info"
  for p in .ai/ AGENTS.md; do grep -qxF "$p" "$dir/.git/info/exclude" 2>/dev/null || echo "$p" >> "$dir/.git/info/exclude"; done
fi
echo "Harness creado en $dir (AGENTS.md y .ai/). Edita AGENTS.md. Ambos quedan fuera de git; quítalos de .git/info/exclude para versionarlos."
