# Modo objetivo (goal) y trabajo autónomo

Cuando la sesión tiene un objetivo (`/goal` o un mensaje tipo "tienes autonomía, trabaja hasta…"):

1. **Trabajar hasta terminar**: no parar a preguntar lo que se pueda decidir con el código, `CLAUDE.md` o las reglas.
   Solo se para ante algo irreversible o decisión del usuario (dependencias nuevas, contraseñas, commits, push).
2. **Al acabar el plan vigente**: resumirlo en .ai/history.md (una línea por cambio) y no terminar todavía.
3. **Investigar qué más hacer**: pendientes de .ai/currentplan.md, docs propios del repo en .ai/ si existen, memoria nativa.
4. **Investigar cómo hacerlo**: API real de las dependencias, skills disponibles, web si hace falta. Citar en el plan qué se reutiliza.
5. **Planificar y hacer**: escribir el siguiente plan en .ai/currentplan.md (contexto, pasos, verificación) y aplicarlo
   paso a paso marcando ✓. Cada paso se prueba antes del siguiente.
6. Repetir 2–5 hasta agotar tiempo u objetivo. Al final: guardian y resumen corto (qué se hizo, qué no se verificó).

- Sin decisión del usuario se elige la opción más simple y reversible y se guarda en la memoria nativa.
