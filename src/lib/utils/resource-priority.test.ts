import { describe, it, expect } from 'vitest'
import { getResourcePriority } from './resource-priority'

describe('resource priority', () => {
  it('returns priority entries by key', () => {
    expect(getResourcePriority('logo')?.priority).toBe('critical')
    expect(getResourcePriority('non-existent')).toBeUndefined()
  })
})
