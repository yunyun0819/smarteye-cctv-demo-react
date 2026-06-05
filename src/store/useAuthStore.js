import { create } from 'zustand'

const useAuthStore = create((set) => ({
    user: null,
    isLoggedIn: false,

    zu_login: (user) => set({ user, isLoggedIn: true }),

    zu_logout: () => {
        localStorage.removeItem('tokens')
        set({ user: null, isLoggedIn: false })
    },
}))

export default useAuthStore
