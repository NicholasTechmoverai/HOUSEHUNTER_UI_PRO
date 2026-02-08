import { defineStore } from 'pinia'

let refreshTimer: ReturnType<typeof setInterval> | null = null

interface VerificationStep {
    identifier: string
    type: 'email' | 'phone' | 'id'
    required: boolean
    completed: boolean
    redirectAfter?: string
}

interface User {
    id: string
    email: string
    is_email_verified: boolean
    public_id: string
    display_name: string
    profile_picture: string
    Profile_picture_thumbnail: string
    phone_number: string | null
    is_phone_verified: boolean
}

interface RedirectStackItem {
    path: string
    params?: Record<string, any>
    query?: Record<string, any>
    timestamp: number
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string | null,
        user: null as User | null,
        redirectStack: [] as RedirectStackItem[],
        verificationStack: [] as VerificationStep[],
        refreshing: false,
        loading: false,
        error: null as any
    }),

    getters: {
        isAuthenticated: (state) => !!state.user && !!state.token,
        isEmailVerified: s => !!s.user?.is_email_verified,
        isPhoneVerified: s => !!s.user?.is_phone_verified,
        currentUser: (state) => state.user,
        hasRedirect: (state) => state.redirectStack.length > 0,
        pendingVerification: (state) => state.verificationStack.filter(v => !v.completed),
        nextRedirect: (state) => state.redirectStack[0],
        nextVerification: (state) => state.verificationStack.find(v => !v.completed)
    },

    actions: {
        pushRedirect(route: any) {
            const existingIndex = this.redirectStack.findIndex(r => r.path === route.path)
            if (existingIndex > -1) this.redirectStack.splice(existingIndex, 1)

            this.redirectStack.unshift({
                path: route.path,
                params: route.params,
                query: route.query,
                timestamp: Date.now()
            })

            if (this.redirectStack.length > 5) this.redirectStack.pop()
        },
        setLastAttemptedRouteToCurrent() {
            const route = useRoute()
            this.pushRedirect(route)
        },

        popRedirect() {
            return this.redirectStack.shift() || null
        },

        clearRedirects() {
            this.redirectStack = []
        },

        addVerification(step: Omit<VerificationStep, 'completed'>) {
            const existingIndex = this.verificationStack.findIndex(v => v.type === step.type)
            if (existingIndex > -1) {
                this.verificationStack[existingIndex] = { ...step, completed: false }
            } else {
                this.verificationStack.push({ ...step, completed: false })
            }
        },

        completeVerification(type: VerificationStep['type']) {
            const step = this.verificationStack.find(v => v.type === type)
            if (step) step.completed = true
        },

        clearVerifications() {
            this.verificationStack = []
        },

        setUser(user: User, token?: string) {
            this.user = user
            if (token) this.token = token
        },

        clearUser() {
            this.user = null
            this.token = null
            this.error = null
            this.clearRedirects()
            this.clearVerifications()
        },

        async login(credentials: { email: string; password: string }) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                const response = await post(endpoints.user.login, credentials)

                if (response.success) {
                    this.setUser(response.user, response.access_token)

                    if (!response.user.is_email_verified) {
                        this.addVerification({
                            identifier: credentials.email,
                            type: 'email',
                            required: true,
                            redirectAfter: this.nextRedirect?.path || '/dashboard'
                        })
                    }

                    if (!response.user.is_phone_verified && response.user.phone_number) {
                        this.addVerification({
                            identifier: response.user.phone_number,
                            type: 'phone',
                            required: true,
                            redirectAfter: this.nextRedirect?.path || '/dashboard'
                        })
                    }

                    const redirect = this.popRedirect()

                    return {
                        success: true,
                        redirectTo: redirect?.path || '/dashboard',
                        requiresVerification: this.pendingVerification.length > 0
                    }
                }

                return { success: false, message: response.message }
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async register(payload: Record<string, any>) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                const response = await post(endpoints.user.register, payload)

                if (response.success) {
                    this.setUser(response.user, response.access_token)

                    this.addVerification({
                        identifier: payload.email,
                        type: 'email',
                        required: true,
                        redirectAfter: '/dashboard'
                    })

                    return {
                        ...response,
                        requiresVerification: true
                    }
                }

                return response
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async verifyCode(credentials: { identifier: string; code: string; type: string }) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                const response = await post(endpoints.auth.verifyCode, credentials)

                if (response.success) {
                    this.completeVerification(credentials.type as VerificationStep['type'])

                    const step = this.verificationStack.find(v => v.type === credentials.type)
                    const nextStep = this.nextVerification

                    return {
                        success: true,
                        redirectTo: nextStep ? null : (step?.redirectAfter || '/dashboard'),
                        hasNextVerification: !!nextStep
                    }
                }

                return response
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        handleRouteGuard(route: any): boolean {
            if (route.meta?.requiresAuth && !this.isAuthenticated) {
                this.pushRedirect(route)
                useRouter().push('/login')
                return false
            }

            if (route.meta?.requiresVerified && this.user && !this.user.is_email_verified) {
                this.addVerification({
                    identifier: this.user.email,
                    type: 'email',
                    required: true,
                    redirectAfter: route.fullPath
                })

                useRouter().push('/verify')
                return false
            }

            return true
        },

        async refreshToken() {
            if (!this.token || this.refreshing || !this.user) return false

            this.refreshing = true

            try {
                const { post } = useApi()
                const endpoints = useEndpoints()

                const response = await post(endpoints.auth.renewToken(this.user.public_id), {}, true)

                if (response.success) {
                    this.setUser(response.user, response.access_token)
                    return true
                }
                return false
            } catch (error) {
                if (error.response?.status === 401) this.clearUser()
                return false
            } finally {
                this.refreshing = false
            }
        },

        async verifyEmail(credentials: { email: string; code: string }) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                const response = await post(endpoints.auth.verifyEmail, credentials)

                if (response.success && this.user) {
                    this.user.is_email_verified = true
                }

                return response
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message || 'Email verification failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async verifyPhone(credentials: { phone: string; code: string }) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                const response = await post(endpoints.auth.verifyPhone, credentials)

                if (response.success && this.user) {
                    this.user.is_phone_verified = true
                }

                return response
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message || 'Phone verification failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async checkEmailExists(email: string) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                return await post(endpoints.auth.isEmailExists, { email })
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message || 'Password reset request failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async sendCodes(email: string, purpose: string) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                return await post(endpoints.auth.sendCodes, { email, purpose })
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message || 'Password reset request failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateToNewPassword(data: { current_password: string; new_password: string; token: String | null }) {
            const { post } = useApi()
            const endpoints = useEndpoints()

            this.loading = true
            this.error = null

            try {
                return await post(endpoints.user.changePassword, data)
            } catch (error: any) {
                this.error = error.response?.data?.message || error.message || 'Password change failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async handleGoogleLogin(): Promise<void> {
            const url = useEndpoints().auth.googleLogin
            this.setLastAttemptedRouteToCurrent()

            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
            if (isMobile) {
                window.location.href = url
                return
            }

            const width = 500
            const height = 600
            const left = window.screenX + (window.innerWidth - width) / 2
            const top = window.screenY + (window.innerHeight - height) / 2

            const popup = window.open(
                url,
                'Google Login',
                `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
            )

            if (!popup) {
                window.location.href = url
            }
        },

        startAutoRefresh() {
            if (refreshTimer) clearInterval(refreshTimer)

            refreshTimer = setInterval(() => {
                this.refreshToken()
            }, 20 * 60 * 1000)
        },

        stopAutoRefresh() {
            if (refreshTimer) clearInterval(refreshTimer)
            refreshTimer = null
        },

        logout() {
            this.clearUser()
            this.stopAutoRefresh()
        },

        initCrossTabListener() {
            window.addEventListener('storage', (event: StorageEvent) => {
                if (event.key === 'auth') {
                    if (event.newValue) {
                        try {
                            const data = JSON.parse(event.newValue)
                            this.user = data.user || null
                            this.token = data.token || null
                        } catch (e) {
                            console.error('Failed to parse user store:', e)
                        }
                    } else {
                        this.clearUser()
                    }
                }
            })
        },

        init() {
            this.initCrossTabListener()
            console.log("initialized!!")

            const route = useRoute()

            if (!this.user && !route.fullPath.startsWith('/auth/callback')) {
                useGoogleOneTap()
            }

            if (this.token) {
                this.refreshToken().then(success => {
                    if (success) this.startAutoRefresh()
                    else this.clearUser()
                })
            }
        },

    },
    persist: {
        storage: process.client ? localStorage : undefined,
        serializer: {
            serialize: JSON.stringify,
            deserialize: JSON.parse
        }
    }
})