import { describe, it, expect } from 'vitest'
import { cn, formatDuration } from './utils'

describe('utils', () => {
  it('cn() merges class names intelligently', () => {
    const result = cn('p-2', false && 'hidden', 'text-sm', 'p-2')
    expect(result).toContain('p-2')
    expect(result).toContain('text-sm')
    expect(result.split('p-2').length - 1).toBe(1) // deduped
  })

  it('formatDuration() returns m:ss format', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(5)).toBe('0:05')
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(600)).toBe('10:00')
  })
})
