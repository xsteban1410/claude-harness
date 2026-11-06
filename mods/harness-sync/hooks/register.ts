import type { Register } from 'claude-code'

const WEEK_S = 7 * 24 * 3600

export const expandHome = (p: string, home: string): string =>
  p.startsWith('~/') ? `${home}${p.slice(1)}` : p

// Días enteros desde el último commit (epoch s); undefined si no se sabe.
export const staleDays = (lastCommitS: number | undefined, nowS: number): number | undefined =>
  lastCommitS === undefined || Number.isNaN(lastCommitS) ? undefined : Math.floor((nowS - lastCommitS) / 86400)

export const isStale = (lastCommitS: number | undefined, nowS: number): boolean =>
  lastCommitS === undefined || nowS - lastCommitS >= WEEK_S

// Ficheros que nunca deben ir en claro al repo (los secretos solo en secrets.tar.gpg).
export const forbiddenStaged = (names: string[]): string[] =>
  names.filter(n => /(^|\/)(\.credentials\.json|\.claude\.json)$/.test(n))

const pad = (n: number) => String(n).padStart(2, '0')

export const register: Register = (on, options) => {
  const repoOpt = String(options.repo ?? '~/Projects/claude-harness-private')
  const auto = String(options.autoSync ?? 'ask')

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'harness-sync',
      description: 'Sincroniza el estado de Claude Code con el repo privado (backup + commit + push)',
    })
    const started = await next(e)
    if (auto === 'off') return started
    try {
      const home = (await $.process.run(['printenv', 'HOME'])).stdout.trim()
      const repo = expandHome(repoOpt, home)
      const log = await $.process.run(['git', '-C', repo, 'log', '-1', '--format=%ct'])
      const last = log.exitCode === 0 ? Number(log.stdout.trim()) : undefined
      const nowS = Math.floor((await $.clock.now()) / 1000)
      if (isStale(last, nowS)) {
        const d = staleDays(last, nowS)
        if (auto === 'auto') {
          $.ui.toast(`harness-sync: sincronizando (${d ?? '?'} días sin copia)…`)
          await $.command.run({ command: 'harness-sync', args: '' })
        } else {
          $.ui.toast(`Harness sin sincronizar hace ${d ?? '?'} días: escribe /harness-sync`)
        }
      }
    } catch {
      // repo ausente o sin git: no molestar al arrancar
    }
    return started
  })

  on('command.run', { command: 'harness-sync' }, async $ => {
    const home = (await $.process.run(['printenv', 'HOME'])).stdout.trim()
    const repo = expandHome(repoOpt, home)
    const git = (...args: string[]) => $.process.run(['git', '-C', repo, ...args], { timeoutMs: 120000 })

    // 1. solo el remoto privado esperado
    const url = await git('remote', 'get-url', 'origin')
    if (url.exitCode !== 0 || !url.stdout.includes('claude-harness-private')) {
      return { text: `harness-sync cancelado: origin de ${repo} no es claude-harness-private.` }
    }

    // 2. backup (sin pedir contraseña: si cambian los secretos, avisa)
    const b = await $.process.run(['bash', `${repo}/backup.sh`], {
      env: { SKIP_SECRETS: '1', HOME: home },
      timeoutMs: 300000,
    })
    if (b.exitCode !== 0) {
      return { text: `harness-sync cancelado: backup.sh falló, nada se subió.\n${b.stderr.trim()}` }
    }
    const secretsNote = b.stderr.includes('SECRETS_CHANGED')
      ? '\nOjo: los secretos cambiaron; ejecuta `! ./backup.sh` en el repo para re-cifrarlos.'
      : ''

    // 3. ¿hay cambios?
    await git('add', '-A')
    const staged = await git('diff', '--cached', '--name-only')
    const names = staged.stdout.split('\n').filter(Boolean)
    if (names.length === 0) return { text: `Sin cambios que sincronizar.${secretsNote}` }

    // 4. defensa: nada de credenciales en claro
    const bad = forbiddenStaged(names)
    if (bad.length > 0) {
      await git('reset', '-q')
      return { text: `harness-sync cancelado: credenciales en claro (${bad.join(', ')}). Nada se subió.` }
    }

    // 5. commit + push normal (nunca --force)
    const d = new Date(await $.clock.now())
    const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    const c = await git('commit', '-q', '-m', `sync: ${stamp}`)
    if (c.exitCode !== 0) return { text: `harness-sync: el commit falló.\n${c.stderr.trim()}` }
    const p = await git('push', 'origin', 'HEAD')
    if (p.exitCode !== 0) return { text: `Commit hecho pero el push falló (se reintenta en la próxima sync).\n${p.stderr.trim()}${secretsNote}` }
    return { text: `Sincronizado: ${names.length} archivos (${stamp}).${secretsNote}` }
  })
}
