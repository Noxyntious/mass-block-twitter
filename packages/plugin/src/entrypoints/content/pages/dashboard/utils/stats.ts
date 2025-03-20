import { Activity } from '$lib/db'

/**
 * format number to string with comma
 */
function formatNumber(now: number, before: number): string {
  if (now === before) {
    return '0%'
  }
  if (before === 0) {
    return '+100%'
  }
  return now > before
    ? `+${((now - before) / before) * 100}%`
    : `-${((before - now) / before) * 100}%`
}

type Stats = Record<
  'total' | 'auto' | 'manual' | 'hidden',
  { value: number; change: string }
>

export function calcStats(now: Activity[], before: Activity[]): Stats {
  const auto = now.filter(
    (it) => it.action === 'block' && it.trigger_type === 'auto',
  )
  const manual = now.filter(
    (it) => it.action === 'block' && it.trigger_type === 'manual',
  )
  const hidden = now.filter((it) => it.action === 'hide')
  const beforeAuto = before.filter(
    (it) => it.action === 'block' && it.trigger_type === 'auto',
  )
  const beforeManual = before.filter(
    (it) => it.action === 'block' && it.trigger_type === 'manual',
  )
  const beforeHidden = before.filter((it) => it.action === 'hide')
  return {
    total: {
      value: now.length,
      change: formatNumber(now.length, before.length),
    },
    auto: {
      value: auto.length,
      change: formatNumber(auto.length, beforeAuto.length),
    },
    manual: {
      value: manual.length,
      change: formatNumber(manual.length, beforeManual.length),
    },
    hidden: {
      value: hidden.length,
      change: formatNumber(hidden.length, beforeHidden.length),
    },
  }
}
export function formatStats(stats: Stats) {
  return [
    {
      title: 'dashboard.stats.total',
      ...stats.total,
      icon: '🛡️',
    },
    {
      title: 'dashboard.stats.auto',
      ...stats.auto,
      icon: '⚙️',
    },
    {
      title: 'dashboard.stats.manual',
      ...stats.manual,
      icon: '👆',
    },
    {
      title: 'dashboard.stats.hidden',
      ...stats.hidden,
      icon: '👁️',
    },
  ].map((it) => ({
    ...it,
    trend: it.change.startsWith('-') ? 'down' : 'up',
    period: 'dashboard.stats.period',
  }))
}
