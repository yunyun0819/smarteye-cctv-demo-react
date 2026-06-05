// Spring Boot 인증 API + JWT 인터셉터
import useAuthStore from '../store/useAuthStore'
import { api } from './Http'

// 토큰 저장: localStorage "tokens" 키에 JSON으로 저장
// { accessToken, refreshToken, user }

export const login = (email, password) =>
    api.post('/auth/login', { email, password })

export const logout = () =>
    api.post('/auth/logout')

export const refreshToken = (token) =>
    api.post('/auth/refresh', { refreshToken: token })


// 요청 인터셉터 — 토큰 자동 첨부
api.interceptors.request.use(
    (config) => {
        const excludePaths = ['/auth/login', '/auth/refresh']
        const isExcluded = excludePaths.some((path) => config.url.includes(path))

        if (!isExcluded) {
            const stored = localStorage.getItem('tokens')
            if (stored) {
                const parsed = JSON.parse(stored)
                if (parsed?.accessToken) {
                    config.headers.Authorization = `Bearer ${parsed.accessToken}`
                }
            }
        }

        return config
    },
    (error) => Promise.reject(error)
)

// 동시 요청이 401을 받아도 refresh는 한 번만 수행
let isRefreshing = false
let refreshSubscribers = []

const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach(cb => cb(newAccessToken))
    refreshSubscribers = []
}

// 응답 인터셉터 — 401 시 토큰 재발급 후 재시도
api.interceptors.response.use(
    (res) => res,

    async (error) => {
        const { config, response } = error
        if (!config) return Promise.reject(error)

        const excludePaths = ['/auth/refresh', '/auth/logout']
        const isExcluded = excludePaths.some((path) => config.url.includes(path))
        if (isExcluded) return Promise.reject(error)

        if (response?.status === 401 && !config._retry) {
            config._retry = true

            if (isRefreshing) {
                return new Promise((resolve) => {
                    refreshSubscribers.push((newAccessToken) => {
                        config.headers.Authorization = `Bearer ${newAccessToken}`
                        resolve(api(config))
                    })
                })
            }

            isRefreshing = true
            try {
                const stored = localStorage.getItem('tokens')
                const parsed = stored ? JSON.parse(stored) : {}

                const res = await api.post('/auth/refresh', {
                    refreshToken: parsed.refreshToken
                })
                const { data } = res.data

                if (!data?.accessToken) throw new Error('AccessToken 발급 실패')

                const newTokens = { ...parsed, accessToken: data.accessToken, refreshToken: data.refreshToken }
                localStorage.setItem('tokens', JSON.stringify(newTokens))

                useAuthStore.getState().zu_login(parsed.user)

                isRefreshing = false
                onRefreshed(data.accessToken)

                config.headers.Authorization = `Bearer ${data.accessToken}`
                return api(config)

            } catch {
                isRefreshing = false
                refreshSubscribers = []
                useAuthStore.getState().zu_logout()
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)
