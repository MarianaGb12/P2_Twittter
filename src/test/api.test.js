/* global global, vi */
import { describe, it, expect, beforeEach } from "vitest";
import {
  loginUser,
  registerUser,
  getUserTweets,
  createTweet,
  likeTweet,
  commentTweet,
  deleteTweet,
} from "../services/api";

global.fetch = vi.fn();

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockReset();
  });

  const mockResponse = (data, ok = true) => {
    return Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    });
  };

  describe("loginUser", () => {
    it("should make a POST request to login endpoint", async () => {
      const credentials = { username: "testuser", password: "password123" };
      const mockData = {
        data: { token: "test-token", user: { name: "Test User" } },
      };

      fetch.mockResolvedValueOnce(mockResponse(mockData));

      const result = await loginUser(credentials);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/login"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(credentials),
        }),
      );
      expect(result).toEqual(mockData);
    });

    it("should throw error on failed login", async () => {
      const credentials = { username: "testuser", password: "wrong-password" };
      const errorMessage = "Invalid credentials";

      fetch.mockResolvedValueOnce(
        mockResponse({ message: errorMessage }, false),
      );

      await expect(loginUser(credentials)).rejects.toThrow(errorMessage);
    });
  });

  describe("registerUser", () => {
    it("should make a POST request to register endpoint", async () => {
      const userData = {
        name: "Test User",
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      const mockData = { data: { message: "User registered successfully" } };

      fetch.mockResolvedValueOnce(mockResponse(mockData));

      const result = await registerUser(userData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/users"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(userData),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("getUserTweets", () => {
    it("should make a GET request with token", async () => {
      const token = "test-token";
      const mockData = { data: [{ id: 1, content: "Test tweet" }] };

      fetch.mockResolvedValueOnce(mockResponse(mockData));

      const result = await getUserTweets(token);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tweets"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "x-access-token": token,
          }),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("createTweet", () => {
    it("should make a POST request to create tweet", async () => {
      const content = "New test tweet";
      const token = "test-token";
      const mockData = { data: { id: 1, content } };

      fetch.mockResolvedValueOnce(mockResponse(mockData));

      const result = await createTweet(content, token);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tweets"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "x-access-token": token,
          }),
          body: JSON.stringify({ content }),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("likeTweet", () => {
    it("should make a POST request to like tweet", async () => {
      const tweetId = 1;
      const token = "test-token";
      const mockData = { data: { likes: 1 } };

      fetch.mockResolvedValueOnce(mockResponse(mockData));

      const result = await likeTweet(tweetId, token);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tweets/likes"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "x-access-token": token,
          }),
          body: JSON.stringify({ tweetId, like: 1 }),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("commentTweet", () => {
    it("should make a POST request to comment on tweet", async () => {
      const tweetId = 1;
      const comment = "Test comment";
      const token = "test-token";
      const mockData = { data: { id: 1, comment } };

      fetch.mockResolvedValueOnce(mockResponse(mockData));

      const result = await commentTweet(tweetId, comment, token);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tweets/comments"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "x-access-token": token,
          }),
          body: JSON.stringify({ tweetId, comment }),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("deleteTweet", () => {
    it("should make a DELETE request to delete tweet", async () => {
      const tweetId = 1;
      const token = "test-token";
      const mockData = { data: { message: "Tweet deleted successfully" } };

      fetch.mockResolvedValueOnce(mockResponse(mockData));

      const result = await deleteTweet(tweetId, token);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tweets"),
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            "x-access-token": token,
          }),
          body: JSON.stringify({ tweetId }),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });
});
