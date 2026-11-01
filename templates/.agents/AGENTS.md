# <Proyecto> — guía para agentes
<una línea: qué es y principios (KISS, rendimiento…)>

## Entorno (obligatorio)
- <cómo se ejecutan los comandos, rutas permitidas, qué nunca se toca>
- <git: ¿commits solo a petición? ¿nunca push?>

## Cómo trabajamos
- <convenciones del proyecto, dependencias nuevas, estilo>

## Harness local (.agents/)
- rules/: reglas por tema; las que llevan `paths` solo se leen al tocar esos archivos.
- skills/<nombre>/SKILL.md: procedimientos del proyecto (probar, añadir componente…).
- agents/: subagentes del proyecto. design/: referencias y capturas aprobadas.
- hooks/pre.sh y hooks/post.sh (opcionales): los ejecuta el despachador global; reciben el JSON del hook por stdin,
  exit 2 bloquea/avisa.
