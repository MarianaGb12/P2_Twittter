import { renderHook, act } from '@testing-library/react';
import { useTweetState } from '../useTweetState';
import { getTweets, createTweet, deleteTweet } from '../../services/api';
import { useAuth } from '../useAuth';

// Mock de los servicios de API
jest.mock('../../services/api', () => ({
  getTweets: jest.fn(),
  createTweet: jest.fn(),
  deleteTweet: jest.fn(),
}));

// Mock del hook useAuth
jest.mock('../useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('useTweetState Hook', () => {
  const mockToken = 'fake-token';
  const mockTweets = [
    { _id: '1', content: 'Test tweet 1' },
    { _id: '2', content: 'Test tweet 2' },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ token: mockToken });
    jest.clearAllMocks();
  });

  it('should fetch tweets successfully', async () => {
    getTweets.mockResolvedValueOnce({ data: mockTweets });

    const { result } = renderHook(() => useTweetState());

    expect(result.current.loading).toBe(false);
    expect(result.current.tweets).toEqual([]);

    await act(async () => {
      await result.current.fetchTweets();
    });

    expect(getTweets).toHaveBeenCalledWith(mockToken);
    expect(result.current.tweets).toEqual(mockTweets);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch tweets error', async () => {
    const errorMessage = 'Failed to fetch tweets';
    getTweets.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useTweetState());

    await act(async () => {
      await result.current.fetchTweets();
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
    expect(result.current.tweets).toEqual([]);
  });

  it('should add a new tweet successfully', async () => {
    const newTweet = { _id: '3', content: 'New tweet' };
    createTweet.mockResolvedValueOnce({ data: newTweet });

    const { result } = renderHook(() => useTweetState());

    // Primero cargamos algunos tweets
    getTweets.mockResolvedValueOnce({ data: mockTweets });
    await act(async () => {
      await result.current.fetchTweets();
    });

    // Luego agregamos un nuevo tweet
    await act(async () => {
      await result.current.addTweet('New tweet');
    });

    expect(createTweet).toHaveBeenCalledWith('New tweet', mockToken);
    expect(result.current.tweets).toEqual([newTweet, ...mockTweets]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should remove a tweet successfully', async () => {
    deleteTweet.mockResolvedValueOnce();

    const { result } = renderHook(() => useTweetState());

    // Primero cargamos algunos tweets
    getTweets.mockResolvedValueOnce({ data: mockTweets });
    await act(async () => {
      await result.current.fetchTweets();
    });

    // Luego eliminamos un tweet
    await act(async () => {
      await result.current.removeTweet('1');
    });

    expect(deleteTweet).toHaveBeenCalledWith('1', mockToken);
    expect(result.current.tweets).toEqual([mockTweets[1]]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle loading states correctly', async () => {
    getTweets.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { result } = renderHook(() => useTweetState());

    let fetchPromise;
    act(() => {
      fetchPromise = result.current.fetchTweets();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await fetchPromise;
    });

    expect(result.current.loading).toBe(false);
  });
}); 