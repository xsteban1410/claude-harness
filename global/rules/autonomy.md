# Modo objetivo (goal) y trabajo autónomo

Cuando la sesión tiene un objetivo (`/goal` o un mensaje tipo "tienes autonomía, trabaja hasta…"):

1. **Trabajar hasta terminar**: no parar a preguntar lo que se pueda decidir con el código, `AGENTS.md` o las reglas.
   Solo se para ante algo irreversible o decisión del usuario (dependencias nuevas, contraseñas, commits, push).
2. **Al acabar el plan vigente**: resumirlo en .ai/history.md (una línea por cambio) y no terminar todavía.
3. **Investigar qué más hacer**: .ai/roadmap.md, .ai/task.md, pendientes de .ai/status.md, referencias de .ai/design/refs.md.
4. **Investigar cómo hacerlo**: API real de las dependencias, skills de .ai/skills/, web si hace falta. Citar en el plan qué se reutiliza.
5. **Planificar y hacer**: escribir el siguiente plan en .ai/currentplan.md (contexto, pasos, verificación) y aplicarlo
   paso a paso marcando ✓. Cada paso se prueba antes del siguiente.
6. Repetir 2–5 hasta agotar tiempo u objetivo. Al final: guardian y resumen corto (qué se hizo, qué no se verificó).

- Leer solo lo necesario (offset/limit, tail), agrupar comandos, no relanzar lo que ya se sabe.
- Sin decisión del usuario se elige la opción más simple y reversible y se anota en .ai/decisions.md.
