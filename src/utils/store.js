"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTokens = create(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearAllTokens: () => set({ accessToken: "", refreshToken: "" }),
    }),
    { name: "tokens" }
  )
);