import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

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
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

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

    act(() => {
      screen.getByText('Login').click()
    })

    act(() => {
      screen.getByText('Logout').click()
    })

    expect(screen.getByTestId('token')).toHaveTextContent('no-token')
    expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false')
  })

  it('should persist auth state in localStorage', () => {
    localStorage.clear()
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    act(() => {
      screen.getByText('Login').click()
    })

    expect(localStorage.getItem('token')).toBe('test-token')
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ name: 'Test User' }))

    unmount()

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