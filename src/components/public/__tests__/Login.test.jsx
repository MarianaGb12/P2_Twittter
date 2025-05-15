import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { useAuth } from '../../../hooks/useAuth';
import { loginUser } from '../../../services/api';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../services/api', () => ({
  loginUser: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('Inicia sesión en X')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Teléfono, correo electrónico o usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockToken = 'fake-token';
    const mockUserData = {
      token: mockToken,
      name: 'Test User',
      username: 'testuser',
    };

    loginUser.mockResolvedValueOnce({ data: mockUserData });
    require('jwt-decode').jwtDecode.mockReturnValueOnce({ userId: '123' });

    renderLogin();

    await userEvent.type(
      screen.getByPlaceholderText('Teléfono, correo electrónico o usuario'),
      'testuser'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Contraseña'),
      'password123'
    );

    await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith({
        token: mockToken,
        user: {
          _id: '123',
          name: 'Test User',
          username: 'testuser',
        },
      });
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    loginUser.mockRejectedValueOnce(new Error(errorMessage));

    renderLogin();

    await userEvent.type(
      screen.getByPlaceholderText('Teléfono, correo electrónico o usuario'),
      'testuser'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Contraseña'),
      'wrongpassword'
    );

    await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /Iniciar sesión/i });
    await userEvent.click(submitButton);

    const usernameInput = screen.getByPlaceholderText('Teléfono, correo electrónico o usuario');
    const passwordInput = screen.getByPlaceholderText('Contraseña');

    expect(usernameInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
  });
}); 