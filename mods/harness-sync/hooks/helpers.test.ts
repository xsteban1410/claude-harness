import { expect, test } from 'claude-code/testing'
import { expandHome, forbiddenStaged, isStale, staleDays } from './register'

test('expandHome', async () => {
  expect(expandHome('~/x', '/home/u')).toBe('/home/u/x')
  expect(expandHome('/abs', '/home/u')).toBe('/abs')
})

test('antigüedad: 7 días o sin dato = toca sincronizar', async () => {
  const now = 1_000_000_000
  expect(isStale(now - 6 * 86400, now)).toBe(false)
  expect(isStale(now - 7 * 86400, now)).toBe(true)
  expect(isStale(undefined, now)).toBe(true)
  expect(staleDays(now - 9 * 86400 - 5, now)).toBe(9)
})

test('bloquea credenciales en claro y deja pasar el cifrado', async () => {
  expect(forbiddenStaged(['claude/settings.json', 'secrets.tar.gpg'])).toEqual([])
  expect(forbiddenStaged(['claude/.credentials.json', 'a/.claude.json'])).toHaveLength(2)
})
