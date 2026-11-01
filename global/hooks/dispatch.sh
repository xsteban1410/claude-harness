#!/usr/bin/env bash
# Despachador global: `dispatch.sh pre|post`. Ejecuta .ai/hooks/<pre|post>.sh del proyecto actual si existe.
# Sin ese archivo no hace nada (exit 0). El JSON del hook pasa por stdin; el código de salida se propaga.
phase=$1
root=${CLAUDE_PROJECT_DIR:-$PWD}
while [[ $root != / && ! -d $root/.ai ]]; do root=$(dirname "$root"); done
hook=$root/.ai/hooks/$phase.sh
[[ -x $hook ]] || { cat >/dev/null; exit 0; }
exec "$hook"
