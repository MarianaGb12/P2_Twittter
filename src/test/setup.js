import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock de las variables de entorno
vi.mock('../config/env', () => ({
  VITE_API_URL: 'http://localhost:3000'
}))

// Mock de fetch global
global.fetch = vi.fn()

// Limpia después de cada prueba
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
}) 