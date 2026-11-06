import { expect, test } from 'claude-code/testing'
import { isDone, leftOf, planTimes } from './register'

test('cuota restante y fin del plan', async () => {
  expect(leftOf(90)).toBe(10)
  expect(isDone('hecho\nAUTOPILOT_DONE')).toBe(true)
  expect(isDone('sigo con el paso 2')).toBe(false)
})

test('repaso 10 min antes de recargar y reanudación 1 min después', async () => {
  const now = Date.UTC(2026, 10, 6, 12, 0)
  const reset = new Date(now + 60 * 60_000).toISOString() // recarga en 60 min
  expect(planTimes(reset, now, 10)).toEqual({ wrapMs: 50 * 60_000, resumeMs: 61 * 60_000 })
  // recarga en 5 min: el repaso ya toca (0), no se programa en el pasado
  expect(planTimes(new Date(now + 5 * 60_000).toISOString(), now, 10)).toEqual({ wrapMs: 0, resumeMs: 6 * 60_000 })
  expect(planTimes(undefined, now, 10)).toBeUndefined()
})
