import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

// Componente de prueba que usa el contexto
function TestComponent() {
  const { token, user, isAuthenticated, login, logout } = useContext(AuthContext)
  return (
    <div>
      <div data-testid="token">{token || 'no-token'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no-user'}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <button onClick={() => login({ token: 'test-token', user: { name: 'Test User' } })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  it('should provide initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
  })

  it('should update state on login', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    act(() => {
      screen.getByText('Login').click()
    })

    expect(screen.getByTestId('token')).toHaveTextContent('test-token')
    expect(screen.getByTestId('user')).toHaveTextContent('{"name":"Test User"}')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
  })

  it('should clear state on logout', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Primero hacemos login
    act(() => {
      screen.getByText('Login').click()
    })

    // Luego hacemos logout
    act(() => {
      screen.getByText('Logout').click()
    })

    expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
  })

  it('should persist auth state in localStorage', () => {
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Hacemos login
    act(() => {
      screen.getByText('Login').click()
    })

    // Desmontamos el componente
    unmount()

    // Remontamos y verificamos que el estado persiste
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('token')).toHaveTextContent('test-token')
    expect(screen.getByTestId('user')).toHaveTextContent('{"name":"Test User"}')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true')
  })
}) 