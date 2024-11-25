import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/HomeView.vue')
        },
        {
            path: '/admin',
            name: 'Admin',
            component: () => import('@/views/admin/IndexView.vue'),
            beforeEnter: (to, from, next) => {
                const user = Cookies.get('user')
                if (!user) {
                    next({ name: 'Login' })
                } else {
                    next()
                }
            },
            children: [
                {
                    path: 'home',
                    name: 'AdminHome',
                    component: () => import('@/views/admin/HomeView.vue')
                },
                {
                    path: 'gamelist',
                    name: 'GameList',
                    component: () => import('@/views/admin/Game/GameListView.vue')
                }
            ]
        },
        {
            path: '/admin/login',
            name: 'Login',
            component: () => import('@/views/admin/LoginView.vue')
        }
    ]
})

export default router
