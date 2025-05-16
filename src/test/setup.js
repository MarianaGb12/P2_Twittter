/* global global, vi */
import '@testing-library/jest-dom'
import { afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'


vi.mock('../config/env', () => ({
  VITE_API_URL: 'http://localhost:3000'
}))

// Setup global fetch mock
global.fetch = vi.fn()

// Setup global localStorage mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Setup global window mock
global.window = {
  ...global.window,
  localStorage: localStorageMock,
}

// Clear all mocks and cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})

// Reset all mocks before all tests
beforeAll(() => {
  vi.clearAllMocks()
}) 