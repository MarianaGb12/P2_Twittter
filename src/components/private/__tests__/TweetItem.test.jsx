import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TweetItem from '../TweetItem';
import { useAuth } from '../../../hooks/useAuth';

// Mock del hook useAuth
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock de los servicios de API
jest.mock('../../../services/api', () => ({
  likeTweet: jest.fn(),
  commentTweet: jest.fn(),
  deleteTweet: jest.fn(),
}));

describe('TweetItem Component', () => {
  const mockTweet = {
    _id: '123',
    content: 'Test tweet content',
    user: {
      _id: 'user123',
      username: 'testuser',
    },
    likes: 5,
    comments: [
      {
        _id: 'comment1',
        user: { username: 'commenter1' },
        comment: 'Test comment',
      },
    ],
    createdAt: '2024-03-20T12:00:00.000Z',
  };

  const mockRefresh = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('renders tweet content correctly', () => {
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: { _id: 'user123' },
    });

    render(<TweetItem tweet={mockTweet} refresh={mockRefresh} />);
    
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Test tweet content')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // likes count
  });

  it('handles like action', async () => {
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: { _id: 'user123' },
    });

    const { likeTweet } = require('../../../services/api');
    likeTweet.mockResolvedValueOnce();

    render(<TweetItem tweet={mockTweet} refresh={mockRefresh} />);
    
    const likeButton = screen.getByRole('button', { name: /❤️/i });
    await userEvent.click(likeButton);

    expect(likeTweet).toHaveBeenCalledWith('123', 'fake-token');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('handles comment submission', async () => {
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: { _id: 'user123' },
    });

    const { commentTweet } = require('../../../services/api');
    commentTweet.mockResolvedValueOnce();

    render(<TweetItem tweet={mockTweet} refresh={mockRefresh} />);
    
    // Abrir la sección de comentarios
    const replyButton = screen.getByRole('button', { name: /💬/i });
    await userEvent.click(replyButton);

    // Escribir y enviar un comentario
    const textarea = screen.getByPlaceholderText('Escribe tu respuesta...');
    await userEvent.type(textarea, 'New test comment');
    
    const submitButton = screen.getByRole('button', { name: /Responder/i });
    await userEvent.click(submitButton);

    expect(commentTweet).toHaveBeenCalledWith('123', 'New test comment', 'fake-token');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('shows delete button only for tweet owner', () => {
    // Primero renderizamos como el dueño del tweet
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: { _id: 'user123' }, // Mismo ID que el tweet
    });

    const { unmount } = render(<TweetItem tweet={mockTweet} refresh={mockRefresh} />);
    expect(screen.getByRole('button', { name: /🗑️/i })).toBeInTheDocument();

    // Limpiamos el renderizado anterior
    unmount();

    // Ahora renderizamos como otro usuario
    useAuth.mockReturnValue({
      token: 'fake-token',
      user: { _id: 'different-user' }, // ID diferente al del tweet
    });

    render(<TweetItem tweet={mockTweet} refresh={mockRefresh} />);
    const deleteButton = screen.queryByRole('button', { name: /🗑️/i });
    expect(deleteButton).not.toBeInTheDocument();
  });
}); 