import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../components/public/Login'
import { loginUser } from '../services/api'
import { useAuth } from '../hooks/useAuth'

vi.mock('../services/api', () => ({
  loginUser: vi.fn()
}))

const mockLogin = vi.fn()
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin
  })
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

vi.mock('jwt-decode', () => ({
  jwtDecode: () => ({ userId: '123' })
}))

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch.mockReset()
  })

  it('should render the login form', () => {
    renderLogin()
    
    expect(screen.getByPlaceholderText('Teléfono, correo electrónico o usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('should show validation error for empty fields', async () => {
    renderLogin()
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    const usernameInput = screen.getByPlaceholderText('Teléfono, correo electrónico o usuario')
    const passwordInput = screen.getByPlaceholderText('Contraseña')
    
    expect(usernameInput).toBeInvalid()
    expect(passwordInput).toBeInvalid()
  })

  it('should successfully login and redirect to home', async () => {
    const mockResponse = {
      data: {
        token: 'fake-token',
        name: 'Test User',
        username: 'testuser'
      }
    }
    loginUser.mockResolvedValueOnce(mockResponse)
    
    renderLogin()
    
    fireEvent.change(screen.getByPlaceholderText('Teléfono, correo electrónico o usuario'), {
      target: { value: 'testuser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' }
    })

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
    })

    expect(mockLogin).toHaveBeenCalledWith({
      token: 'fake-token',
      user: {
        _id: '123',
        name: 'Test User',
        username: 'testuser'
      }
    })

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('should show error message when login fails', async () => {
    const errorMessage = 'Credenciales inválidas'
    loginUser.mockRejectedValueOnce(new Error(errorMessage))
    
    renderLogin()
    
    fireEvent.change(screen.getByPlaceholderText('Teléfono, correo electrónico o usuario'), {
      target: { value: 'testuser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongpassword' }
    })

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    const errorMessageElement = await screen.findByTestId('error-message')
    expect(errorMessageElement).toHaveTextContent(errorMessage)
  })

  it('should show default error message when login fails without specific message', async () => {
    loginUser.mockRejectedValueOnce(new Error())
    
    renderLogin()
    
    fireEvent.change(screen.getByPlaceholderText('Teléfono, correo electrónico o usuario'), {
      target: { value: 'testuser' }
    })
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongpassword' }
    })

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    fireEvent.click(submitButton)

    const errorMessageElement = await screen.findByTestId('error-message')
    expect(errorMessageElement).toHaveTextContent('Error al iniciar sesión')
  })
}) 