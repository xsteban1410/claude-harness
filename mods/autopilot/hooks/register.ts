import type { Register } from 'claude-code'

export type Phase = 'run' | 'waiting' | 'wrapup'
export type State = { on: boolean; phase: Phase; resumeAt?: string }

export const CONTINUE =
  '[autopilot] Continúa con el siguiente paso pendiente de .ai/currentplan.md (si no existe, usa el objetivo de la sesión). ' +
  'Verifica cada paso antes de pasar al siguiente. No hagas commits, push ni controles el escritorio sin permiso. ' +
  'Si todo está terminado y verificado, responde únicamente: AUTOPILOT_DONE'
export const WRAPUP =
  '[autopilot] Queda poca cuota de la sesión. No empieces trabajo nuevo: repasa por encima lo hecho, anota mejoras posibles ' +
  'y escribe el siguiente plan en .ai/currentplan.md (contexto, pasos, verificación) y una línea por cambio en .ai/history.md. Responde corto.'
export const RESUME = '[autopilot] La cuota se ha recargado. Ejecuta el plan de .ai/currentplan.md paso a paso.'

const MIN = 60_000

// % restante de una ventana a partir de su % usado.
export const leftOf = (used: number): number => 100 - used

export const isDone = (answer: string): boolean => /\bAUTOPILOT_DONE\b/.test(answer)

// Cuándo repasar (resetsAt − repaso) y cuándo reanudar (resetsAt + 1 min), en ms desde ahora; nunca negativo.
export const planTimes = (resetsAtIso: string | undefined, nowMs: number, reviewMin: number) => {
  const reset = resetsAtIso ? new Date(resetsAtIso).getTime() : NaN
  if (Number.isNaN(reset)) return undefined
  return {
    wrapMs: Math.max(0, reset - reviewMin * MIN - nowMs),
    resumeMs: Math.max(0, reset + MIN - nowMs),
  }
}

const KEY = 'autopilot'

export const register: Register = (on, options) => {
  const floor = Number(options.floor ?? 10)
  const reviewMin = Number(options.reviewMinutes ?? 10)
  let mode = 'default'
  let cancelWrap: (() => void) | undefined
  let cancelResume: (() => void) | undefined

  on('classic.UserPromptSubmit', async ($, e, next) => {
    mode = e.permission_mode ?? mode
    return next(e)
  })

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'piloto',
      description: '/piloto on|off|status — trabaja solo por cuota: para al llegar al mínimo y reanuda al recargar',
    })
    const started = await next(e)
    const st = (await $.store.get(KEY)) as State | undefined
    if (st?.on) {
      $.ui.toast(`Autopilot activo (${st.phase}). Si cerraste la sesión, escribe /piloto on para reanudar.`)
    }
    return started
  })

  on('command.run', { command: 'piloto' }, async ($, e) => {
    const arg = e.args.trim()
    const cur = ((await $.store.get(KEY)) as State | undefined) ?? { on: false, phase: 'run' as Phase }

    if (arg === 'off') {
      cancelWrap?.()
      cancelResume?.()
      await $.store.set(KEY, { on: false, phase: 'run' })
      return { text: 'Autopilot desactivado.' }
    }
    if (arg === '' || arg === 'status') {
      const u = await $.session.usage()
      const five = u.rateLimits.find(r => r.kind === 'five_hour')
      const q = five ? `${Math.round(leftOf(five.percentUsed))}% restante (recarga ${five.resetsAt ?? '?'})` : 'sin lectura de cuota'
      return { text: `Autopilot ${cur.on ? 'ACTIVO' : 'apagado'} · fase ${cur.phase} · mínimo ${floor}% · ${q}` }
    }
    if (arg !== 'on') return { text: 'Uso: /piloto on | off | status' }

    await $.store.set(KEY, { on: true, phase: 'run' })
    await $.prompt.submit({ text: CONTINUE })
    const warn = mode === 'bypassPermissions' ? '' : '\nAviso: no estás en modo bypass; se parará a pedir permisos (Shift+Tab hasta «bypass permissions»).'
    return { text: `Autopilot activo: trabajará hasta que quede el ${floor}% de la sesión.${warn}` }
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId) return next(e)
    const st = (await $.store.get(KEY)) as State | undefined
    if (!st?.on) return next(e)

    if (e.isAborted) {
      await $.store.set(KEY, { on: false, phase: 'run' })
      $.ui.toast('Autopilot en pausa: interrumpiste el turno. /piloto on para seguir.')
      return next(e)
    }

    // El turno de repaso acaba: se queda esperando la recarga (el reloj de reanudación ya está armado).
    if (st.phase === 'wrapup') {
      await $.store.set(KEY, { ...st, phase: 'waiting' })
      return next(e)
    }
    if (st.phase === 'waiting') return next(e)

    if (isDone(e.answer)) {
      await $.store.set(KEY, { on: false, phase: 'run' })
      $.ui.toast('Autopilot terminó: no queda plan pendiente.')
      return next(e)
    }

    const u = await $.session.usage()
    const five = u.rateLimits.find(r => r.kind === 'five_hour')
    const week = u.rateLimits.find(r => r.kind === 'seven_day')

    if (week && leftOf(week.percentUsed) <= floor) {
      await $.store.set(KEY, { on: false, phase: 'run' })
      $.ui.toast(`Autopilot detenido: queda ≤${floor}% del límite de 7 días.`)
      return next(e)
    }

    if (five && leftOf(five.percentUsed) <= floor) {
      const nowMs = await $.clock.now()
      const times = planTimes(five.resetsAt, nowMs, reviewMin)
      if (!times) {
        await $.store.set(KEY, { on: false, phase: 'run' })
        $.ui.toast('Autopilot detenido: no sé cuándo se recarga la sesión.')
        return next(e)
      }
      await $.store.set(KEY, { on: true, phase: 'waiting', resumeAt: five.resetsAt })
      $.ui.toast(`Autopilot en espera: repasa a las ${new Date(nowMs + times.wrapMs).toLocaleTimeString().slice(0, 5)} y reanuda tras la recarga.`)

      cancelWrap?.()
      cancelResume?.()
      cancelWrap = $.clock.after(times.wrapMs, async () => {
        const s = (await $.store.get(KEY)) as State | undefined
        if (!s?.on || s.phase !== 'waiting') return
        await $.store.set(KEY, { ...s, phase: 'wrapup' })
        await $.prompt.submit({ text: WRAPUP })
      }).cancel
      cancelResume = $.clock.after(times.resumeMs, async () => {
        const s = (await $.store.get(KEY)) as State | undefined
        if (!s?.on) return
        await $.store.set(KEY, { on: true, phase: 'run' })
        await $.prompt.submit({ text: RESUME })
      }).cancel
      return next(e)
    }

    await $.prompt.submit({ text: CONTINUE })
    return next(e)
  })
}
