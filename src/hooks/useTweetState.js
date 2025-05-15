import { useState, useCallback } from 'react';
import { getTweets, createTweet, deleteTweet } from '../services/api';
import { useAuth } from './useAuth';

export const useTweetState = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchTweets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTweets(token);
      setTweets(response.data);
    } catch (err) {
      setError(err.message || 'Error al cargar los tweets');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addTweet = useCallback(async (content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createTweet(content, token);
      setTweets(prevTweets => [response.data, ...prevTweets]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Error al crear el tweet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const removeTweet = useCallback(async (tweetId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTweet(tweetId, token);
      setTweets(prevTweets => prevTweets.filter(tweet => tweet._id !== tweetId));
    } catch (err) {
      setError(err.message || 'Error al eliminar el tweet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    tweets,
    loading,
    error,
    fetchTweets,
    addTweet,
    removeTweet,
  };
}; 