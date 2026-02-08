import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as any,
    notifications: null as any,
    loading: false,
    error: null as any
  }),

  actions: {
    async fetchProfile() {
      const { post } = useApi()
      const endpoints = useEndpoints()

      try {
        const response = await post(endpoints.user.profile, {}, true)

        if (response.success) {
          this.profile = response.data
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      }
    },

    async fetchListings(userId?: string) {
      const { post } = useApi()
      const endpoints = useEndpoints()
      const auth = useAuthStore()

      try {
        const id = userId || auth.currentUser?.public_id
        const response = await post(endpoints.user.listings(id), {}, true)
        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      }
    },

    async updateProfile(data: Record<string, any>) {
      const { post } = useApi()
      const endpoints = useEndpoints()
      const auth = useAuthStore()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.user.updateProfile(auth.currentUser?.public_id), data, true)

        if (response.success && auth.user) {
          auth.user = { ...auth.user, ...response.user }
          this.profile = response.user
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchNotifications() {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true

      try {
        const response = await post(endpoints.user.getNotifications, {}, true)
        this.notifications = response.data
        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchNotificationCount() {
      const { post } = useApi()
      const endpoints = useEndpoints()

      try {
        return await post(endpoints.user.getNotificationsCount, {}, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      }
    },

    async getSearchHistory(type?: string) {
      const { get } = useApi()
      const endpoints = useEndpoints()
      const auth = useAuthStore()

      if (!auth.user) return

      try {
        return await get(endpoints.user.searchHistory(auth.currentUser?.public_id), { type }, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      }
    },

    async getUserMeta(publicId: string) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true

      try {
        return await post(endpoints.user.getUserMeta(publicId), {}, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getSavedItems(type: string) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true

      try {
        return await post(endpoints.user.getSavedItems, { type }, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getMessages() {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true

      try {
        return await post(endpoints.user.messages, {}, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getSwapRequests() {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true

      try {
        return await post(endpoints.user.swapRequests, {}, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearProfile() {
      this.profile = null
      this.notifications = null
    }
  },
  persist: {
    storage: process.client ? localStorage : undefined,
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }
})