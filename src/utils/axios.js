"use client"

import axios from "axios";

import { useTokens } from "@/utils/store.js"

const api = axios.create({
    baseURL: 'https://ilkinibadov.com/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use(
    (config) => {
        const token = useTokens.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

export const refreshToken = async () => {
    const tokenStore = useTokens.getState()
    const refreshToken = tokenStore.refreshToken;
    console.log("refresh:", refreshToken)
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    try {
        const res = await axios.post('https://ilkinibadov.com/api/v1/auth/refresh', {
            refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        tokenStore.setAccessToken(accessToken)
        tokenStore.setRefreshToken(newRefreshToken)

        return accessToken
    } catch (error) {
        console.error("Error refreshing token:", error);
        tokenStore.clearAllTokens()
        throw error;
    }
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                processQueue(null, newToken)
                originalRequest.headers.Authorization = 'Bearer ' + newToken;
                return api(originalRequest)
            } catch (error) {
                processQueue(error, null);
                // clear tokens via getState()
                useTokens.getState().clearAllTokens()
                return Promise.reject(error);
            }
            finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
)

export default api