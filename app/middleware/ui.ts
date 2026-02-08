import { useStateStore } from "~/stores/state"

export default defineNuxtRouteMiddleware((to) => {
  const state = useStateStore()

  // if (to.path.startsWith('/admin')) {
  //   state.setNavbar(false)
  //   state.setFooter(false)
  //   state.setLayout('admin')
  // } else {
  //   state.setNavbar(true)
  //   state.setFooter(true)
  //   state.setLayout('default')
  // }
  console.log(to.path)
})
