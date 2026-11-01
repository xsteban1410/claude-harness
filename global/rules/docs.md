---
paths:
  - ".ai/**"
---
# Memoria del proyecto (.ai/)

- Al empezar un proyecto con .ai/: leer en orden currentplan.md, status.md, task.md, memory.md. design.md y decisions.md
  solo si la tarea los necesita. history.md nunca entero (tail).
- Plan primero: antes de empezar o modificar algo se escribe el plan en currentplan.md (contexto, pasos, verificación)
  y se acuerda con el usuario. Entre sesiones se continúa marcando ✓; al terminarlo, se resume en history.md y se sustituye.
- Quien escribe .ai/ es un subagente Haiku con effort low (`Agent` con `model: haiku`, `effort: low`, Read/Write, sin
  heredocs); el modelo de la sesión solo programa y le pasa qué se hizo, archivos, referencia usada y cómo probarlo.
  Al cerrar la sesión: subagente `guardian` (status, memory, task, history).
- status.md ≤ 10 líneas y memory.md ≤ 30: se reescriben, no se amplían. decisions.md: una línea con fecha.
- .ai/ es privado: debe estar en .git/info/exclude (o .gitignore). En bash con heredoc las comillas invertidas se ejecutan:
  textos con ` o ' se escriben con Write/Edit.
