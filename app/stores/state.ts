import { defineStore } from 'pinia'

export type LayoutType = 'default' | 'admin' | 'manage' | (string & {})
export type MobilePositions = 'top' | 'bottom' | (string & {})


export const useStateStore = defineStore('state', {
  state: () => ({
    showNavbar: true,
    MobileNavBarPosition:'top' as MobilePositions,
    showFooter: false,
    layout: 'default' as LayoutType,
    loading: false,
    
  }),

  getters: {
    isNavbarVisible: (state) => state.showNavbar,
    isFooterVisible: (state) => state.showFooter,
    isLoading: (state) => state.loading,
    currentLayout: (state) => state.layout
  },

  actions: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar
    },

    setNavbar(value: boolean) {
      this.showNavbar = value
    },

    setFooter(value: boolean) {
      this.showFooter = value
    },

    setLayout(layout: LayoutType) {
      this.layout = layout
      console.log("set layout",this.layout ,"New",layout)
    },

    // resetLayout() {
    //   this.layout = 'default'
    // },

    setLoading(value: boolean) {
      this.loading = value
    }
  }
})
