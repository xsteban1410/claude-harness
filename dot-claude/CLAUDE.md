## Harness por proyecto (claude-harness)
- Cada repo tiene `CLAUDE.md` (raíz) y `.ai/` (`currentplan.md` + `history.md`); `.claude` solo existe en ~/.claude.
- Si faltan, créalos desde ~/.claude/templates, rellenando `CLAUDE.md` según el repo, y añádelos a `.git/info/exclude`.
- Al empezar leer `.ai/currentplan.md`; `history.md` solo con tail. Hechos duraderos van a la memoria nativa, no a `.ai/`.
- Al modificar el arnés (~/Projects/claude-harness): commit y push de ese repo.
